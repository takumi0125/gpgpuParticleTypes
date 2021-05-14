// isChrome
import isEdge from './isEdge';
export default function(userAgent) {
  return !isEdge(userAgent) && !!userAgent.toLowerCase().match(/chrome/);
};
