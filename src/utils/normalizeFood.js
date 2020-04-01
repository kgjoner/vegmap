module.exports = function normalizeFood(food) {
  food = food.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f -]/g, "")
  const foodTable = {
    almoco: 'almoço',
    almocos: 'almoço',
    hamburguer: 'hambúrguer',
    hamburguers: 'hambúrguer',
    hamburgueres: 'hambúrguer',
    hamburger: 'hambúrguer',
    hamburgers: 'hambúrguer',
    pizza: 'pizza',
    pizzas: 'pizza',
    hotdog: 'hotdog',
    hotdogs: 'hotdog',
    cachorroquente: 'hotdog',
    cachorrosquentes: 'hotdog',
    cachorrosquente: 'hotdog',
    cachorroquentes: 'hotdog',
    porcao: 'porções',
    porcaos: 'porções',
    porcoes: 'porções',
    drink: 'drinks',
    drinks: 'drinks',
    bebida: 'drinks',
    bebidas: 'drinks',
    cafe: 'café',
    cafes: 'café',
    salgado: 'salgados',
    salgados: 'salgados',
    doce: 'doces',
    doces: 'doces',
    salada: 'salada',
    saladas: 'saladas',
    sushi: 'sushi',
    sushis: 'sushi',
    brasileiro: 'brasileiro',
    mexicano: 'mexicano',
    italiano: 'italiano',
    arabe: 'árabe',
    chines: 'chinês'
  }

  return foodTable[food]
}