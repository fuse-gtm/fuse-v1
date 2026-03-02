# Fuse Design System — Token Map

> Figma ↔ Code mapping for FUSE-502 (Theme Pass)
> Source: Twenty Figma file (duplicated to Fuse workspace)
> Codebase: `packages/twenty-ui/src/theme/`

## Current State

**Figma**: Duplicated Twenty design file with Figma variables defined
**Code**: Emotion ThemeProvider with TypeScript theme objects (THEME_LIGHT / THEME_DARK)
**Upstream**: Commit `1db2a409` migrates to Linaria + CSS custom properties (`--t-xxx`)

### Decision: Cherry-pick Linaria first or theme on Emotion?

| Approach | Effort | Risk | Recommendation |
|----------|--------|------|----------------|
| Theme on Emotion (current) | 2-3 days | Low risk, but changes get overwritten when Linaria lands | Only if Linaria cherry-pick is blocked |
| Cherry-pick Linaria → theme via CSS vars | 0.5 day cherry-pick + 0.5 day theme | Medium risk (merge conflicts), but changes persist | **Recommended** |

---

## 1. Color Tokens

### Figma Variables → Code Mapping

| Figma Variable | Figma Value (Light) | Emotion Path | Linaria CSS Var (post-migration) |
|---|---|---|---|
| `Background/Primary` | `#ffffff` | `theme.background.primary` | `var(--t-background-primary)` |
| `Background/Secondary` | `#fcfcfc` | `theme.background.secondary` | `var(--t-background-secondary)` |
| `Background/tertiary` | `#f1f1f1` | `theme.background.tertiary` | `var(--t-background-tertiary)` |
| `Background/Quarternary` | `#ebebeb` | `theme.background.quaternary` | `var(--t-background-quaternary)` |
| `Background/Brand` | `#f0f4ff` | — (custom for Fuse) | — |
| `Background/Inverted - Primary` | `#333333` | `theme.background.invertedPrimary` | `var(--t-background-inverted-primary)` |
| `Background/Inverted - Secondary` | `#666666` | `theme.background.invertedSecondary` | `var(--t-background-inverted-secondary)` |
| `Background/Danger` | `#ffefef` | `theme.background.danger` | `var(--t-background-danger)` |
| `Text/Primary` | `#333333` | `theme.font.color.primary` | `var(--t-font-color-primary)` |
| `Text/Secondary` | `#666666` | `theme.font.color.secondary` | `var(--t-font-color-secondary)` |
| `Text/Tertiary` | `#999999` | `theme.font.color.tertiary` | `var(--t-font-color-tertiary)` |
| `Text/Light` | `#b3b3b3` | `theme.font.color.light` | `var(--t-font-color-light)` |
| `Text/Extra light` | `#cccccc` | `theme.font.color.extraLight` | `var(--t-font-color-extra-light)` |
| `Text/Inverted` | `#ffffff` | `theme.font.color.inverted` | `var(--t-font-color-inverted)` |
| `Text/Danger` | `#e5484d` | `theme.font.color.danger` | `var(--t-font-color-danger)` |
| `Accent/Accent 9` | `#3e63dd` | `theme.color.blue` (Indigo) | `var(--t-color-blue)` |
| `Accent/Accent 10` | `#3a5ccc` | `theme.accent.accent10` | `var(--t-accent-accent10)` |
| `Accent/Accent 6` | `#c6d4f9` | `theme.accent.accent6` | `var(--t-accent-accent6)` |
| `Borders/Light` | `#f1f1f1` | `theme.border.color.light` | `var(--t-border-color-light)` |
| `Borders/Medium` | `#ebebeb` | `theme.border.color.medium` | `var(--t-border-color-medium)` |
| `Borders/Stronger` | `#d6d6d6` | `theme.border.color.strong` | `var(--t-border-color-strong)` |
| `Borders/Danger` | `#ffe5e5` | `theme.border.color.danger` | `var(--t-border-color-danger)` |
| `Transparent/Light` | `#0000000a` | `theme.background.transparent.light` | `var(--t-background-transparent-light)` |
| `Transparent/Medium` | `#00000014` | `theme.background.transparent.medium` | `var(--t-background-transparent-medium)` |
| `Transparent/Strong` | `#00000029` | `theme.background.transparent.strong` | `var(--t-background-transparent-strong)` |
| `Transparent/primary` | `#ffffffcc` | `theme.background.transparent.primary` | `var(--t-background-transparent-primary)` |
| `Transparent/Secondary` | `#fcfcfccc` | `theme.background.transparent.secondary` | `var(--t-background-transparent-secondary)` |

### Radix Color Scales (used in code, not directly in Figma variables)

| Figma Variable | Figma Value | Code Reference |
|---|---|---|
| `Colors/Indigo/2` | `#f8faff` | `RadixColors.indigoP3.indigo2` |
| `Colors/Indigo/3` | `#f0f4ff` | `RadixColors.indigoP3.indigo3` |
| `Colors/Indigo/4` | `#e6edfe` | `RadixColors.indigoP3.indigo4` |
| `Colors/Indigo/5` | `#d9e2fc` | `RadixColors.indigoP3.indigo5` |
| `Colors/Indigo/6` | `#c6d4f9` | `RadixColors.indigoP3.indigo6` |
| `Colors/Indigo/9` | `#3e63dd` | `RadixColors.indigoP3.indigo9` |
| `Colors/Indigo/11` | `#3451b2` | `RadixColors.indigoP3.indigo11` |
| `Colors/Indigo/12` | `#101d46` | `RadixColors.indigoP3.indigo12` |
| `Colors/Red/9` | `#e5484d` | `RadixColors.redP3.red9` |
| `Colors/Red/10` | `#dc3d43` | `RadixColors.redP3.red10` |
| `Colors/Green/5` | `#ccebd7` | `RadixColors.greenP3.green5` |
| `Colors/Green/12` | `#153226` | `RadixColors.greenP3.green12` |
| `Colors/Orange/5` | `#ffdcc3` | `RadixColors.orangeP3.orange5` |
| `Colors/Orange/6` | `#ffcca7` | `RadixColors.orangeP3.orange6` |
| `Colors/Orange/11` | `#bd4b00` | `RadixColors.orangeP3.orange11` |

---

## 2. Typography Tokens

### Figma Variables → Code Mapping

| Figma Variable | Figma Value | Emotion Path |
|---|---|---|
| `Titles/H1` | Inter SemiBold 24/1.2 | `theme.font.size.xl` (24.64px) + `theme.font.weight.semiBold` (600) |
| `Titles/H2` | Inter SemiBold 20/1.2 | `theme.font.size.lg` (19.68px) + `theme.font.weight.semiBold` |
| `Titles/H3` | Inter SemiBold 16/1.2 | `theme.font.size.md` (16px) + `theme.font.weight.semiBold` |
| `Big/Medium` | Inter Medium 16/1.2 | `theme.font.size.md` + `theme.font.weight.medium` (500) |
| `Base/Semi-bold` | Inter SemiBold 13/1.4 | `theme.font.size.xs` (13.6px) + `theme.font.weight.semiBold` |
| `Base/Medium` | Inter Medium 13/1.4 | `theme.font.size.xs` + `theme.font.weight.medium` |
| `Base/Regular` | Inter Regular 13/1.4 | `theme.font.size.xs` + `theme.font.weight.regular` (400) |
| `Base/Small/Medium` | Inter Medium 12/1.4 | `theme.font.size.xxs` (10px) — **mismatch: Figma 12px vs code 10px** |
| `Base/Small/Regular` | Inter Regular 12/1.4 | `theme.font.size.xxs` — **same mismatch** |
| `Label/default` | Inter SemiBold 11/100% | No direct mapping — custom label style |
| `Label/small` | Inter SemiBold 9/100% | No direct mapping — custom label style |

**Font Family**: Inter, sans-serif (both Figma and code)

### Fuse Brand Override Points

To rebrand typography for Fuse:
- **Font family**: Change `Inter` in both Figma and `FontCommon.ts`
- **Font sizes**: Adjust scale in `FontCommon.ts` → `size` object
- **Font weights**: Modify `FontCommon.ts` → `weight` object

---

## 3. Spacing Tokens

### Code System

Base unit: **4px** (`spacing(n) = n * 4px`)

| Usage | Code | Value |
|---|---|---|
| Tight | `theme.spacing(1)` | 4px |
| Default | `theme.spacing(2)` | 8px |
| Comfortable | `theme.spacing(3)` | 12px |
| Spacious | `theme.spacing(4)` | 16px |
| Section | `theme.spacing(6)` | 24px |
| Large | `theme.spacing(8)` | 32px |

Note: Figma does not expose spacing as named variables — spacing is applied directly to frames. The 4px grid in Figma aligns with the code's `spacing()` function.

---

## 4. Border Tokens

### Radius

| Code Path | Value | Usage |
|---|---|---|
| `theme.border.radius.xs` | 2px | Inline elements |
| `theme.border.radius.sm` | 4px | Buttons, inputs |
| `theme.border.radius.md` | 8px | Cards, panels |
| `theme.border.radius.xl` | 20px | Large containers |
| `theme.border.radius.xxl` | 40px | Hero elements |
| `theme.border.radius.pill` | 999px | Pill shapes |
| `theme.border.radius.rounded` | 100% | Circles |

---

## 5. Shadow & Blur Tokens

### Figma Variables → Code Mapping

| Figma Variable | Code Path |
|---|---|
| `BoxShadow/light/Light` | `theme.boxShadow.light` |
| `BoxShadow/light/Strong` | `theme.boxShadow.strong` |
| `Shadow+Blur/light/S light-B strong` | Composite: `theme.boxShadow.light` + `theme.blur.strong` |
| `Shadow+Blur/light/S strong-B strong` | Composite: `theme.boxShadow.strong` + `theme.blur.strong` |
| `Blur/Light` | `theme.blur.light` (radius: 12px → code: 6px — **mismatch**) |
| `Blur/Strong` | `theme.blur.strong` (radius: 40px → code: 20px — **mismatch**) |

---

## 6. Fuse Brand Tokens (To Define)

These are the tokens you need to choose for Fuse's brand identity. Once chosen, update them in Figma first, then override in code.

| Token | Twenty Default | Fuse Value | Notes |
|---|---|---|---|
| **Primary accent** | Indigo (#3e63dd) | TBD | Used for links, buttons, selection |
| **Accent scale** | Indigo 1-12 | TBD | Full Radix scale needed |
| **Font family** | Inter | TBD | Or keep Inter |
| **Logo mark** | Twenty logo | Fuse logo | SVG replacement |
| **Favicon** | Twenty favicon | Fuse favicon | 16x16, 32x32, 192x192 |
| **Background tint** | Pure grays | TBD | Optional warm/cool shift |
| **Border style** | Neutral grays | TBD | Usually inherits from background |
| **Tag palette** | Radix full set | TBD | Keep or subset |

---

## 7. FUSE-502 Execution Plan

### Path A: Cherry-pick Linaria first (recommended)

```
1. git cherry-pick 1db2a409612d8e4de0148f7b6bdf8d62535002fd
2. Resolve any merge conflicts (expect clean — zero twenty-ui changes in Fuse)
3. Verify build: npx nx build twenty-ui && npx nx build twenty-front
4. Create /packages/twenty-front/src/theme/fuse-overrides.css:
   :root {
     /* Override accent color — example with Fuse brand */
     --t-accent-accent9: #YOUR_COLOR;
     --t-accent-accent10: #YOUR_DARKER;
     /* Override font family if needed */
     --t-font-family: 'Your Font', sans-serif;
     /* Background tint if desired */
     --t-background-primary: #YOUR_BG;
   }
5. Import in app entry point
6. Verify in Storybook: npx nx storybook:build twenty-front
```

**Time**: ~1 day total

### Path B: Theme on Emotion (if Linaria is blocked)

```
1. Edit packages/twenty-ui/src/theme/constants/ files directly:
   - MainColorsLight.ts — swap Indigo accent for Fuse brand color
   - AccentLight.ts — replace Radix indigo scale with Fuse scale
   - FontCommon.ts — change font family if needed
   - GrayScaleLight.ts — warm/cool shift if desired
2. Update logo SVGs in twenty-front assets
3. Rebuild: npx nx build twenty-ui && npx nx build twenty-front
4. Verify in Storybook
```

**Time**: ~2-3 days (touching more files, higher merge conflict risk with upstream)

---

## 8. Mismatches Found

| Area | Figma | Code | Impact |
|---|---|---|---|
| Small font size | 12px | 10px (xxs: 0.625rem) | Minor — Figma may be ahead of code |
| Blur/Light radius | 12px | 6px | Visual difference in backdrop blur |
| Blur/Strong radius | 40px | 20px | Visual difference in backdrop blur |
| H1 size | 24px | 24.64px (1.54rem) | Negligible — rem rounding |
| Base size | 13px | 13.6px (0.85rem) | Negligible — rem rounding |

These are not blocking. They reflect minor drift between Figma and code that existed in Twenty upstream.

---

## Files Reference

| File | Purpose |
|---|---|
| `packages/twenty-ui/src/theme/constants/ThemeLight.ts` | Root light theme object |
| `packages/twenty-ui/src/theme/constants/ThemeDark.ts` | Root dark theme object |
| `packages/twenty-ui/src/theme/constants/MainColorsLight.ts` | Primary color definitions |
| `packages/twenty-ui/src/theme/constants/AccentLight.ts` | Accent color scale |
| `packages/twenty-ui/src/theme/constants/FontCommon.ts` | Font sizes, weights, family |
| `packages/twenty-ui/src/theme/constants/GrayScaleLight.ts` | Gray scale (backgrounds, borders, text) |
| `packages/twenty-ui/src/theme/constants/BorderLight.ts` | Border colors and radii |
| `packages/twenty-ui/src/theme/constants/BoxShadowLight.ts` | Shadow definitions |
| `packages/twenty-ui/src/theme/constants/BackgroundLight.ts` | Background colors |
| `packages/twenty-ui/src/theme/provider/ThemeProvider.tsx` | Emotion ThemeProvider wrapper |
