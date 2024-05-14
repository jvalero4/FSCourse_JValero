const { test, after, beforeEach, describe } = require('node:test')
const mongoose = require('mongoose')
const assert = require('node:assert')
const supertest = require('supertest')
const testHelper = require('./test_helper')
const app = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')

const api = supertest(app)

const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Imp2YWxlcm8iLCJpZCI6IjY2NDFmMGU1NGEwZjRjMDdlZGY4YTZlZSIsImlhdCI6MTcxNTY3NTI5MX0.84QAxWadm2Kt9nc1ugXR7rot0McmQiDlXJLTmh0B_NE'

beforeEach(async () => {
    await Blog.deleteMany({})

    const blogObject = testHelper.initialBlogs.map(blog => new Blog(blog))
    const promiseArray = blogObject.map(blog => blog.save())
    await Promise.all(promiseArray)
  })

describe('HTTP requests', () => {
    test('blogs are returned as json', async() => {
        const response = await api.get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
    
        assert.strictEqual(response.body.length, testHelper.initialBlogs.length)
    })
    
    test('identificator of blogs are named id', async() => {
        const response = await testHelper.blogsInDb()
    
        for (let blog of response) {
            assert(blog.hasOwnProperty('id'))
            break
        }
    })
    
    test('validating the post of a blog to database', async() => {
        const newBlog = {
            title: "Blog Elemental Elpais",
            author: "Javier Valero",
            url: "https://elpais.com/cultura/elemental/",
            likes: 6
        }
 
        await api.post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)
    
        const blogsAtEnd = await testHelper.blogsInDb()
        assert.strictEqual(blogsAtEnd.length, testHelper.initialBlogs.length + 1)
    
        const titles = blogsAtEnd.map(blog => blog.title)
        assert(titles.includes('Blog Elemental Elpais'))
    })
    
    test('blog without likes property turns 0 likes default', async() => {
        const newBlog = {
            title: "Blog Elemental Elpais",
            author: "Javier Valero",
            url: "https://elpais.com/cultura/elemental/"
        }

        await api.post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

        const blogsAtEnd = await testHelper.blogsInDb()
        const newBlogAtDB = blogsAtEnd.filter(blog => blog.title === 'Blog Elemental Elpais')
        assert.strictEqual(newBlogAtDB[0].likes, 0)
    })

    test("blog without properties title or url doesn't send correctly", async() => {
        const newBlog = {
            title: "Blog Elemental Elpais",
            author: "Javier Valero",
            likes: 10
        }

        await api.post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(400)

        const blogsAtEnd = await testHelper.blogsInDb()
        assert.strictEqual(blogsAtEnd.length, testHelper.initialBlogs.length)
    })

    test("if id it's valid, success with status code 204 work", async() => {
        const blogsAtStart = await testHelper.blogsInDb()
        const blogToDelete = blogsAtStart[0]
        await api.delete(`/api/blogs/${blogToDelete.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(204)

        const blogsAtEnd = await testHelper.blogsInDb()
        assert.strictEqual(blogsAtEnd.length, testHelper.initialBlogs.length - 1)

        const titleBlogs = blogsAtEnd.map(blog => blog.title)
        assert(!titleBlogs.includes(blogToDelete.title))
    })

    test('updating likes of a specific blog', async() => {
        const blogsAtStart = await testHelper.blogsInDb()
        const blogToUpdate = blogsAtStart[0]
        blogToUpdate.likes = 100

        await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .expect(200)

        const blogsAtEnd = await testHelper.blogsInDb()
        assert.strictEqual(blogsAtEnd.length, testHelper.initialBlogs.length)
        const blogUpdated = blogsAtStart[0]
        assert.strictEqual(blogUpdated.likes, 100)
    })
})

describe('User posts', () => {
    test('password must be at least 3 characters', async() => {
        const usersAtStart = await testHelper.usersInDb()

        const newUser = {
            username: 'user1234',
            name: 'Superuser',
            password: 'su',
        }

        const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)

        const usersAtEnd = await testHelper.usersInDb()
        assert(result.body.error.includes('Password must be at least 3 characters'))

        assert.strictEqual(usersAtEnd.length, usersAtStart.length)
    })
    test('username must be at least 3 characters', async() => {
        const usersAtStart = await testHelper.usersInDb()

        const newUser = {
            username: 'us',
            name: 'Superuser',
            password: 'su123321',
        }

        const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)

        const usersAtEnd = await testHelper.usersInDb()
        assert(result.body.error.includes('User validation failed: username: Path `username` (`us`) is shorter than the minimum allowed length (3).'))

        assert.strictEqual(usersAtEnd.length, usersAtStart.length)
    })
    test('username must be unique', async() => {
        const usersAtStart = await testHelper.usersInDb()

        const newUser = {
            username: 'jvalero',
            name: 'Repeated',
            password: 'su123321'
        }

        const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)

        const usersAtEnd = await testHelper.usersInDb()
        assert(result.body.error.includes('expected `username` to be unique'))

        assert.strictEqual(usersAtEnd.length, usersAtStart.length)
    })
})

after(async () => {
    await mongoose.connection.close()
})

// Esquema de Mongoose para usuarios