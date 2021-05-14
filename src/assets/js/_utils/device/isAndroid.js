// isAndroid
export default function(userAgent) {
  return !!userAgent.toLowerCase().match(/android/);
};
