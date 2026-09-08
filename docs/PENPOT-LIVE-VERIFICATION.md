# Live Penpot Verification

This document separates repository release acceptance from checks that can only be performed inside a live Penpot workspace.

## Import

1. Import/open `penpot/generated/moonwitness-mw-0042.penpot`.
2. Import the v2 vector references listed by `penpot/screens/screens-v2.json`.
3. Confirm the token set from `penpot/tokens/moonwitness.tokens.json`.

## Native reconstruction

Rebuild shared primitives/components as native reusable Penpot objects. Recompose the golden slice and v2 application surfaces from instances rather than media-backed reference boards.

## Interaction

Wire Public → Community → Platform golden-case flow plus authenticated shell interactions: navigation, command palette, notifications, drawers/menus, Kanban transitions, Chat, AI Workspace, profile/settings, authorization messaging, and recovery states.

## Accessibility

Perform live keyboard/focus walkthrough, check visible focus and modal/drawer trapping, confirm semantic state is not color-only, and run final contrast review against the actual resolved fonts and native component colors.

## Verification record

When performed, record:
- Penpot workspace/file identifier
- date
- reviewer
- font availability result
- component rebuild result
- interaction result
- accessibility/contrast result
- blocking defects, if any

The v1.3.1 repository release does not fabricate this record. These live-workspace checks are intentionally outside repository asset closure.
