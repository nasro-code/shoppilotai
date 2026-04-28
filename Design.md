---
version: "alpha"
name: "Multi-Tenant AI Support Platform"
description: "Multi Tenant Dashboard Section is designed for demonstrating application workflows and interface hierarchy. Key features include clear information density, modular panels, and interface rhythm. It is suitable for product showcases, admin panels, and analytics experiences."
colors:
  primary: "#10B981"
  secondary: "#0F172A"
  tertiary: "#EF4444"
  neutral: "#FFFFFF"
  background: "#FFFFFF"
  surface: "#10B981"
  text-primary: "#0F172A"
  text-secondary: "#64748B"
  border: "#F1F5F9"
  accent: "#10B981"
typography:
  display-lg:
    fontFamily: "Inter"
    fontSize: "48px"
    fontWeight: 600
    lineHeight: "48px"
    letterSpacing: "-0.025em"
  body-md:
    fontFamily: "Inter"
    fontSize: "12px"
    fontWeight: 400
    lineHeight: "16px"
  label-md:
    fontFamily: "Inter"
    fontSize: "14px"
    fontWeight: 500
    lineHeight: "20px"
rounded:
  md: "8px"
  full: "9999px"
spacing:
  base: "4px"
  sm: "1px"
  md: "2px"
  lg: "4px"
  xl: "6px"
  gap: "4px"
  card-padding: "9px"
  section-padding: "24px"
components:
  button-primary:
    backgroundColor: "#FEF2F2"
    textColor: "#DC2626"
    typography: "{typography.label-md}"
    rounded: "{rounded.full}"
    padding: "8px"
  button-secondary:
    textColor: "#475569"
    rounded: "{rounded.md}"
    padding: "6px"
  button-link:
    textColor: "{colors.text-secondary}"
    typography: "{typography.label-md}"
    rounded: "{rounded.full}"
    padding: "8px"
  card:
    backgroundColor: "{colors.neutral}"
    rounded: "24px"
    padding: "24px"
---

## Overview

- **Composition cues:**
  - Layout: Grid
  - Content Width: Bounded
  - Framing: Glassy
  - Grid: Strong

## Colors

The color system uses light mode with #10B981 as the main accent and #FFFFFF as the neutral foundation.

- **Primary (#10B981):** Main accent and emphasis color.
- **Secondary (#0F172A):** Supporting accent for secondary emphasis.
- **Tertiary (#EF4444):** Reserved accent for supporting contrast moments.
- **Neutral (#FFFFFF):** Neutral foundation for backgrounds, surfaces, and supporting chrome.

- **Usage:** Background: #FFFFFF; Surface: #10B981; Text Primary: #0F172A; Text Secondary: #64748B; Border: #F1F5F9; Accent: #10B981

- **Gradients:** bg-gradient-to-b from-slate-200/80 to-transparent via-slate-100/50, bg-gradient-to-b from-slate-900/60 to-transparent

## Typography

Typography relies on Inter across display, body, and utility text.

- **Display (`display-lg`):** Inter, 48px, weight 600, line-height 48px, letter-spacing -0.025em.
- **Body (`body-md`):** Inter, 12px, weight 400, line-height 16px.
- **Labels (`label-md`):** Inter, 14px, weight 500, line-height 20px.

## Layout

Layout follows a grid composition with reusable spacing tokens. Preserve the grid, bounded structural frame before changing ornament or component styling. Use 4px as the base rhythm and let larger gaps step up from that cadence instead of introducing unrelated spacing values.

Treat the page as a grid / bounded composition, and keep that framing stable when adding or remixing sections.

- **Layout type:** Grid
- **Content width:** Bounded
- **Base unit:** 4px
- **Scale:** 1px, 2px, 4px, 6px, 8px, 12px, 16px, 20px
- **Section padding:** 24px, 32px, 40px
- **Card padding:** 9px, 16px, 20px, 24px
- **Gaps:** 4px, 6px, 8px, 12px

## Elevation & Depth

Depth is communicated through glass, border contrast, and reusable shadow or blur treatments. Keep those recipes consistent across hero panels, cards, and controls so the page reads as one material system.

Surfaces should read as glass first, with borders, shadows, and blur only reinforcing that material choice.

- **Surface style:** Glass
- **Borders:** 0.67px #F1F5F9; 0.67px #E2E8F0; 0.67px #CBD5E1; 0.67px #FFFFFF
- **Shadows:** rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 1px 2px 0px; rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.1) 0px 4px 6px -4px; rgba(0, 0, 0, 0.08) 0px 12px 48px -12px
- **Blur:** 12px, 8px

### Techniques
- **Gradient border shell:** Use a thin gradient border shell around the main card. Wrap the surface in an outer shell with 1px padding and a 32px radius. Drive the shell with linear-gradient(rgba(226, 232, 240, 0.8), rgba(241, 245, 249, 0.5), rgba(0, 0, 0, 0)) so the edge reads like premium depth instead of a flat stroke. Keep the actual stroke understated so the gradient shell remains the hero edge treatment. Inset the real content surface inside the wrapper with a slightly smaller radius so the gradient only appears as a hairline frame.

## Shapes

Shapes rely on a tight radius system anchored by 16px and scaled across cards, buttons, and supporting surfaces. Icon geometry should stay compatible with that soft-to-controlled silhouette.

Use the radius family intentionally: larger surfaces can open up, but controls and badges should stay within the same rounded DNA instead of inventing sharper or pill-only exceptions.

- **Corner radii:** 16px, 20px, 24px, 40px, 9999px
- **Icon treatment:** Linear
- **Icon sets:** Solar

## Components

Anchor interactions to the detected button styles. Reuse the existing card surface recipe for content blocks.

### Buttons
- **Primary:** background #FEF2F2, text #DC2626, radius 9999px, padding 8px, border 0px solid rgb(229, 231, 235).
- **Secondary:** text #475569, radius 8px, padding 6px, border 0.666667px solid rgb(226, 232, 240).
- **Links:** text #64748B, radius 9999px, padding 8px, border 0px solid rgb(229, 231, 235).

### Cards and Surfaces
- **Card surface:** background #FFFFFF, border 0.666667px solid rgb(241, 245, 249), radius 24px, padding 24px, shadow rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 1px 2px 0px.
- **Card surface:** background rgba(255, 255, 255, 0.9), border 0.666667px solid rgba(255, 255, 255, 0.2), radius 20px, padding 20px, shadow rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.1) 0px 4px 6px -4px, blur 12px.
- **Card surface:** background #FFFFFF, border 0.666667px solid rgb(241, 245, 249), radius 24px, padding 16px, shadow rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 1px 2px 0px.

### Iconography
- **Treatment:** Linear.
- **Sets:** Solar.

## Do's and Don'ts

Use these constraints to keep future generations aligned with the current system instead of drifting into adjacent styles.

### Do
- Do use the primary palette as the main accent for emphasis and action states.
- Do keep spacing aligned to the detected 4px rhythm.
- Do reuse the Glass surface treatment consistently across cards and controls.
- Do keep corner radii within the detected 16px, 20px, 24px, 40px, 9999px family.

### Don't
- Don't introduce extra accent colors outside the core palette roles unless the page needs a new semantic state.
- Don't mix unrelated shadow or blur recipes that break the current depth system.
- Don't exceed the detected moderate motion intensity without a deliberate reason.

## Motion

Motion feels controlled and interface-led across text, layout, and section transitions. Timing clusters around 150ms and 700ms. Easing favors ease and cubic-bezier(0.4. Hover behavior focuses on text and color changes. Scroll choreography uses GSAP ScrollTrigger for section reveals and pacing.

**Motion Level:** moderate

**Durations:** 150ms, 700ms, 1000ms

**Easings:** ease, cubic-bezier(0.4, 0, 0.2, 1)

**Hover Patterns:** text, color

**Scroll Patterns:** gsap-scrolltrigger