---
title: 用rust开发esp32的基础流程
published: 2026-06-10
description: '配置开发环境，构建项目，烧录与调试'
image: ''
tags: [rust, embassy, esp32]
category: 'mcu'
draft: false 
lang: ''
---

在安装好Rust开发环境的基础上进行：

### 一、安装ESP32 Rust工具

esp32的rust开发工具链由espup这个工具进行管理

```bash
cargo install espup
```

安装对应esp32型号target的工具链，例如esp32s3的Xtensa工具链

```bash
espup install --targets esp32s3
```

安装烧录工具espflash

```bash
cargo install espflash
```



## 二、烧录和监视串口

如果使用串口进行烧录

直接使用Cargo runner进行烧录

```bash
cargo +esp run --release
```

这个runner是在.cargo/config.toml中定义的

```toml
[build]
target = "xtensa-esp32s3-none-elf"

[target.xtensa-esp32s3-none-elf]
runner = "espflash flash --monitor"
rustflags = [
  "-C", "link-arg=-Tlinkall.x",
]

[unstable]
build-std = ["core"]

```

或者可以用espflash指定串口进行烧录

```bash
espflash flash --monitor --port /dev/ttyUSB0 target/xtensa-esp32s3-none-elf/release/ir_imu_ble_esp32_rust
```

烧录日志

```bash
cargo +esp run --release
    Finished `release` profile [optimized + debuginfo] target(s) in 0.09s
     Running `espflash flash --monitor target/xtensa-esp32s3-none-elf/release/ir_imu_ble_esp32_rust`
[2026-06-10T08:40:08Z INFO ] Serial port: '/dev/ttyUSB0'
[2026-06-10T08:40:08Z INFO ] Connecting...
[2026-06-10T08:40:08Z INFO ] Using flash stub
Chip type:         esp32s3 (revision v0.2)
Crystal frequency: 40 MHz
Flash size:        8MB
Features:          WiFi, BLE, Embedded Flash
MAC address:       70:04:1d:d5:0a:a4
App/part. size:    87,072/8,323,072 bytes, 1.05%
[00:00:01] [========================================]       1/1       0x0      Verifying... OK!                                                                                                                                                                                       
[00:00:00] [========================================]       1/1       0x8000   Verifying... OK!                                                                                                                                                                                       
[00:00:02] [========================================]       2/2       0x10000  Verifying... OK!                                                                                                                                                                                       [2026-06-10T08:40:13Z INFO ] Flashing has completed!
Commands:
    CTRL+R    Reset chip
    CTRL+C    Exit

ESP-ROM:esp32s3-20210327
Build:Mar 27 2021
rst:0x1 (POWERON),boot:0x8 (SPI_FAST_FLASH_BOOT)
SPIWP:0xee
mode:DIO, clock div:2
load:0x3fce2820,len:0x158c
load:0x403c8700,len:0xd24
load:0x403cb700,len:0x2f34
entry 0x403c8924
I (29) boot: ESP-IDF v5.5.1-838-gd66ebb86d2e 2nd stage bootloader
I (30) boot: compile time Nov 26 2025 12:27:56
I (30) boot: Multicore bootloader
I (31) boot: chip revision: v0.2
I (34) boot: efuse block revision: v1.3
I (38) boot.esp32s3: Boot SPI Speed : 40MHz
I (42) boot.esp32s3: SPI Mode       : DIO
I (45) boot.esp32s3: SPI Flash Size : 8MB
I (49) boot: Enabling RNG early entropy source...
I (54) boot: Partition Table:
I (56) boot: ## Label            Usage          Type ST Offset   Length
I (63) boot:  0 nvs              WiFi data        01 02 00009000 00006000
I (69) boot:  1 phy_init         RF data          01 01 0000f000 00001000
I (76) boot:  2 factory          factory app      00 00 00010000 007f0000
I (82) boot: End of partition table
I (85) esp_image: segment 0: paddr=00010020 vaddr=3c000020 size=01ecch (  7884) map
E (93) boot_comm: Image requires efuse blk rev >= v128.5, but chip is v1.3
E (99) boot: Factory app partition is not bootable
E (104) boot: No bootable app partitions in the partition table
```

