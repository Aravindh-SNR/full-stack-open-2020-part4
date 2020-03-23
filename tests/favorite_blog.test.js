const { favoriteBlog } = require('../utils/list_helper');

describe('favorite blog', () => {
    const listWithNoBlogs = [];

    const listWithOneBlog = [
        {
            _id: '5a422aa71b54a676234d17f8',
            title: 'Go To Statement Considered Harmful',
            author: 'Edsger W. Dijkstra',
            url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
            likes: 5,
            __v: 0
        }
    ];

    const listWithOneWinner = [
        {
            _id: '5a422aa71b54a676234d17f8',
            title: 'Go To Statement Considered Harmful',
            author: 'Edsger W. Dijkstra',
            url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
            likes: 2,
            __v: 0
        },
        {
            _id: '5a422aa71b54a676234d17f8',
            title: 'Go To Statement Considered Harmful',
            author: 'Edsger W. Dijkstra',
            url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
            likes: 3,
            __v: 0
        },
        {
            _id: '5a422aa71b54a676234d17f8',
            title: 'Go To Statement Considered Harmful',
            author: 'Edsger W. Dijkstra',
            url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
            likes: 15,
            __v: 0
        }
    ];

    const listWithManyWinners = [
        {
            _id: '5a422aa71b54a676234d17f8',
            title: 'Go To Statement Considered Harmful',
            author: 'Edsger W. Dijkstra',
            url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
            likes: 2,
            __v: 0
        },
        {
            _id: '5a422aa71b54a676234d17f8',
            title: 'Go To Statement Considered Harmful',
            author: 'Dijkstra, the Winner',
            url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
            likes: 3,
            __v: 0
        },
        {
            _id: '5a422aa71b54a676234d17f8',
            title: 'Go To Statement Considered Harmful',
            author: 'Edsger W. Dijkstra',
            url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
            likes: 3,
            __v: 0
        }
    ];

    test('of empty list is undefined', () => {
        expect(favoriteBlog(listWithNoBlogs)).toBe(undefined);
    });

    test('when list has only one blog is that blog', () => {
        expect(favoriteBlog(listWithOneBlog)).toEqual({
            title: listWithOneBlog[0].title,
            author: listWithOneBlog[0].author,
            likes: listWithOneBlog[0].likes
        });
    });

    test('of a bigger list with one winner is determined right', () => {
        expect(favoriteBlog(listWithOneWinner)).toEqual({
            title: 'Go To Statement Considered Harmful',
            author: 'Edsger W. Dijkstra',
            likes: 15
        });
    });

    test('of a bigger list with many winners is the winner that occurs first in the list', () => {
        expect(favoriteBlog(listWithManyWinners)).toEqual({
            title: 'Go To Statement Considered Harmful',
            author: 'Dijkstra, the Winner',
            likes: 3
        });
    });
});