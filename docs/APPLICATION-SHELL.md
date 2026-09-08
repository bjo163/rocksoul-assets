# Application Shell & Product Surfaces

MoonWitness v2 adds the authenticated application layer without modifying the immutable v1 raster baseline.

## Shared shell

Every authenticated surface uses one shell contract:

- compact responsive sidebar
- shared topbar
- breadcrumbs
- backend health indicator
- theme control
- notifications
- user menu
- command palette
- main content landmark

Navigation remains **AutoMenu-driven** from `moonwitness/ui/v2/navigation.json`.

## Vector surfaces

`moonwitness/ui/v2/` contains editable SVG sources for:

- Dashboard
- Command Palette
- Notifications
- Kanban
- Calendar
- Chat
- AI Workspace
- Resources / AutoMenu
- Profile / Settings
- Authorization UX
- Error / Empty / Loading states

All 12 v2 application surfaces also have generated PNG previews under `moonwitness/ui/v2/png/`. SVG remains canonical; PNG is delivery/reference output.

## Penpot

Import the v2 SVG references, then rebuild the shell and product surfaces with native reusable components. The shell contract lives in `penpot/application-shell/application-shell.json`.

## Accessibility

Global shell controls must remain keyboard reachable. Mobile navigation is a focus-trapped drawer. Backend status is text + semantic state, never color-only. Error, empty, loading, offline, and forbidden states must expose distinct semantics.
