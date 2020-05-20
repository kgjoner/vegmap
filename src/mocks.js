export const mockUser = {
  name: 'Vicente Promonte',
  userID: '1112345',
  email: 'v.promonte@provider.com'
}

export const mockSearchParams = {
  latitude: -27.32,
  longitude: -48.65,
  foods: [],
  vegan: true,
  vegetarian: true
}

export const mockRestaurantInputData = {
  name: 'Il Gelato',
  type: 'vegetarian',
  foods: [
    'sorvete',
    'açaí'
  ],
  option: {
    vegan: true,
    vegetarian: true,
  },
  address: 'Rua das Oliveiras, 37',
  latitude: -27.234,
  longitude: -48.106
}


export const mockRestaurant = {
  _id: '02',
  name: 'Il Gelato',
  username: 'ilgelato',
  type: 'vegetarian',
  foods: [
    'sorvete',
    'açaí'
  ],
  options: {
    vegan: true,
    vegetarian: true,
  },
  address: 'Rua das Oliveiras, 37',
  location: {
    coordinates: [-48.106, -27.234],
    _id: '8810927461',
    type: 'Point'
  },
  likes: [],
  editionLog: [
    {
      ...mockUser,
      date: "2020-05-12T01:33:01.449Z",
    }
  ]
}

export const mockRestaurantLiked = {
  _id: '02',
  name: 'Il Gelato',
  username: 'ilgelato',
  type: 'vegetarian',
  foods: [
    'sorvete',
    'açaí'
  ],
  options: {
    vegan: true,
    vegetarian: true,
  },
  address: 'Rua das Oliveiras, 37',
  location: {
    coordinates: [-48.106, -27.234],
    _id: '8810927461',
    type: 'Point'
  },
  likes: [mockUser.userID],
  editionLog: [
    {
      ...mockUser,
      date: "2020-05-12T01:33:01.449Z",
    }
  ]
}

export const mockRestaurants = [
  {
    _id: '01',
    name: 'Seu Vagem',
    username: 'seuvagem',
    type: 'vegan',
    foods: [
      'almoço',
      'salada',
      'porções'
    ],
    options: {
      vegan: true,
      vegetarian: false,
    },
    address: 'Av. Pedra Branca, 1444',
    location: {
      coordinates: [-48.276, -27.221],
      _id: '1678211230083'
    },
    likes: ['87127156900', '76100323893'],
    editionLog: [
      {
        ...mockUser,
        date: "2020-05-13T00:59:27.673Z",
      }
    ]
  }
]

export const mockError = {
  message: '501: Invalid params.'
}

export const mockCoords = {
  latitude: -27.802,
  longitude: -47.256,
}