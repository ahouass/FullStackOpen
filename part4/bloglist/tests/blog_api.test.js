require('dotenv').config()
const { test, describe } = require('node:test')
const assert = require('node:assert')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')

const api = supertest(app)

// test.only('blogs are returned as json', async () => {
//   await api
//     .get('/api/blogs')
//     .expect(200)
//     .expect('Content-Type', /application\/json/)
// })

// test.only('verify that the unique identifier', async () => {
//   const response = await api.get('/api/blogs')
//   const blog = await response.body[0]
//   assert(blog.id !== undefined)
// })

// test.only('a valid blog can be added', async () => {
//   const newBlog = {
//     title: 'Test Blog',
//     author: 'Test Author',
//     url: 'https://test.com',
//     likes: 0
//   }

//   const blogsAtStart = await Blog.find({})

//   await api
//     .post('/api/blogs')
//     .send(newBlog)
//     .expect(201)
//     .expect('Content-Type', /application\/json/)

//   const blogsAtEnd = await Blog.find({})

//   assert.strictEqual(blogsAtEnd.length, blogsAtStart.length + 1)

//   const titles = blogsAtEnd.map(blog => blog.title)

//   assert(titles.includes('Test Blog'))
// })

// test.only('if the likes property is missing from the request, it will default to 0', async () => {
//   const newBlog = {
//     title: 'Test Blog',
//     author: 'Test Author',
//     url: 'https://test.com'
//   }

//   await api
//     .post('/api/blogs')
//     .send(newBlog)
//     .expect(201)
//     .expect('Content-Type', /application\/json/)

//   const response = await api.get('/api/blogs')
//   const blog = response.body.find(b => b.title === 'Test Blog' && b.author === 'Test Author')
//   assert.strictEqual(blog.likes, 0)
// })

test('fails with 400 if title is missing', async () => {
  const newBlog = {
    author: 'Test Author',
    url: 'https://test.com'
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)
})

test('fails with 400 if url is missing', async () => {
  const newBlog = {
    title: 'Test Title',
    author: 'Test Author'
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)
})

test('fails with 400 if both title and url are missing', async () => {
  const newBlog = {
    author: 'Test Author'
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)
})

test('succeeds with status 204 if id is valid', async () => {
  const blogsAtStart = await Blog.find({})

  await api
    .delete(`/api/blogs/${blogsAtStart[0].id}`)
    .expect(204)

  const blogsAtEnd = await Blog.find({})
  assert.strictEqual(blogsAtEnd.length, blogsAtStart.length - 1)
})

test('succeeds with status 200 if likes are updated', async () => {
  const blogsAtStart = await Blog.find({})
  const blogToUpdate = blogsAtStart[0]

  const updatedLikes = { likes: blogToUpdate.likes + 1 }

  await api
    .put(`/api/blogs/${blogToUpdate.id}`)
    .send(updatedLikes)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await Blog.find({})
  const updatedBlog = blogsAtEnd.find(b => b.id === blogToUpdate.id)

  assert.strictEqual(updatedBlog.likes, blogToUpdate.likes + 1)
})