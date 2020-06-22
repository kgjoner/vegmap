import { errorNames } from "../constants"

export function existOrError(value, err) {
  if(!value || (typeof value === 'string' && !value.trim())) throw err
  if(typeof value === 'object' && Object.keys(value).length === 0) throw err
}


export function checkWhetherRestaurantInputDataExist(restaurant) {
  const {name, type, option, foods, address, latitude, longitude} = restaurant

  existOrError(name, {
    name: errorNames.EMPTY_FIELD.NAME,
    message: 'Informe o nome do restaurante.'
  })

  existOrError(type, {
    name: errorNames.EMPTY_FIELD.TYPE,
    message: 'Informe o tipo do restaurante.'
  })

  existOrError(option.vegan || option.vegetarian, {
    name: errorNames.EMPTY_FIELD.OPTION,
    message: 'O restaurante deve atender ao menos uma das opções.'
  })

  existOrError(foods, {
    name: errorNames.EMPTY_FIELD.FOODS,
    message: 'Informe as comidas servidas.'
  })

  existOrError(address, {
    name: errorNames.EMPTY_FIELD.ADDRESS,
    message: 'Informe o endereço do restaurante.'
  })

  existOrError(latitude, {
    name: errorNames.EMPTY_FIELD.COORDS,
    message: 'Informe as coordenadas do restaurante.'
  })
  
  existOrError(longitude, {
    name: errorNames.EMPTY_FIELD.COORDS,
    message: 'Informe as coordenadas do restaurante.'
  })
}