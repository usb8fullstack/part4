const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

const jwt = require('jsonwebtoken')

blogsRouter.get('/', async (request, response) => {
  const blogs =  await Blog.find({}).populate('user',
    { username: 1, name: 1, id: 1 }
  )
  response.json(blogs)
})

blogsRouter.post('/', async (request, response, next) => {
  const body = request.body

  const token = request.token

  try {
    const decodedToken = jwt.verify(token, process.env.SECRET)
    if (!decodedToken.id) {
      return response.status(401).json({ error: 'token missing or invalid' })
    }
    const user = await User.findById(decodedToken.id)

    if (!body.title || !body.author || !body.url) {
      return response.status(400).json({
        error: 'title, author or url must be not emty'
      })
    }

    const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes || 0,
      user: user._id
    })

    const savedBlog = await blog.save()

    // user.blogs = user.blogs.concat(savedBlog._id)
    // user.blogs = [...user.blogs, savedBlog._id]

    user.blogs = [savedBlog._id, ...user.blogs]  // database order inside itself
    await user.save()

    response.status(201).json(savedBlog)
  } catch(error) {
    next(error)
  }
})

blogsRouter.get('/:id', async (request, response, next) => {
  try {
    const blog = await Blog.findById(request.params.id)
    if (blog) {
      response.json(blog)
    } else {
      response.status(404).end()
    }
  }
  catch(error) {
    next(error)
  }
})

blogsRouter.delete('/:id', async (request, response, next) => {
  try {
    await Blog.findByIdAndRemove(request.params.id)
    response.status(204).end()
  }
  catch (error) {
    next(error)
  }
})

blogsRouter.put('/:id', (request, response, next) => {
  const { title, author, url, likes } = request.body

  if (!title || !author || !url) {
    return response.status(400).json({
      error: 'title, author or url must be not emty'
    })
  }

  Blog
    .findByIdAndUpdate(
      request.params.id,
      { title, author, url, likes },
      { new: true, runValidators: true, context: 'query' }
    )
    .then(updatedBlog => {
      if (updatedBlog) { response.status(200).json(updatedBlog) }
      else { response.status(404).end() }
    })
    .catch(error => next(error))
})

module.exports = blogsRouter