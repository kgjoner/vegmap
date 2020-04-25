import React, { Component } from 'react'
import GoogleMapReact from 'google-map-react'
import Marker from './utils/Marker'
import SearchBar from './SearchBar'

class Maps extends Component {
  static defaultProps = {
    center: {
      lat: -27.6,
      lng: -48.6
    },
    zoom: 14,
    restaurants: [{
        latitude: -27.8,
        longitude: -48.5
    }]      
  }

  render() {
    return (
      <div style={{ height: '100vh', width: '100vw' }}>
        <GoogleMapReact
          bootstrapURLKeys={{key: 'AIzaSyDrnBGWDiDjBSbrPS1bGmDMXDpUzkhEEvo'}}
          defaultCenter={this.props.center}
          // center={this.state.center}
          defaultZoom={this.props.zoom}
          // onChildMouseEnter={this.onChildMouseEnter}
          // onChildMouseLeave={this.onChildMouseLeave}
        >
          {this.props.restaurants.map((restaurant, index) => {
            console.log(restaurant)
            return (<Marker
              key={index} 
              restaurant={restaurant}
              lat={restaurant.location.coordinates[1]} 
              lng={restaurant.location.coordinates[0]} 
            />)
          })}
        </GoogleMapReact>
        <SearchBar userLocation={{latitude: this.props.center.lat, longitude: this.props.center.lng}}
            setRestaurants={this.props.setRestaurants}
            isOnMap={true}/>
        <button className="map-btn map-btn--apart" onClick={() => this.props.setShowMap(false)}>Voltar</button>
      </div>
    )
  }
}

export default Maps