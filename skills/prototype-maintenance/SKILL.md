---
name: prototype-maintenance
description: >-
  Maintain an existing interactive prototype by clarifying ownership of pages, components, dialogs, data, state, styles, and validation. Use for ongoing structural iteration and maintenance maps, rather than first-time static delivery packaging.
---

# Prototype Maintenance

Use this skill to make an existing prototype easier to modify over many rounds of product iteration.

The goal is not to redesign the product. Preserve the current behavior and visual direction while improving maintainability, file ownership, and validation speed.

## Scope And Handoff

- Use this skill for ongoing structural iteration and ownership mapping in an existing prototype. For first-time static splitting or packaging, use `static-prototype-splitter` when available; it is not a required dependency.
- A small copy, layout, or behavior request does not require a directory overhaul. Split only the responsibilities relevant to the request.
- Retain the existing entry filename, framework, script model, and preview workflow. The `app.html` layout below is an example, not a rename requirement.
- Follow the user's authorization rules for file replacement, configuration, dependencies, network access, local servers, and stored data. This skill does not grant those permissions.

## When To Trigger

Trigger this skill when the user asks to:

- Improve later prototype modification speed.
- Split JS by page, component, field, modal, store, or data layer.
- Split CSS by base, layout, page, component, modal, and field scopes.
- Separate mock data, seed data, schemas, and state/store logic.
- Create or update a prototype maintenance README.
- Create or update a CHANGE-MAP that maps future requests to files.
- Continue optimizing an existing interactive prototype.
- Make a combined preview and split files stay maintainable together.
- Explain where a future prototype change should be made.

## Default Principles

- Follow the user's language and the prototype's existing terminology.
- Read the current entry and active script references before editing.
- Keep the original visual design and interaction intent unless the user asks for redesign.
- Do not rewrite everything into a framework unless explicitly requested.
- Avoid a second divergent implementation. The combined preview should load shared/split modules or be generated from them.
- Keep changes focused on maintainability and the requested product behavior.
- Splitting is not complete when new files are merely added. Each split must also reduce the old file's responsibility so future edits have one obvious owner.
- Keep unrelated changes intact and preserve the original input and superseded files. Focus authorized edits on the active implementation; do not delete legacy files or replace protected documents without approval.
- After changes, verify syntax and the main preview interaction when practical.

## Recommended Structure

Adapt names to the project, but prefer this shape for static interactive prototypes:

```text
prototype/
├── app.html
├── README-prototype.md
├── CHANGE-MAP.md
├── assets/
│   ├── css/
│   │   ├── base.css
│   │   ├── layout.css
│   │   ├── components.css
│   │   ├── modals.css
│   │   ├── fields.css
│   │   └── pages/
│   │       ├── home.css
│   │       ├── editor.css
│   │       └── fill.css
│   └── js/
│       └── app/
│           ├── core.js
│           ├── runtime.js
│           ├── pages/
│           ├── components/
│           ├── fields/
│           ├── modals/
│           ├── data/
│           ├── store/
│           └── utils/
└── pages/
    └── ...
```

Use equivalent names when the prototype domain differs. The important part is the responsibility split.

For small prototypes, a flatter structure is fine. For prototypes that are changing frequently, prefer the directory structure above so each future request maps to a small file.

## Layer Responsibilities

### Entry Layer

Keep the current combined preview entry; `app.html` is the example name used below.

It should contain:

- Device frame or preview shell, if any.
- Root container.
- CSS links.
- Ordered script references.

It should not contain most business logic.

### Page Layer

Use page files for page rendering and page-specific layout:

- Home/list/search/tabs.
- Editor/create/edit page.
- Fill/preview/submit/detail page.
- Login/register/onboarding pages.
- Settings/account pages.

When the user asks to change a page layout or page copy, start here.

If one page file contains multiple frequently edited subviews, split it again. Example:

```text
pages/home/
├── index.js
├── search.js
├── my-forms.js
└── submitted.js
```

### Field Or Component Layer

Use field/component files for repeated UI blocks:

- Field type labels.
- Field defaults.
- Field preview in the editor.
- Fill-page controls.
- Upload/image/file/radio/checkbox/OCR/date renderers.

When the user asks to change one element type, avoid searching the whole app first. Start from the field config and renderer files.

When a prototype has many form controls or repeated cards, prefer registries:

```text
fields/
├── registry.js
├── text.js
├── image.js
├── file.js
├── options.js
└── ocr.js
```

### Modal Layer

Use modal files for:

- Field settings sheet.
- Type picker sheet.
- Sort drawer.
- Confirm dialogs.
- Add-element library sheet.

Keep modal state local when possible, and only commit data after confirm actions.

### Data Layer

Separate data from store behavior.

Use `data/` for:

- Mock templates.
- Industry/category lists.
- Field type definitions.
- Demo users and examples.
- Seed records and fixtures.

Use `store/` for:

- Local storage keys.
- Form save/delete/update.
- Submit record save/delete/update.
- Data normalization and migrations.

Do not mix storage rules into page renderers unless the prototype is very small.

When existing local data may already exist, preserve its keys and user edits. Add only missing seed records by stable IDs and make seeding idempotent; do not overwrite edited records, duplicate items, or reset local storage on reload. Treat schema migrations as a separate, authorized operation with a documented recovery path.

### CSS Layer

Split CSS by ownership, not just by size:

- `base.css`: variables, reset, typography.
- `layout.css`: shell, device frame, page container, grid primitives.
- `components.css`: buttons, inputs, cards, tabs, chips.
- `modals.css`: sheets, drawers, confirm dialogs, toast.
- `fields.css`: field controls and form element previews.
- `pages/*.css`: page-specific layout and exceptions.

If a selector is reused across pages, keep it in components or fields. If it is specific to one page, move it to that page CSS.

### Change Map Layer

Add `CHANGE-MAP.md` for prototypes expected to receive many rounds of edits.

It should map common user requests directly to files:

```md
# Change Map

## Pages
- Home page: assets/js/app/pages/home/index.js
- Template page: assets/js/app/pages/templates/index.js
- Form editor: assets/js/app/pages/editor/index.js

## Fields
- Image upload field: assets/js/app/fields/image.js
- File upload field: assets/js/app/fields/file.js
- Radio/checkbox fields: assets/js/app/fields/options.js

## Modals
- Field settings modal: assets/js/app/modals/field-settings.js
- Sort drawer: assets/js/app/modals/sort.js

## Data
- Template data: assets/js/app/data/templates.js
- Industry categories: assets/js/app/data/industries.js

## Styles
- Template page styles: assets/css/pages/templates.css
- Field styles: assets/css/fields.css
```

Keep CHANGE-MAP short. It is an editing index, not product documentation.

### Runtime Layer

Use runtime files for:

- Router/render dispatch.
- Event delegation.
- Gesture handling.
- Action dispatch.
- Bootstrapping.

If runtime becomes large, split by interaction type, but keep one clear entry point.

## Maintenance README

When requested, add or update `README-prototype.md` in the prototype root.

Include:

- Total preview entry.
- Local preview URL and reserved ports, if any.
- Page-to-file map.
- Field/component-to-file map.
- Modal-to-file map.
- Data layer location.
- CSS layer location.
- CHANGE-MAP location.
- How to refresh and validate after changes.
- Common future-change examples, such as "change upload image field" or "change form submission page".

Keep it concise and useful. It is for humans maintaining the prototype, not a long development diary.

## Workflow

1. Inspect active entry files.
   - Use `rg --files`, `grep`, and targeted reads.
   - Confirm which scripts are actually loaded by the combined preview.
   - Do not assume existing split files are active.

2. Identify current ownership.
   - Page renderers.
   - Field renderers/config.
   - Modals/drawers.
   - Store/data helpers.
   - Runtime/event handlers.

3. Split carefully.
   - Prefer mechanical extraction first when preserving behavior matters.
   - Keep script loading order explicit in `app.html`.
   - Avoid changing behavior during the split unless the user also asked for behavior changes.
   - After extracting a module, remove or shrink the corresponding responsibility from the old file. Do not leave two active owners for the same page, component, modal, data set, or CSS selector.
   - Leave legacy combined files unused rather than deleting them unless the user confirms deletion.
   - Preserve the existing classic-script or ES-module model. Check load order, exports, and inline event handlers after moving functions.
   - Make view mount/unmount responsibilities explicit. Remove stale listeners and timers when leaving a view so repeated navigation does not duplicate actions.

4. Split data when data is growing.
   - Move large mock data out of page renderers and store files.
   - Keep seed fixtures deterministic and easy to scan.
   - Merge new seed data into existing local data when possible.
   - If data is moved to `data/`, make store/state files consume that data instead of keeping a duplicate active copy.

5. Split CSS when visual changes are becoming slow.
   - Start with base/layout/components/pages.
   - Move page-only selectors into page CSS.
   - Move reusable controls into components or fields CSS.
   - After moving selectors, remove duplicate active selectors from the previous global stylesheet unless they are intentionally retained as shared component styles.
   - Preserve cascade order and responsive breakpoints; rebase CSS `url(...)`, font, and import paths relative to the new file location.

6. Update or create README and CHANGE-MAP.
   - Document the final active structure.
   - Make it clear what file to edit for common future requests.
   - Include local preview URL, reserved ports, and cache-busting instructions when relevant.

7. Verify.
   - Recursively check the JavaScript files actually owned by the prototype, including nested page/component files. When Python and Node are already available, this example checks `.js`, `.mjs`, and `.cjs` below `assets/js`; adapt the root to the project. Do not install runtimes just to run it.
     ```bash
     python3 - <<'PY_CHECK'
     from pathlib import Path
     import subprocess
     import sys

     root = Path("assets/js")
     files = sorted(p for p in root.rglob("*")
                    if p.is_file() and p.suffix in {".js", ".mjs", ".cjs"}
                    and not {"node_modules", "vendor", ".git"}.intersection(p.parts))
     if not files:
         sys.exit("No JavaScript files found; verify the check root.")
     failed = False
     for path in files:
         failed |= subprocess.run(["node", "--check", str(path)]).returncode != 0
     sys.exit(1 if failed else 0)
     PY_CHECK
     ```
   - For framework projects or a different module mode, use the existing project checks. A syntax pass does not prove browser behavior.
   - Open the combined preview.
   - Compare affected behavior with the baseline, including forward/back navigation, revisiting the edited view, modal confirm/cancel, and saved state after refresh where applicable.
   - Check browser console errors when practical.

## Split Granularity Rules

Use these rules to avoid both under-splitting and over-splitting:

- If a file is edited repeatedly for unrelated requests, split it.
- If a page contains multiple independently changing subviews, split the subviews.
- If mock data takes more space than the logic around it, move it to `data/`.
- Consider `fields/` when several field/control types change independently; do not split solely to meet a count.
- Consider `modals/` when dialogs or drawers have separate state or maintenance needs.
- If CSS changes require searching a large global stylesheet, split by page and component.
- If a file is stable and rarely edited, do not split it just for aesthetics.

## Validation Helpers

Prefer simple, dependency-free validation for static prototypes:

- Use `node --check` for JS syntax.
- For cache busting, substitute an actual value, such as `app.html?t=20261109-153000`; `Date.now()` typed literally in a URL is a fixed string. An HTML query alone does not refresh separately cached JS/CSS, so use browser cache controls or the existing asset-versioning strategy when needed.
- Keep the local preview port stable when the user has chosen one.
- Verify the changed interaction in the browser after structural refactors.
- Direct file open is acceptable for compatible static pages. Fetched fragments and browser ES modules generally require HTTP; document the opening mode and reuse the existing preview server when available. Starting a new server follows the user's authorization rules.

## Response Style

When finishing, tell the user:

- What was split or documented.
- The active entry file.
- The most important new file paths.
- Whether README-prototype.md or CHANGE-MAP.md was created or updated.
- What verification was completed.
- Any legacy files left in place intentionally.

Keep the final response short and practical.
