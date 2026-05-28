const lodash = require('lodash')

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
  let max = 0;
  let favorite = null;
  blogs.forEach(blog => {
    if (blog.likes > max) {
      max = blog.likes;
      favorite = blog;
    }
  });
  return favorite;
}

const mostBlogs  = (blogs) => {
  const maxBlogs = lodash.maxBy(lodash.values(lodash.groupBy(blogs, 'author')), (o) => o.length)
  return {
    author: maxBlogs[0].author,
    blogs: maxBlogs.length
  }
}

const mostLikes = (blogs) => {
  const maxLikes = lodash.maxBy(lodash.values(lodash.groupBy(blogs, 'author')), (o) => lodash.sumBy(o, 'likes'))
  return {
    author: maxLikes[0].author,
    likes: lodash.sumBy(maxLikes, 'likes')
  }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}
