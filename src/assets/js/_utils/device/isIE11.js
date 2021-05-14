// isIE11
export default function(userAgent) {
  return userAgent.toLowerCase().indexOf('rv:11.0') !== -1;
}
