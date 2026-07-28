---
title: 给rk3506移植archlinux
published: 2026-07-15
description: ''
image: ''
tags: []
category: ''
draft: true 
lang: ''
---



## 一、前言

给有完善vendor内核和bsp的sbc移植其他linux发行版，无怪乎要走以下流程：

- 获取对应架构的发行版的rootfs
- 通过chroot和qemu来定制rootfs
- 通过内核源码的makefile规则安装内核模块到自定义rootfs
- 跟随sdk的规则，让rootfs跟随内核、uboot等其他部分打包为一个完整镜像
- 烧录完整镜像到闪存，启动系统

不同于buildroot/openwrt这种需要从源码来编译rootfs的系统，对于主流Linux发行版，像Debian/Ubuntu，我们不可能是从源码编译，更多是基于已有rootfs的适配，俗称糊一个系统（

而archlinux又更为特殊：X86的archlinux内核和软件包都是滚动更新，众所周知的原因，arm设备的内核都是经过厂商魔改的，以厂商sdk的vendor内核为准，不存在一个上游内核。如果用archlinux arm或者armbian维护的内核，这样可以滚动更新，但就意味着要放弃很多功能，系统是残废的。

