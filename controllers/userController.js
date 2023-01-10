import asyncHandler from 'express-async-handler'
import { v4 as uuidv4 } from 'uuid'
import fs from 'fs/promises'

//way one for loading data
// import userData from './data/user.json' assert { type: 'json' }

//way two for loading data
import { readFile } from 'fs/promises'
const userData = JSON.parse(
  await readFile(new URL('../data/user.json', import.meta.url))
)

// @desc    Get random user
// @route   GET /user/random
// @access  Public
const getRandomUser = asyncHandler(async (req, res) => {
  res.json(userData[Math.floor(Math.random() * userData.length)])
})

// @desc    Get all users
// @route   GET /user/all
// @access  Public
const getAllUsers = asyncHandler(async (req, res) => {
  const { limit } = req.query
  if (limit) {
    res.json(userData.slice(0, limit))
  } else {
    res.json(userData)
  }
})

// @desc    Post a user
// @route   POST /user/save
// @access  Public
const saveUser = asyncHandler(async (req, res) => {
  const { gender, name, contact, address, photoUrl } = req.body
  if (gender && name && contact && address && photoUrl) {
    const user = {
      Id: uuidv4(),
      gender,
      name,
      contact,
      address,
      photoUrl,
    }
    userData.push(user)
    await fs.writeFile(
      new URL('../data/user.json', import.meta.url),
      JSON.stringify(userData)
    )
    res.json(user)
  } else {
    res.status(400)
    throw new Error('Invalid user data')
  }
})

// @desc    Update user
// @route   PUT user/update/:id
// @access  Public

const updateUser = asyncHandler(async (req, res) => {
  const { id } = req.params
  const user = userData.find((user) => user.Id === id)
  if (user) {
    user.gender = req.body.gender || user.gender
    user.name = req.body.name || user.name
    user.contact = req.body.contact || user.contact
    user.address = req.body.address || user.address
    user.photoUrl = req.body.photoUrl || user.photoUrl
    res.json(user)
  } else {
    res.status(404)
    throw new Error('User not found')
  }
})

// @desc    Update user
// @route   PUT user/update
// @access  Public
const bulkUpdateUser = asyncHandler(async (req, res) => {
  // Validate the request body
  if (!req.body.userIds || !Array.isArray(req.body.userIds)) {
    return res.status(400).send({ error: 'Invalid request body' })
  }
  const userIds = req.body.userIds
  const { data } = req.body
  const findUser = userData.filter((user) => userIds.includes(user.Id))
  const updateUser = findUser.map((user) => {
    return {
      Id: user.Id,
      gender: data.gender || user.gender,
      name: data.name || user.name,
      contact: data.contact || user.contact,
      address: data.address || user.address,
      photoUrl: data.photoUrl || user.photoUrl,
    }
  })
  res.json({
    userData: updateUser,
  })
})

// @desc    Delete user
// @route   Delete user/delete/:id
// @access  Public
const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params
  const user = userData.find((user) => user.Id === id)
  if (user) {
    userData.splice(userData.indexOf(user), 1)
    res.json(user)
  } else {
    res.status(404)
    throw new Error('User not found')
  }
})

export {
  getRandomUser,
  getAllUsers,
  saveUser,
  updateUser,
  deleteUser,
  bulkUpdateUser,
}
