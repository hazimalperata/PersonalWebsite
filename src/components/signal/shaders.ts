/**
 * Point-cloud shaders. Simplex noise: Ashima Arts / Ian McEwan (webgl-noise), MIT licence,
 * https://github.com/ashima/webgl-noise
 */
export const vertexShader = /* glsl */ `
attribute vec3 aFrom;
attribute vec3 aTo;
attribute vec3 aColor;
attribute float aSeed;
attribute float aLane;

uniform float uMix;
uniform float uTime;
uniform float uPx;
uniform float uFade; // 0 -> 1 on first paint
uniform vec2 uMouse;
uniform float uOrbit;
uniform vec2 uOrbitSel; // 1 when the from / to state rotates (contact ring)
uniform vec4 uA; // size, noise, repel, alpha of the from-state
uniform vec4 uB; // same for the to-state
uniform vec2 uFocus; // focused project of from / to state, -1 for none
uniform vec2 uIsPipe; // 1 when the from / to state is the pipeline
uniform float uPipeX; // world x the workflow pipeline has filled up to (huge = everything lit)

varying vec3 vColor;
varying float vAlpha;

vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 mod289(vec4 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 permute(vec4 x){return mod289(((x*34.0)+10.0)*x);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}
float snoise(vec3 v){
  const vec2 C=vec2(1.0/6.0,1.0/3.0);
  const vec4 D=vec4(0.0,0.5,1.0,2.0);
  vec3 i=floor(v+dot(v,C.yyy));
  vec3 x0=v-i+dot(i,C.xxx);
  vec3 g=step(x0.yzx,x0.xyz);
  vec3 l=1.0-g;
  vec3 i1=min(g.xyz,l.zxy);
  vec3 i2=max(g.xyz,l.zxy);
  vec3 x1=x0-i1+C.xxx;
  vec3 x2=x0-i2+C.yyy;
  vec3 x3=x0-D.yyy;
  i=mod289(i);
  vec4 p=permute(permute(permute(i.z+vec4(0.0,i1.z,i2.z,1.0))+i.y+vec4(0.0,i1.y,i2.y,1.0))+i.x+vec4(0.0,i1.x,i2.x,1.0));
  float n_=0.142857142857;
  vec3 ns=n_*D.wyz-D.xzx;
  vec4 j=p-49.0*floor(p*ns.z*ns.z);
  vec4 x_=floor(j*ns.z);
  vec4 y_=floor(j-7.0*x_);
  vec4 x=x_*ns.x+ns.yyyy;
  vec4 y=y_*ns.x+ns.yyyy;
  vec4 h=1.0-abs(x)-abs(y);
  vec4 b0=vec4(x.xy,y.xy);
  vec4 b1=vec4(x.zw,y.zw);
  vec4 s0=floor(b0)*2.0+1.0;
  vec4 s1=floor(b1)*2.0+1.0;
  vec4 sh=-step(h,vec4(0.0));
  vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;
  vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
  vec3 p0=vec3(a0.xy,h.x);
  vec3 p1=vec3(a0.zw,h.y);
  vec3 p2=vec3(a1.xy,h.z);
  vec3 p3=vec3(a1.zw,h.w);
  vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
  p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
  vec4 m=max(0.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0);
  m=m*m;
  return 42.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
}

void main(){
  // each point leaves a little after the one before it (seed-staggered), so the field flows instead of snapping
  float local = clamp((uMix - aSeed * 0.32) / 0.68, 0.0, 1.0);
  float e = local * local * local * (local * (local * 6.0 - 15.0) + 10.0);

  vec3 from = aFrom;
  vec3 to = aTo;
  float c = cos(uOrbit); float s = sin(uOrbit);
  if (uOrbitSel.x > 0.5) from.xy = vec2(c * from.x - s * from.y, s * from.x + c * from.y);
  if (uOrbitSel.y > 0.5) to.xy = vec2(c * to.x - s * to.y, s * to.x + c * to.y);
  vec3 pos = mix(from, to, e);

  // curved path: a small perpendicular arc while travelling
  float travel = sin(e * 3.14159265);
  pos.xy += vec2(cos(aSeed * 40.0), sin(aSeed * 40.0)) * travel * 38.0;

  float noiseAmp = mix(uA.y, uB.y, e);
  vec2 q = pos.xy * 0.0042;
  float t = uTime * 0.11 + aSeed * 7.0;
  vec2 drift = vec2(snoise(vec3(q, t)), snoise(vec3(q + 31.4, t + 11.0)));
  pos.xy += drift * noiseAmp;

  float repel = mix(uA.z, uB.z, e);
  vec2 d = pos.xy - uMouse;
  float dist = length(d);
  float fall = exp(-(dist * dist) / (2.0 * 120.0 * 120.0));
  pos.xy += (d / max(dist, 1.0)) * fall * 96.0 * repel;

  float size = mix(uA.x, uB.x, e) * (0.78 + aSeed * 0.5) * (1.0 + pos.z * 0.16);
  gl_PointSize = size * uPx;

  float dimA = (uFocus.x > -0.5 && abs(aLane - uFocus.x) > 0.5) ? 1.0 : 0.0;
  float dimB = (uFocus.y > -0.5 && abs(aLane - uFocus.y) > 0.5) ? 1.0 : 0.0;
  float dim = mix(dimA, dimB, e);
  float pw = mix(uIsPipe.x, uIsPipe.y, e);
  float lit = 1.0 - smoothstep(uPipeX - 50.0, uPipeX + 50.0, pos.x);
  float emph = mix(1.0, mix(0.26, 1.0, lit), pw);
  gl_PointSize *= 1.0 + 0.45 * pw * lit;
  vAlpha = mix(uA.w, uB.w, e) * mix(1.0, 0.15, dim) * (0.82 + 0.18 * aSeed) * emph * uFade;
  vColor = aColor;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
`;

export const fragmentShader = /* glsl */ `
varying vec3 vColor;
varying float vAlpha;
void main(){
  float d = length(gl_PointCoord - 0.5);
  if (d > 0.5) discard;
  float a = smoothstep(0.5, 0.12, d);
  gl_FragColor = vec4(vColor, a * vAlpha);
}
`;
