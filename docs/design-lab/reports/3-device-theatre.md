# D3 Device Theatre report
Route /lab/3; code src/lab/d3, src/app/lab/3. Branch lab-3.
Sections: hero (Geist 300, word-by-word blur fade, own liquid-chrome fbm shader in ChromeShader.tsx, CSS gradient on coarse/reduced), proof (light sweep + eased count-up), device stage (500svh sticky, 300svh mobile; one R3F canvas DeviceScene.tsx: extruded phone, lightformer env, shader screen crossfade, cover-fit UVs, Rommer canvas texture illustration, floating tilted 1likte panels, dolly zoom-through dissolving into near-black), more-work spotlight rows, capabilities with one-shot shine, How I use AI (4-step scroll-drawn pipeline + product lines) and the system part (SystemStage.tsx: terminal typed by scroll, 5 parts), experience timeline with scrubbed glowing line, fixed peel footer with magnetic email button.
Scope updates applied: AI section incl. system; Rommer shown as "Movement analysis for Rommer" (facts title), screen caption does not name the app.
Decisions: phone body is ExtrudeGeometry (RoundedBox cannot round XY corners at that thickness). Lint: react-hooks/immutability disabled per file for three.js/scroll mutables.
Verify: typecheck/lint/build EXIT=0 (lint: 1 pre-existing og warning). Playwright desktop/mobile/reduced: no console or page errors; mobile scrollWidth 390. Shots in <worktree>/shots\d3\ (d-*, m-*, r-full).
Weaknesses: SSR/hydration flash before motion gate; hero shader slightly grey; fullPage reduced shot repeats because of fixed footer; no real GPU fps measurement (swiftshader).
Next: tune shader contrast, pause rail focus handling, measure fps.
