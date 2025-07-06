// Shared: Load products to specific containers
function renderProducts(containerId, filteredProducts) {
    const container = $(containerId);
    container.html('');

    filteredProducts.forEach(product => {
        let productHTML = `
            <div class="product-card">
                <img src="${product.image}" alt="${product.name}">
                <h3>${product.name}</h3>
                <p>$${product.price.toFixed(2)}</p>
                <a href="product.html?id=${product.id}" class="btn">View Details</a>
            </div>
        `;
        container.append(productHTML);
    });

    if (filteredProducts.length === 0) {
        container.html('<p>No products found.</p>');
    }
}

$(document).ready(function(){

    // Load Featured products on index.html
    if ($('#featured-products').length) {
        renderProducts('#featured-products', products);
    }

    // Load all products on shop.html
    if ($('#shop-products').length) {
        renderProducts('#shop-products', products);

        $('#searchInput').on('input', function() {
            applyFilters();
        });

        $('.category-filter').on('change', function() {
            applyFilters();
        });

        function applyFilters() {
            let searchValue = $('#searchInput').val().toLowerCase();
            let selectedCategories = $('.category-filter:checked').map(function(){
                return this.value;
            }).get();

            let filtered = products.filter(product => {
                let matchesSearch = product.name.toLowerCase().includes(searchValue);
                let matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(product.category);
                return matchesSearch && matchesCategory;
            });

            renderProducts('#shop-products', filtered);
        }
    }
});

// login functionality
//   const allowed = window.location.pathname.includes("login.html");
//   const isLoggedIn = localStorage.getItem("user");

//   if (!isLoggedIn && !allowed) {
//     window.location.href = "login.html";
//   }