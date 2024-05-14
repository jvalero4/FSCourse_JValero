const Blog = require('../models/blog')
const User = require('../models/user')

initialBlogs = [{
    "title": "Blog adrenalina Elpais",
    "author": "Javier Valero",
    "url": "https://elpais.com/deportes/adrenalina/",
    "likes": 4,
    "user": "6641f0e54a0f4c07edf8a6ee"
  },
  {
    "title": "Blog 1UP Elpais",
    "author": "Javier Valero",
    "url": "https://elpais.com/cultura/1up/",
    "likes": 10,
    "user": "6641f0e54a0f4c07edf8a6ee"
  }]

  const blogsInDb = async () => {
    const Blogs = await Blog.find({})
    return Blogs.map(blog => blog.toJSON())
  }

  const usersInDb = async () => {
    const Users = await User.find({})
    return Users.map(user => user.toJSON())
  }

  module.exports = {
    initialBlogs,blogsInDb,usersInDb
  }