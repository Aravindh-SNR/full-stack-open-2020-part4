const dummy = list => 1;

const totalLikes = list => list.reduce((sum, currentBlog) => sum + currentBlog.likes, 0);

const favoriteBlog = list => {
    if (!list.length) {
        return undefined;
    }

    const max = Math.max(...list.map(blog => blog.likes));
    const favorite = list.find(blog => blog.likes === max);
    return {
        title: favorite.title,
        author: favorite.author,
        likes: favorite.likes
    };
};

const mostBlogs = list => {
    if (!list.length) {
        return undefined;
    }

    const authors = {};

    list.forEach(blog => {
        authors[blog.author] = authors[blog.author] ? authors[blog.author] + 1 : 1;
    });

    // Maximum value
    const blogs = Math.max(...Object.values(authors));

    // Key with maximum value
    const author = Object.keys(authors).find(author => authors[author] === blogs);

    return { author, blogs };
};

const mostLikes = list => {
    if (!list.length) {
        return undefined;
    }

    const authors = {};

    list.forEach(blog => {
        authors[blog.author] = authors[blog.author] ? authors[blog.author] + blog.likes : blog.likes;
    });

    // Maximum value
    const likes = Math.max(...Object.values(authors));

    // Key with maximum value
    const author = Object.keys(authors).find(author => authors[author] === likes);

    return { author, likes };
};

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
};