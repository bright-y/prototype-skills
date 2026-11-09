---
name: static-prototype-splitter
description: >-
  Split or package an existing static HTML/CSS/JS prototype into reusable pages or components while preserving its visuals and interactions. Use for structural delivery work; use prototype-maintenance for ongoing module ownership and iteration.
---

# Static Prototype Splitter

Use this skill to turn a finished or semi-finished static prototype into a cleaner deliverable for demo, iteration, migration, or handoff.

The goal is not to redesign the product. Preserve the existing visual direction and interaction intent while making the prototype easier to open, inspect, modify, and migrate.

## Scope And Handoff

- Use this skill for a new split, componentized, or handoff deliverable from an existing static prototype. For ongoing edits to an already organized prototype, use `prototype-maintenance` when available; it is not a required dependency.
- For a small copy or style change, make the requested change without restructuring the prototype.
- Keep existing framework projects in their established stack; do not flatten a React/Vue or similar project into static HTML unless requested.
- Follow the user's authorization rules for file replacement, configuration, dependencies, network access, local servers, and stored data. This skill does not grant those permissions.

## Default Principles

- Preserve source files. Do not overwrite the original prototype unless the user explicitly asks.
- Create timestamped output folders for generated deliverables.
- Keep edits focused on structure, paths, reusable assets, and basic interaction wiring.
- Maintain the original language, product terminology, visual style, and page hierarchy.
- Prefer plain static HTML/CSS/JS unless the user asks for a framework.
- Avoid unrelated redesign, dependency installation, build tooling, or framework migration.
- When a prototype needs both split pages and a complete preview, treat split page files as the single source of truth. Avoid maintaining a second, divergent copy of page content or interaction logic in the combined entry.
- The combined entry should compose, load, or generate from the split page source through routing, templates, shared modules, or a small build/sync script. If a temporary combined implementation is necessary for reliability, call out the duplication and recommend reconciling it before further page-level iteration.
- For later page edits, modify the specific split page and its page-level script first, then refresh or regenerate the combined preview so the user does not need to make the same change twice.

## When To Trigger

Trigger this skill when the user asks to:

- Split a large HTML prototype into separate pages.
- Organize a static prototype into a deliverable folder.
- Componentize a static HTML prototype.
- Package a prototype for handoff or demo.
- Create a cleaner version of a product design prototype.
- Convert a single-file static app into a multi-page or static component structure.
- Prepare a prototype for later migration to Vue, React, Taro, uni-app, WeChat mini program, or another frontend stack.

## Recommended Output Shapes

Choose one or more shapes based on the request.

### Split File Version

Use when the user needs easy static demo pages or page-by-page design iteration.

Recommended structure:

```text
输出目录_YYYYMMDD-HHMMSS/
├── 拆分文件版/
│   ├── index.html
│   ├── page-a.html
│   ├── page-b.html
│   └── assets/
│       ├── styles.css
│       └── app.js
└── README.md
```

Guidelines:

- Each major view becomes one HTML file.
- Preserve page navigation through normal links where practical.
- Extract shared CSS and lightweight JS into `assets/`.
- Keep each page independently openable in a browser.
- Keep page names meaningful and stable.

### Componentized Static Version

Use when the prototype should become easier to migrate into a frontend framework later.

Recommended structure:

```text
输出目录_YYYYMMDD-HHMMSS/
├── 组件化版/
│   ├── index.html
│   └── assets/
│       ├── styles.css
│       ├── components.js
│       ├── data.js
│       └── app.js
└── README.md
```

Guidelines:

- `index.html`: shell, root container, script/style references.
- `assets/styles.css`: shared styles.
- `assets/data.js`: mock data and business data, when useful.
- `assets/components.js`: reusable HTML render functions or component templates.
- `assets/app.js`: route switching, state, event binding, and simple interactions.
- Keep this version framework-free unless the user asks for a specific framework.
- If split HTML pages also exist, do not manually duplicate their content inside `app.js`. Prefer importing shared templates, loading page fragments, or using a deterministic sync step so split pages remain the maintenance source.

### Combined Preview From Split Pages

Use when the user wants each page independently editable while also needing one complete interactive preview.

Recommended structure:

```text
prototype/
├── app.html                  # Complete preview shell
├── pages/
│   ├── welcome.html
│   ├── templates.html
│   └── ...
├── assets/
│   ├── css/styles.css
│   ├── js/common.js
│   ├── js/router.js          # Preview routing / composition only
│   └── js/pages/
│       ├── templates.js
│       └── ...
└── README.md
```

Guidelines:

- Keep page markup and page-specific behavior in `pages/` and `assets/js/pages/`.
- Keep `app.html` as a shell: device frame, navigation, route container, and shared script/style references.
- Keep `router.js` focused on loading pages, binding shared navigation, preserving state, and preview-only concerns.
- Avoid a long `app-combined.js` that rewrites every page by hand. If one exists as a short-term workaround, mark it as generated or temporary and reconcile it with split pages before doing many page edits.
- When the user asks to modify one page, edit only that page and its page script unless the preview shell or shared styles truly need adjustment.

### Packaged Handoff Folder

Use when the user asks for a complete package or delivery bundle.

Recommended structure:

```text
产品原型完整包_YYYYMMDD-HHMMSS/
├── 使用说明.md
├── 原始文件/
├── 拆分文件版/
└── 组件化版/
```

Guidelines:

- Include only files needed for demo and handoff.
- Keep source filenames recognizable.
- If creating an archive, use a timestamped name.
- Do not delete intermediate generated folders unless the user confirms.

## Workflow

1. Inspect the prototype files.
   - Identify entry files, major views, shared CSS, shared JS, inline event handlers, assets, external CDN dependencies, dialogs, drawers, tabs, and page navigation.
   - Use `rg --files` and targeted reads before editing.

2. Decide output shape.
   - If the user only asks to split: create `拆分文件版`.
   - If the user asks for migration readiness or componentization: create `组件化版`.
   - If the user asks for delivery: create a complete package with a usage note.
   - If unclear, choose the smallest output that meets the request. Create multiple versions only when they serve a stated need; keep one authoritative source for shared content and behavior.

3. Create a timestamped output folder.
   - Recommended timestamp format: `YYYYMMDD-HHMMSS`.
   - Preserve original files unchanged.

4. Extract and organize.
   - Move shared CSS into a common stylesheet.
   - Move shared JS into a common script.
   - Normalize asset paths.
   - Convert major views into separate HTML files or component templates.
   - Keep interactions that matter for demo: navigation, tabs, drawers, modals, toggles, list-detail transitions, basic forms, and file inputs.

5. Resolve runtime and extraction details.
   - Choose the opening mode before implementation: direct `file://` pages, or HTTP preview when using fetched fragments or ES modules. Do not promise double-click operation for a design that requires HTTP. Reuse an existing preview server when possible; starting one follows the user's authorization rules.
   - Keep complete HTML documents and loadable fragments distinct. When loading a fragment into a shell, normalize its relative asset and navigation URLs to the shell's base; raw fragment insertion does not preserve the source document's base URL or reliably run its scripts.
   - When moving inline CSS into a stylesheet, rebase `url(...)`, font, and import paths relative to the new stylesheet. Preserve cascade order, specificity, and responsive behavior.
   - Keep one coherent script model. Preserve load order and shared state for classic scripts; preserve import/export boundaries for modules. Inline handlers cannot access module-local functions without an explicit bridge.
   - Mount page behavior explicitly and clean up listeners or timers when leaving a view. Verify that revisiting a page does not register actions twice.
   - Inventory existing storage keys and state transitions before splitting. Do not clear storage or silently overwrite user-created data to make the demo work.

6. Write handoff documentation.
   - Include source file, generated time, entry pages, folder purpose, and recommended next steps.
   - Keep documentation short and useful.

7. Verify.
   - Check that entry HTML files exist.
   - Check linked CSS/JS paths, CSS asset URLs, fragment assets, and navigation targets from each entry or composed view.
   - Open or preview locally when practical.
   - For visual prototypes, verify desktop/mobile layout if a browser tool is available.
   - Compare key routes and interactions with the original: initial render, forward/back navigation, revisiting a view, modal confirm/cancel, and saved state after refresh where applicable.
   - Mention any unverified behavior or external CDN dependency risk. Do not claim offline support without checking external resources.

## README / Usage Note Template

Use a concise README in the user's or project's language. The following Chinese example can be adapted; list only entries actually generated and state whether HTTP is required:

```markdown
# 项目原型整理

生成时间：YYYY-MM-DD HH:mm:ss

来源文件：原始文件名.html

## 推荐打开

- `拆分文件版/index.html`
- `组件化版/index.html`

## 拆分文件版

适合静态原型演示和逐页设计调整。每个页面是独立 HTML，页面之间通过文件链接跳转。

## 组件化版

适合继续演进为 Vue、React、Taro、uni-app、微信小程序或其他前端结构。

## 说明

- 原始文件未被修改。
- 公共样式和脚本已整理到 `assets/`。
- 如需继续工程化，可优先迁移 `components.js`、`data.js` 和 `app.js`。
```

## Quality Checklist

Before final response, check:

- Original source files are preserved.
- Output folder has a timestamp.
- Entry files are clearly named.
- Asset paths work relative to each HTML file.
- Navigation between pages or views still works.
- Important interactions are not lost.
- README or usage note explains what to open.
- Final response includes the saved path and verification result.
