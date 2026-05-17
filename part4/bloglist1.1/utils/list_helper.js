const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return null
  }

  return blogs.reduce((favorite, blog) => {
    return blog.likes > favorite.likes ? blog : favorite
  }, blogs[0])
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0) {
    return null
  }

  const authorCounts = {}

  blogs.forEach(blog => {
    authorCounts[blog.author] = (authorCounts[blog.author] || 0) + 1
  })

  let maxBlogs = 0
  let mostProlificAuthor = null

  for (const author in authorCounts) {
    if (authorCounts[author] > maxBlogs) {
      maxBlogs = authorCounts[author]
      mostProlificAuthor = author
    }
  }

  return { author: mostProlificAuthor, blogs: maxBlogs }
}

const mostLikes = (blogs) => {
  if (blogs.length === 0) {
    return null
  }

  const authorLikes = {}

  blogs.forEach(blog => {
    authorLikes[blog.author] = (authorLikes[blog.author] || 0) + blog.likes
  })

  let maxLikes = 0
  let mostLikedAuthor = null

  for (const author in authorLikes) {
    if (authorLikes[author] > maxLikes) {
      maxLikes = authorLikes[author]
      mostLikedAuthor = author
    }
  }

  return { author: mostLikedAuthor, likes: maxLikes }
}

module.exports = {dummy, totalLikes, favoriteBlog}