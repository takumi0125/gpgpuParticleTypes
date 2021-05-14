// preloadImg
export default async function(imgPath) {
  return new Promise(function(resolve, reject) {
    let img, onError, onLoad;
    img = new Image();
    onLoad = function() {
      img.removeEventListener('load', onLoad);
      img.removeEventListener('error', onError);
      return resolve(img);
    };
    onError = function() {
      img.removeEventListener('load', onLoad);
      img.removeEventListener('error', onError);
      return reject('img load error', imgPath);
    };
    img.addEventListener('load', onLoad);
    img.addEventListener('error', onError);
    return img.src = imgPath;
  });
};
