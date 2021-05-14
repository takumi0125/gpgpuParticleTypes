// resolution (DataTextureのサイズ), positionVelocityTexture, colorTextureはthree.jsによって自動的に定義済み

#pragma glslify: hsv2rgb = require('../../../_utils/glsl/hsv2rgb')
#pragma glslify: rgb2hsv = require('../../../_utils/glsl/rgb2hsv')

uniform sampler2D imgColorsData;

void main(void) {
  vec2 uv = gl_FragCoord.xy / resolution;

  vec2 velocity = texture2D(positionVelocityTexture, uv).zw;

  vec4 colorFrom = texture2D(colorTexture, uv);
  vec4 colorTo = texture2D(imgColorsData, uv);
  vec4 color = colorFrom + (colorTo - colorFrom) * 0.8;

  vec3 hsv = rgb2hsv(color.rbg);
  float velocityValue = min(1.0, length(velocity) / 20.0);
  hsv.r += velocityValue;
  hsv.g -= velocityValue * 4.0;
  color.rgb = hsv2rgb(hsv);

  gl_FragColor = color;
}
