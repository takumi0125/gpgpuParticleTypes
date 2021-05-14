precision highp float;
precision highp int;

uniform sampler2D pointTexture;
uniform float alpha;
uniform float typeIndex;
uniform float numTypes;

varying vec4 vColor;

void main(void) {
  vec2 uvUnit = vec2(1.0 / numTypes, 1.0);
  vec2 uv = gl_PointCoord.xy * uvUnit + vec2(uvUnit.x * typeIndex, 0.0);
  uv.y = 1.0 - uv.y;
  vec4 color = texture2D(pointTexture, uv);
  color *= (vColor / 255.0);
  if(color.a == 0.0) discard;
  gl_FragColor = color;
}
