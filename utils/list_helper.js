const dummy = (blogs) => {
    if (Array.isArray(blogs)) {
        return 1
    } else {
        return 0
    }
  }

const totalLikes = (blogs) => {
    const blogsLikes = blogs.map(blog => blog.likes);

    const reducer = (sum, item) => {
        return sum + item
    }
    return blogsLikes.length === 0 ? 0 : blogsLikes.reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {
    const blogsLikes = blogs.map(blog => blog.likes);
    
    const indexOfMostLiked = blogsLikes.indexOf(Math.max(...blogsLikes))

    const blogFavorite = {
        title: blogs[indexOfMostLiked].title,
        author: blogs[indexOfMostLiked].author,
        likes: blogs[indexOfMostLiked].likes
    }
    return blogFavorite
    
}

const mostBlogs = (blogs) => {
    const authorBlogsCount = new Map(blogs.map(
        blog => [blog.author, blogs.filter(b => b.author === blog.author).length]));

    let maxAuthor = "";
    let maxBlogs = 0;

    authorBlogsCount.forEach((blogs, author) => {
        if (blogs > maxBlogs) {
            maxAuthor = author
            maxBlogs = blogs
        }
    })

    return {
        author: maxAuthor,
        blogs: maxBlogs
    }
}

const mostLikes = (blogs) => {
    const authorLikesCount = blogs.reduce((acc, blog) => {
        if (acc[blog.author]) {
          acc[blog.author] += blog.likes;
        } else {
          acc[blog.author] = blog.likes;
        }
        return acc;
      }, {});

    let maxAuthor = ''
    let maxLikes = 0

    for (const author in authorLikesCount) {
        if(authorLikesCount[author] > maxLikes) {
            maxAuthor = author
            maxLikes = authorLikesCount[author]
        }
    }
        
    
    return {
        author: maxAuthor,
        likes: maxLikes
    }
}
  
  module.exports = {
    dummy,totalLikes,favoriteBlog,mostBlogs,mostLikes
  }