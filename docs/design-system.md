# TrackJ Design System

## Design Intent

TrackJ should feel like a calm command center for a demanding job search. The interface must help users scan active opportunities, understand what needs attention, and act without friction.

The visual system should be restrained, legible, and work-focused. It should avoid marketing-page patterns inside the product experience.

## Design Principles

- Clarity first: every screen should make the next useful action visible.
- Low cognitive load: reduce choices, noise, and repeated manual entry.
- Trustworthy AI: AI assistance must be clearly labeled and easy to review.
- Dense but humane: support scanning many applications without making the UI feel cramped.
- Accessible by default: keyboard, screen reader, color contrast, and reduced-motion needs are part of the baseline.
- Responsive with intent: desktop is the primary productivity surface, but core workflows must remain usable on mobile.

## Layout

Primary app layout:

- Persistent left navigation on desktop.
- Collapsible or bottom navigation on smaller screens.
- Main content area with page header, primary action, filters when relevant, and content.
- Detail views should use focused panels, tabs, or full pages depending on complexity.

Spacing:

- Use a consistent spacing scale based on `4px` increments.
- Prefer `8px`, `12px`, `16px`, `24px`, `32px`, and `48px` for common layout gaps.
- Keep dense data regions tighter than marketing content.

Containers:

- Avoid cards inside cards.
- Use cards for repeated job, company, contact, or document items.
- Use full-width sections or simple constrained layouts for page structure.
- Use tables or structured lists when users need comparison across many applications.

## Responsive Behavior

- Desktop views should optimize for scanning and comparison.
- Tablet views may collapse secondary panels beneath primary content.
- Mobile views should prioritize the current task over showing every column or metric.
- Tables should become responsive lists or allow controlled horizontal scrolling when comparison remains important.
- Primary actions must remain reachable without covering content.

## Typography

Use a system font stack unless a documented product decision introduces a specific typeface.

Recommended stack:

```css
font-family:
  Inter,
  ui-sans-serif,
  system-ui,
  -apple-system,
  BlinkMacSystemFont,
  "Segoe UI",
  sans-serif;
```

Type scale:

- Page title: `28px` to `32px`, semibold.
- Section title: `20px` to `24px`, semibold.
- Card title: `16px` to `18px`, semibold.
- Body text: `14px` to `16px`, regular.
- Supporting text: `12px` to `14px`, regular.
- Data labels: `12px` to `13px`, medium.

Rules:

- Do not scale font size directly with viewport width.
- Use `line-height` between `1.35` and `1.6` depending on density.
- Keep letter spacing at `0` unless a specific uppercase label needs slight spacing for legibility.
- Avoid hero-scale text inside dashboards, panels, sidebars, cards, and modals.

## Color

The product palette should communicate focus, status, and confidence without becoming visually loud.

Base colors:

- Background: near-white neutral.
- Surface: white or very light neutral.
- Text primary: deep neutral.
- Text secondary: medium neutral.
- Border: light neutral.
- Focus ring: high-contrast blue.

Accent colors:

- Primary action: blue or teal with strong contrast.
- Success: green.
- Warning: amber.
- Danger: red.
- AI assistance: distinct but restrained accent, such as indigo, used sparingly.

Rules:

- Do not rely on color alone to communicate status.
- Avoid one-note palettes dominated by a single hue.
- Avoid excessive gradients, decorative blobs, and purely atmospheric backgrounds.
- Status colors must have text labels or icons where meaning matters.
- Color tokens must be named by role, not raw color, such as `color.status.offer` instead of `color.green.500`.

## Status Language

Application statuses should use consistent labels:

- Saved
- Applied
- Screening
- Interviewing
- Offer
- Rejected
- Withdrawn
- Archived

Status badges should be compact, readable, and accessible. They must include text. Color may reinforce the state but cannot be the only indicator.

## Components

Buttons:

- Use primary buttons for the main page action.
- Use secondary buttons for supportive actions.
- Use destructive styling only for destructive actions.
- Icon-only buttons require accessible names and tooltips when the icon is not universally obvious.

Forms:

- Labels are required.
- Required fields must be clear without relying only on an asterisk.
- Validation errors should appear close to the relevant field.
- Long forms should be grouped into meaningful sections.
- Save and cancel behavior must be obvious.

Tables and lists:

- Use tables for comparison-heavy job application views.
- Use structured lists for mobile and compact summaries.
- Columns should be chosen based on actionability.
- Empty states should include the next useful action.

Modals and dialogs:

- Use modals for focused tasks that should not require navigation.
- Avoid large multi-step workflows inside modals.
- Trap focus while open.
- Restore focus to the triggering element when closed.

Navigation:

- Navigation labels should use product vocabulary.
- Active navigation state must be visible and accessible.
- Avoid deep navigation until product complexity justifies it.

AI surfaces:

- AI-generated content must be labeled as AI-assisted.
- Drafts should support review, edit, accept, and discard actions.
- AI loading states should explain the operation without overstating certainty.
- AI errors should preserve the user's original input.

## Iconography

- Use a consistent icon set.
- Icons should support recognition and scanning.
- Do not use icons as the only label for complex or uncommon actions.
- Keep icon size consistent within each control group.
- Use icons for statuses, actions, and navigation only when they improve clarity.

## Motion

- Motion should communicate state changes, navigation, or feedback.
- Keep transitions quick and subtle.
- Respect `prefers-reduced-motion`.
- Avoid looping decorative animation inside productivity workflows.

## Accessibility Standards

- Target WCAG 2.2 AA.
- Use semantic HTML before ARIA.
- All interactive elements must be keyboard accessible.
- Visible focus styles are required.
- Form controls must have accessible labels.
- Icon-only controls must have accessible names.
- Text and meaningful UI elements must meet contrast requirements.
- Error messages must be programmatically associated with fields when possible.
- Dialogs and menus must manage focus correctly.
- Dynamic task-relevant updates should be announced when appropriate.

## Content Style

Voice:

- Calm.
- Direct.
- Practical.
- Respectful of the user's stress and time.

Rules:

- Use human product language instead of internal system language.
- Prefer short action labels, such as `Add application`, `Save changes`, or `Draft follow-up`.
- Avoid hype around AI.
- Explain errors in terms of what happened and what the user can do next.
- Empty states should be helpful, not cute.

## Design Review Checklist

Before shipping a UI change, verify:

- The primary task is obvious.
- Loading, empty, error, and success states exist.
- Keyboard navigation works.
- Focus states are visible.
- Text does not overflow at common viewport sizes.
- Color is not the only status indicator.
- AI content is clearly labeled when present.
- The layout remains usable on mobile.
- The interface follows the product vocabulary in this document and `docs/roadmap.md`.
