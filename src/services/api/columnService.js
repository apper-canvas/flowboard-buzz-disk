import columnData from '../mockData/column.json'
import { delay } from '../index'

let columns = [...columnData]

export const getAll = async () => {
  await delay(250)
  return [...columns]
}

export const getById = async (id) => {
  await delay(200)
  const column = columns.find(c => c.id === id)
  return column ? { ...column } : null
}

export const create = async (columnData) => {
  await delay(300)
  const newColumn = {
    ...columnData,
    id: Date.now().toString(),
    cards: []
  }
  columns.push(newColumn)
  return { ...newColumn }
}

export const update = async (id, data) => {
  await delay(300)
  const index = columns.findIndex(c => c.id === id)
  if (index === -1) throw new Error('Column not found')
  
  columns[index] = { ...columns[index], ...data }
  return { ...columns[index] }
}

export const remove = async (id) => {
  await delay(200)
  const index = columns.findIndex(c => c.id === id)
  if (index === -1) throw new Error('Column not found')
  
  columns.splice(index, 1)
  return true
}