// setUpBtnTwitter
export default function(btn, text, shareURL = '',hashtags=[]) {
  let url = 'https://twitter.com/intent/tweet?';
  if (shareURL === '') {
    url += ('text=' + encodeURIComponent(text));
  } else {
    url += ('url=' + encodeURIComponent(shareURL) + '&text=' + encodeURIComponent(text));
  }

  if(hashtags.length > 0) {
    let hashstr = hashtags.map((tag) => {
      return encodeURIComponent(tag)
    }).join(',')
    url += `&hashtags=${hashstr}`
  }

  return btn.addEventListener('click', function(e) {
    window.open(url, 'twitterShare', 'width=670,height=400');
    e.preventDefault();
    e.stopImmediatePropagation();
  });
};
