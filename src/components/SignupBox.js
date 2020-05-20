import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { addRestaurant, updateRestaurant } from '../store/restaurant/actions'
import { setPinLocation, changeMapMode } from '../store/map/actions'
import { mapModes } from '../store/map/actionTypes'

import FoodInput from './utils/FoodInput'
import "./signupBox.css"

function SignupBox() {
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

  const selectedRestaurant = useSelector(state => state.restaurant.selectedRestaurant)
  const isLoading = useSelector(state => state.restaurant.saving)
  const error = useSelector(state => state.restaurant.error)
  const pinLocation = useSelector(state => state.map.pinLocation)
  const mapMode = useSelector(state => state.map.mapMode)
  const user = useSelector(state => state.user.user)
  const dispatch = useDispatch()

  useEffect(() => {
    if(Object.keys(selectedRestaurant).length > 0) {
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

  function handleSubmit(e) {
    e.preventDefault()
    const restaurantInputData = {
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
    }
    if(Object.keys(selectedRestaurant).length > 0) {
      restaurantInputData.username = selectedRestaurant.username
      dispatch(updateRestaurant({ restaurant: restaurantInputData, user }))
    } else {
      dispatch(addRestaurant({ restaurant: restaurantInputData, user }))
    }
  }

  function pickCoordsOnMap() {
    document.querySelector('.popup__bg').style.visibility = 'hidden'
    dispatch(changeMapMode(mapModes.PICKING))
  }

  useEffect(() => {
    if(mapMode === mapModes.PICKING) {
      setLatitude(pinLocation.latitude)
      setLongitude(pinLocation.longitude)
      setTimeout(() => {
        dispatch(changeMapMode(mapModes.HIDDEN))
        document.querySelector('.popup__bg').style.visibility = 'visible'
        dispatch(setPinLocation({latitude: null, longitude: null }))
      }, 1000)
    }
  }, [pinLocation])


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
              className={error && error.name === 'name' ? 'error' : ''}
              value={name}
              onChange={e => setName(e.target.value)}>
            </input>
          </div>

          <div className="input-block">
            <label htmlFor="type">Tipo*</label>
            <select name="type" id="type"
              className={error && error.name === 'type' ? 'error' : ''}
              value={type}
              onChange={e => handleType(e.target.value)}>
                <option value={null}>Selecione</option>
                <option value="vegan">Vegano Exclusivo</option>
                <option value="vegetarian">Vegetariano</option>
                <option value="default">Carnista</option>
            </select>
          </div>

          <div className={`input-block checkbox ${error && error.name === 'option' ? 'error' : ''}`}>
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
            className={error && error.name === 'address' ? 'error' : ''}
            value={address}
            onChange={e => setAddress(e.target.value)}>
          </input>
        </div>

        <div className="input-group">
          <div className="input-block">
            <label htmlFor="latitude">Latitude*</label>
            <input name="latitude" id="latitude"
              className={error && error.name === 'coord' ? 'error' : ''} 
              value={latitude}
              onChange={e => setLatitude(e.target.value)}>  
            </input>
          </div>
          <div className="input-block">
            <label htmlFor="longitude">Longitude*</label>
            <input name="longitude" id="longitude"
              className={error && error.name === 'coord' ? 'error' : ''}  
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
          <div className="input-block input-block--facebook">
            <label htmlFor="facebook">Facebook</label>
            <input name="facebook" id="facebook"
              value={facebookUsername}
              onChange={e => setFacebookUsername(e.target.value)}>
            </input>
          </div>       
          <div className="input-block input-block--instagram">
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
          <div className={error && error.message ? 'error-sign error-visible' : 'error-sign'}>
            {error ? error.message : null}
          </div>
        </div>
      </form>
    </div>
  )
}

export default SignupBox