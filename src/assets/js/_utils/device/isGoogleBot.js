// isGoogleBot
export default function(userAgent) {
  return !!userAgent.toLowerCase().match(/googlebot/);
}
