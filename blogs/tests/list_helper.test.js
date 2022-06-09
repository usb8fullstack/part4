const listHelper = require('../utils/list_helper')

test('dummy returns one', () => {
  const blogs = []
  const result = listHelper.dummy(blogs)
  expect(result).toBe(1)
})

const listBlogs = [
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
    __v: 0
  },
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
    __v: 0
  },
  {
    _id: '5a422b3a1b54a676234d17f9',
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 12,
    __v: 0
  },
  {
    _id: '5a422b3a1b54a676234d17f9',
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 12,
    __v: 0
  },
]

describe('TOTAL LIKES', () => {
  test('when list is emty, equals the likes of that', () => {
    const _blogs = []
    const result = listHelper.totalLikes(_blogs)
    expect(result).toBe(0)
  })
  test('when list has only 1 blog, equals the likes of that', () => {
    const _blogs = [...[], listBlogs[0]]
    const result = listHelper.totalLikes(_blogs)
    expect(result).toBe(5)
  })

  test('when list has only 2 blogs, equals the likes of that', () => {
    const _blogs = [...[], listBlogs[0], listBlogs[1]]
    const result = listHelper.totalLikes(_blogs)
    expect(result).toBe(10)
  })

  test('when list has many blogs, equals the likes of that', () => {
    const result = listHelper.totalLikes(listBlogs)
    expect(result).toBe(34)
  })
})