
let currentPage = 1;

function fetchRepositories() {
    const username = document.getElementById('username').value;
    const perPage = document.getElementById('perPage').value;
    const searchQuery = document.getElementById('search').value;
    const repositoriesContainer = document.getElementById('repositories');
    const loader = document.getElementById('loader');

    // Clear previous results
    repositoriesContainer.innerHTML = '';

    // Show loader while fetching repositories
    loader.style.display = 'block';

    // Construct the API URL with pagination and search parameters
    const apiUrl = `https://api.github.com/users/${username}/repos?per_page=${perPage}&page=${currentPage}&q=${searchQuery}`;

    // Fetch repositories using GitHub API
    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(repositories => {
            const filteredRepositories = repositories.filter(repo => repo.name.toLowerCase().includes(searchQuery));

            if (filteredRepositories.length === 0) {
                repositoriesContainer.innerHTML = 'No matching repositories found.';
            } else {
                filteredRepositories.forEach(repo => {
                    const repoElement = createRepoCard(repo);
                    repositoriesContainer.appendChild(repoElement);
                });
            }

            // Hide loader after fetching repositories
            loader.style.display = 'none';
        })
        .catch(error => {
            repositoriesContainer.innerHTML = `Error fetching repositories. ${error.message}`;
            console.error(error);

            // Hide loader in case of an error
            loader.style.display = 'none';
        });
}

function createRepoCard(repo) {
    const repoCard = document.createElement('div');
    repoCard.className = 'repo-card';

    const repoLink = document.createElement('a');
    repoLink.href = repo.html_url;
    repoLink.target = '_blank';
    repoLink.textContent = repo.name;
    repoLink.style.fontWeight = 'bold';

    const topics = document.createElement('p');
    topics.textContent = `Topics: ${repo.topics.join(', ')}`;

    repoCard.appendChild(repoLink);
    repoCard.appendChild(topics);

    return repoCard;
}

function nextPage() {
    currentPage++;
    fetchRepositories();
}

function prevPage() {
    if (currentPage > 1) {
        currentPage--;
        fetchRepositories();
    }
}

