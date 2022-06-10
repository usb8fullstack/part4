var _ = require('lodash')
// eslint-disable-next-line no-unused-vars
const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  const reducer = (sum, item) => {
    return sum + item.likes
  }
  return blogs.reduce(reducer, 0)
}

const favoriteBlog  = (blogs) => {
  const reducer = (x, y) => {
    return (x.likes > y.likes) ? x : y
  }
  return (blogs.length !== 0) ? blogs.reduce(reducer) : {}
}

const mostBlogs = (blogs) => {
  const result = _(blogs)
    .countBy('author')
    .entries()
    // .value()
    .maxBy((o) => o[1])
  return (blogs.length !== 0)
    ? { author: result[0], blogs: result[1] }
    : {}
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
}