---
title: 瑞芯微rk3576的分区、镜像格式与OTA探究
published: 2026-07-09
description: ''
image: ''
tags: [rk3576, ota, rockchip, 嵌入式]
category: '嵌入式'
draft: true
lang: ''
---

• 你的理解基本对，但补一条关键细节：这里的 OTA 包不是“更大的 A/B 包”，反而是“给已刷 A/B
  系统升级用的精简包”。

  我解包检查了旧包，未污染 SDK，全部在 /tmp 下操作。结果是：

  rk3576-v20260701.tar.zst        237M
  解包后的旧 update.img             792M
  旧 update.img 里的 rootfs.img     649M

  所以你记得的 200 多 MB 应该是 .tar.zst 压缩发布包大小，不是 Rockchip 原始 update.img
  大小。

  旧 update.img 是非 A/B factory 包，package-file 是：

  bootloader
  uboot
  misc
  boot
  recovery
  userdata
  oem
  rootfs

  当前 output/update-ab/Image/update.img 是 A/B factory 包，package-file 是：

  bootloader
  uboot
  misc
  boot_a
  boot_b
  system_a
  system_b
  oem
  userdata

  但它没有把 rootfs.img 真正存两份。解包看到 system_a / system_b 都指向同一个 rootfs.img
  offset，所以当前 factory 包大小是 729M，不是 1.3G。

  关系可以这样理解：

  build.sh all
    -> RK_AB_UPDATE=y 时生成 A/B factory update.img
    -> 用于整机刷写/量产/恢复
    -> 包含 bootloader、uboot、misc、A/B 分区映射、oem、userdata 等

  build.sh ota-updateimg
    -> 生成 A/B OTA update.img
    -> 用于系统内升级
    -> 使用 ota-package-file
    -> 当前只包含 boot_a 和 system_a
    -> 通常比 factory 小

  所以，“factory 镜像就是原本不带 A/B 分区的镜像”这个理解在启用 RK_AB_UPDATE=y 后不成
  立。要支持 A/B OTA，factory 初始刷机包也应该是 A/B 分区布局，否则后续 OTA 没有匹配的
  slot/分区基础。

  当前 729M 不是 OTA 引入异常膨胀，主要还是 rootfs 本身 656M。旧 factory 原始 update.img
  其实还更大，792M，因为旧包还包含 recovery.img 约 71M。
