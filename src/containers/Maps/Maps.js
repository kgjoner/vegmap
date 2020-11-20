import React, { useCallback, useRef, useState, useEffect } from 'react'

import GoogleMapReact from 'google-map-react'
import Marker from '../../components/Marker'
import Pin from '../../components/Pin'
import Button from '../../components/Button'
import RestaurantCard from '../RestaurantCard'
import { changeSelectedRestaurant } from '../../store/restaurant/actions'
import { setCenterMapLocation, setPinLocation, changeMapMode } from '../../store/map/actions'
import { mapModes } from '../../constants/systemTypes'

import './maps.css'
import { useSelector, useDispatch } from 'react-redux'


function Maps() {
  const mapRef = useRef()
  const centerMapLocation = useSelector(state => state.map.centerMapLocation)
  const pinLocation = useSelector(state => state.map.pinLocation)
  const isHidden = useSelector(state => state.map.mapMode === mapModes.HIDDEN)
  const isPicking = useSelector(state => state.map.mapMode === mapModes.PICKING)
  const restaurants = useSelector(state => state.restaurant.restaurants)
  const selectedRestaurant = useSelector(state => state.restaurant.selectedRestaurant)
  const [pinFalling, setPinFalling] = useState(false)
  const [render, setRender] = useState(false)
  const center = useRef()
  const dispatch = useDispatch()

  useEffect(() => {
    if(!center.current) {
      center.current = {
        lat: centerMapLocation.latitude, 
        lng: centerMapLocation.longitude
      }
      setRender(!render)
    }
  }, [centerMapLocation])

  const handleMarkerClick = useCallback((restaurant) => {
    dispatch(changeSelectedRestaurant(restaurant))
  }, [dispatch])


  const handleZoomChanged = useCallback((newZoom) => {
    Array.from(document.getElementsByClassName('marker')).forEach(el => {
      el.style.width = `${newZoom*2.5}px`
      el.style.height = `${newZoom*2.5}px`
    })
  }, [])


  const handleDrag = useCallback((e) => {
    const newMapLocation = {
      latitude: e.center.lat(),
      longitude: e.center.lng()
    }
    dispatch(setCenterMapLocation(newMapLocation))
  }, [dispatch])


  const handleClick = useCallback(({ lat, lng }) => {
    if(isPicking) {
      dispatch(setPinLocation({latitude: lat, longitude: lng}))
      setPinFalling(true)
      setTimeout(() => {
        setPinFalling(false)
        dispatch(changeMapMode(mapModes.HIDDEN))
      }, 1000)
      
    } else if(Object.keys(selectedRestaurant).length > 0) {
      dispatch(changeSelectedRestaurant(null))
    }
  }, [isPicking, selectedRestaurant, dispatch])


  const hideMap = useCallback(() => {
    if(Object.keys(selectedRestaurant).length > 0) {
      dispatch(changeSelectedRestaurant(null))
    }
    dispatch(changeMapMode(mapModes.HIDDEN))
  }, [selectedRestaurant, dispatch])

  return (
    <div className={`map 
      ${isHidden ? 'map--hidden' : ''}
      ${isPicking ? 'map--over-popup' : ''}`}
      role="region">

      {center.current ?
        <GoogleMapReact
          bootstrapURLKeys={{key: process.env.REACT_APP_GoogleApiKey}}
          defaultCenter={center.current}
          defaultZoom={16}
          onZoomAnimationEnd={handleZoomChanged}
          onDragEnd={handleDrag}
          onClick={handleClick}
          onGoogleApiLoaded={({ map }) => {
            mapRef.current = map;
          }}
          options={() => { 
            return { minZoom: 12 } }}
        >
          {isPicking ? null :
            restaurants.map((restaurant) => {
            return (<Marker
              key={restaurant._id} 
              restaurant={restaurant}
              lat={restaurant.location.coordinates[1]} 
              lng={restaurant.location.coordinates[0]}
              handleMarkerClick={handleMarkerClick}
            />)
          })}
          {pinLocation?.latitude ? 
            <Pin 
              lat={pinLocation.latitude}
              lng={pinLocation.longitude}
              fall={pinFalling}
            />
            : null}
        </GoogleMapReact>

        : <p>Sem Localização</p>
      }

      { isPicking ? null :
        <div className="map__btn-container">
          <Button
            text="Voltar"
            onClick={hideMap} />
        </div>
      }

      { Object.keys(selectedRestaurant).length > 0 ?
        <RestaurantCard variant='float'
          restaurant={restaurants.find(r => r._id === selectedRestaurant._id)} />
        : null
      }
    </div>
  )
}

export default Maps