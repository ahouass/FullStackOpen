process.env.NODE_ENV = 'test'
process.env.SECRET = process.env.SECRET || 'testsecret'

const { describe, test, beforeEach, after } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')
const bcrypt = require('bcrypt')

const api = supertest(app)

let token

const initialBlogs = [
  {
    title: 'First class tests',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.html',
    likes: 10,
  },
  {
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
  },
]

beforeEach(async () => {
  await Blog.deleteMany({})
  await User.deleteMany({})

  const passwordHash = await bcrypt.hash('sekret', 10)
  const user = await new User({
    username: 'root',
    name: 'Superuser',
    passwordHash,
  }).save()

  const loginResponse = await api
    .post('/api/login')
    .send({ username: 'root', password: 'sekret' })

  token = loginResponse.body.token

  const blogsWithUser = initialBlogs.map((blog) => ({
    ...blog,
    user: user._id,
  }))

  const savedBlogs = await Blog.insertMany(blogsWithUser)
  user.blogs = savedBlogs.map((blog) => blog._id)
  await user.save()
})

describe('when there are initially blogs saved', () => {
  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')

    assert.strictEqual(response.body.length, initialBlogs.length)
  })

  test('unique identifier property is id', async () => {
    const response = await api.get('/api/blogs')

    response.body.forEach((blog) => {
      assert.ok(blog.id)
      assert.strictEqual(blog._id, undefined)
    })
  })

  test('creator user info is included', async () => {
    const response = await api.get('/api/blogs')

    response.body.forEach((blog) => {
      assert.ok(blog.user)
      assert.ok(blog.user.username)
      assert.ok(blog.user.name)
      assert.strictEqual(blog.user.passwordHash, undefined)
    })
  })
})

describe('addition of a new blog', () => {
  test('succeeds with valid data', async () => {
    const newBlog = {
      title: 'Type wars',
      author: 'Robert C. Martin',
      url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
      likes: 2,
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .set('Authorization', `Bearer ${token}`)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')

    assert.strictEqual(response.body.length, initialBlogs.length + 1)
    const titles = response.body.map((blog) => blog.title)
    assert.ok(titles.includes(newBlog.title))
  })

  test('defaults likes to 0 when missing', async () => {
    const newBlog = {
      title: 'Canonical string reduction',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    }

    const response = await api
      .post('/api/blogs')
      .send(newBlog)
      .set('Authorization', `Bearer ${token}`)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(response.body.likes, 0)
  })

  test('fails with status code 400 if title is missing', async () => {
    const newBlog = {
      author: 'Robert C. Martin',
      url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.html',
      likes: 10,
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .set('Authorization', `Bearer ${token}`)
      .expect(400)

    const response = await api.get('/api/blogs')
    assert.strictEqual(response.body.length, initialBlogs.length)
  })

  test('fails with status code 400 if url is missing', async () => {
    const newBlog = {
      title: 'TDD harms architecture',
      author: 'Robert C. Martin',
      likes: 0,
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .set('Authorization', `Bearer ${token}`)
      .expect(400)

    const response = await api.get('/api/blogs')
    assert.strictEqual(response.body.length, initialBlogs.length)
  })

  test('fails with status code 401 if token is missing', async () => {
    const newBlog = {
      title: 'Unauthorized blog',
      author: 'Anonymous',
      url: 'http://example.com/unauthorized',
      likes: 1,
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(401)

    const response = await api.get('/api/blogs')
    assert.strictEqual(response.body.length, initialBlogs.length)
  })
})

describe('deletion of a blog', () => {
  test('succeeds with status code 204 if id is valid', async () => {
    const response = await api.get('/api/blogs')
    const blogToDelete = response.body[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(204)

    const blogsAtEnd = await api.get('/api/blogs')
    assert.strictEqual(blogsAtEnd.body.length, initialBlogs.length - 1)

    const titles = blogsAtEnd.body.map((blog) => blog.title)
    assert.ok(!titles.includes(blogToDelete.title))
  })

  test('fails with status code 403 if user is not the creator', async () => {
    const response = await api.get('/api/blogs')
    const blogToDelete = response.body[0]

    const otherPasswordHash = await bcrypt.hash('salainen', 10)
    await new User({
      username: 'otheruser',
      name: 'Other User',
      passwordHash: otherPasswordHash,
    }).save()

    const otherLogin = await api
      .post('/api/login')
      .send({ username: 'otheruser', password: 'salainen' })

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', `Bearer ${otherLogin.body.token}`)
      .expect(403)

    const blogsAtEnd = await api.get('/api/blogs')
    assert.strictEqual(blogsAtEnd.body.length, initialBlogs.length)
  })
})

describe('updating a blog', () => {
  test('succeeds with valid data', async () => {
    const response = await api.get('/api/blogs')
    const blogToUpdate = response.body[0]
    const updatedLikes = blogToUpdate.likes + 1

    const updatedBlog = {
      likes: updatedLikes,
    }

    const updateResponse = await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(updatedBlog)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(updateResponse.body.likes, updatedLikes)
  })
})

after(async () => {
  await mongoose.connection.close()
})
