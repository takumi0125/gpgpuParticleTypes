precision highp float;
precision highp int;

uniform mat4 modelMatrix;
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;

uniform float time;
uniform sampler2D positionVelocityTexture;
uniform sampler2D colorTexture;

uniform float dataTextureSize;
uniform float dataCanvasSize;
uniform float drawScale;
uniform float pointSize;

attribute vec3 position;
attribute float vertexIndex;
attribute vec4 randomValue;

varying vec4 vColor;

void main(void){
  vec4 modelPos = modelMatrix * vec4(vec3(0.0), 1.0);

  float colIndex = mod(vertexIndex, dataTextureSize);
  float rowIndex = floor(vertexIndex / dataTextureSize);
  vec2 dataTextureUV = (vec2(colIndex, rowIndex) + vec2(0.5)) / dataTextureSize;

  vec4 positionVelocityData = texture2D(positionVelocityTexture, dataTextureUV);

  vec2 pos = positionVelocityData.xy * drawScale;
  modelPos.xy += pos;

  vColor = texture2D(colorTexture, dataTextureUV);
  vColor.a -= randomValue.y * 255.0 * 0.5;


  gl_Position = projectionMatrix * viewMatrix * modelPos;
  gl_PointSize = pointSize * (1.0 + 0.4 * randomValue.x + min(1.0, length(positionVelocityData.zw) / 10.0));
}
