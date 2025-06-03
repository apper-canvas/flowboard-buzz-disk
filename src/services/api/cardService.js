import cardData from '../mockData/card.json'
import { delay } from '../index'

let cards = [...cardData]

export const getAll = async () => {
  await delay(300)
  return [...cards]
}

export const getById = async (id) => {
  await delay(200)
  const card = cards.find(c => c.id === id)
  return card ? { ...card } : null
}

export const create = async (cardData) => {
  await delay(400)
  const newCard = {
    ...cardData,
    id: Date.now().toString(),
    labels: cardData.labels || [],
    assignees: cardData.assignees || []
  }
  cards.push(newCard)
  return { ...newCard }
}

export const update = async (id, data) => {
  await delay(350)
  const index = cards.findIndex(c => c.id === id)
  if (index === -1) throw new Error('Card not found')
  
  cards[index] = { ...cards[index], ...data }
  return { ...cards[index] }
}

export const remove = async (id) => {
  await delay(250)
  const index = cards.findIndex(c => c.id === id)
  if (index === -1) throw new Error('Card not found')
  
  cards.splice(index, 1)
  return true
}