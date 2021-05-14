// isEdge
export default function(userAgent) {
  return !!userAgent.toLowerCase().match(/edge?/);
};
