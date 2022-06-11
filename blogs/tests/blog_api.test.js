const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const helper = require('./test_helper')

const Blog = require('../models/blog')

beforeEach(async () => {
  await Blog.deleteMany({})

  let blogObject = new Blog(helper.initialBlogs[0])
  await blogObject.save()

  blogObject = new Blog(helper.initialBlogs[1])
  await blogObject.save()
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
}, 100000)

// ---------------------------------------------
test('all blogs are returned', async () => {
  const response = await api.get('/api/blogs')
  expect(response.body).toHaveLength(helper.initialBlogs.length)
})

test('a specific blogs is within the returned notes', async () => {
  const response = await api.get('/api/blogs')
  const titles = response.body.map(r => r.title)
  expect(titles).toContain('journal 1')
})

test('verify the existence of property _id', async () => {
  const response = await api.get('/api/blogs')
  response.body.forEach(blog => {
    expect(blog.id).toBeDefined()
  })
})

// ---------------------------------------------
afterAll(() => {
  mongoose.connection.close()
})