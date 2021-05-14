// clamp
export default function(value, min, max) {
  return Math.max(min, Math.min(max, value));
};
