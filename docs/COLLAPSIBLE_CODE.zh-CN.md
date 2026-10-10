# 折叠代码块

博客保留了标准 Markdown 围栏代码块的行为。普通代码块仍然这样写：

````markdown
```bash
echo "始终展开"
```
````

对于必要但过长的代码，在语言名称后添加 `fold`。代码块默认折叠，读者点击折叠栏即可展开，再次点击可以收起：

````markdown
```bash fold
#!/usr/bin/env bash
# 很长的脚本……
```
````

可以同时使用 `title` 给折叠代码块添加标题：

````markdown
```bash title="完整部署脚本" fold
#!/usr/bin/env bash
# 很长的脚本……
```
````

`fold` 适用于所有代码语言，不只限于 Bash，例如 `cpp fold`、`rust fold` 或 `text fold`。
