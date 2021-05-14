// isWebpSupported
// export default ()=> document.createElement('canvas').toDataURL('image/webp').indexOf('data:image/webp') == 0;

export default async ()=> {
  const webpImg = "data:image/webp;base64,UklGRjIAAABXRUJQVlA4ICYAAACyAgCdASoCAAEALmk0mk0iIiIiIgBoSygABc6zbAAA/v56QAAAAA==";
  let resolver;

  const img = new Image();
  const onLoad = ()=> {
    console.log('webp loaded');
    img.removeEventListener('load', onLoad);
    img.removeEventListener('error', onError);
    resolver(true);
  }
  const onError = ()=> {
    console.log('webp load error');
    img.removeEventListener('load', onLoad);
    img.removeEventListener('error', onError);
    resolver(false);
  }

  return new Promise((resolve)=> {
    resolver = resolve;
    img.addEventListener('load', onLoad, { once: true });
    img.addEventListener('error', onError, { once: true });
    img.src = webpImg;
  });
}

