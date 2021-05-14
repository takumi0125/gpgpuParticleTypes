// ------------------------------
// parseGetParams
// ------------------------------
export default ()=> {
  const params = {}
  location.search.replace('?', '').split('&').map((str)=> {
    const [ key, value ] = str.split('=')
    params[key] = value;
    return { key, value };
  });
  return params;
}

