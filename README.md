# Prototype Skills

面向产品与设计协作的两个 Agent Skills：拆分已有 HTML 原型，并让后续修改有明确的文件位置，同时保留现有视觉和交互。

**版本：v1.0.0** · [快速安装](#快速安装codex) · [完整案例](examples/event-registration/CASE-STUDY_20261109-184615.md) · [更新记录](CHANGELOG_20261110-115648.md) · [MIT License](LICENSE)

![维护版报名原型：新增手机号](examples/event-registration/screenshots/03-after-change-final.jpg)

虚构活动报名案例包含三个版本：**原始单文件 → 拆为 8 个文件 → 仅改 2 个文件增加必填手机号**。附桌面与窄屏实测截图、复现提示词、变更地图和验证脚本。[查看全部对照与验收记录](EXAMPLES_20261109-184615.md)。

## 快速安装（Codex）

在支持内置 `skill-installer` 的 Codex 中，复制下面这段话，可一次安装两个 skill：

```text
使用 $skill-installer，从 GitHub 仓库 bright-y/prototype-skills 的 v1.0.0 标签安装：
- skills/static-prototype-splitter
- skills/prototype-maintenance
安装到用户级 ~/.agents/skills，保留各自目录及配套文件。
如果已有同名 skill，先告知差异，不要覆盖。
```

安装需要访问 GitHub，并向本地技能目录写入文件；按照你的客户端权限提示确认即可。安装后在下一轮对话中使用下方示例；若未出现，重启 Codex。`v1.0.0` 固定这次发布的内容；希望跟随最新提交时，可把提示中的标签改成 `main`。

### 可选：终端一次安装两个（macOS / Linux）

需要已有 Python 3，并且本机存在以下内置安装器脚本；路径不同或脚本不存在时，使用上面的自然语言方式。此命令不安装 Python 或其他软件包。

```bash
python3 "${CODEX_HOME:-$HOME/.codex}/skills/.system/skill-installer/scripts/install-skill-from-github.py" \
  --repo bright-y/prototype-skills \
  --ref v1.0.0 \
  --path skills/static-prototype-splitter skills/prototype-maintenance \
  --dest "$HOME/.agents/skills"
```

安装器遇到已有同名目录会退出，不覆盖其中内容。批量安装不是事务：如果中途遇到冲突，前一个 skill 可能已安装；按实际提示检查，勿直接删除已有目录。

### 手动导入与其他客户端

从 [v1.0.0 发布页](https://github.com/bright-y/prototype-skills/releases/tag/v1.0.0) 下载源码 ZIP，解压后把 `skills/` 下需要的文件夹整体放入目标客户端支持的技能目录，保留 `SKILL.md` 和 `agents/openai.yaml`。Codex 用户级目录可使用 `~/.agents/skills`。

安装路径与调用方式以目标客户端为准。其他客户端和插件目录上架尚未实测；当前发布的是独立 skill 文件夹。官方安装与发现说明见 [OpenAI Docs：Build skills](https://learn.chatgpt.com/docs/build-skills)。

## 选择哪个 Skill

| Skill | 适用场景 | 主要产物 |
| --- | --- | --- |
| [static-prototype-splitter](skills/static-prototype-splitter/SKILL.md) | 首次整理单文件 HTML 或松散静态原型，进行拆分、组件化或交付打包 | 页面或组件、公共资源、预览入口和交付说明 |
| [prototype-maintenance](skills/prototype-maintenance/SKILL.md) | 继续维护原型，明确页面、字段、弹窗、数据和样式的职责 | 维护结构、README-prototype、CHANGE-MAP 和验证流程 |

两者可分别安装和使用。可先拆分再持续维护；局部文案或样式修改按实际需要处理。

## 使用示例

### 拆分静态原型

```text
使用 $static-prototype-splitter，把 demo.html 拆成可维护的静态页面或组件。
保留现有视觉、文案与交互，不引入框架。
保留原文件，新建带时间戳的交付目录，说明入口与验证结果。
如果需要 HTTP 预览，请先说明原因。
```

### 继续维护原型

```text
使用 $prototype-maintenance，整理现有原型的页面、字段、弹窗、数据与样式职责。
保留当前入口、技术栈和已有本地数据。
补充维护说明与 CHANGE-MAP，说明常见需求改哪些文件，并验证受影响交互。
```

### 拆分页与完整预览共存

```text
使用 $static-prototype-splitter，提供逐页维护文件和完整预览入口。
拆分页或共享模块作为唯一维护来源；完整预览由它们加载或生成。
说明修改后如何同步与验证。
```

## 完整案例：活动报名

[案例索引](EXAMPLES_20261109-184615.md) · [案例说明与复现提示词](examples/event-registration/CASE-STUDY_20261109-184615.md) · [维护与运行说明](examples/event-registration/README-prototype_20261109-184615.md) · [CHANGE-MAP](examples/event-registration/CHANGE-MAP_20261109-184615.md) · [实测记录](examples/event-registration/VALIDATION_20261109-184615.md)

| 阶段 | 文件 | 可检查的结果 |
| --- | --- | --- |
| 原始版 | [before/index.html](examples/event-registration/before/index.html) | 界面、CSS 和脚本在一个文件中 |
| 拆分版 | [after-split/](examples/event-registration/after-split/) | 8 个文件；HTML 壳、CSS 与组合脚本和原始版一致 |
| 维护版 | [after-change/](examples/event-registration/after-change/) | 新增必填手机号，仅 `fields.js`、`store.js` 有差异，兼容旧记录 |

GitHub 的 HTML 文件页展示源码。实际操作请下载仓库 ZIP，解压后用浏览器打开 `examples/event-registration/index.html`；无需安装依赖。浏览器文件模式下的存储共享存在差异，运行说明中提供可选 HTTP 预览方式。

## 验证状态

| 范围 | 已完成的验证 |
| --- | --- |
| Skill 文件 | 两份 `SKILL.md` 的 YAML、名称和描述基础校验；两份 Codex 界面元数据检查 |
| 案例文件与逻辑 | 提取一致性、仅两个文件的维护差异、本地链接、脚本语法、字段校验、旧记录兼容、重复提交、存储错误和文本转义 |
| 案例浏览器操作 | 内置浏览器 HTTP 环境：确认/取消、Escape、刷新持久化、前进/后退、重复点击，以及三版 390 px 窄屏布局 |
| 安装与发布 | 下载安装与版本核对结果见 [v1.0.0 Release](https://github.com/bright-y/prototype-skills/releases/tag/v1.0.0) |

案例自动检查需要已有 Python 3 与 Node，在案例目录运行 `python3 tests/verify.py`。案例已保存 10 张实测截图；详见 [VALIDATION](examples/event-registration/VALIDATION_20261109-184615.md)。

基础校验与案例验收不等于对任意原型、所有客户端或全部浏览器的保证；尚未覆盖真实手机、跨浏览器全覆盖和所有客户端的安装后自动发现。

## 运行边界

- Skill 提供原型整理与维护工作流。已有框架项目保留原技术栈；迁移框架、小程序或生产应用需另外明确范围。
- 普通静态文件可以直接打开；使用 `fetch` 加载片段或浏览器 ES modules 时通常需要 HTTP 预览，交付时应说明。
- Skill 本身不依赖固定 MCP、付费 API 或后台服务。具体原型引用的 CDN、远程图片或字体需按项目检查。
- Python、Node、`rg` 与浏览器按任务选用；这些说明不会授权安装依赖、覆盖文件、清空存储或启动服务。

## 仓库结构

```text
skills/
├── static-prototype-splitter/
│   ├── SKILL.md
│   └── agents/openai.yaml
└── prototype-maintenance/
    ├── SKILL.md
    └── agents/openai.yaml
examples/event-registration/     # 三个版本、文档、截图与验证脚本
```

`SKILL.md` 是技能入口，`agents/openai.yaml` 提供可选的 Codex 界面信息。案例源码和演示数据均为独立构造的教学内容。

## 反馈与许可

遇到问题请 [提交 Issue](https://github.com/bright-y/prototype-skills/issues)，附客户端、安装方式、复现步骤和报错；分享前请移除业务数据和个人信息。欢迎通过 PR 改进文档与案例。

本项目采用 [MIT License](LICENSE)，使用、修改或分发时保留版权和许可声明。
