// Mock data for the 3D models
const models = [
    {
        id: 1,
        name: 'Sci-Fi Helmet',
        price: 49.99,
        image: 'https://via.placeholder.com/600x400.png?text=Sci-Fi+Helmet',
        artist: 'Alex Volkov',
        rating: 4.8,
        category: 'Sci-Fi',
        fileType: 'FBX',
    },
    {
        id: 2,
        name: 'Medieval Castle',
        price: 99.99,
        image: 'https://via.placeholder.com/600x400.png?text=Medieval+Castle',
        artist: 'Isabelle Chen',
        rating: 4.9,
        category: 'Architecture',
        fileType: 'OBJ',
    },
    {
        id: 3,
        name: 'Dragon Figurine',
        price: 79.99,
        image: 'https://via.placeholder.com/600x400.png?text=Dragon+Figurine',
        artist: 'David Lee',
        rating: 4.7,
        category: 'Fantasy',
        fileType: 'STL',
    },
];

// Mock data for user profiles
const users = [
    {
        id: 1,
        name: 'Alex Volkov',
        avatar: 'https://via.placeholder.com/150.png?text=Alex+Volkov',
        email: 'alex.volkov@example.com',
        bio: '3D artist specializing in sci-fi and hard-surface modeling.',
        uploadedModels: [1],
        sales: 125,
        earnings: 5468.75,
    },
    {
        id: 2,
        name: 'Isabelle Chen',
        avatar: 'https://via.placeholder.com/150.png?text=Isabelle+Chen',
        email: 'isabelle.chen@example.com',
        bio: 'Concept artist and 3D sculptor with a passion for fantasy creatures.',
        uploadedModels: [2],
        sales: 210,
        earnings: 10498.80,
    }
];

// Mock data for admin dashboard
const adminStats = {
    totalSales: 335,
    totalUsers: 2,
    uploadedModels: 3,
    platformRevenue: 15967.55,
};

function renderFeaturedModels() {
    const modelGrid = document.querySelector('.mb-16 .grid');
    if (modelGrid) {
        models.forEach(model => {
            const modelCard = document.createElement('div');
            modelCard.className = 'bg-brand-surface rounded-lg overflow-hidden';
            modelCard.innerHTML = `
                <img src="${model.image}" alt="${model.name}" class="w-full h-64 object-cover">
                <div class="p-6">
                    <h3 class="text-xl font-bold">${model.name}</h3>
                    <p class="text-gray-400">${model.artist}</p>
                    <p class="text-lg font-bold mt-4">$${model.price}</p>
                </div>
            `;
            modelGrid.appendChild(modelCard);
        });
    }
}

function renderTrendingArtists() {
    const artistGrid = document.querySelectorAll('.mb-16 .grid')[1];
    if (artistGrid) {
        users.forEach(user => {
            const artistCard = document.createElement('div');
            artistCard.className = 'bg-brand-surface rounded-lg p-6 text-center';
            artistCard.innerHTML = `
                <img src="${user.avatar}" alt="${user.name}" class="w-24 h-24 rounded-full mx-auto mb-4">
                <h3 class="text-xl font-bold">${user.name}</h3>
                <p class="text-gray-400">${user.bio}</p>
            `;
            artistGrid.appendChild(artistCard);
        });
    }
}

function renderMarketplaceModels(filteredModels = models) {
    const modelGrid = document.querySelector('.w-3\\/4 .grid');
    if (modelGrid) {
        modelGrid.innerHTML = ''; // Clear existing models
        filteredModels.forEach(model => {
            const modelCard = document.createElement('div');
            modelCard.className = 'bg-brand-surface rounded-lg overflow-hidden';
            modelCard.innerHTML = `
                <a href="product.html?id=${model.id}">
                    <img src="${model.image}" alt="${model.name}" class="w-full h-64 object-cover">
                    <div class="p-6">
                        <h3 class="text-xl font-bold">${model.name}</h3>
                        <p class="text-gray-400">${model.artist}</p>
                        <p class="text-lg font-bold mt-4">$${model.price}</p>
                    </div>
                </a>
            `;
            modelGrid.appendChild(modelCard);
        });
    }
}

function setupFilters() {
    const categoryFilter = document.getElementById('category-filter');
    const fileTypeFilter = document.getElementById('file-type-filter');
    const priceFilter = document.getElementById('price-filter');
    const priceValue = document.getElementById('price-value');
    const sortByFilter = document.getElementById('sort-by-filter');

    if (categoryFilter) {
        const applyFilters = () => {
            let filteredModels = [...models];

            // Category filter
            if (categoryFilter.value !== 'all') {
                filteredModels = filteredModels.filter(model => model.category.toLowerCase() === categoryFilter.value);
            }

            // File type filter
            if (fileTypeFilter.value !== 'all') {
                filteredModels = filteredModels.filter(model => model.fileType.toLowerCase() === fileTypeFilter.value);
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
                // Add more sorting options here, e.g., popularity, newest
            }

            renderMarketplaceModels(filteredModels);
        };

        categoryFilter.addEventListener('change', applyFilters);
        fileTypeFilter.addEventListener('change', applyFilters);
        priceFilter.addEventListener('input', applyFilters);
        sortByFilter.addEventListener('change', applyFilters);
    }
}

function renderProductPage() {
    const params = new URLSearchParams(window.location.search);
    const modelId = parseInt(params.get('id'), 10);

    if (modelId) {
        const model = models.find(m => m.id === modelId);
        const seller = users.find(u => u.name === model.artist);

        if (model && seller) {
            // Populate model details
            document.getElementById('model-name').textContent = model.name;
            document.getElementById('model-price').textContent = `$${model.price}`;
            document.getElementById('model-description').textContent = `A detailed ${model.name} model, perfect for your next project. Category: ${model.category}. File Type: ${model.fileType}.`;

            // Populate seller details
            document.getElementById('seller-name').textContent = seller.name;
            document.getElementById('seller-avatar').src = seller.avatar;
            document.getElementById('seller-avatar').alt = seller.name;

            // Populate main model viewer image
            document.getElementById('main-model-image').src = model.image;
            document.getElementById('main-model-image').alt = model.name;

            // Render related models
            const relatedModels = models.filter(m => m.category === model.category && m.id !== model.id);
            const relatedGrid = document.querySelector('.mt-16 .grid');
            if (relatedGrid) {
                relatedGrid.innerHTML = '';
                relatedModels.forEach(relatedModel => {
                    const modelCard = document.createElement('div');
                    modelCard.className = 'bg-brand-surface rounded-lg overflow-hidden';
                    modelCard.innerHTML = `
                        <a href="product.html?id=${relatedModel.id}">
                            <img src="${relatedModel.image}" alt="${relatedModel.name}" class="w-full h-64 object-cover">
                            <div class="p-6">
                                <h3 class="text-xl font-bold">${relatedModel.name}</h3>
                                <p class="text-gray-400">${relatedModel.artist}</p>
                                <p class="text-lg font-bold mt-4">$${relatedModel.price}</p>
                            </div>
                        </a>
                    `;
                    relatedGrid.appendChild(modelCard);
                });
            }
        }
    }
}

function renderUserProfile() {
    // For the prototype, we'll just display the first user's profile.
    const user = users[0];

    if (user) {
        // Populate user info
        document.getElementById('user-avatar').src = user.avatar;
        document.getElementById('user-name').textContent = user.name;
        document.getElementById('user-email').textContent = user.email;
        document.getElementById('user-bio').textContent = user.bio;

        // Populate sales stats
        document.getElementById('total-sales').textContent = user.sales;
        document.getElementById('total-earnings').textContent = `$${user.earnings.toLocaleString()}`;

        // Populate uploaded models
        const uploadedModelsGrid = document.querySelector('section:last-of-type .grid');
        if (uploadedModelsGrid) {
            const userModels = models.filter(model => user.uploadedModels.includes(model.id));
            userModels.forEach(model => {
                const modelCard = document.createElement('div');
                modelCard.className = 'bg-brand-surface rounded-lg overflow-hidden';
                modelCard.innerHTML = `
                    <a href="product.html?id=${model.id}">
                        <img src="${model.image}" alt="${model.name}" class="w-full h-64 object-cover">
                        <div class="p-6">
                            <h3 class="text-xl font-bold">${model.name}</h3>
                            <p class="text-lg font-bold mt-4">$${model.price}</p>
                        </div>
                    </a>
                `;
                uploadedModelsGrid.appendChild(modelCard);
            });
        }
    }
}


function renderAdminDashboard() {
    const pageTitle = document.querySelector('title');
    if (pageTitle && pageTitle.textContent.includes('Admin')) {
        // Populate overview cards
        document.getElementById('total-sales').textContent = adminStats.totalSales;
        document.getElementById('total-users').textContent = adminStats.totalUsers;
        document.getElementById('uploaded-models').textContent = adminStats.uploadedModels;
        document.getElementById('platform-revenue').textContent = `$${adminStats.platformRevenue.toLocaleString()}`;

        // Populate users table
        const usersTableBody = document.getElementById('users-table-body');
        if (usersTableBody) {
            users.forEach(user => {
                const row = document.createElement('tr');
                row.className = 'border-b border-gray-700';
                row.innerHTML = `
                    <td class="p-4">${user.name}</td>
                    <td class="p-4">${user.email}</td>
                    <td class="p-4">${user.sales}</td>
                    <td class="p-4">
                        <button class="text-blue-500 hover:underline mr-4">View</button>
                        <button class="text-red-500 hover:underline">Delete</button>
                    </td>
                `;
                usersTableBody.appendChild(row);
            });
        }

        // Populate models table
        const modelsTableBody = document.getElementById('models-table-body');
        if (modelsTableBody) {
            models.forEach(model => {
                const row = document.createElement('tr');
                row.className = 'border-b border-gray-700';
                row.innerHTML = `
                    <td class="p-4">${model.name}</td>
                    <td class="p-4">${model.artist}</td>
                    <td class="p-4">$${model.price}</td>
                    <td class="p-4">
                        <button class="text-green-500 hover:underline mr-4">Approve</button>
                        <button class="text-yellow-500 hover:underline mr-4">Reject</button>
                        <button class="text-red-500 hover:underline">Remove</button>
                    </td>
                `;
                modelsTableBody.appendChild(row);
            });
        }
    }
}


function handleUploadForm() {
    const uploadForm = document.getElementById('upload-form');
    if (uploadForm) {
        uploadForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const modelName = document.getElementById('model-name').value;
            if (modelName) {
                alert(`"${modelName}" has been successfully submitted for review!`);
                uploadForm.reset();
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
        renderMarketplaceModels();
        setupFilters();
    } else if (pageTitle.includes('Product')) {
        renderProductPage();
    } else if (pageTitle.includes('Upload')) {
        handleUploadForm();
    } else if (pageTitle.includes('Profile')) {
        renderUserProfile();
    } else if (pageTitle.includes('Admin')) {
        renderAdminDashboard();
    }
});
