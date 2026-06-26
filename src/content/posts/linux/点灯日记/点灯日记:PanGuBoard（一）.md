---
title: 点灯日记:PanGuBoard STM32MP157（一）
published: 2026-06-09
description: '系统启动流程、固件编译与打包'
image: './images/PanGuBoard.jpg'
tags: [点灯日记, st, bootloader, spl]
category: 'linux'
draft: false 
lang: ''
---



这个板子的官方资料：https://wiki.i2som.com/docs/panguboarddoccn/panguboarddoccn-1fthohufi5btd

## 一、系统启动流程

不同于一般的SOC是SPL -> Uboot -> Kernel -> rootfs的加载流程，stm32mp系列SOC引入了基于**TF-A**(Trusted Firmware-A)的安全功能

在Linux内核启动前，大致需要以下几个阶段进行引导：

### ROM code

固化到SOC ROM里的一段程序，负责处理执行的第一条代码，把FSBL加载到RAM中

### 一级加载引导程序FSBL 

**first stage boot loader**

一般说的SPL就是FSBL，负责初始化时钟和外部DDR，负责把SSBL加载到DDR中并跳转到对应位置

### 二级加载引导程序SSBL 

**second stage boot loader**

即一般意义上的Bootloader，例如Uboot，负责加载Linux Kernel和rootfs，负责Linux系统的启动。也可以实现复杂的USB以太网和显示功能。



对于stm32mp系列，TF-A和Uboot SPL都是可选的FSBL。

简而言之，TF-A作为一级引导程序，在SPL功能的基础上，实现了更多功能和安全保障

> TF-A(Trusted Firmware-A)是由ARM®提供的安全类软件的参考实现。TF-A最初设计是为Armv8-A 平台，现在由STMicroelectronics适配并使用在Armv7-A 平台。现在该项目已经将Trusted Firmware项目移交给Linaro作为开源项目来管理。这部分代码遵守BSD-3-Clause 版权。
> 如果是Trusted boot chain方式，TF-A就是作为 FSBL。
>
> The global architecture of TF-A is explained in the Trusted Firmware-A design document.
> TF-A分为不同的阶段，每个都有主要的功能。
>
> - Boot loader stage 1 (BL1) application processor trusted ROM
> - Boot loader stage 2 (BL2) trusted boot firmware
> - Boot loader stage 3-2 (BL32) runtime software
> - Boot loader stage 3-3 (BL33) non-trusted firmware
>
> BL1, BL2和BL32部分是属于TF-A，BL33是在不在TF-A里的。
> BL1 目前是可选项，如果编译试开启参数BL2_AT_EL3，BL1就会被移除。在PanGu开发板上，由于这部分功能是由ROM code和BL2完成的，所以BL1部分是移除的。BL2就是PanGu开发板第一个要加载的部分。
> BL33是由TF-A加载的第一个非安全的代码。在启动过程中，这个就是SSBL，对于PanGu开发板SSBL就是U-Boot。
> 在PanGu开发板上，这两个二进制BL2和 BL32，还有device tree都放在同一个binary文件中，上电时由ROM加载到SYSRAM。

取自[PanGuBoard资料：BootChains介绍](https://wiki.i2som.com/docs/panguboarddoccn/panguboarddoccn-1fthpusacmn6s)

### Basic boot chain和Trusted boot chain特性对比

其中，Basic boot chain指的是FSBL使用Uboot SPL，Trusted boot chain指的是FSBL使用TF-A

| Features                                          | Trusted boot chain | Basic boot chain |
| ------------------------------------------------- | ------------------ | ---------------- |
| **Boot device support**                           |                    |                  |
| eMMC                                              | Supported          | Supported        |
| SDCard                                            | Supported          | Supported        |
| NOR                                               | Supported          | Supported        |
| NAND                                              | Supported          | Not supported    |
| Flash programming via UART                        | Supported          | Not supported    |
| Flash programming via USB                         | Supported          | Not supported    |
| **Device control**                                |                    |                  |
| DDR initialization                                | Supported          | Supported        |
| PMIC management                                   | Supported          | Supported        |
| System shutdown                                   | Supported          | Not supported    |
| SMP CPU boot and reset                            | Supported          | supported        |
| Low power management                              | Supported          | Not supported    |
| **Security features**                             |                    |                  |
| Authentication ECDSA Based                        | Supported          | Not supported    |
| Secure boot TZEN=1 - SMC Firewalling              | Supported          | Not supported    |
| Cortex-M4 isolation control                       | Supported          | Not supported    |
| Non secure boot - Unlimited access to RCC and PWR | Supported          | Supported        |
| HSI/CSI Calibration                               | Supported          | Not supported    |
| Security Tamper                                   | Supported          | Not supported    |
| Security OTP                                      | Supported          | Not supported    |
| Security IWDG1                                    | Supported          | Not supported    |

## 二、构建固件

我现在越来越感觉根据官方资料来构建固件是dirty work，原来需要自己摸索并总结经验的操作，现在可以直接交给codex，甚至说我不想用st提供的yocto，而是用buildroot或者debian，也可以让codex来移植，不断试错，直到系统可以正常启动且功能完备。

因此就不再进行记录了，就只是用codex把厂商的18个G的资料裁剪为一个可复现的SDK，存放到Github。

::gitHub{repo="haoyn231/PanGuBoard_STM32MP157"}

制作SD卡固件时，raw 镜像布局为：

| GPT 分区 | 名称       | 从 SD 卡启动后的设备名 |     TSV 偏移 |         典型生成大小 | 内容                  |
| -------: | ---------- | ---------------------- | -----------: | -------------------: | --------------------- |
|        1 | `fsbl1`    | `/dev/mmcblk0p1`       | `0x00004400` |              256 KiB | FSBL 副本 1           |
|        2 | `fsbl2`    | `/dev/mmcblk0p2`       | `0x00044400` |              256 KiB | FSBL 副本 2           |
|        3 | `ssbl`     | `/dev/mmcblk0p3`       | `0x00084400` |                2 MiB | SSBL                  |
|        4 | `bootfs`   | `/dev/mmcblk0p4`       | `0x00284400` |               64 MiB | kernel、DTB、extlinux |
|        5 | `vendorfs` | `/dev/mmcblk0p5`       | `0x04284400` |               16 MiB | 空占位分区            |
|        6 | `rootfs`   | `/dev/mmcblk0p6`       | `0x05284400` |           约 750 MiB | Buildroot rootfs      |
|        7 | `userfs`   | `/dev/mmcblk0p7`       | 工具动态后移 | 剩余空间，约 703 MiB | 空占位分区            |

如果是eMMC固件，需要用STM32CubeProgrammer进行烧录，所以并不是打包为一个完整的固件，而是不同部分加分区表（FlashLayout TSV）的形式

eMMC TSV 的目标是 `mmc1`。FSBL 写入 eMMC boot partition，其余镜像写入 eMMC user area 的固定偏移。

| TSV 名称   | 目标区域         |           偏移 | 内容                  |
| ---------- | ---------------- | -------------: | --------------------- |
| `fsbl1`    | `mmc1 boot1`     | boot partition | FSBL 副本 1           |
| `fsbl2`    | `mmc1 boot2`     | boot partition | FSBL 副本 2           |
| `ssbl`     | `mmc1` user area |   `0x00080000` | SSBL                  |
| `bootfs`   | `mmc1` user area |   `0x00280000` | kernel、DTB、extlinux |
| `vendorfs` | `mmc1` user area |   `0x04280000` | 空占位分区            |
| `rootfs`   | `mmc1` user area |   `0x05280000` | Buildroot rootfs      |
| `userfs`   | `mmc1` user area |   `0x85280000` | 空占位分区            |

值得注意的是，无论是SD卡固件还是eMMC固件，都应该有Basic boot chain和Trusted boot chain两种类型，对应不同的FSBL。



## 碎碎念

