import { useState } from 'react'
import { getAllAcceptableFoods, turnFoodIntoAcceptableForm } from '../utils/acceptableFoods'


function useFood(initialValue) {
  const [savedFoods, setSavedFoods] = useState(initialValue)
  const [foodOnTyping, setFoodOnTyping] = useState('')
  const [foodHint, setFoodHint] = useState('')

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


  function handleKeyInput(e, onEnter) {
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
      e.preventDefault()
      const addedFood = shouldHintOverrideTyped() ? foodHint : foodOnTyping
      addFoodToChain(addedFood)
      if(onEnter) onEnter()
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
    const addedFood = shouldHintOverrideTyped() ? foodHint : foodOnTyping
    addFoodToChain(addedFood)
  }


  //I may unify the two next functions to call "turnFood..." only once 
  //because "foodHint" is already in an acceptable form

  function shouldHintOverrideTyped() {
    return foodHint && (
      foodOnTyping.match(/\s+$/) ||
      !turnFoodIntoAcceptableForm(foodOnTyping)
    )
  }


  function addFoodToChain(food) {
    food = turnFoodIntoAcceptableForm(food)
    const newChain = [...savedFoods]
    if(food) {
      newChain.push(food)
    }
    setSavedFoods(newChain)
    setFoodHint('')
    setFoodOnTyping('')
  }


  return [
    savedFoods,
    foodOnTyping,
    foodHint,
    {
      change: handleChange,
      keyInput: handleKeyInput,
      blur: handleBlur,
      changeAll: setSavedFoods
    }
  ]

}

export default useFood