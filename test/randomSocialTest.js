const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');
const { expect } = require('chai');
const {
  POSTS_API_URL,
  fetchPosts,
  displayPosts,
  loadAndDisplayPosts
} = require('../random-social.js');

describe('random social posts', () => {
  let dom;

  beforeEach(() => {
    dom = new JSDOM(
      '<p id="post-status"></p><section id="posts"></section>'
    );
    global.document = dom.window.document;
  });

  afterEach(() => {
    delete global.document;
    dom.window.close();
  });

  it('fetches posts from the external API', async () => {
    const posts = [{ title: 'A post', body: 'Post content' }];
    let requestedUrl;

    const result = await fetchPosts(async (url) => {
      requestedUrl = url;
      return { ok: true, json: async () => posts };
    });

    expect(requestedUrl).to.equal(POSTS_API_URL);
    expect(result).to.equal(posts);
  });

  it('rejects unsuccessful responses and invalid response data', async () => {
    const failedResponseError = await fetchPosts(async () => ({ ok: false, status: 503 }))
      .then(() => null, (error) => error);
    expect(failedResponseError.message).to.equal('Posts request failed with status 503');

    const invalidDataError = await fetchPosts(async () => ({ ok: true, json: async () => ({}) }))
      .then(() => null, (error) => error);
    expect(invalidDataError.message).to.equal('Posts response must be an array');
  });

  it('renders each post title and body as text', () => {
    const posts = [
      { title: '<strong>First</strong>', body: 'First body' },
      { title: 'Second', body: 'Second body' }
    ];

    displayPosts(posts);

    const entries = document.querySelectorAll('#posts article');
    expect(entries).to.have.length(2);
    expect(entries[0].querySelector('h2').textContent).to.equal('<strong>First</strong>');
    expect(entries[0].querySelector('strong')).to.equal(null);
    expect(entries[1].querySelector('p').textContent).to.equal('Second body');
  });

  it('loads the posts and updates the page status', async () => {
    const posts = [{ title: 'A post', body: 'Post content' }];

    await loadAndDisplayPosts(async () => ({
      ok: true,
      json: async () => posts
    }));

    expect(document.querySelector('#posts article h2').textContent).to.equal('A post');
    expect(document.querySelector('#post-status').textContent).to.equal('Showing 1 post.');
  });

  it('starts loading posts when the browser page script runs', async () => {
    const page = new JSDOM(
      '<p id="post-status"></p><section id="posts"></section>',
      { runScripts: 'outside-only' }
    );
    const posts = [{ title: 'Browser post', body: 'Browser content' }];
    let requestedUrl;

    page.window.fetch = async (url) => {
      requestedUrl = url;
      return { ok: true, json: async () => posts };
    };
    page.window.eval(
      fs.readFileSync(path.resolve(__dirname, '..', 'random-social.js'), 'utf8')
    );
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(requestedUrl).to.equal(POSTS_API_URL);
    expect(page.window.document.querySelector('#posts h2').textContent).to.equal('Browser post');
    expect(page.window.document.querySelector('#post-status').textContent).to.equal('Showing 1 post.');
    page.window.close();
  });

  it('shows an explicit status when the API request fails', async () => {
    const originalError = console.error;
    console.error = () => {};

    try {
      await loadAndDisplayPosts(async () => ({ ok: false, status: 500 }));
      expect(document.querySelector('#post-status').textContent)
        .to.equal('Unable to load posts. Please try again later.');
    } finally {
      console.error = originalError;
    }
  });
});
