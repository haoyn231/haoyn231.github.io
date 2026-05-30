---
title: 使用Vivado进行ZYNQ的PL端开发基础流程
published: 2026-05-18
description: ''
image: ''
tags: []
category: ''
draft: false 
lang: ''
---
从创建工程到烧录比特流文件到芯片里，最终固化到非易失性存储器里。这里的比特流文件可以理解为最终生成的结果，类似于编译出的二进制文件。

在写好verilog文件，到生成比特流文件，中间还有很多步骤，包括：

+ RTL描述与分析
+ 创建激励与仿真测试
+ 设计综合
+ 添加设计约束
+ 设计实现（布局布线）

完成后才能生成比特流文件。整个流程对应Vivado界面左侧的Flow Navigator。

![](https://cdn.nlark.com/yuque/0/2026/png/60715310/1779079624128-ae9b577f-afcc-4ab9-851b-9f39582c1fd8.png)



### 一、示例程序：LED灯闪烁

```verilog
module led_flash(
    input clk,
    input rst_n,
    output reg led
    );
    reg [25:0] cnt;
    always @ (posedge clk or negedge rst_n)
    begin
        if (!rst_n)
            cnt <=26'd0;
        else if (cnt < 26'd49_999_999)
            cnt <= cnt + 1'b1;
        else
            cnt <= 26'd0;
    end

    always @ (posedge clk or negedge rst_n)
    begin
        if (!rst_n)
            led <= 1'b0;
        else if (cnt == 26'd49_999_999)
            led <= ~led;
        else
            led <= led;
    end
    
endmodule 
```

创建了一个LED灯闪烁的模块，包括时钟线（高电平触发 posedge）、复位信号（低电平触发 negedge）、输出的LED信号和一个26位的计数寄存器。

两个always控制块，一个用作计数器，另一个用于控制LED。

### 二、RTL描述与分析

对当前HDL工程进行一次检查，检查是否有语法错误，但是无法检查是否有逻辑错误。同时把HDL展开为真正的逻辑结构。

![](https://cdn.nlark.com/yuque/0/2026/png/60715310/1779080392420-c6bebdac-c141-4724-b36a-7adfbdc72aee.png)

RTL Analysis就是指对理解当前的HDL工程到底是在干什么，它可以生成一个概括性的原理图，但不是真正的电路，只是一个示意图（RTL级抽象电路），我们可以通过查看这个示意图来确定自己编写的Verilog是否符合要求。

如下是示例工程中的led_flash对应的原理图：

![](https://cdn.nlark.com/yuque/0/2026/png/60715310/1779080604512-307c1f04-7526-45dc-9e84-c9a3c338d9e2.png)

可以看到其中的时钟信号、复位信号、LED信号、逻辑门和触发器等等。

### 三、激励创建与仿真

对于大型的HDL工程，在实际综合前需要创建一个激励，对它进行仿真测试，来查看是否符合预期。它虽然是HDL开发的必要流程，但不是强制性的，对于简单的工程也可以不进行仿真测试，本文暂时略过。

### 四、设计综合

设计综合 Synthesis 就是将我们的HDL工程转化为门级网表

![](https://cdn.nlark.com/yuque/0/2026/png/60715310/1779081962139-a4cf99df-7674-4ba6-89c4-2ab015dbde46.png)

可以得到工程对应的利用FPGA器件所具有的基本元件LUT搭建的电路图

![](https://cdn.nlark.com/yuque/0/2026/png/60715310/1779081018706-1cb3121a-627e-4a3a-9588-a0a0084676b3.png)

可以查看不同的LUT对应的逻辑表达式和真值表映射

![](https://cdn.nlark.com/yuque/0/2026/png/60715310/1779081214597-a9d80fde-cd74-4a29-b1c6-2923bc80d899.png)

通过Report Utilization，可以查看逻辑资源的使用情况
![](https://cdn.nlark.com/yuque/0/2026/png/60715310/1779081286614-f9da128a-afbc-40d6-bc69-ac4d8f1a274d.png)

### 五、添加设计约束

在之前的操作里，完成了HDL电路设计、RTL分析和综合，最终生成了FPGA里真实的电路结构，但是它们还只是在FPGA内部，无法与外部交互，不知道时钟信号和复位信号从哪儿来，不知道LED信号对应哪个真实引脚。因此需要进行约束，其中引脚约束就是给信号绑定真实的IO，让它操作真实的引脚的电平，进行输入输出。

在综合后的界面里，点击layout里的IO Planning，打开引脚分配界面，给信号分配真实的引脚

![](https://cdn.nlark.com/yuque/0/2026/png/60715310/1779081755491-87e762b1-d3a7-46b6-8adb-a48b3b34cf9b.png)

保存后就可以生成约束文件XDC



### 六、设计实现（布局布线）

在综合得到真实电路图和添加约束后，就可以通过电路图和约束文件在FPGA里实现这个设计，即把之前的设计实现在FPGA器件里。

![](https://cdn.nlark.com/yuque/0/2026/png/60715310/1779081936038-eb8daca3-1bcc-4438-8fcb-69f7cf4db8e4.png)

完成设计后，可以在Device中看到FPGA中生成的电路，也可以看到连接关系

![](https://cdn.nlark.com/yuque/0/2026/png/60715310/1779082744103-f158a2fd-ec6f-44e2-82af-053cd173c0d6.png)



### 七、生成比特流文件

实现设计后就可以生成比特流文件

![](https://cdn.nlark.com/yuque/0/2026/png/60715310/1779082861342-0507273c-3f42-45b6-83ac-bc5f47202eb0.png)

Generate Bitstream即可

### 八、烧录与固化

通过Flow打开Hardware Manager，连接设备，烧录比特流即可

![](https://cdn.nlark.com/yuque/0/2026/png/60715310/1779083036081-38cbfee1-69d0-499d-a187-ae5b345e4bdb.png)

对于程序固化来说，如果是纯FPGA芯片，可以通过Vivado之间把bin烧录到开发板的Flash中，但是对于ZYNQ，PL端没有引出非易失性存储器的控制引脚，需要使用SDK通过PS端来完成程序固化，暂时不做展开。

