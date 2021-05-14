// checkDeivce (use MobileDetect)
import MobileDetect from 'mobile-detect';

export default function() {
  let md = new MobileDetect(navigator.userAgent);
  let html = document.querySelector('html');
  if (md.tablet()) {
    html.classList.add('is-tablet');
  } else if (md.mobile()) {
    html.classList.add('is-mobile');
  } else {
    html.classList.add('is-desktop');
  }
  return md;
};
