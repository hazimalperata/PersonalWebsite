# Direction 3 — Device Theatre (route /lab/3, folder src/lab/d3)

**Idea:** a dark, luxurious product-launch stage. A 3D phone turns through the shipped apps as you scroll. It
says "I ship real products".

**References:**
- https://nickho-motorsports.nl
- https://edolus.com
- https://aengel.io (and https://aengel.io/lite as the model for an honest light fallback)
- Apple product pages for the sticky storytelling rhythm

## Look
- Palette:
  - near-black `#07070A`, panel `#101015`
  - warm white `#EDE9E3`, secondary `#8A8A93`
  - one chrome/iridescent accent, only in the shader and a thin gradient hairline
  - no neon
- Type:
  - **Geist** (300 for display, 500 for UI); captions in **Geist Mono**, small, tracking 0.08em.
  - Display 8–12 vw, light weight, tight leading.
- Layout: cinematic.
  - Generous black space.
  - Text appears in short lines.
  - A thin top bar with name + section name + a "Contact" pill.

## Signature motions
1. **Hero: a living chrome background.**
   - A full-screen fragment shader: liquid chrome / aurora, slow, dark, with soft highlights that follow the
     cursor a little. Write it yourself in R3F (ShaderMaterial on a full-screen plane) or adapt React Bits'
     "Liquid Chrome" / "Aurora" (credit them).
   - Pause off-screen; DPR ≤ 1.25; on coarse pointers render at half resolution or swap to a static gradient
     image.
   - The headline fades up word by word (blur 8 px → 0, y 20 → 0), then the role and the message.
2. **The device sequence: the centrepiece.**
   - A pinned section, about 500 vh on desktop.
   - One R3F scene with a phone built from geometry: `RoundedBox` body with a metallic/physical material, a
     screen plane slightly in front, subtle environment lighting from drei `Environment` with a preset or a
     generated lightformer setup. No external model files required.
   - ScrollTrigger scrub drives a progress value (keep it in a ref, read it in `useFrame`, damp it). As it
     advances the phone:
     - (a) turns from front to three-quarter, and its screen shows **Dremly** (cycling its 3 screenshots);
     - (b) does a full graceful turn, and the screen swaps to **Posme**;
     - (c) turns again, and the screen shows **Rommer** as an explicit *illustration*: a minimal animated pose
       skeleton (lines and joints) drawn on a canvas texture, with the caption "Illustration · on-device pose
       analysis". Not a fake screenshot.
     - (d) moves aside as the **1likte** wide images appear on a floating tilted panel.
   - Beside the phone, a text column cross-fades per app: title, one-line summary, role, stack chips, and
     platform + store links for Dremly and Posme.
   - A small progress rail shows 1 / 4 … 4 / 4.
   - Screen textures: load the screenshots with drei `useTexture`, `SRGBColorSpace`; keep the aspect right with
     cover-fit UV math.
3. **Zoom-through.** At the end of the sequence the camera dollies into the phone screen. The screen fills the
   viewport and dissolves into the next section's background, a smooth hand-off rather than a cut.
4. **Footer reveal.** The page content slides up to uncover a fixed contact block underneath: page wrapper with
   margin-bottom equal to the footer height, footer `position: fixed; bottom: 0; z-index: -1` (the "peel"
   pattern).

## Other sections
- **Proof:** four numbers in light display weight, revealed with a soft light sweep (a gradient mask moving
  across the text once on enter) and counted up without overshoot.
- **More work:** a minimal list; hover shows a soft spotlight following the cursor inside the row.
- **Capabilities:** four glass-like panels (very subtle: 1 px border at 8% white, backdrop blur only if cheap)
  with items. A slow reflective shine passes over each panel once as it enters.
- **Experience:** a vertical timeline with a thin glowing line that draws as you scroll (scrub), dates in mono.
- **Contact:** the fixed footer block with a huge light "Let's build something real." line, the email, CV and
  socials, and a magnetic Contact button.

## Performance (strict)
- One `<Canvas>` for the device scene, mounted only when near the viewport (IntersectionObserver).
- `frameloop="demand"` with `invalidate()` while scrubbing, or pause when off-screen.
- DPR `[1, 1.5]`.
- The hero shader is a separate lightweight canvas.

## Mobile
- The device sequence stays but is shorter (~300 vh), with the text below the phone.
- Lower DPR and simpler lighting.
- The hero shader becomes a pre-rendered gradient.
- The zoom-through can become a fade.
