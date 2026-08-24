# dsh-wbtree

DSH 侧栏「工作区下拉 + 会话分支树」插件。

把工作区切换改为下拉列表，并把按分支（fork）衍生的会话以树形呈现，带紧凑的父→子连线、同级同名自动编号 (2)/(3)、相对时间，以及每行的 ⋯ 菜单（重命名 / 分叉会话 / 归档会话）。头部不再有「新会话」按钮（窄栏 rail 模式保留 +）。

## 效果

```
┌─ [工作区 ▾]          ← 下拉选择（含「未分组」）
│
│ A
│ └─ B
│    ├─ C
│    └─ D   ⋯        ← 每行悬停显示 ⋯ 菜单
```

## 安装

### 方式一：作为 npm 包（推荐）

```sh
# 在目标机器上
dsh plugin --profile web add dsh-wbtree
```

然后把 `dsh-wbtree` 加进 `~/.dsh/profiles/web/package.json` 的 `dsh.profile.bundles` 列表（或在 `~/.dsh/profiles/web/cordis.patch.yml` 末尾追加 `- insert: [{ id: wbtree, name: 'dsh-wbtree' }]`），重启 dsh web。

### 方式二：本地文件夹（离线）

1. 把 `dsh-wbtree` 整个目录复制到 `~/.dsh/profiles/web/node_modules/` 下。
2. 在 `~/.dsh/profiles/web/cordis.patch.yml` 末尾追加：

```yaml
- insert:
    - id: wbtree
      name: 'dsh-wbtree'
```

3. 重启 dsh web。

## 卸载

删除上述插入的行（或在 patch 行上加 `disabled: true`），重启即可；包目录可一并删除。

## 维护

- 浏览器半：`lib/client.js`（`__ModuleLoader__` 包格式，与官方 ui-* 包一致）
- host 半：`lib/index.js`（空实现，仅为行解析）
- 修改后重启 dsh web 生效。

## License

MIT
