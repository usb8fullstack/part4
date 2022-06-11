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

describe('GET METHOD', () => {
  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  }, 100000)

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

})


describe('POST METHOD', () => {
  test('a valid blog can be added ', async () => {
    const newBlog = {
      title: 'journal 3',
      author: 'hihi',
      url: 'http://www.hihi.com',
      likes: 3,
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

    const titles = blogsAtEnd.map(n => n.title)
    expect(titles).toContain('journal 3')
  })

  test(`a valid blog without likes property, can be added
  (likes will be defaulted to the value 0)`, async () => {
    const newBlog = {
      title: 'journal 4',
      author: 'haha',
      url: 'http://www.haha.com',
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    const titles = blogsAtEnd.map(n => n.likes)
    expect(titles).toContainEqual(0)
  })

  // test('blog without content is not added', async () => {
  //   const newBlog = {
  //     likes: 4,
  //   }

  //   await api
  //     .post('/api/blogs')
  //     .send(newBlog)
  //     .expect(400)  // TODO: change route

  //   const blogsAtEnd = await helper.blogsInDb()

  //   expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
  // })

})


// ---------------------------------------------
afterAll(() => {
  mongoose.connection.close()
})