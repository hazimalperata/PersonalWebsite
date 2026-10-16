/** Full-screen quad: the plane is 2x2 so its vertices already sit in clip space. */
export const distortVertex = /* glsl */ `
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`;
