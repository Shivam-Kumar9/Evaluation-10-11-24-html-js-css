
const PostsContainer = document.getElementById('PostsContainer');
const userDropdown = document.getElementById('userDropdown');
const sortDropdown = document.getElementById('sortDropdown');
const searchInput = document.getElementById('searchInput');
const PrevPageBtn = document.getElementById('PrevPage');
const nextpageBtn = document.getElementById('nextpage');
const pageInfo = document.getElementById('pageInfo');


let post = [];
let filteredPosts = [];
let currentPage = 1;
const postsPerPage = 10;

async function fetchData() {
    const [postResonse, usersResponse] = await Promise.all([
        fetch('https://jsonplaceholder.typicode.com/posts'),
        fetch('https://jsonplaceholder.typicode.com/users')
    ])

    post = await postResonse.Json();
    const users = await usersResponse.Json();
    populateUserDropdown(users);
    displayPosts();
}

function populateUserDropdown(users){
    users.forEach(user => {
        const option = Document.createElement('option');
        option.textContent = user.name;
        userDropdown.appendChild(option);
    })
}

// display posts with pagination , filter, sorting and search

function displayPosts(){
    const userId = userDropdown.value;
    const searchQuery = searchInput.value.toLowerCase();
    const sortOrder = sortDropdown.value;
}

//filter post  by search

filteredPosts = posts.filter(post =>
    (!userId || post.userId == userId) &&
    (post.title.toLowerCase().includes(searchQuery) || post.body.toLowerCase().includes(searchQuery))
)

// sort post by title

filteredPosts.sort((a,b) => {
    const titleA = a.title.toLowerCase();
    const titleB = b.title.toLowerCase();
    if(sortOrder === 'asc') return titleA.localCompare(titleB);
    return titleB.localCompare(titleA);
})

const startIndex = (currentPage -1)* postsPerPage;
const paginatedPosts = FilterPosts.slice(startIndex, startIndex + postsPerPage);
pageInfo.textContent = `Page ${currentPage} of ${Math.ceil(filteredPosts.length / postsPerPage)}`;


// render posts
 PostsContainer.innerHtml = paginationPosts.map(post => `
    <div class='post' onclick='openPost(${post.id})'>
     <h3>${post.title}</h3>
     <p>${post.body}</p>
     </div>
    `).join('');
 
    // }

 async function openPost(postId){
    const postResonse = await fetch(`https://jsonplaceholder.typicode.com/posts/${postId}`)
    const commentsResponse = await fetch(`https://jsonplaceholder.typicode.com/comments?postId=${postId}`)
    const post = await postResonse.Json();
    const comments = await commentsResponse.jason(); 

    const newWindow = window.open('', '_blank');
    newWindow.document.write(`<h2>${post.title}</h2><p>${post.body}</p> <h3>Comments:</h3>`)
    comments.forEach(comment => {
        newWindow.document.write(`<p><strong>${comment.name}:</strong> ${comment.body}</p>`)
    })
 }   

 userDropdown.addEventListener('change', () => { currentPage =1 ; displayPosts(); });
 sortDropdown.addEventListener('change', displayPosts);
 searchInput.addEventListener('input', () => { currentPage = 1; displayPosts(); });

 PrevPageBtn.addEventListener('click',() => {
    if(currentPage >1){
        currentPage--;
         displayPosts()
    }
 })

 nextpageBtn.addEventListener('click',() =>{
    if( currentPage * postsPerPage <filteredPosts.length){
        currentPage++;
        displayPosts()
    }
 })

 fetchData()