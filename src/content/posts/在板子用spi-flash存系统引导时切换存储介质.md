---
title: 在板子用SPI Flash存系统引导时切换存储介质
slug: spi-flash
published: 2026-10-13
description: '原理分析以及使用rkdeveloptool清空SPI Flash'
image: ''
tags: []
category: ''
draft: false 
showOnHome: true
lang: ''
---
那种比较成熟的商业开发板，比如香橙派和Radxa的，它会考虑系统从SD卡、eMMC和NVME SSD启动，因此它会有单独的一颗SPI Flash来做存U-Boot做系统引导，但是当我们切换存储介质时（比如从SD卡换成eMMC，或者从eMMC换成NVME时），SPI Flash中的U-Boot会干扰到新存储介质的识别，例如：
```bash

```