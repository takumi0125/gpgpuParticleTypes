// map
export default function(value, inputMin, inputMax, outputMin, outputMax, clamp = true) {
  if (clamp === true) {
    if (value < inputMin) {
      return outputMin;
    }
    if (value > inputMax) {
      return outputMax;
    }
  }
  let p = (outputMax - outputMin) / (inputMax - inputMin);
  return ((value - inputMin) * p) + outputMin;
};
