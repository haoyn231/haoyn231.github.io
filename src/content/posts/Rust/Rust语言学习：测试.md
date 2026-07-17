---
title: Rust语言学习：测试
published: 2025-10-21
description: '整理 Rust 单元测试、断言、错误测试与测试组织方式'
image: ''
tags: [rust, 测试, cargo, 单元测试]
category: 'Rust'
draft: false 
lang: ''
---
Rust 中的测试是带有 `#[test]` 属性（attribute）的函数。当运行测试时，Rust 的测试工具会构建并运行这些被标记的函数，并报告它们是成功还是失败。

### 1\. 如何编写测试

测试函数通常被组织在一个名为 `tests` 的 `mod`（模块）中，并使用 `#[cfg(test)]` 属性进行标注，这样它们只会在 `cargo test` 时才被编译。

  * `#[test]` 属性：将一个函数标记为测试函数。
  * `use super::*`：导入外部模块（父模块）的所有公共项，以便在 `tests` 模块中访问它们，例如下面例子中的 `add` 函数。

```rust
// 这是一个我们想要测试的函数
pub fn add(left: u64, right: u64) -> u64 {
    left + right
}

// 使用 #[cfg(test)] 告诉编译器只有在 cargo test 时才编译此模块
#[cfg(test)]
mod tests {
    // 导入外部模块的函数
    use super::*;

    // 这是一个测试函数
    #[test]
    fn it_works() {
        let result = add(2, 2);
        // 使用断言宏来检查结果
        assert_eq!(result, 4);
    }
}
```

### 2\. 断言宏 (Assert Macros)

Rust 提供了几个用于检查测试条件的宏。如果断言失败，测试函数将会 `panic`，并被标记为测试失败。

| 宏 | 描述 |
| :--- | :--- |
| `assert!(expression)` | 断言一个表达式的结果为 `true`。 |
| `assert_eq!(left, right)` | 断言两个表达式的值相等。 |
| `assert_ne!(left, right)` | 断言两个表达式的值不相等。 |

### 3\. 为断言失败提供自定义错误消息

所有断言宏都接受一个可选的自定义错误消息参数。这个消息会在断言失败时被打印出来，帮助我们更快地定位问题。

自定义消息参数（使用格式化字符串）会从断言宏的第二个参数（对于 `assert!`）或第三个参数（对于 `assert_eq!` 和 `assert_ne!`）开始。

```rust
pub fn greeting(name: &str) -> String {
    format!("Hello {}!", name)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn greeting_contains_name() {
        let result = greeting("Carol");
        
        // 使用 assert! 检查条件
        assert!(
            result.contains("Carol"),
            // --- 自定义错误消息 ---
            // 如果 result.contains("Carol") 返回 false，将打印这条消息
            "Greeting did not contain name, value was `{}`",
            result // 格式化参数
        );
    }
}
```

*如果上述测试失败（例如 `greeting` 函数返回 "Hello \!")，输出将会是：*
` thread 'tests::greeting_contains_name' panicked at 'Greeting did not contain name, value was  `Hello \!`'`
