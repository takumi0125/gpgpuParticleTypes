// resolution (DataTextureのサイズ), positionVelocityTextureはthree.jsによって自動的に定義済み

uniform float dataCanvasSize;
uniform vec2 pointerPos;
uniform float pointerForceRadius;
uniform float isPointerActive;
uniform float transitionValue;
uniform sampler2D imgPositionsData;

const float FRICTION = 0.8;
const float POINTER_FORCE_FACTOR = 5.0;
const float SELF_FORCE_FACTOR = 0.1;
const float TRANSITION_FORCE_FACTOR = 100.0;

void main(void) {
  vec2 uv = gl_FragCoord.xy / resolution;

  vec4 positionVelocityData = texture2D(positionVelocityTexture, uv);

  vec2 acceralation = vec2(0.0);
  vec2 posFrom = positionVelocityData.xy;
  vec2 velocity = positionVelocityData.zw;

  vec2 posTo = texture2D(imgPositionsData, uv).xy;

  // ポインターによる加速 (ポインターの位置から放射状に力が弱くなる)
  vec2 pointerForceVector = posTo - pointerPos;
  float pointerForcePower = max(0.0, pointerForceRadius - max(4.0, length(pointerForceVector))) / pointerForceRadius;
  pointerForcePower = smoothstep(0.1, 0.9, pointerForcePower * pointerForcePower) * POINTER_FORCE_FACTOR;
  acceralation += normalize(pointerForceVector) * pointerForcePower;

  // 遷移時にかかる力 (ポインタの位置から爆発っぽくなる)
  acceralation += normalize(pointerForceVector) * TRANSITION_FORCE_FACTOR * transitionValue;

  // 元の位置に戻ろうとする力による加速
  vec2 selfForce = (posTo - posFrom) * SELF_FORCE_FACTOR;
  acceralation += selfForce;

  // 速度に加速度をプラス
  velocity += acceralation * isPointerActive;

  // 抵抗
  velocity *= FRICTION;

  gl_FragColor = vec4(posFrom + velocity, velocity);
}
