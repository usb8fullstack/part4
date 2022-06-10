const listHelper = require('../utils/list_helper')

test('dummy returns one', () => {
  const blogs = []
  const result = listHelper.dummy(blogs)
  expect(result).toBe(1)
})

const generalBlogs = [
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
    __v: 0
  },
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
    __v: 0
  },
  {
    _id: '5a422b3a1b54a676234d17f9',
    title: 'Canonical string reduction',
    author: 'Hihihaha',
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
    const blogs = []
    const result = listHelper.totalLikes(blogs)
    expect(result).toBe(0)
  })
  test('when list has only 1 blog, equals the likes of that', () => {
    const blogs = [...[], generalBlogs[0]]
    const result = listHelper.totalLikes(blogs)
    expect(result).toBe(5)
  })

  test('when list has only 2 blogs, equals the likes of that', () => {
    const blogs = [...[], generalBlogs[0], generalBlogs[1]]
    const result = listHelper.totalLikes(blogs)
    expect(result).toBe(10)
  })

  test('when list has many blogs, equals the likes of that', () => {
    const result = listHelper.totalLikes(generalBlogs)
    expect(result).toBe(34)
  })
})

describe('FAVORITE BLOG', () => {
  test('when list is emty, equals the likes of that', () => {
    const blogs = []
    const result = listHelper.favoriteBlog(blogs)
    expect(result).toEqual({})
  })

  test(`it should be returned the blog having most like, 
    (If more than one at the top, it is enough to return one of them.)`, () => {
    const result = listHelper.favoriteBlog(generalBlogs)
    expect(result).toEqual({
      _id: '5a422b3a1b54a676234d17f9',
      title: 'Canonical string reduction',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
      likes: 12,
      __v: 0
    })
  })
})

describe('MOST BLOGS', () => {
  test('when list is emty, equals the likes of that', () => {
    const blogs = []
    const result = listHelper.mostBlogs(blogs)
    expect(result).toEqual({})
  })

  test(`it should be returned the the author who has the largest amount of blogs,
    (If more than one at the top, it is enough to return one of them.)`, () => {
    const blogs = [...generalBlogs, {
      _id: '1a422b3a1b54a676234d17f1',
      title: 'Hahahihi',
      author: 'Hihihaha',
      url: 'http://hiha.com',
      likes: 5,
      __v: 0
    }]
    const result = listHelper.mostBlogs(blogs)
    expect(result).toEqual({
      author: 'Edsger',
      blogs: 2
    })
  })
})

describe('MOST LIKES', () => {
  test('when list is emty, equals the likes of that', () => {
    const blogs = []
    const result = listHelper.mostLikes(blogs)
    expect(result).toEqual({})
  })

  test(`it should be returned the the author whose blog posts have the largest amount of likes,
    (If more than one at the top, it is enough to return one of them.)`, () => {
    const blogs = [...generalBlogs, {
      _id: '1a422b3a1b54a676234d17f1',
      title: 'Hahahihi',
      author: 'Hihihaha',
      url: 'http://hiha.com',
      likes: 5,
      __v: 0
    }]
    const result = listHelper.mostLikes(blogs)
    expect(result).toEqual({
      author: 'Hihihaha',
      likes: 17
    })
  })
})