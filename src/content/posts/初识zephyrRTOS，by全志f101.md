---
title: 初识ZephyrRTOS，通过全志f101
slug: zephyrrtos-by-f101
published: 2026-10-13
description: ''
image: ''
tags: []
category: ''
draft: false 
showOnHome: true
lang: ''
---
zephyr的核心工作流基于west这个构建系统，west是python开发的，所以需要准备一个python虚拟环境来管理依赖，再在里面用west来管理自己的workspace、依赖和执行工作流。

在此记录一下我搭建zephyr开发环境的流程

创建~./projects/zephyr，通过uv在里面创建一个zephyr全局的python虚拟环境

```bash
❯ uv venv --python 3.12 --seed --prompt zephyr .venv
Using CPython 3.12.15
Creating virtual environment with seed packages at: .venv
 + pip==26.2.1
Activate with: source .venv/bin/activate

  ~/projects/zephyr ·································································· took  24s at  10:28:23 下午 ─╮
❯   
```

```bash
❯ west init -m https://github.com/YuzukiHD/zephyr --mr zephyr-v4.2.2-f101 f101-ws
=== Initializing in /home/hao/projects/zephyr/f101-ws
--- Cloning manifest repository from https://github.com/YuzukiHD/zephyr, rev. zephyr-v4.2.2-f101
正克隆到 '/home/hao/projects/zephyr/f101-ws/.west/manifest-tmp'...
remote: Enumerating objects: 1598900, done.
remote: Counting objects: 100% (59/59), done.
remote: Compressing objects: 100% (24/24), done.
remote: Total 1598900 (delta 40), reused 35 (delta 35), pack-reused 1598841 (from 2)
接收对象中: 100% (1598900/1598900), 921.13 MiB | 7.46 MiB/s, 完成.
处理 delta 中: 100% (1161357/1161357), 完成.
--- setting manifest.path to zephyr
=== Initialized. Now run "west update" inside /home/hao/projects/zephyr/f101-ws.
❯ ls
f101-ws
❯ cd f101-ws
❯ ls
zephyr
❯ ls -a
.  ..  .west  zephyr

  ~/projects/zephyr/f101-ws ····························································  zephyr at  10:34:53 下午 ─╮
❯     
```
在里面执行west update

```bash

```