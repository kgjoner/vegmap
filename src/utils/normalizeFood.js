const { foodTable } = require('./foodTable')

module.exports = function normalizeFood(food) {
  food = food.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f -]/g, "")
  return foodTable[food]
}