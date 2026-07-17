---
title: Rust语言学习：基础语法
published: 2025-07-29
description: '整理变量、常量、数据类型、函数与控制流等 Rust 基础语法'
image: ''
tags: [rust, 基础语法, 变量, 控制流]
category: 'Rust'
draft: false 
lang: ''
---

## 1. 变量与可变性

Rust 中的变量默认是 **不可变** 的。可以使用 `mut` 关键字使变量变为 **可变** 的。

### 1.1 可变变量

通过 `mut` 关键字，可以声明一个可变变量，其值在后续可以被修改。

```rust
// 可变变量
let mut x = 5;
println!("The value of x is: {}", x);
x = 10;
println!("The value of x is: {}", x);
```

### 1.2 常量

常量在绑定值后任何时候都不能更改。

- **声明**: 使用 `const` 关键字，且必须显式标注值的类型。
- **命名**: Rust 常量的命名约定是使用全大写字母，并用下划线分隔单词。
- **赋值**: 只能被设置为常量表达式，不能是函数调用的结果或任何其他在运行时才能确定的值。

```
// 常量 不可用mut，必须标注类型，仅可以用常量表达式赋值
const SPECAL_NUMBER: i32 = 3;
println!("The value of SPECAL_NUMBER is: {}", SPECAL_NUMBER);
```

### 1.3 变量遮蔽 (Shadowing)

Rust 允许声明一个与之前变量同名的新变量，这个过程称为遮蔽 (Shadowing)。新变量会“遮蔽”掉旧的变量。

- 它通过再次使用 `let` 关键字来创建了一个全新的变量。
- 这允许我们改变值的类型，同时保持名称不变。
- 在离开作用域后，被遮蔽的变量会恢复。

```rust
// 变量遮蔽
let my_number = 5;
// 这里的my_number是一个新的变量，遮蔽了原来的 5
let my_number = my_number + 1; 

{
    // 在这个内部作用域，my_number又被一次遮蔽
    let my_number = my_number * 2;
    println!("The value of my_number in the inner scope is: {}", my_number); // 输出 12
}

println!("The value of my_number is: {}", my_number); // 输出 6
```

## 2. 数据类型

Rust 是一种静态类型语言，它在编译时就必须知道所有变量的类型。数据类型可以分为两大类：**标量类型**和**复合类型**。

### 2.1 标量类型 (Scalar Types)

标量类型表示一个单一的值。Rust 有四种主要的标量类型：

| 类型       | 说明                                                         | 示例                                  |
| ---------- | ------------------------------------------------------------ | ------------------------------------- |
| **整数**   | 有符号 (`i8` 到 `i128`, `isize`) 和无符号 (`u8` 到 `u128`, `usize`) | `let int1 = 98_222;`                  |
| **浮点数** | `f32` (单精度) 和 `f64` (双精度)                             | `const PI: f64 = 3.14159;`            |
| **布尔值** | `bool`，值为 `true` 或 `false`                               | `let is_rust_fun = true;`             |
| **字符**   | `char`，表示一个 Unicode 标量值，用单引号括起来              | `let char1 = 'z';` `let char2 = '😻';` |

**整数的字面量表示:**

```rust
let int1 = 98_222;       // 十进制，下划线可用于提高可读性
let int2 = 0xff;         // 十六进制
let int3 = 0o77;         // 八进制
let int4 = 0b1111_0000;   // 二进制
let int5 = b'A';         // 字节 (u8)
```

### 2.2 复合类型 (Compound Types)

复合类型可以将多个值组合成一个类型。Rust 有两种原生的复合类型：

#### 元组 (Tuple)

- 将多个不同类型的值组合进一个复合类型中。
- 长度固定：一旦声明，其大小不能伸缩。
- 可以通过模式匹配进行 **解构 (Destructuring)**，或使用点号 `.` 加索引来访问元素。

```rust
// 元组 不同数据类型的组合
let my_tuple: (i32, f64, u8) = (500, 6.4, 1);

// 解构元组
let (x, y, z) = my_tuple;
println!("The value of y is: {}", y);

// 通过索引访问
let five_hundred = my_tuple.0;
println!("The first value is: {}", five_hundred);
```

#### 数组 (Array)

- 将多个 **相同类型** 的值组合在一起。
- 长度固定。
- 数据存储在栈上。

```rust
let a = [10, 20, 30, 40, 50];
let first = a[0]; // 访问数组元素
```

## 3. 函数

使用 `fn` 关键字定义函数。Rust 代码使用蛇形命名法 (snake case) 作为函数和变量名称的规范。

### 3.1 函数参数

必须为每个参数声明其类型。

```rust
fn another_function(x: i32, y: String) {
    println!("The value of x is: {}", x);
    println!("The value of y is: {}", y);
}
```

### 3.2 语句和表达式

- **语句 (Statements)**: 执行某些操作但不返回值的指令。例如 `let x = 6;`。
- **表达式 (Expressions)**: 会计算并产生一个值。例如 `5 + 6`。
- 函数体由一系列语句和一个可选的结尾表达式构成。
- 在 Rust 中，代码块 `{}` 是一个表达式，它会返回块中最后一个表达式的值。

```rust
let y = {
    let x = 5;
    x + 1 // 这个块表达式的返回值是 6，注意末尾没有分号
};
println!("The value of y is: {}", y); // y 的值为 6
```

### 3.3 函数返回值

- 在箭头 `->` 之后声明返回值的类型。
- 函数的返回值是其函数体中最后一个表达式的值。
- 可以使用 `return` 关键字提前从函数中返回。
- 没有显式返回值的函数，其返回类型是 `()`，称为单元类型 (unit type)。

```rust
// 含返回值的函数
fn five() -> i32 {
    5 // 这是一个表达式，其值将作为函数返回值
}

fn plus_one(x: i32) -> i32 {
    return x + 1; // 也可以使用 return 显式返回
}
```

## 4. 控制流

### 4.1 `if` 表达式

- `if` 表达式的条件必须是 `bool` 类型。
- 因为 `if` 是一个表达式，所以可以将其用在 `let` 语句的右侧来赋值。

```rust
fn if_function(x: i32) {
    if x < 5 {
        println!("x is less than 5");
    } else if x == 5 {
        println!("x is equal to 5");
    } else {
        println!("x is greater than 5");
    }

    // if表达式可以返回值
    let y = if x < 10 { x + 1 } else { x - 1 };
    println!("The value of y is: {}", y);
}
```

### 4.2 循环

Rust 提供了三种循环：`loop`、`while` 和 `for`。

#### `loop`

- `loop` 关键字告诉 Rust 无限次地执行一块代码，直到你显式地告诉它停止。
- 可以使用 `break` 关键字退出循环，`break` 后面可以跟一个表达式，作为 `loop` 循环的返回值。
- 可以使用 `continue` 跳过当前迭代，进入下一次迭代。

```rust
fn loop_function() -> i32 {
    let mut counter = 0;
    loop {
        counter += 1;
        if counter == 10 {
            break counter * 2; // 退出循环并返回 20
        }
    }
}
```

#### 循环标签 (Loop Labels)

对于嵌套循环，可以使用循环标签来指定 `break` 或 `continue` 要作用于哪个循环。

```rust
fn labeled_loop() {
    let mut count = 0;
    'counting_up: loop {
        println!("count = {count}");
        let mut remaining = 10;

        loop {
            println!("remaining = {}", remaining);
            if remaining == 9 {
                break; // 退出内层循环
            }
            if count == 2 {
                break 'counting_up; // 退出名为 'counting_up 的外层循环
            }
            remaining -= 1;
        }
        count += 1;
    }
    println!("End count = {count}");
}
```

#### `while` 循环

当条件为真时，循环就会继续。

```rust
fn while_function() {
    let mut number = 3;

    while number != 0 {
        println!("{}!", number);
        number -= 1;
    }
    println!("LIFTOFF!!!");
}
```

#### `for` 循环

用于遍历集合中的每个元素，如数组。`for` 循环是更安全、更简洁的选择，因为它避免了 `while` 循环中可能出现的索引越界等错误。

```rust
fn for_function() {
    let a = [10, 20, 30, 40, 50];

    // 使用 .iter() 方法遍历集合
    for element in a.iter() {
        println!("The value is: {}", element);
    }

    // 遍历一个范围 (Range)
    // .rev() 方法用于反转范围
    for number in (1..4).rev() {
        println!("{}!", number);
    }
    println!("LIFTOFF!!!");
}
```
