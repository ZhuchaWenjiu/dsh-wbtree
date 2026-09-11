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

> **分发以 GitHub 为准**：新版本先推这里，npm 上的包可能滞后（见「发布」）。
> 三种方式装完**都必须重启 `dsh web`**——客户端 bundle 在启动时编入页面。

### 方式一：从 GitHub 装（推荐）

```sh
dsh plugin --profile web add github:ZhuchaWenjiu/dsh-wbtree
```

### 方式二：npm（可能滞后）

```sh
dsh plugin --profile web add dsh-wbtree
```

### 方式三：本地目录（开发用）

```sh
dsh plugin --profile web add link:D:\path\to\dsh-wbtree
```

改完 `lib/client.js` 重启 `dsh web` 即生效；`node_modules/dsh-wbtree` 会是指向源码目录的 junction / 软链。

### 装完没生效？

上面三条命令会通过包内的 `cordis.patch.yml`（来自 `package.json` 的 `dsh.bundle.patch`）自动往 profile 插一行 loader 条目。没插上就手动补，并确认 `dsh.profile.bundles` 里含 `dsh-wbtree`：

```yaml
# ~/.dsh/profiles/web/cordis.patch.yml 末尾
- insert:
    - id: wbtree
      name: 'dsh-wbtree'
```

## 卸载

把 `dsh-wbtree` 从 `~/.dsh/profiles/web/package.json` 的 `dsh.profile.bundles` 删掉（或给上面那行 patch 加 `disabled: true`），重启 `dsh web`；要清依赖再 `dsh plugin --profile web remove dsh-wbtree`。

## 维护

- 仓库：<https://github.com/ZhuchaWenjiu/dsh-wbtree> —— issue / PR / 版本都以这里为准
- 浏览器半：`lib/client.js`（`__ModuleLoader__` 懒加载 CJS 包格式，与官方 `ui-*` 一致）；host 半：`lib/index.js`（空实现，只为让 loader 行能解析）
- **改了必须重启 `dsh web`**：客户端 bundle 在启动时编入页面
- ⚠️ `lib/client.js` 的 cordis `inject` 必须声明它用到的 client 服务（现为 `slots` / `sessions` / `workspaces` / `uiWorkspace` / `locale`）。**留空数组会让 `apply()` 在服务就绪前执行**，而代码里 `ctx.get(...)` 判空会静默 `return`——插件完全不生效且不报任何错。另注意 `dsh.client.inject` 只是加载/预取元数据，**不决定 apply 顺序**
- 本插件是 `sidebar.workspaces` 槽的 `priority: -1` 占用者，会遮蔽内置会话列表；想临时看原生列表就给 patch 行加 `disabled: true`

## 发布

- **GitHub 为主**：`git push` 即发布，`package.json` 的 `version` 手动升
- npm 为辅：`npm publish` 现在要求账号开了 2FA，或用一个**勾选 Bypass 2FA、权限为 Read and write（publish）并包含 `dsh-wbtree`** 的 granular access token（写进 `~/.npmrc` 的 `//registry.npmjs.org/:_authToken`）。见 [npm Docs](https://docs.npmjs.com/requiring-2fa-for-package-publishing-and-settings-modification/)

## License

MIT
