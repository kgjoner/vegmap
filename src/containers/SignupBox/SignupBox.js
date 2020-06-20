import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import useFood from '../../hooks/useFood'
import { addRestaurant, updateRestaurant } from '../../store/restaurant/actions'
import { setPinLocation, changeMapMode } from '../../store/map/actions'
import { mapModes } from '../../store/map/actionTypes'

import Input from '../../components/Input'
import Select from '../../components/Select'
import Checkbox from '../../components/Checkbox'
import FoodInput from '../../components/FoodInput'
import Button from '../../components/Button'
import Notification from '../../components/Notification'
import "./signupBox.css"

function SignupBox() {
  const [name, setName] = useState('')
  const [type, setType] = useState('')
  const [option, setOption] = useState({ vegan: false, vegetarian: false })
  const [foods, foodOnTyping, foodHint, foodHandlers] = useFood([])
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

  const typeOptions = [
    {value: 'vegan', label: 'Vegano Exclusivo'},
    {value: 'vegetarian', label: 'Vegetariano'},
    {value: 'default', label: 'Carnista'}
  ]

  const options = [{
      id: 'vegan-option', 
      label: 'Opção Vegana', 
      value: option.vegan, 
      setValue: value => setOption(Object.assign({}, option, { vegan: value })),
      disabled: type === 'vegan'
    }, {
      id: 'vegetarian-option', 
      label: 'Opção Vegetariana', 
      value: option.vegetarian,
      setValue: value => setOption(Object.assign({}, option, { vegetarian: value })),
      disabled: type === 'vegan' || type === 'vegetarian'
  }]

  useEffect(() => {
    if(Object.keys(selectedRestaurant).length > 0) {
      setName(selectedRestaurant.name)
      setType(selectedRestaurant.type)
      foodHandlers.changeAll([...selectedRestaurant.foods])
      setOption({...selectedRestaurant.option})
      setAddress(selectedRestaurant.address)
      setWebsite(selectedRestaurant.website)
      setFacebookUsername(selectedRestaurant.facebookUsername)
      setInstagramUsername(selectedRestaurant.instagramUsername)
      setLatitude(selectedRestaurant.location.coordinates[1])
      setLongitude(selectedRestaurant.location.coordinates[0])
    }
  }, [selectedRestaurant, foodHandlers])

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
    if(mapMode === mapModes.PICKING
      && pinLocation.latitude) {
      setLatitude(pinLocation.latitude)
      setLongitude(pinLocation.longitude)
      setTimeout(() => {
        dispatch(changeMapMode(mapModes.HIDDEN))
        document.querySelector('.popup__bg').style.visibility = 'visible'
        dispatch(setPinLocation({latitude: null, longitude: null }))
      }, 1000)
    }
  }, [pinLocation, mapMode, dispatch])


  function handleType(value) {
    setType(value)
    let newOption = {
      vegan: value === 'vegan',
      vegetarian: value === 'vegetarian',
    }
    setOption(newOption)
  }

  return (
    <div className="signup">
      <h2 className="signup__title">
        Cadastro
      </h2>
      <form className="signup__form" onSubmit={handleSubmit}>
        <div className="signup__group">
          <Input id="name"
            label="Nome*"
            value={name}
            setValue={setName}
            error={error}
          />
          <Select id="restaurant-type"
            label="Tipo*"
            value={type}
            setValue={handleType}
            error={error}
            options={typeOptions}
          />
          <Checkbox id="option"
            error={error}
            options={options}
          />
        </div>

        <div className="signup__group">
          <FoodInput 
            label="Comidas*"
            savedFoods={foods}
            foodOnTyping={foodOnTyping}
            foodHint={foodHint}
            handlers={foodHandlers} 
            error={error} />
        </div>

        <div className="signup__group">
          <Input id="address"
            label="Endereço*"
            value={address}
            setValue={setAddress}
            error={error}
          />
        </div>

        <div className="signup__group">
          <Input id="latitude"
            label="Latitude*"
            value={latitude}
            setValue={setLatitude}
            error={error}
          />
          <Input id="longitude"
            label="Longitude*"
            value={longitude}
            setValue={setLongitude}
            error={error}
          />
          <div className="signup__block">
            <Button
              text="Selecionar no Mapa" 
              onClick={e => pickCoordsOnMap()} />
          </div>
        </div>
               
        <div className="signup__group">
          <Input id="website"
            label="Site Oficial*"
            value={website}
            setValue={setWebsite}
            error={error}
          />
          <Input id="facebook"
            label="Facebook*"
            value={facebookUsername}
            setValue={setFacebookUsername}
            error={error}
            prepend='/'
          />
          <Input id="instagram"
            label="Instagram*"
            value={instagramUsername}
            setValue={setInstagramUsername}
            error={error}
            prepend="@"
          />
        </div>

        <div className="signup__submit-block">
          <Button type="submit"
            variant="primary"
            text="Confirmar"
            isLoading={isLoading}
            thick
          />
          <Notification 
            type={error ? 'error' : null}
            message={error ? error.message : ''}
          />
        </div>

      </form>
    </div>
  )
}

export default SignupBox