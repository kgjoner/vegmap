import { errorNames } from '../constants/systemTypes'
import { errorMessages } from '../constants/systemMessages'

export function existOrError(value, err) {
  if(!value || (typeof value === 'string' && !value.trim())) throw err
  if(typeof value === 'object' && Object.keys(value).length === 0) throw err
}


export function checkWhetherRestaurantInputDataExist(restaurant) {
  const {name, type, option, foods, address, latitude, longitude} = restaurant

  existOrError(name, {
    name: errorNames.EMPTY_FIELD.NAME,
    message: errorMessages.EMPTY_FIELD.NAME
  })

  existOrError(type, {
    name: errorNames.EMPTY_FIELD.TYPE,
    message: errorMessages.EMPTY_FIELD.TYPE
  })

  existOrError(option.vegan || option.vegetarian, {
    name: errorNames.EMPTY_FIELD.OPTION,
    message: errorMessages.EMPTY_FIELD.OPTION
  })

  existOrError(foods, {
    name: errorNames.EMPTY_FIELD.FOODS,
    message: errorMessages.EMPTY_FIELD.FOODS
  })

  existOrError(address, {
    name: errorNames.EMPTY_FIELD.ADDRESS,
    message: errorMessages.EMPTY_FIELD.ADDRESS
  })

  existOrError(latitude, {
    name: errorNames.EMPTY_FIELD.COORDS,
    message: errorMessages.EMPTY_FIELD.COORDS
  })
  
  existOrError(longitude, {
    name: errorNames.EMPTY_FIELD.COORDS,
    message: errorMessages.EMPTY_FIELD.COORDS
  })
}