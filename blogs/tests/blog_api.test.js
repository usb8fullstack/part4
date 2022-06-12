const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const helper = require('./test_helper')

const Blog = require('../models/blog')
const bcrypt = require('bcrypt')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

let token
beforeEach(async () => {
  await User.deleteMany({})

  const userForToken = {}
  for (let o of helper.initialUsers) {
    const passwordHash = await bcrypt.hash(o.password, 10)
    let userObject = new User({ username: o.username, name: o.name, passwordHash })
    await userObject.save()
    userForToken.username = userObject.username
    userForToken.id = userObject._id.toString()
  }

  await Blog.deleteMany({})
  // await Blog.insertMany(helper.initialBlogs)
  // NOTE: forEach has some issues with async >>>
  for (let o of helper.initialBlogs) {
    o.user = userForToken.id
    let blogObject = new Blog(o)
    await blogObject.save()
  }

  token = jwt.sign(userForToken, process.env.SECRET, { expiresIn: 60*60 })
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
  test('a valid blog cannot be added WITHOUT token ', async () => {
    const newBlog = {
      title: 'journal 3',
      author: 'hihi',
      url: 'http://www.hihi.com',
      likes: 3,
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(401)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
  })

  test('a valid blog can be added ', async () => {
    const newBlog = {
      title: 'journal 3',
      author: 'hihi',
      url: 'http://www.hihi.com',
      likes: 3,
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
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
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    const likes = blogsAtEnd.map(n => n.likes)
    expect(likes).toContainEqual(0)
  })

  test('blog without title is not added', async () => {
    const newBlog = {
      // title: '',
      author: 'haha',
      url: 'http://www.haha.com',
      likes: 9,
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(400)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
    // NOTE: not +2 post test above !!!
  })

  test('blog without url is not added', async () => {
    const newBlog = {
      title: 'journal 4',
      author: 'haha',
      likes: 9,
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(400)

    // const blogsAtEnd = await helper.blogsInDb()
    // expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
  })

})


describe('GET BY ID METHOD', () => {
  test('succeeds with a valid id', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToView = blogsAtStart[0]

    const resultBlog = await api
      .get(`/api/blogs/${blogToView.id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)
    const processedBlogToView = JSON.parse(JSON.stringify(blogToView))

    expect(resultBlog.body).toEqual(processedBlogToView)
  })

  test('fails with statuscode 404 if blog does not exist', async () => {
    const validNonexistingId = await helper.nonExistingId()

    // console.log(validNonexistingId)
    await api
      .get(`/api/blogs/${validNonexistingId}`)
      .expect(404)
  })

  test('fails with statuscode 400 id is invalid', async () => {
    const invalidId = '5a3d5da59070081a82a3445huhu'

    await api
      .get(`/api/blogs/${invalidId}`)
      .expect(400)
  })
})


describe('DELETE METHOD', () => {
  test('succeeds with status code 204 if id is valid', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(204)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length - 1)

    const titles = blogsAtEnd.map(r => r.title)
    expect(titles).not.toContain(blogToDelete.title)
  })

  test('fails with status code 400 if id is invalid', async () => {
    await api
      .delete('/api/blogs/62a48487fcfeca016e7d2006huhu')
      .set('Authorization', `Bearer ${token}`)
      .expect(400)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
  })
})


describe('UPDATE METHOD', () => {
  test('a blog - with existent valid ID can be updated', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToView = blogsAtStart[0]

    blogToView.title = 'journal hiha'
    blogToView.likes = 999

    await api
      .put(`/api/blogs/${blogToView.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send(blogToView)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    const titles = blogsAtEnd.map(n => n.title)
    expect(titles).toContain('journal hiha')
    const likes = blogsAtEnd.map(n => n.likes)
    expect(likes).toContainEqual(999)
  })

  test(`a blog - with existent valid ID cannot be updated
  if title, url or author is not valid`, async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToView = blogsAtStart[0]

    blogToView.title = ''

    await api
      .put(`/api/blogs/${blogToView.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send(blogToView)
      .expect(400)
  })

  test(`a blog - with existent valid ID cannot be updated
  if properties are invalid type (e.g: new likes is string )`, async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToView = blogsAtStart[0]

    blogToView.likes = 'uuu'

    await api
      .put(`/api/blogs/${blogToView.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send(blogToView)
      .expect(400)
  })

  test('a blog - with non-existent valid ID cannot be updated', async () => {
    const validNonexistingId = await helper.nonExistingId()

    const blogUpdate = {
      title: 'journal 3',
      author: 'hihi',
      url: 'http://www.hihi.com',
      likes: 3,
    }

    await api
      .put(`/api/blogs/${validNonexistingId}`)
      .set('Authorization', `Bearer ${token}`)
      .send(blogUpdate)
      .expect(404)
  })

  test('a blog - with invalid ID cannot be updated', async () => {
    const invalidId = '5a3d5da59070081a82a3445huhu'

    const blogUpdate = {
      title: 'journal 3',
      author: 'hihi',
      url: 'http://www.hihi.com',
      likes: 3,
    }

    await api
      .put(`/api/blogs/${invalidId}`)
      .set('Authorization', `Bearer ${token}`)
      .send(blogUpdate)
      .expect(400)
  })

})


afterAll(() => {
  mongoose.connection.close()
})