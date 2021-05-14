// isFirefox
export default function(userAgent) {
  return !!userAgent.toLowerCase().match(/firefox/);
};
