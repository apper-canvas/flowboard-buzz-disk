import userData from '../mockData/user.json'
import { delay } from '../index'

let users = [...userData]

export const getAll = async () => {
  await delay(200)
  return [...users]
}

export const getById = async (id) => {
  await delay(150)
  const user = users.find(u => u.id === id)
  return user ? { ...user } : null
}

export const create = async (userData) => {
  await delay(300)
  const newUser = {
    ...userData,
    id: Date.now().toString()
  }
  users.push(newUser)
  return { ...newUser }
}

export const update = async (id, data) => {
  await delay(300)
  const index = users.findIndex(u => u.id === id)
  if (index === -1) throw new Error('User not found')
  
  users[index] = { ...users[index], ...data }
  return { ...users[index] }
}

export const remove = async (id) => {
  await delay(200)
  const index = users.findIndex(u => u.id === id)
  if (index === -1) throw new Error('User not found')
  
  users.splice(index, 1)
  return true
}