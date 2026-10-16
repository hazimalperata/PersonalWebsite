# Direction 2 — Kinetic Editorial (route /lab/2, folder src/lab/d2)

**Idea:** type is the interface. Loud, confident, magazine-meets-brutalism, flat saturated colour, no decorative
imagery. It says "I'm sure of my work".

**References:**
- https://neutomni.com
- https://mikewilcockdesign.com
- https://stefanobg.com

## Look
- Palette:
  - off-white `#F2EFE8`, black `#0B0B0B`
  - signal red `#E2261C`
  - one acid panel `#E4FF3A`, used once
  - text on red: off-white; text on acid: black
- Type:
  - **Bricolage Grotesque**, variable, with the `wdth` (75–100) and `wght` axes. Load it with `axes: ['wdth']`
    in next/font if supported; otherwise use `Big Shoulders Display` or `Anton` as the condensed alternative and
    say which you used.
  - Display sizes 14–24 vw. Body **Inter** 400/500, 18–20 px.
  - Uppercase display is allowed here.
- Layout:
  - edge-to-edge type;
  - a strict 12-column grid with thin 1 px rules;
  - lots of negative space between the loud moments.

## Signature motions
1. **Hero: the name as a wall of type.**
   - "HAZIM ALPER ATA" set across the full width (fit with a measured font-size: scale the type so each line
     fills the viewport width exactly; recompute on resize).
   - On load, lines rise through masks with GSAP SplitText (`type: "lines,chars"`, `mask: "lines"`), stagger
     0.06 s, `power4.out`, ~1 s.
   - Below it, the role and a one-line version of the message.
   - **Scroll velocity skew:** while scrolling, display lines skew (`skewY` / `skewX`) in proportion to
     ScrollTrigger velocity, clamped to ±6°, smoothed with `gsap.quickTo`, returning to 0 when scrolling stops.
     Apply it to every display headline on the page.
   - **Variable axes on scroll:** the hero name's `wdth` / `wght` change with scroll progress (wide and heavy →
     condensed and light as you leave).
2. **Scroll-lit statement.**
   - The full message, pinned as a big paragraph (5–7 vw).
   - Each word goes from 15% to 100% opacity as you scrub (SplitText words + ScrollTrigger scrub).
   - Key words ("highest standard", "real", "modern") turn red when lit.
3. **Colour panels that wipe over each other.**
   - The proof section is 4 full-viewport panels (black, red, off-white, acid), each one fact.
   - Each panel reveals over the previous with a scrubbed `clip-path` (e.g. `inset(100% 0 0 0)` →
     `inset(0)`, or a diagonal polygon).
   - The giant number counts up while its panel arrives. Eased, no overshoot; the final value is exact.
4. **Work as huge titles + cursor image.**
   - Each project title in display type, one per row, with kind · year · stack in small text.
   - On fine pointers, hovering a row shows its screenshot in a frame that follows the cursor with lag
     (`quickTo`), rotating slightly with horizontal velocity, scaling from 0.9.
   - On touch, the image sits inline under the title.
   - Rommer: no image; on hover show a red card with "Movement analysis, on device" set in type.
   - Click expands the row into a full-screen detail overlay with GSAP Flip: title moves to the top, summary,
     role, stack, links, "Read the case study". Close with Esc / button, focus managed.
5. **Marquee bands** between sections: a full-width band of words (the stack items) scrolling horizontally. Speed
   and direction follow scroll velocity; it pauses under reduced motion.

## Other sections
- **More work:** a numbered list in display type at 6 vw with underline-draw on hover.
- **Capabilities:** 4 columns with big group titles; items as plain lines with a red bullet.
- **Experience:** a big-type table: years on the left in display, company + role + line on the right; rules
  between rows draw in on enter.
- **Contact:** a black full screen with "LET'S TALK" at full width (same fitted type), the email below as a big
  link with an underline that draws, CV + socials.
  - The headline letters push away from the cursor slightly (per-char quickTo, small distance) on fine pointers.

## Mobile
- Fitted type still fills the width (it simply gets smaller).
- Velocity skew ±3°.
- The pinned statement becomes a normal paragraph whose words light on enter (no pin) if pinning feels bad on
  touch.
- Panels still wipe; use a shorter scroll distance.
- No cursor image.
