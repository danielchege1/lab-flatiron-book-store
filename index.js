// 1. Select the UL element from the HTML.
// NOTE: Your HTML uses 'book-list', even though the instructions mention 'post-list'. 
// We are using 'book-list' so it actually shows up on your page!
const listElement = document.getElementById('book-list');

// 2. Create the function to display the posts (as requested in the lab instructions)
function displayPosts(posts) {
    // Loop through the array of posts
    posts.forEach(post => {
        // Create an li element
        const li = document.createElement('li');
        
        // Create an h1 element and set its text to the post title
        const h1 = document.createElement('h1');
        h1.textContent = post.title;
        
        // Create a p element and set its text to the post body
        const p = document.createElement('p');
        p.textContent = post.body;
        
        // Append h1 and p to li
        li.appendChild(h1);
        li.appendChild(p);
        
        // Append li to the ul
        listElement.appendChild(li);
    });
}

// 3. Refactor with Async/Await (as requested in step 4 of your lab)
async function fetchAndDisplay() {
    try {
        // Fetch the data using await
        const response = await fetch('https://jsonplaceholder.typicode.com/posts');
        
        // Check if the response is okay
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        // Convert the response to JSON
        const data = await response.json();
        
        // Call displayPosts() after fetching the data
        displayPosts(data);

    } catch (error) {
        // Catch any errors and log them to the console
        console.error("Error fetching data:", error);
    }
}

// 4. Call the function to run it when the script loads
fetchAndDisplay();