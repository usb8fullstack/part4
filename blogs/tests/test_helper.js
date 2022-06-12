const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
  {
    title: 'journal 1',
    author: 'hihi',
    url: 'http://www.hihi.com',
    likes: 1,
  },
  {
    title: 'journal 2',
    author: 'haha',
    url: 'http://www.haha.com',
    likes: 2,
  },
]

const nonExistingId = async () => {
  const blog = new Blog({
    title: 'journal nnn',
    author: 'hihi nnn',
    url: 'http://www.hihi.com',
    likes: 9,
  })
  await blog.save()
  await blog.remove()

  return blog._id.toString()
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

/********************************************/
const initialUsers = [
  {
    username: 'user1-test',
    name: 'one-test',
    password: 'passuser1',
  },
  // {
  //   username: 'user2-test',
  //   name: 'two-test',
  //   password: 'passuser2',
  // },
]

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}

module.exports = {
  initialBlogs, nonExistingId, blogsInDb, usersInDb, initialUsers,
}