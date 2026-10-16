/**
 * Cursor-speed driven ripple. `uScale` maps wrapper UVs onto the texture so the
 * result matches CSS `object-cover`. The chromatic offset is deliberately tiny.
 */
export const distortFragment = /* glsl */ `
uniform sampler2D uTex;
uniform float uTime;
uniform float uStrength;
uniform vec2 uMouse;
uniform vec2 uScale;

varying vec2 vUv;

void main() {
  vec2 p = vUv;
  p += (vUv - uMouse) * uStrength * 0.08 * sin(vUv.y * 8.0 + uTime * 2.0);

  vec2 uv = (p - 0.5) * uScale + 0.5;
  vec2 shift = vec2(uStrength * 0.004, 0.0);

  float r = texture2D(uTex, uv + shift).r;
  vec2 ga = texture2D(uTex, uv).ga;
  float b = texture2D(uTex, uv - shift).b;

  gl_FragColor = vec4(r, ga.x, b, 1.0);
  #include <colorspace_fragment>
}
`;
