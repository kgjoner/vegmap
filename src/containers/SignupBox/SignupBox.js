import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import useFood from '../../hooks/useFood'
import usePrevious from '../../hooks/usePrevious'
import { addRestaurant, updateRestaurant } from '../../store/restaurant/actions'
import { setPinLocation, changeMapMode } from '../../store/map/actions'
import { mapModes, errorNames, notificationTypes } from '../../constants/systemTypes'

import Input from '../../components/Input'
import Checkbox from '../../components/Checkbox'
import FoodInput from '../../components/FoodInput'
import Button from '../../components/Button'
import Notification from '../../components/Notification'
import "./signupBox.css"

function SignupBox() {
  const [name, setName] = useState('')
  const [type, setType] = useState('')
  const [option, setOption] = useState({ vegan: false, vegetarian: false })
  const [isExclusive, setIsExclusive] = useState(false)
  const [foods, foodOnTyping, foodHint, foodHandlers, setFoods] = useFood([])
  const [address, setAddress] = useState('')
  const [neighborhood, setNeighborhood] = useState('')
  const [website, setWebsite] = useState('')
  const [facebookUsername, setFacebookUsername] = useState('')
  const [instagramUsername, setInstagramUsername] = useState('')
  const [latitude, setLatitude] = useState('')
  const [longitude, setLongitude] = useState('')
  const [shakeError, setShakeError] = useState(false)

  const selectedRestaurant = useSelector(state => state.restaurant.selectedRestaurant)
  const isLoading = useSelector(state => state.restaurant.saving)
  const error = useSelector(state => {
    if(state.notification.type === notificationTypes.ERROR) {
      return state.notification
    } else {
      return null
    }
  })
  const pinLocation = useSelector(state => state.map.pinLocation)
  const mapMode = useSelector(state => state.map.mapMode)
  const user = useSelector(state => state.user.user)
  const dispatch = useDispatch()

  const previousMapMode = usePrevious(mapMode)

  const options = [{
      id: 'vegan-option', 
      label: 'Opção Vegana', 
      value: option.vegan, 
      setValue: value => setOption(Object.assign({}, option, { vegan: value })),
    }, {
      id: 'vegetarian-option', 
      label: 'Opção Vegetariana', 
      value: option.vegetarian,
      setValue: value => setOption(Object.assign({}, option, { vegetarian: value })),
  }]

  useEffect(() => {
    if(Object.keys(selectedRestaurant).length > 0) {
      setName(selectedRestaurant.name)
      setType(selectedRestaurant.type)
      setFoods([...selectedRestaurant.foods]) 
      setOption({...selectedRestaurant.option})
      setIsExclusive(selectedRestaurant.isExclusive)
      setAddress(selectedRestaurant.address)
      setNeighborhood(selectedRestaurant.neighborhood)
      setWebsite(selectedRestaurant.website)
      setFacebookUsername(selectedRestaurant.facebookUsername)
      setInstagramUsername(selectedRestaurant.instagramUsername)
      setLatitude(selectedRestaurant.location.coordinates[1])
      setLongitude(selectedRestaurant.location.coordinates[0])
    }
  }, [selectedRestaurant, setFoods])


  useEffect(() => {
    if(error) {
      setShakeError(true)
      setTimeout(() => {
        setShakeError(false)
      }, 800)
    }
  }, [error])

  function handleSubmit(e) {
    e.preventDefault()
    const restaurantInputData = {
      name,
      type,
      option,
      isExclusive,
      foods,
      address,
      neighborhood,
      website,
      facebookUsername,
      instagramUsername,
      latitude,
      longitude,
    }
    if(Object.keys(selectedRestaurant).length > 0) {
      restaurantInputData.tagname = selectedRestaurant.tagname
      dispatch(updateRestaurant({ restaurant: restaurantInputData, user }))
    } else {
      dispatch(addRestaurant({ restaurant: restaurantInputData, user }))
    }
  }


  function pickCoordsOnMap() {
    dispatch(changeMapMode(mapModes.PICKING))
  }


  useEffect(() => {
    if(mapMode === mapModes.PICKING 
      && !pinLocation.latitude && latitude) {
      dispatch(setPinLocation({ latitude, longitude }))
    } else if(previousMapMode === mapModes.PICKING
      && mapMode === mapModes.HIDDEN) {
      setLatitude(pinLocation.latitude)
      setLongitude(pinLocation.longitude)
      dispatch(setPinLocation({ latitude: null, longitude: null }))
    }
  }, [pinLocation, mapMode, latitude, longitude, previousMapMode, dispatch])

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
            error={error?.name === errorNames.EMPTY_FIELD.NAME}
          />
          <Checkbox id="option"
            error={error?.name === errorNames.EMPTY_FIELD.OPTION}
            options={options}
          />
          <Checkbox id="exclusive"
            options={[{
              id: 'exclusive-option', 
              label: 'Exclusivo', 
              value: isExclusive, 
              setValue: value => setIsExclusive(value)
            }]}
          />
        </div>

        <div className="signup__group">
          <FoodInput 
            label="Comidas*"
            savedFoods={foods}
            foodOnTyping={foodOnTyping}
            foodHint={foodHint}
            handlers={foodHandlers} 
            error={error?.name === errorNames.EMPTY_FIELD.FOODS} />
        </div>

        <div className="signup__group">
          <Input id="address"
            label="Endereço*"
            value={address}
            setValue={setAddress}
            error={error?.name === errorNames.EMPTY_FIELD.ADDRESS}
          />
          <Input id="neighborhood"
            label="Bairro*"
            value={neighborhood}
            setValue={setNeighborhood}
            error={error?.name === errorNames.EMPTY_FIELD.NEIGHBORHOOD}
          />
        </div>

        <div className="signup__group">
          <Input id="latitude"
            label="Latitude*"
            value={latitude}
            setValue={setLatitude}
            error={error?.name === errorNames.EMPTY_FIELD.COORDS}
          />
          <Input id="longitude"
            label="Longitude*"
            value={longitude}
            setValue={setLongitude}
            error={error?.name === errorNames.EMPTY_FIELD.COORDS}
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
          />
          <Input id="facebook"
            label="Facebook*"
            value={facebookUsername}
            setValue={setFacebookUsername}
            prepend='/'
          />
          <Input id="instagram"
            label="Instagram*"
            value={instagramUsername}
            setValue={setInstagramUsername}
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
          <div className={shakeError ? 'error-shake' : ''}>
            <Notification
              
              type={error ? 'error' : null}
              message={error ? error.message : ''}
            />
          </div>
        </div>

      </form>
    </div>
  )
}

export default SignupBox