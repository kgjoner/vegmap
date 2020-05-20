export function existOrError(value, err) {
  if(!value || (typeof value === 'string' && !value.trim())) throw err
  if(typeof value === 'object' && Object.keys(value).length === 0) throw err
}


export function checkWhetherRestaurantInputDataExist(restaurant) {
  const {name, type, option, foods, address, latitude, longitude} = restaurant

  existOrError(name, {
    name: 'name',
    message: 'Informe o nome do restaurante.'
  })
  existOrError(type, {
    name: 'type',
    message: 'Informe o tipo do restaurante.'
  })
  existOrError(option.vegan || option.vegetarian, {
    name: 'option',
    message: 'O restaurante deve atender ao menos uma das opções.'
  })
  existOrError(foods, {
    name: 'foods',
    message: 'Informe as comidas servidas.'
  })
  existOrError(address, {
    name: 'address',
    message: 'Informe o endereço do restaurante.'
  })
  existOrError(latitude, {
    name: 'coord',
    message: 'Informe as coordenadas do restaurante.'
  })
  existOrError(longitude, {
    name: 'coord',
    message: 'Informe as coordenadas do restaurante.'
  })
}