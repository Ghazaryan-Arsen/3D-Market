const API_URL = 'http://localhost:5000/api';

async function fetchModels() {
    const token = localStorage.getItem('token');
    const headers = {};
    if (token) {
        headers['x-auth-token'] = token;
    }

    try {
        const response = await fetch(`${API_URL}/models`, { headers });
        if (!response.ok) {
            console.error('Failed to fetch models, status:', response.status);
            return [];
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching models:', error);
        return [];
    }
}

function handlePurchase() {
    const buyNowButton = document.getElementById('buy-now-button');
    if (buyNowButton) {
        buyNowButton.addEventListener('click', async () => {
            const params = new URLSearchParams(window.location.search);
            const modelId = params.get('id');
            const token = localStorage.getItem('token');

            if (!token) {
                alert('You must be logged in to purchase a model.');
                return;
            }

            if (!modelId) {
                alert('Could not find model ID.');
                return;
            }

            try {
                const response = await fetch(`${API_URL}/purchase`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-auth-token': token
                    },
                    body: JSON.stringify({ modelId })
                });

                if (response.ok) {
                    alert('Purchase successful!');
                } else {
                    const errorData = await response.json();
                    alert(`Purchase failed: ${errorData.message || 'Server error'}`);
                }
            } catch (error) {
                console.error('Error during purchase:', error);
                alert('An error occurred during the purchase process.');
            }
        });
    }
}

async function fetchUsers() {
    try {
        const response = await fetch(`${API_URL}/users`);
        return await response.json();
    } catch (error) {
        console.error('Error fetching users:', error);
        return [];
    }
}

async function fetchUser(id) {
    try {
        const response = await fetch(`${API_URL}/users/${id}`);
        return await response.json();
    } catch (error) {
        console.error('Error fetching user:', error);
        return null;
    }
}

async function renderFeaturedModels() {
    const modelGrid = document.querySelector('.mb-16 .grid');
    if (modelGrid) {
        const models = await fetchModels();
        models.forEach(model => {
            const modelCard = document.createElement('div');
            modelCard.className = 'bg-brand-surface rounded-lg overflow-hidden';
            modelCard.innerHTML = `
                <img src="https://via.placeholder.com/600x400.png?text=${model.name}" alt="${model.name}" class="w-full h-64 object-cover">
                <div class="p-6">
                    <h3 class="text-xl font-bold">${model.name}</h3>
                    <p class="text-gray-400">${model.user ? model.user.name : 'Unknown Artist'}</p>
                    <p class="text-lg font-bold mt-4">$${model.price}</p>
                </div>
            `;
            modelGrid.appendChild(modelCard);
        });
    }
}

async function renderTrendingArtists() {
    const artistGrid = document.querySelectorAll('.mb-16 .grid')[1];
    if (artistGrid) {
        const users = await fetchUsers();
        users.forEach(user => {
            const artistCard = document.createElement('div');
            artistCard.className = 'bg-brand-surface rounded-lg p-6 text-center';
            artistCard.innerHTML = `
                <img src="https://via.placeholder.com/150.png?text=${user.name}" alt="${user.name}" class="w-24 h-24 rounded-full mx-auto mb-4">
                <h3 class="text-xl font-bold">${user.name}</h3>
                <p class="text-gray-400">${user.bio || 'No bio available'}</p>
            `;
            artistGrid.appendChild(artistCard);
        });
    }
}

async function renderMarketplaceModels(filteredModels) {
    const modelGrid = document.getElementById('model-grid');
    if (modelGrid) {
        const models = filteredModels || await fetchModels();
        modelGrid.innerHTML = ''; // Clear existing models
        models.forEach(model => {
            const modelCard = document.createElement('div');
            modelCard.className = 'bg-brand-surface rounded-lg overflow-hidden';
            modelCard.innerHTML = `
                <a href="product.html?id=${model._id}">
                    <img src="https://via.placeholder.com/600x400.png?text=${model.name}" alt="${model.name}" class="w-full h-64 object-cover">
                    <div class="p-6">
                        <h3 class="text-xl font-bold">${model.name}</h3>
                        <p class="text-gray-400">${model.user ? model.user.name : 'Unknown Artist'}</p>
                        <p class="text-lg font-bold mt-4">$${model.price}</p>
                    </div>
                </a>
            `;
            modelGrid.appendChild(modelCard);
        });
    }
}

async function setupFilters() {
    const categoryFilter = document.getElementById('category-filter');
    const fileTypeFilter = document.getElementById('file-type-filter');
    const priceFilter = document.getElementById('price-filter');
    const priceValue = document.getElementById('price-value');
    const sortByFilter = document.getElementById('sort-by-filter');

    if (categoryFilter) {
        const models = await fetchModels();
        const applyFilters = () => {
            let filteredModels = [...models];

            // Category filter
            if (categoryFilter.value !== 'all') {
                filteredModels = filteredModels.filter(model => model.category.toLowerCase() === categoryFilter.value);
            }

            // File type filter
            if (fileTypeFilter.value !== 'all') {
                filteredModels = filteredModels.filter(model => model.files.some(f => f.toLowerCase().endsWith(fileTypeFilter.value)));
            }

            // Price filter
            filteredModels = filteredModels.filter(model => model.price <= priceFilter.value);
            priceValue.textContent = `$${priceFilter.value}`;

            // Sort by filter
            switch (sortByFilter.value) {
                case 'price-asc':
                    filteredModels.sort((a, b) => a.price - b.price);
                    break;
                case 'price-desc':
                    filteredModels.sort((a, b) => b.price - a.price);
                    break;
            }

            renderMarketplaceModels(filteredModels);
        };

        categoryFilter.addEventListener('change', applyFilters);
        fileTypeFilter.addEventListener('change', applyFilters);
        priceFilter.addEventListener('input', applyFilters);
        sortByFilter.addEventListener('change', applyFilters);
    }
}

async function renderProductPage() {
    const params = new URLSearchParams(window.location.search);
    const modelId = params.get('id');

    if (modelId) {
        const response = await fetch(`${API_URL}/models/${modelId}`);
        const model = await response.json();

        const seller = await fetchUser(model.user);

        if (model && seller) {
            // Populate model details
            document.getElementById('model-name').textContent = model.name;
            document.getElementById('model-price').textContent = `$${model.price}`;
            document.getElementById('model-description').textContent = model.description;

            // Populate seller details
            document.getElementById('seller-name').textContent = seller.name;
            document.getElementById('seller-avatar').src = `https://via.placeholder.com/150.png?text=${seller.name}`;
            document.getElementById('seller-avatar').alt = seller.name;

            // Populate main model viewer image
            document.getElementById('main-model-image').src = `https://via.placeholder.com/600x400.png?text=${model.name}`;
            document.getElementById('main-model-image').alt = model.name;
        }
    }
}

function handleUploadForm() {
    const uploadForm = document.getElementById('upload-form');
    if (uploadForm) {
        uploadForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const token = localStorage.getItem('token');
            if (!token) {
                alert('You must be logged in to upload a model.');
                return;
            }

            const formData = new FormData(uploadForm);
            const data = {
                name: formData.get('name'),
                description: formData.get('description'),
                price: parseFloat(formData.get('price')),
                category: formData.get('category'),
                tags: formData.get('tags').split(',').map(tag => tag.trim()),
                // Since this is a prototype, we send placeholder file names
                files: ['model.fbx', 'texture.png']
            };

            try {
                const response = await fetch(`${API_URL}/models`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-auth-token': token
                    },
                    body: JSON.stringify(data)
                });

                if (response.ok) {
                    alert('Model uploaded successfully!');
                    uploadForm.reset();
                } else {
                    const errorData = await response.json();
                    alert(`Upload failed: ${errorData.errors ? errorData.errors[0].msg : 'Server error'}`);
                }
            } catch (error) {
                console.error('Error uploading model:', error);
                alert('An error occurred while uploading the model.');
            }
        });
    }
}

async function renderUserProfile() {
    const token = localStorage.getItem('token');
    if (token) {
        const response = await fetch(`${API_URL}/auth/me`, {
            headers: { 'x-auth-token': token }
        });
        const user = await response.json();

        if (user) {
            // Populate user info
            document.getElementById('user-avatar').src = `https://via.placeholder.com/150.png?text=${user.name}`;
            document.getElementById('user-name').textContent = user.name;
            document.getElementById('user-email').textContent = user.email;
            document.getElementById('user-bio').textContent = user.bio || 'No bio available';
        }
    }
}

async function renderAdminDashboard() {
    const pageTitle = document.querySelector('title');
    if (pageTitle && pageTitle.textContent.includes('Admin')) {
        const token = localStorage.getItem('token');
        if (token) {
            const response = await fetch(`${API_URL}/admin/stats`, {
                headers: { 'x-auth-token': token }
            });
            const stats = await response.json();

            // Populate overview cards
            document.getElementById('total-sales').textContent = stats.totalSales;
            document.getElementById('total-users').textContent = stats.totalUsers;
            document.getElementById('uploaded-models').textContent = stats.totalModels;
            document.getElementById('platform-revenue').textContent = `$${stats.totalRevenue.toLocaleString()}`;

            // Fetch and populate users table
            const usersResponse = await fetch(`${API_URL}/admin/users`, {
                headers: { 'x-auth-token': token }
            });
            const users = await usersResponse.json();
            const usersTableBody = document.getElementById('users-table-body');
            if (usersTableBody) {
                users.forEach(user => {
                    const row = document.createElement('tr');
                    row.className = 'border-b border-gray-700';
                    row.innerHTML = `
                        <td class="p-4">${user.name}</td>
                        <td class="p-4">${user.email}</td>
                        <td class="p-4">${user.sales || 0}</td>
                        <td class="p-4">
                            <button data-user-id="${user._id}" class="text-red-500 hover:underline delete-user-button">Delete</button>
                        </td>
                    `;
                    usersTableBody.appendChild(row);
                });

                // Add event listeners for the new delete buttons
                document.querySelectorAll('.delete-user-button').forEach(button => {
                    button.addEventListener('click', async (e) => {
                        const userId = e.target.getAttribute('data-user-id');
                        if (confirm('Are you sure you want to delete this user?')) {
                            const token = localStorage.getItem('token');
                            const response = await fetch(`${API_URL}/admin/users/${userId}`, {
                                method: 'DELETE',
                                headers: { 'x-auth-token': token }
                            });

                            if (response.ok) {
                                alert('User deleted successfully.');
                                renderAdminDashboard(); // Refresh the dashboard
                            } else {
                                alert('Failed to delete user.');
                            }
                        }
                    });
                });
            }

            // Fetch and populate models table
            const modelsResponse = await fetch(`${API_URL}/admin/models`, {
                headers: { 'x-auth-token': token }
            });
            const models = await modelsResponse.json();
            const modelsTableBody = document.getElementById('models-table-body');
            if (modelsTableBody) {
                models.forEach(model => {
                    const row = document.createElement('tr');
                    row.className = 'border-b border-gray-700';
                    row.innerHTML = `
                        <td class="p-4">${model.name}</td>
                        <td class="p-4">${model.user.name}</td>
                        <td class="p-4">$${model.price}</td>
                        <td class="p-4">
                            <button data-model-id="${model._id}" class="text-red-500 hover:underline delete-model-button">Remove</button>
                        </td>
                    `;
                    modelsTableBody.appendChild(row);
                });

                // Add event listeners for the new delete buttons
                document.querySelectorAll('.delete-model-button').forEach(button => {
                    button.addEventListener('click', async (e) => {
                        const modelId = e.target.getAttribute('data-model-id');
                        if (confirm('Are you sure you want to remove this model?')) {
                            const token = localStorage.getItem('token');
                            const response = await fetch(`${API_URL}/admin/models/${modelId}`, {
                                method: 'DELETE',
                                headers: { 'x-auth-token': token }
                            });

                            if (response.ok) {
                                alert('Model removed successfully.');
                                renderAdminDashboard(); // Refresh the dashboard
                            } else {
                                alert('Failed to remove model.');
                            }
                        }
                    });
                });
            }
        }
    }
}

function handleLoginForm() {
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            const response = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();
            if (data.token) {
                localStorage.setItem('token', data.token);
                // Visually confirm login by hiding the form and showing content
                loginForm.style.display = 'none';
                // Re-render the models now that the user is authenticated
                renderMarketplaceModels();
            } else {
                alert('Invalid credentials');
            }
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    console.log('3D Market Platform initialized.');

    const pageTitle = document.querySelector('title').textContent;

    if (pageTitle.includes('3D Market Platform')) {
        renderFeaturedModels();
        renderTrendingArtists();
    } else if (pageTitle.includes('Marketplace')) {
        setupFilters();
        handleLoginForm();
    } else if (pageTitle.includes('Product')) {
        renderProductPage();
        handlePurchase();
    } else if (pageTitle.includes('Upload')) {
        handleUploadForm();
    } else if (pageTitle.includes('Profile')) {
        renderUserProfile();
    } else if (pageTitle.includes('Admin')) {
        renderAdminDashboard();
    }
});
