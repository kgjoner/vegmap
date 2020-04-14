module.exports = function existOrError(value, msg) {
  if(!value || (typeof value === 'string' && !value.trim())) throw msg
  if(typeof value === 'object' && Object.keys(value).length === 0) throw msg
}