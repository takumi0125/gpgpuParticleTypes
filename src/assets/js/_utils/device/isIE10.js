// isIE10
export default function(userAgent) {
  return userAgent.toLowerCase().indexOf('msie 10.0') !== -1;
}
