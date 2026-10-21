# Lab: Bookstore Manager

## Introduction

Flatbooks, a local bookstore, needs a website to start advertising their selection of books. They have a rough template of how they want the website to look but its up to you to help them envision their dream. You will need to update the existing title on the page and add a new batch of elements for every book they have in their catalog, which they have provided a template of how each book should look like on the page. They have also provided the store name and a list of books saved to an object, use this object and your knowledge of DOM manipulation to complete this challenge.

## Challenge
1. Update Existing Element of title
2. Create New Elements for each book 

## Bonus Challenge
3. Delete Element

## Instructions

1. **Fork and Clone the Repository:**
   - Go to the provided GitHub repository link.
   - Fork the repository to your GitHub account.
   - Clone the forked repository to your local machine.
   - Open the project in VSCode.
   - Run `npm install` to install all necessary dependencies.

2. **Update Existing Element**
   - Update the header of page to match the name of the book store
      - Select the DOM element with the id of `header` 
      - Save as a variable called `bookStoreTitle`
      - Change the textContent of `bookStoreTitle` to the name property of the `bookStore` variable

3. **Create New Element**
   - Create a new element for each book 
      - Loop through every book
         - Each book is saved in the books property of the `bookStore` variable
      - Within the loop create and change the following new elements:
         - Create an `li` element called `bookContainer`
         - Create an `h3` element called `bookTitle`
            - Set `bookTitle` textContent to the title of the book
         - Create an `p` element called `bookAuthor`
            - Set `bookAuthor` textContent to the author of the book         
         - Create an `img` element called `bookImage`
            - Set `bookImage` src to the image url of the book (**Reminder you can change any attribute of an html element including the src in the same way as you would change the textContent**)
      - Select the element with the id of `book-list` and save it to the variable `bookList`
      - Append elements to html
         - Append `bookTitle`,`bookAuthor`, and `bookImage` elements to `bookContainer` element
         - Append `bookContainer` element to `bookList`

4. **BONUS CHALLENGE: Delete Element**
   - Delete the element with id of `delete-this` from the DOM


## BONUS: Remove Elements from the DOM

We know how to add elements and change their attributes. What if we want to
remove an element from a page?

### `removeChild()`

We use `removeChild()`, as you might guess, to remove a particular child of an
element:

```js
someElement.removeChild(someChildElement);
```

Let's take a look at a more complex example:

```js
const ul = document.getElementsByTagName("ul")[0];
const secondChild = ul.querySelector("li:nth-child(2)");
ul.removeChild(secondChild);
```

Here you can see the power of `querySelector()`: we can use it to find the
second `li` element of `ul`. We then pass that element as the argument to our
`removeChild` method, which removes the element from our `ul`.

What if we want to remove the whole unordered list (`ul`)?

### `element.remove()`

We can just call `remove()` on the element itself:

```js
ul.remove();
```

And it's gone!


[mdn-textcontent]:
  https://developer.mozilla.org/en-US/docs/Web/API/Node/textContent
[mdn-innerhtml]:
  https://developer.mozilla.org/en-US/docs/Web/API/Element/innerHTML
[so-answer]: https://stackoverflow.com/a/35213639

## Resources

- [document.createElement()](https://developer.mozilla.org/en-US/docs/Web/API/Document/createElement)
- [append()](https://developer.mozilla.org/en-US/docs/Web/API/Element/append)
- [removeChild()](https://developer.mozilla.org/en-US/docs/Web/API/Node/removeChild)
- [element.remove()](https://developer.mozilla.org/en-US/docs/Web/API/ChildNode/remove)
- [classList Property][classlist]

[to-string]: https://www.w3schools.com/jsref/jsref_tostring_string.asp
[code-injection]:
  https://www.reddit.com/r/learnjavascript/comments/9502x5/is_innerhtml_still_considered_bad/e3p31go/?utm_source=share&utm_medium=web2x&context=3
[classlist]: https://developer.mozilla.org/en-US/docs/Web/API/Element/classList

## Random Social Posts

Open `random-social.html` to load and display posts from JSONPlaceholder. The
page fetches the posts asynchronously and shows a status message if the request
fails. An internet connection is required to load the feed.

## Weather Alerts

Open `weather-alerts.html` to search active National Weather Service alerts by
two-letter state abbreviation. The page uses the public weather.gov API and
requires an internet connection.
