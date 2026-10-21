const POSTS_API_URL = 'https://jsonplaceholder.typicode.com/posts';

async function fetchPosts(fetchFunction = fetch) {
    const response = await fetchFunction(POSTS_API_URL);

    if (!response.ok) {
        throw new Error(`Posts request failed with status ${response.status}`);
    }

    const posts = await response.json();
    if (!Array.isArray(posts)) {
        throw new TypeError('Posts response must be an array');
    }

    return posts;
}

function displayPosts(posts, postsContainer = document.querySelector('#posts')) {
    postsContainer.replaceChildren();

    posts.forEach((post) => {
        const postContainer = document.createElement('article');
        const postTitle = document.createElement('h2');
        const postBody = document.createElement('p');

        postTitle.textContent = post.title;
        postBody.textContent = post.body;
        postContainer.append(postTitle, postBody);
        postsContainer.appendChild(postContainer);
    });
}

async function loadAndDisplayPosts(fetchFunction = fetch) {
    const status = document.querySelector('#post-status');
    status.textContent = 'Loading posts...';

    let posts;
    try {
        posts = await fetchPosts(fetchFunction);
    } catch (error) {
        status.textContent = 'Unable to load posts. Please try again later.';
        console.error('Failed to load social media posts:', error);
        return;
    }

    displayPosts(posts);
    const noun = posts.length === 1 ? 'post' : 'posts';
    status.textContent = `Showing ${posts.length} ${noun}.`;
}

if (typeof document !== 'undefined' && typeof module === 'undefined') {
    loadAndDisplayPosts();
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { POSTS_API_URL, fetchPosts, displayPosts, loadAndDisplayPosts };
}
