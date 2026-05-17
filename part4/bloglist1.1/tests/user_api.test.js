process.env.NODE_ENV = 'test'

const { describe, test, beforeEach, after } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const bcrypt = require('bcrypt')
const app = require('../app')
const User = require('../models/user')

const api = supertest(app)

const initialUser = {
  username: 'root',
  name: 'Superuser',
  password: 'sekret',
}

beforeEach(async () => {
  await User.deleteMany({})

  const passwordHash = await bcrypt.hash(initialUser.password, 10)
  const user = new User({
    username: initialUser.username,
    name: initialUser.name,
    passwordHash,
  })

  await user.save()
})

describe('user creation', () => {
  test('succeeds with a fresh username', async () => {
    const usersAtStart = await User.find({})

    const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: 'salainen',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await User.find({})
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)
  })

  test('fails with status code 400 if username is missing', async () => {
    const usersAtStart = await User.find({})

    const newUser = {
      name: 'Missing Username',
      password: 'salainen',
    }

    const response = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    assert.ok(response.body.error.includes('username'))

    const usersAtEnd = await User.find({})
    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })

  test('fails with status code 400 if username is too short', async () => {
    const usersAtStart = await User.find({})

    const newUser = {
      username: 'ab',
      name: 'Too Short',
      password: 'salainen',
    }

    const response = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    assert.ok(response.body.error.includes('username'))

    const usersAtEnd = await User.find({})
    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })

  test('fails with status code 400 if password is missing', async () => {
    const usersAtStart = await User.find({})

    const newUser = {
      username: 'nopassword',
      name: 'Missing Password',
    }

    const response = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    assert.ok(response.body.error.includes('password'))

    const usersAtEnd = await User.find({})
    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })

  test('fails with status code 400 if password is too short', async () => {
    const usersAtStart = await User.find({})

    const newUser = {
      username: 'shortpass',
      name: 'Too Short Password',
      password: '12',
    }

    const response = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    assert.ok(response.body.error.includes('password'))

    const usersAtEnd = await User.find({})
    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })

  test('fails with status code 400 if username is not unique', async () => {
    const usersAtStart = await User.find({})

    const newUser = {
      username: initialUser.username,
      name: 'Duplicate User',
      password: 'salainen',
    }

    const response = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    assert.ok(response.body.error.includes('unique'))

    const usersAtEnd = await User.find({})
    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })
})

after(async () => {
  await mongoose.connection.close()
})
