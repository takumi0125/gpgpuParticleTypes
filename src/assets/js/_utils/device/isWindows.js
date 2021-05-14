// isWindows
export default function(userAgent) {
  return userAgent.toLowerCase().indexOf('windows') !== -1;
}
