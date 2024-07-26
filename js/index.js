// js/index.js

document.addEventListener('DOMContentLoaded', () => {
    const searchForm = document.getElementById('search-form');
    const searchInput = document.getElementById('search-input');
    const searchResults = document.getElementById('search-results');
    const repoResults = document.getElementById('repo-results');
    const toggleSearchBtn = document.getElementById('toggle-search');
    let searchType = 'users'; // 'users' or 'repos'

    searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const query = searchInput.value.trim();
        if (query) {
            if (searchType === 'users') {
                searchUsers(query);
            } else {
                searchRepos(query);
            }
        }
    });

    toggleSearchBtn.addEventListener('click', () => {
        searchType = searchType === 'users' ? 'repos' : 'users';
        searchInput.placeholder = searchType === 'users' ? 'Search GitHub users...' : 'Search GitHub repos...';
    });

    function searchUsers(query) {
        fetch(`https://api.github.com/search/users?q=${query}`)
            .then(response => response.json())
            .then(data => {
                displayUsers(data.items);
            })
            .catch(error => console.error('Error:', error));
    }

    function searchRepos(query) {
        fetch(`https://api.github.com/search/repositories?q=${query}`)
            .then(response => response.json())
            .then(data => {
                displayRepos(data.items);
            })
            .catch(error => console.error('Error:', error));
    }

    function displayUsers(users) {
        searchResults.innerHTML = '';
        repoResults.innerHTML = '';
        users.forEach(user => {
            const userCard = document.createElement('div');
            userCard.className = 'user-card';

            const avatar = document.createElement('img');
            avatar.src = user.avatar_url;
            avatar.alt = `${user.login}'s avatar`;

            const username = document.createElement('h3');
            username.textContent = user.login;

            const profileLink = document.createElement('a');
            profileLink.href = user.html_url;
            profileLink.textContent = 'View Profile';
            profileLink.target = '_blank';

            userCard.appendChild(avatar);
            userCard.appendChild(username);
            userCard.appendChild(profileLink);
            searchResults.appendChild(userCard);

            userCard.addEventListener('click', () => {
                fetchUserRepos(user.login);
            });
        });
    }

    function displayRepos(repos) {
        searchResults.innerHTML = '';
        repoResults.innerHTML = '<h2>Repositories</h2>';
        repos.forEach(repo => {
            const repoCard = document.createElement('div');
            repoCard.className = 'repo-card';

            const repoName = document.createElement('h3');
            repoName.textContent = repo.name;

            const repoLink = document.createElement('a');
            repoLink.href = repo.html_url;
            repoLink.textContent = 'View Repository';
            repoLink.target = '_blank';

            repoCard.appendChild(repoName);
            repoCard.appendChild(repoLink);
            repoResults.appendChild(repoCard);
        });
    }

    function fetchUserRepos(username) {
        fetch(`https://api.github.com/users/${username}/repos`)
            .then(response => response.json())
            .then(repos => {
                displayRepos(repos);
            })
            .catch(error => console.error('Error:', error));
    }
});
