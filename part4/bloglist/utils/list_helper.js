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

  const counts = {}

  for (const blog of blogs) {
    counts[blog.author] = (counts[blog.author] || 0) + 1
  }

  let topAuthor = null
  let topCount = 0

  for (const author of Object.keys(counts)) {
    if (counts[author] > topCount) {
      topCount = counts[author]
      topAuthor = author
    }
  }

  return {
    author: topAuthor,
    blogs: topCount,
  }
}

const mostLikes = (blogs) => {
  if (blogs.length === 0) {
    return null
  }

  const totals = {}

  for (const blog of blogs) {
    totals[blog.author] = (totals[blog.author] || 0) + blog.likes
  }

  let topAuthor = null
  let topLikes = Number.NEGATIVE_INFINITY

  for (const author of Object.keys(totals)) {
    if (totals[author] > topLikes) {
      topLikes = totals[author]
      topAuthor = author
    }
  }

  return {
    author: topAuthor,
    likes: topLikes,
  }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}
