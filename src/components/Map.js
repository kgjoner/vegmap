import React, { Component } from 'react'
import GoogleMapReact from 'google-map-react'
import Marker from './utils/Marker'
import Pin from './utils/Pin'
import SearchBar from './SearchBar'
import RestaurantCard from './RestaurantCard'

class Maps extends Component {
  state = {
    card: {null: true, option: {}, foods: [], likes: [], location:{ coordinates: []}},
    zoom: 16,
    center: {
      lat: this.props.mapLocation.latitude, 
      lng: this.props.mapLocation.longitude
    },
    pin: {
      lat: null,
      lng: null
    }
  }

  static getDerivedStateFromProps(props, state) {
    if(props.restaurants.length === 0) return {}

    let newCard = props.restaurants.filter(r => r.username === state.card.username)[0]
      || {null: true, option: {}, foods: [], likes: [], location:{ coordinates: []}}

    if(newCard.likes.length !== state.card.likes.length) {
      setTimeout(() => {
        props.setRestaurants([...props.restaurants])
      }, 0)
    }
    return {card: { ...newCard }}
  }

  handleMarkerClick = (restaurant) => {
    if(!this.state.card.null) this.props.setRestaurants([...this.props.restaurants])
    setTimeout(() => {
      this.setState({ card: {...restaurant} })
    }, 0)
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
    this.props.setMapLocation(newMapLocation)
  }

  handleClick = ({ lat, lng }) => {
    if(this.props.isPicking) {
      if(this.state.pin.lat) document.querySelector('.pin').classList.remove('pin--fall')
      this.setState({ pin: {lat, lng}})
      setTimeout(() => {
        this.props.setPinLocation({latitude: lat, longitude: lng})
      }, 1000)
    }
  }

  render() {
    return (
      <div style={{ height: '100vh', width: '100vw' }}>
        <GoogleMapReact
          bootstrapURLKeys={{key: process.env.REACT_APP_GoogleApiKey || process.env.GoogleApiKey}}
          defaultCenter={this.state.center}
          zoom={this.state.zoom}
          onZoomAnimationEnd={this.handleZoomChanged}
          onDragEnd={this.handleDrag}
          onClick={this.handleClick}
          options={(maps) => { 
            return { minZoom: 12 } }}
        >
          {console.log('reactKey', process.env.REACT_APP_GoogleApiKey, 'other', process.env.GoogleApiKey)}
          {this.props.isPicking ? null :
            this.props.restaurants.map((restaurant, index) => {
            return (<Marker
              key={index} 
              restaurant={restaurant}
              lat={restaurant.location.coordinates[1]} 
              lng={restaurant.location.coordinates[0]}
              handleMarkerClick={this.handleMarkerClick}
            />)
          })}
          {this.state.pin.lat ? 
            <Pin 
              lat={this.state.pin.lat}
              lng={this.state.pin.lng}
              location={this.state.pin}
            />
            : null}
        </GoogleMapReact>
        { this.props.isPicking ? null :
          <button className="map-btn map-btn--apart" onClick={() => this.props.setShowMap(false)}>Voltar</button>
        }
        <SearchBar location={this.props.mapLocation}
          setRestaurants={this.props.setRestaurants}
          isOnMap={true}/>
        <RestaurantCard variant={ !this.state.card.null ? 'float' : 'invisible'}
          restaurant={{...this.state.card}}
          user={this.props.user} />
      </div>
    )
  }
}

export default Maps