const postsContainer = document.getElementById('postsContainer');
const userDropdown = document.getElementById('userDropdown');
const sortDropdown = document.getElementById('sortDropdown');
const searchInput = document.getElementById('searchInput');
const prevPageBtn = document.getElementById('prevPage');
const nextPageBtn = document.getElementById('nextPage');
const pageInfo = document.getElementById('pageInfo');

let posts = [];
let filteredPosts = [];
let currentPage = 1;
const postsPerPage = 10;

async function fetchData() {
    const [postsResponse, usersResponse] = await Promise.all([
        fetch('https://jsonplaceholder.typicode.com/posts'),
        fetch('https://jsonplaceholder.typicode.com/users')
    ]);

    posts = await postsResponse.json();
    const users = await usersResponse.json();
    populateUserDropdown(users);
    displayPosts();
}

function populateUserDropdown(users) {
    users.forEach(user => {
        const option = document.createElement('option');
        option.value = user.id;
        option.textContent = user.name;
        userDropdown.appendChild(option);
    });
}

// Display posts with pagination, filtering, sorting, and search
function displayPosts() {
    const userId = userDropdown.value;
    const searchQuery = searchInput.value.toLowerCase();
    const sortOrder = sortDropdown.value;

    // Filter posts by user and search query
    filteredPosts = posts.filter(post =>
        (!userId || post.userId == userId) &&
        (post.title.toLowerCase().includes(searchQuery) || post.body.toLowerCase().includes(searchQuery))
    );

    // Sort posts by title
    filteredPosts.sort((a, b) => {
        const titleA = a.title.toLowerCase();
        const titleB = b.title.toLowerCase();
        if (sortOrder === 'asc') return titleA.localeCompare(titleB);
        return titleB.localeCompare(titleA);
    });

    // Paginate posts
    const startIndex = (currentPage - 1) * postsPerPage;
    const paginatedPosts = filteredPosts.slice(startIndex, startIndex + postsPerPage);
    pageInfo.textContent = `Page ${currentPage} of ${Math.ceil(filteredPosts.length / postsPerPage)}`;

    // Render posts
    postsContainer.innerHTML = paginatedPosts.map(post => `
        <div class="post" onclick="openPost(${post.id})">
            <h3>${post.title}</h3>
            <p>${post.body}</p>
        </div>
    `).join('');
}

// Open post with comments in a new tab
async function openPost(postId) {
    const postResponse = await fetch(`https://jsonplaceholder.typicode.com/posts/${postId}`);
    const commentsResponse = await fetch(`https://jsonplaceholder.typicode.com/comments?postId=${postId}`);
    const post = await postResponse.json();
    const comments = await commentsResponse.json();

    const newWindow = window.open('', '_blank');
    newWindow.document.write(`<h2>${post.title}</h2><p>${post.body}</p><h3>Comments:</h3>`);
    comments.forEach(comment => {
        newWindow.document.write(`<p><strong>${comment.name}:</strong> ${comment.body}</p>`);
    });
}

// Event listeners for pagination, filtering, sorting, and search
userDropdown.addEventListener('change', () => { currentPage = 1; displayPosts(); });
sortDropdown.addEventListener('change', displayPosts);
searchInput.addEventListener('input', () => { currentPage = 1; displayPosts(); });

prevPageBtn.addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        displayPosts();
    }
});

nextPageBtn.addEventListener('click', () => {
    if (currentPage * postsPerPage < filteredPosts.length) {
        currentPage++;
        displayPosts();
    }
});

// Initialize
fetchData();
