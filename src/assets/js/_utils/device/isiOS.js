// isiOS
import isiPad   from './isiPad';
import isiPhone from './isiPhone';
import isiPod   from './isiPod';

export default function(userAgent) {
  return isiPad(userAgent) || isiPhone(userAgent) || isiPod(userAgent);
};
