const Blog = require('../models/blog')

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
  // {
  //   title: 'journal 3',
  //   author: 'hihi',
  //   url: 'http://www.hihi.com',
  //   likes: 3,
  // },
  // {
  //   title: 'journal 4',
  //   author: 'haha',
  //   url: 'http://www.haha.com',
  //   likes: 4,
  // },
]

const nonExistingId = async () => {
  const blog = new Blog({ content: 'willremovethissoon', date: new Date() })
  await blog.save()
  await blog.remove()

  return blog._id.toString()
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

module.exports = {
  initialBlogs, nonExistingId, blogsInDb
}