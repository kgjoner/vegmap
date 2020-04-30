import React, { useState, useEffect } from 'react'
import FoodInput from './utils/FoodInput'
import existOrError from '../utils/existOrError'
import api from '../services/api'
import "./signupBox.css"

function SignupBox({ selectedRestaurant, closePopup, user, pickCoordsOnMap, pinLocation, setPinLocation }) {
  const [name, setName] = useState('')
  const [type, setType] = useState('')
  const [option, setOption] = useState({ vegan: false, vegetarian: false })
  const [foods, setFoods] = useState([])
  const [address, setAddress] = useState('')
  const [website, setWebsite] = useState('')
  const [facebookUsername, setFacebookUsername] = useState('')
  const [instagramUsername, setInstagramUsername] = useState('')
  const [latitude, setLatitude] = useState('')
  const [longitude, setLongitude] = useState('')
  const [error, setError] = useState({msg: null})
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if(selectedRestaurant) {
      setName(selectedRestaurant.name)
      setType(selectedRestaurant.type)
      setFoods([...selectedRestaurant.foods])
      setOption({...selectedRestaurant.option})
      setAddress(selectedRestaurant.address)
      setWebsite(selectedRestaurant.website)
      setFacebookUsername(selectedRestaurant.facebookUsername)
      setInstagramUsername(selectedRestaurant.instagramUsername)
      setLatitude(selectedRestaurant.location.coordinates[1])
      setLongitude(selectedRestaurant.location.coordinates[0])
      document.getElementById('vegan-option').checked = selectedRestaurant.option.vegan
      document.getElementById('vegetarian-option').checked = selectedRestaurant.option.vegetarian
    }
  }, [selectedRestaurant])

  useEffect(() => {
    if(pinLocation.latitude) {
      setLatitude(pinLocation.latitude)
      setLongitude(pinLocation.longitude)
      setPinLocation({latitude: null, longitude: null })
    }
  }, [pinLocation])

  function handleSubmit(e) {
    e.preventDefault()
    setIsLoading(true)

    try{
      existOrError(name, 'name:Informe o nome do restaurante.')
      existOrError(type, 'type:Informe o tipo do restaurante.')
      existOrError(option.vegan || option.vegetarian, 'option:O restaurante deve atender ao menos uma das opções.')
      existOrError(foods, 'food:Informe as comidas servidas.')
      existOrError(address, 'address:Informe o endereço do restaurante.')
      existOrError(latitude, 'coord:Informe as coordenadas do restaurante.')
      existOrError(longitude, 'coord:Informe as coordenadas do restaurante.')
    } catch(e) {
      if(error.msg) setError({msg: null})
      const newError = {
        target: e.split(':')[0],
        msg: e.split(':')[1]
      }
      setTimeout(() => {
        setError(newError)
        setIsLoading(false)
      }, 0)
      return
    }

    const restaurantInfo = {
      name,
      type,
      option,
      foods,
      address,
      website,
      facebookUsername,
      instagramUsername,
      latitude,
      longitude,
      author: user,
    }

    const method = selectedRestaurant ? 'put' : 'post'
    if(selectedRestaurant) restaurantInfo.username = selectedRestaurant.username

    api[method]('/restaurants', restaurantInfo)
      .then(resp => {
        setName('')
        setType('')
        setOption({ vegan: false, vegetarian: false })
        setFoods([])
        setAddress('')
        setWebsite('')
        setFacebookUsername('')
        setInstagramUsername('')
        setError({msg: null})
        setIsLoading(false)
        // if(!selectedRestaurant) addRestaurant(resp.data)
        closePopup()
      })
      .catch(e => {
        setError({msg: e})
      })
  }

  function handleType(value) {
    setType(value)
    let newOption = {
      vegan: value === 'vegan',
      vegetarian: value === 'vegetarian',
    }
    document.getElementById('vegan-option').checked = newOption.vegan
    document.getElementById('vegetarian-option').checked = newOption.vegetarian
    setOption(newOption)
  }

  function handleCheckbox(value, key) {
    const newOption = {...option}
    newOption[key] = value
    setOption(newOption)
  }

  return (
    <div className="signup">
      <strong className="signup__title">Cadastro</strong>
      <form className="signup__form" onSubmit={handleSubmit}>
        <div className="input-group">
          <div className="input-block">
            <label htmlFor="name">Nome*</label>
            <input name="name" id="name"
              className={error.target === 'name' ? 'error' : ''}
              value={name}
              onChange={e => setName(e.target.value)}>
            </input>
          </div>

          <div className="input-block">
            <label htmlFor="type">Tipo*</label>
            <select name="type" id="type"
              className={error.target === 'type' ? 'error' : ''}
              value={type}
              onChange={e => handleType(e.target.value)}>
                <option value={null}>Selecione</option>
                <option value="vegan">Vegano Exclusivo</option>
                <option value="vegetarian">Vegetariano</option>
                <option value="default">Carnista</option>
            </select>
          </div>

          <div className={`input-block checkbox ${error.target === 'option' ? 'error' : ''}`}>
            <div className="check-option">
              <input type="checkbox" id="vegan-option"
                disabled={type === 'vegan'}
                onChange={e => handleCheckbox(e.target.checked, 'vegan')}/>
              <label htmlFor="vegan-option">Opção Vegana</label>
            </div>
            <div className="check-option">
              <input type="checkbox" id="vegetarian-option"
                disabled={type === 'vegan' || type === 'vegetarian'}
                onChange={e => handleCheckbox(e.target.checked, 'vegetarian')}/>
              <label htmlFor="vegetarian-option">Opção Vegetariana</label>
            </div>
          </div>
        </div>

        <div className="input-group">
          <div className="input-block">
            <label htmlFor="foods">Comidas*</label>
            <FoodInput foods={foods} setFoods={setFoods} error={error} />
          </div>
        </div>

        <div className="input-block">
          <label htmlFor="address">Endereço*</label>
          <input name="address" id="address"
            className={error.target === 'address' ? 'error' : ''}
            value={address}
            onChange={e => setAddress(e.target.value)}>
          </input>
        </div>

        <div className="input-group">
          <div className="input-block">
            <label htmlFor="latitude">Latitude*</label>
            <input name="latitude" id="latitude"
              className={error.target === 'coord' ? 'error' : ''} 
              value={latitude}
              onChange={e => setLatitude(e.target.value)}>  
            </input>
          </div>
          <div className="input-block">
            <label htmlFor="longitude">Longitude*</label>
            <input name="longitude" id="longitude"
              className={error.target === 'coord' ? 'error' : ''}  
              value={longitude}
              onChange={e => setLongitude(e.target.value)}>
            </input>
          </div>
          <div className="btn-block">
            <button type="button" className="get-coord" onClick={e => pickCoordsOnMap()}>Selecionar no Mapa</button>
          </div>
        </div>
               
        <div className="input-group">
          <div className="input-block">
            <label htmlFor="website">Site Oficial</label>
            <input name="website" id="website"
              value={website}
              onChange={e => setWebsite(e.target.value)}>
            </input>
          </div>
          <div className="input-block">
            <label htmlFor="facebook">Facebook</label>
            <input name="facebook" id="facebook"
              value={facebookUsername}
              onChange={e => setFacebookUsername(e.target.value)}>
            </input>
          </div>       
          <div className="input-block">
            <label htmlFor="instagram">Instagram</label>
            <input name="instagram" id="instagram"
              value={instagramUsername}
              onChange={e => setInstagramUsername(e.target.value)}>
            </input>
          </div>
        </div>

        <div className="submit-block">
          <button type="submit">
            { !isLoading ?
            'Confirmar' :
            <div className="icon icon--loading"></div>
            }
          </button>
          <div className={error.msg ? 'error-sign error-visible' : 'error-sign'}>
            {error.msg}
          </div>
        </div>
      </form>
    </div>
  )
}

export default SignupBox