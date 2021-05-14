// isiPhone
export default function(userAgent) {
  return userAgent.toLowerCase().indexOf('iphone') !== -1;
};
