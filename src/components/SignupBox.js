import React, { useState, useEffect } from 'react'
import FoodInput from './utils/FoodInput'
import api from '../services/api'
import "./signupBox.css"

function SignupBox({ addRestaurant, selectedRestaurant, closePopup, user }) {
  const [name, setName] = useState('')
  const [type, setType] = useState('')
  const [foods, setFoods] = useState([])
  const [address, setAddress] = useState('')
  const [website, setWebsite] = useState('')
  const [facebookUsername, setFacebookUsername] = useState('')
  const [instagramUsername, setInstagramUsername] = useState('')
  const [latitude, setLatitude] = useState('')
  const [longitude, setLongitude] = useState('')

  useEffect(() => {
    if(selectedRestaurant) {
      setName(selectedRestaurant.name)
      setType(selectedRestaurant.type)
      setFoods(selectedRestaurant.foods)
      setAddress(selectedRestaurant.address)
      setWebsite(selectedRestaurant.website)
      setFacebookUsername(selectedRestaurant.facebookUsername)
      setInstagramUsername(selectedRestaurant.instagramUsername)
      setLatitude(selectedRestaurant.location.coordinates[1])
      setLongitude(selectedRestaurant.location.coordinates[0])
    }
  }, [selectedRestaurant])

  function getCoords() {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords
        setLatitude(latitude)
        setLongitude(longitude)
      },
      (err) => {
        console.log(err)
      },
      {
        timeout: 30000,
      }
    )
  }

  function handleSubmit(e) {
    e.preventDefault()
    const restaurantInfo = {
      name,
      type,
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
    console.log(method)
    api[method]('/restaurants', restaurantInfo)
      .then(resp => {
        setName('')
        setType('')
        setFoods('')
        setAddress('')
        setWebsite('')
        setFacebookUsername('')
        setInstagramUsername('')
        if(!selectedRestaurant) addRestaurant(resp.data)
        closePopup()
      })
  }

  return (
    <div>
      <strong>Cadastro</strong>
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <div className="input-block">
            <label htmlFor="name">Nome*</label>
            <input name="name" id="name" required
              value={name}
              onChange={e => setName(e.target.value)}>
            </input>
          </div>

          <div className="input-block">
            <label htmlFor="type">Tipo*</label>
            <select name="type" id="type" required
              value={type}
              onChange={e => setType(e.target.value)}>
                <option value={null}>Selecione</option>
                <option value="vegano-exclusivo">Vegano Exclusivo</option>
                <option value="ovolacto">Ovolacto</option>
                <option value="opção-vegana">Opção Vegana</option>
            </select>
          </div>

          <div className="input-block">
            <label htmlFor="latitude">Latitude*</label>
            <input name="latitude" id="latitude" required 
              value={latitude}
              onChange={e => setLatitude(e.target.value)}>  
            </input>
          </div>
          <div className="input-block">
            <label htmlFor="longitude">Longitude*</label>
            <input name="longitude" id="longitude" required 
              value={longitude}
              onChange={e => setLongitude(e.target.value)}>
            </input>
          </div>
        </div>
        
        <div className="input-group">
          <div className="input-block">
            <label htmlFor="foods">Comidas*</label>
            <FoodInput foods={foods} setFoods={setFoods}/>
          </div>
          <div className="btn-block">
            <button type="button" className="get-coord" onClick={e => getCoords()}>Minhas Coordenadas</button>
          </div>
        </div>

        <div className="input-block">
          <label htmlFor="address">Endereço</label>
          <input name="address" id="address"
            value={address}
            onChange={e => setAddress(e.target.value)}>
          </input>
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

        <button type="submit">Confirmar</button>
      </form>
    </div>
  )
}

export default SignupBox