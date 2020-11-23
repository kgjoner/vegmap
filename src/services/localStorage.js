export const persistPermission = (permission) => {
  localStorage.setItem('vegmap-permission', permission)
}

export const getPermission = () => {
  const data = localStorage.getItem('vegmap-permission')
  if(data === 'true') {
    return true
  } else if(data === 'false') {
    return false
  } else {
    return null
  }
}