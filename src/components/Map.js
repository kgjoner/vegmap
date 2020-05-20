import React, { Component } from 'react'
import { connect } from 'react-redux'

import GoogleMapReact from 'google-map-react'
import Marker from './utils/Marker'
import Pin from './utils/Pin'
import SearchBar from './SearchBar'
import RestaurantCard from './RestaurantCard'
import { changeSelectedRestaurant } from '../store/restaurant/actions'
import { setCenterMapLocation, setPinLocation, changeMapMode } from '../store/map/actions'
import { mapModes } from '../store/map/actionTypes'

import './map.css'


const mapStateToProps = (state) => ({
  centerMapLocation: state.map.centerMapLocation,
  pinLocation: state.map.pinLocation,
  isHidden: state.map.mapMode === mapModes.HIDDEN,
  isPicking: state.map.mapMode === mapModes.PICKING,
  restaurants: state.restaurant.restaurants,
  selectedRestaurant: state.restaurant.selectedRestaurant
})

const mapDispatchToProps = (dispatch) => ({
  changeSelectedRestaurant: (restaurant) => dispatch(changeSelectedRestaurant(restaurant)),
  setCenterMapLocation: (location) => dispatch(setCenterMapLocation(location)),
  setPinLocation: (location) => dispatch(setPinLocation(location)),
  changeMapMode: (mode) => dispatch(changeMapMode(mode))
})

class Maps extends Component {
  state = {
    zoom: 16,
    center: {
      lat: this.props.centerMapLocation.latitude, 
      lng: this.props.centerMapLocation.longitude
    }
  }

  handleMarkerClick = (restaurant) => {
    this.props.changeSelectedRestaurant(restaurant)
  }

  handleZoomChanged = (newZoom) => {
    Array.from(document.getElementsByClassName('marker')).forEach(el => {
      el.style.width = `${newZoom*2.5}px`
      el.style.height = `${newZoom*2.5}px`
    })
  }

  handleDrag = (e) => {
    const newMapLocation = {
      latitude: e.center.lat(),
      longitude: e.center.lng()
    }
    this.props.setCenterMapLocation(newMapLocation)
  }

  handleClick = ({ lat, lng }) => {
    if(this.props.isPicking) {
      this.props.setPinLocation({latitude: lat, longitude: lng})
    } else if(Object.keys(this.props.selectedRestaurant).length > 0) {
      this.props.changeSelectedRestaurant(null)
    }
  }

  hideMap = () => {
    if(Object.keys(this.props.selectedRestaurant).length > 0) {
      this.props.changeSelectedRestaurant(null)
    }
    this.props.changeMapMode(mapModes.HIDDEN)
  }

  render() {
    return (
      <div className={`map ${this.props.isHidden ? 'map--hidden' : ''}`}>
        <GoogleMapReact
          bootstrapURLKeys={{key: process.env.REACT_APP_GoogleApiKey}}
          defaultCenter={this.state.center}
          zoom={this.state.zoom}
          onZoomAnimationEnd={this.handleZoomChanged}
          onDragEnd={this.handleDrag}
          onClick={this.handleClick}
          options={() => { 
            return { minZoom: 12 } }}
        >
          {this.props.isPicking ? null :
            this.props.restaurants.map((restaurant) => {
            return (<Marker
              key={restaurant._id} 
              restaurant={restaurant}
              lat={restaurant.location.coordinates[1]} 
              lng={restaurant.location.coordinates[0]}
              handleMarkerClick={this.handleMarkerClick}
            />)
          })}
          {this.props.pinLocation.latitude ? 
            <Pin 
              lat={this.props.pinLocation.latitude}
              lng={this.props.pinLocation.longitude}
            />
            : null}
        </GoogleMapReact>
        { this.props.isPicking ? null :
          <button className="map-btn map-btn--apart" 
            onClick={this.hideMap}>
              Voltar
          </button>
        }
        { Object.keys(this.props.selectedRestaurant).length > 0 ?
          <RestaurantCard variant='float'
            restaurant={{...this.props.selectedRestaurant}} />
          : null
        }
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Maps)