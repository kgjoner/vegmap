export const baseApiUrls = {
  NO_SW: process.env.NODE_ENV === 'development' 
    ? 'http://localhost:3030' 
    : 'https://vegmap-backend.herokuapp.com',
  WITH_SW: '/api',
}


export const mapModes = {
  HIDDEN: 'HIDDEN',
  RESTAURANTS: 'RESTAURANTS',
  PICKING: 'PICKING'
}

export const popups = {
  NONE: 'NONE',
  SIGNUP: 'SIGNUP',
  ASK_FOR_LOGGING: 'ASK_FOR_LOGGING',
  DENUNCIATION_FORM: 'DENUNCIATION_FORM'
}

export const errorNames = {
  RESPONSE: 'RESPONSE',
  REQUEST: 'REQUEST',
  BAD_INPUT:  'BAD_INPUT',
  EMPTY_FIELD: {
    NAME: 'NAME',
    TYPE: 'TYPE',
    OPTION: 'OPTION',
    FOODS: 'FOODS',
    ADDRESS: 'ADDRESS',
    COORDS: 'COORDS',
    REASON: 'REASON'
  },
  UNEXPECTED: 'UNEXPECTED'
}

export const defaultLocation = { 
  latitude: -27.594638, 
  longitude: -48.565883 
}