const Blog = require('../models/blog')
const User = require('../models/user')

initialBlogs = [{
    "title": "Blog adrenalina Elpais",
    "author": "Javier Valero",
    "url": "https://elpais.com/deportes/adrenalina/",
    "likes": 4
  },
  {
    "title": "Blog 1UP Elpais",
    "author": "Javier Valero",
    "url": "https://elpais.com/cultura/1up/",
    "likes": 10
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