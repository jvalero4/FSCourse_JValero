const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

blogsRouter.get('/', async(request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)
  })
  
blogsRouter.post('/', async(request, response, next) => {
    const body = request.body
    const user = request.user
    const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes,
      user: user.id
    })

    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog.id)
    await user.save()
    response.status(201).json(savedBlog)

  })

  blogsRouter.delete('/:id', async(request, response, next) => {
    const blog = await Blog.findById(request.params.id)
    const user = request.user
    if ( blog.user.toString() === user._id.toString() ) {
      await Blog.findByIdAndDelete(request.params.id)
      const indexToDelete = await user.blogs.indexOf(request.params.id)
      await user.blogs.splice(indexToDelete, 1)
      await user.save()
      response.status(204).end()
    } else {
      response.status(401).json({ error: 'Blog can only be deleted by its creator' })
    }
    
  })

  blogsRouter.get('/:id', async(request, response, next) => {
    const blog = await Blog.findById(request.params.id)
    if (blog) {
      response.json(blog)
    } else {
      response.status(404).end()
    }
  })

  blogsRouter.put('/:id', async(request, response, next) => {
    const body = request.body

    const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, body, { new: true })
    response.json(updatedBlog)
  })


  module.exports = blogsRouter