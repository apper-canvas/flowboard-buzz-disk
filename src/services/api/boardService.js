import boardData from '../mockData/board.json'
import { delay } from '../index'

let boards = [...boardData]

export const getAll = async () => {
  await delay(300)
  return [...boards]
}

export const getById = async (id) => {
  await delay(200)
  const board = boards.find(b => b.id === id)
  return board ? { ...board } : null
}

export const create = async (boardData) => {
  await delay(400)
  const newBoard = {
    ...boardData,
    id: Date.now().toString(),
    columns: [],
    members: []
  }
  boards.push(newBoard)
  return { ...newBoard }
}

export const update = async (id, data) => {
  await delay(350)
  const index = boards.findIndex(b => b.id === id)
  if (index === -1) throw new Error('Board not found')
  
  boards[index] = { ...boards[index], ...data }
  return { ...boards[index] }
}

export const remove = async (id) => {
  await delay(250)
  const index = boards.findIndex(b => b.id === id)
  if (index === -1) throw new Error('Board not found')
  
  boards.splice(index, 1)
  return true
}