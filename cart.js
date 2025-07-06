// ========== CART FUNCTIONS ==========
function getCart() {
    return JSON.parse(localStorage.getItem('cart')) || [];
}

function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function addToCart(productId, quantity = 1) {
    let cart = getCart();
    const existing = cart.find(item => item.id === productId);
    if (existing) {
        existing.qty += quantity;
    } else {
        cart.push({ id: productId, qty: quantity });
    }
    saveCart(cart);
}

function removeFromCart(productId) {
    let cart = getCart();
    cart = cart.filter(item => item.id !== productId);
    saveCart(cart);
}

function updateCartQty(productId, qty) {
    let cart = getCart();
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.qty = qty;
    }
    saveCart(cart);
}

// Hook add to cart button (Product Detail)
if ($('#addToCart').length) {
    $('#addToCart').click(function() {
        const urlParams = new URLSearchParams(window.location.search);
        const productId = parseInt(urlParams.get('id'));
        const qty = parseInt($('#quantity').val());
        addToCart(productId, qty);
        alert('Product added to cart!');
    });
}

// Render Cart Page
if (window.location.pathname.includes("cart.html")) {
    const cart = getCart();
    const container = $('#cart-items');
    container.html('');

    if (cart.length === 0) {
        container.html('<p>Your cart is empty.</p>');
    } else {
        cart.forEach(item => {
            const product = products.find(p => p.id === item.id);
            let html = `
            <div class="cart-item">
                <img src="${product.image}" alt="${product.name}">
                <div class="info">
                    <h3>${product.name}</h3>
                    <p>Price: $${product.price.toFixed(2)}</p>
                    <label>Qty:</label>
                    <input type="number" min="1" value="${item.qty}" data-id="${item.id}" class="qty-input">
                    <button class="remove-btn" data-id="${item.id}">Remove</button>
                </div>
            </div>
            `;
            container.append(html);
        });

        calculateTotals();
    }

    // Handle quantity change
    $(document).on('change', '.qty-input', function() {
        const id = parseInt($(this).data('id'));
        const qty = parseInt($(this).val());
        updateCartQty(id, qty);
        calculateTotals();
    });

    // Handle remove item
    $(document).on('click', '.remove-btn', function() {
        const id = parseInt($(this).data('id'));
        removeFromCart(id);
        location.reload();
    });

    // Calculate totals
    function calculateTotals() {
        const cart = getCart();
        let subtotal = 0;
        cart.forEach(item => {
            const product = products.find(p => p.id === item.id);
            subtotal += product.price * item.qty;
        });
        const tax = subtotal * 0.05;
        const shipping = subtotal > 0 ? 5 : 0;
        const total = subtotal + tax + shipping;

        $('#subtotal').text(subtotal.toFixed(2));
        $('#tax').text(tax.toFixed(2));
        $('#shipping').text(shipping.toFixed(2));
        $('#total').text(total.toFixed(2));
    }
}

// //  login/logout functionality
// if (window.location.pathname.includes("index.html") || window.location.pathname.includes("cart.html")) {
//     const user = JSON.parse(localStorage.getItem('user'));
//     if (user) {
//         $('#userGreeting').text(`Welcome, ${user.email}`);
//         $('#logoutBtn').show();
//     } else {
//         $('#userGreeting').text('Welcome, Guest');
//         $('#logoutBtn').hide();
//     }

//     $('#logoutBtn').click(function() {
//         localStorage.removeItem('user');
//         location.reload();
//     });
// }

//  login functionality
//   const allowed = window.location.pathname.includes("login.html");
//   const isLoggedIn = localStorage.getItem("user");

//   if (!isLoggedIn && !allowed) {
//     window.location.href = "login.html";
//   }