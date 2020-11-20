import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { getAllAcceptableFoods, turnFoodIntoAcceptableForm } from '../utils/acceptableFoods'
import { notify } from '../store/notification/action'
import { errorNames, notificationTypes } from '../constants/systemTypes'


function useFood(initialValue) {
  const [savedFoods, setSavedFoods] = useState(initialValue)
  const [foodOnTyping, setFoodOnTyping] = useState('')
  const [foodHint, setFoodHint] = useState('')
  const dispatch = useDispatch()

  const listOfAcceptableFoods = getAllAcceptableFoods()


  function normalizeString(str, {specialChars, diacritics, spaces} = {}) {
    if(spaces) str = str.replace(/\s/, '')
    if(diacritics) str = str.normalize('NFD').replace(/[\u0300-\u036f]/g, "")
    if(specialChars) str = str.replace(/[!?@#$%&*,;/\\|()[\]{}]/g, "")
    return str.toLowerCase()
  }


  function handleChange(typedValue) {
    typedValue = normalizeString(typedValue, { specialChars: true })
    setFoodOnTyping(typedValue)

    if(typedValue.length < 2) {
      setFoodHint('')
      return
    }
    
    const normalizedTypedValue = normalizeString(typedValue, { diacritics: true, spaces: true })
    const beginWithTypedValue = new RegExp('^' + normalizedTypedValue)

    let foodHint = listOfAcceptableFoods.find(listedFood => {
      const normalizedListedFood = normalizeString(listedFood, { diacritics: true, spaces: true })
      return normalizedListedFood.match(beginWithTypedValue)
        && normalizedListedFood !== normalizedTypedValue
        && !savedFoods.includes(listedFood)
    })

    setFoodHint(foodHint || '')
  }


  function handleKeyInput(e) {
    if (e.key === 'Tab' && foodHint) {
      e.preventDefault()
      addFoodToChain(foodHint)
    }

    const separatorKeys = [' ', ',', ';', '.', '/', '\\', '|']
    if(separatorKeys.indexOf(e.key) !== -1) {
      if(e.key === ' ' && foodHint) return
      e.preventDefault()
      addFoodToChain(foodOnTyping)
    }

    if(e.key === 'Enter') {
      if(foodOnTyping) {
        addFoodToChain()
      }
    }

    if(e.key === 'Backspace' && foodOnTyping.length === 0) {
      const newChain = [...savedFoods]
      newChain.pop()
      setSavedFoods(newChain)
      setFoodHint('')
      setFoodOnTyping('')
    }
  }


  function handleBlur() {
    if(!foodOnTyping) return
    addFoodToChain()
  }


  function addFoodToChain(food) {
    let foodToAdd;
    if(food) {
      foodToAdd = turnFoodIntoAcceptableForm(food)
    } else {
      if(foodHint && foodOnTyping.match(/\s+$/)) {
        //To avoid adding a shorter version if there is a larger one, as café x café colonial
        foodToAdd = foodHint
      } else {
        foodToAdd = turnFoodIntoAcceptableForm(foodOnTyping) || foodHint
      }
    }
    setFoodHint('')
    setFoodOnTyping('')

    if(!foodToAdd) {
      dispatch(notify(
        notificationTypes.ERROR,
        'Comida não listada.' 
      ))
      return
    }

    const newChain = [...savedFoods]
    newChain.push(foodToAdd)
    setSavedFoods(newChain)
  }


  return [
    savedFoods,
    foodOnTyping,
    foodHint,
    {
      change: handleChange,
      keyInput: handleKeyInput,
      blur: handleBlur,
    },
    setSavedFoods
  ]

}

export default useFood