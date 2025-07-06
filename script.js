// Shared Render Function for Product Cards
function renderProducts(containerId, productsList) {
  const container = $(containerId);
  container.empty();

  if (productsList.length === 0) {
    container.html('<p class="text-center">No products found.</p>');
  } else {
    productsList.forEach(product => {
      const productHTML = `
  <div class="col-sm-6 col-md-4 col-lg-3">
    <div class="card shadow-sm h-100">
      <div class="product-image-wrapper">
        <img src="${product.image}" class="product-image" alt="${product.name}">
      </div>
      <div class="card-body d-flex flex-column justify-content-between">
        <h5 class="card-title text-center">${product.name}</h5>
        <p class="text-success fw-bold text-center">$${product.price.toFixed(2)}</p>
        <a href="product.html?id=${product.id}" class="btn btn-warning w-100 mt-2">View Details</a>
      </div>
    </div>
  </div>`;
container.append(productHTML);

    });
  }
}
if ($("#featured-products").length) {
  const featured = products.slice(0, 4); // load first 4 products
  renderProducts("#featured-products", featured);
}


// Featured Products (index.html)
$(document).ready(function () {
  if ($("#featured-products").length) {
    renderProducts("#featured-products", products);
  }
});

// Shop Page Filtering Logic
// Shop Page Filtering Logic - FULLY WORKING VERSION
$(document).ready(function () {
  if ($("#shop-products").length) {
    renderProducts("#shop-products", products);

    // Bind filtering when input or checkbox changes
    $("#searchInput, .category-filter").on("input change", function () {
      applyFilters();
    });

    function applyFilters() {
  const searchTerm = $("#searchInput").val().toLowerCase();
  const selectedCategories = $(".category-filter:checked").map(function () {
    return $(this).val();
  }).get();

  const minPrice = parseFloat($("#minPrice").val()) || 0;
  const maxPrice = parseFloat($("#maxPrice").val()) || Number.MAX_VALUE;

  const filteredProducts = products.filter(product => {
    const matchesName = product.name.toLowerCase().includes(searchTerm);
    const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(product.category);
    const matchesPrice = product.price >= minPrice && product.price <= maxPrice;
    return matchesName && matchesCategory && matchesPrice;
  });

      renderProducts("#shop-products", filteredProducts);
    }
  }
});


// Product Detail Page Logic
// $(document).ready(function () {
//   if (window.location.pathname.includes("product.html")) {
//     const urlParams = new URLSearchParams(window.location.search);
//     const productId = parseInt(urlParams.get('id'));
//     const product = products.find(p => p.id === productId);

//     if (product) {
//       $('#productImage').attr('src', product.image);
//       $('#productName').text(product.name);
//       $('#productPrice').text(`$${product.price.toFixed(2)}`);

//       let stars = "";
//       for (let i = 0; i < 5; i++) {
//         stars += i < product.rating ? '<i class="fas fa-star text-warning"></i>' : '<i class="far fa-star"></i>';
//       }
//       $('#productRating').html(stars);
//     }

//     $('#addToCart').click(function () {
//       const qty = parseInt($('#quantity').val());
//       addToCart(productId, qty);
//       alert("Added to cart!");
//     });
//   }
// });

// LocalStorage Cart Logic
function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}

function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function addToCart(id, qty) {
  let cart = getCart();
  let existing = cart.find(item => item.id === id);
  if (existing) {
    existing.qty += qty;
  } else {
    cart.push({ id: id, qty: qty });
  }
  saveCart(cart);
  updateCartCount();
}

function removeFromCart(id) {
  let cart = getCart();
  cart = cart.filter(item => item.id !== id);
  saveCart(cart);
  updateCartCount();
}

function updateQty(id, qty) {
  let cart = getCart();
  const item = cart.find(item => item.id === id);
  if (item) {
    item.qty = qty;
  }
  saveCart(cart);
  updateCartCount();
}

function updateCartCount() {
  const cart = getCart();
  let totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
  $("#cart-count").text(totalQty);
}

// Load Cart Quantity Globally
$(document).ready(updateCartCount);

// Render Cart Page
$(document).ready(function () {
  if (window.location.pathname.includes("cart.html")) {
    const cart = getCart();
    const container = $("#cart-items");
    container.empty();

    if (cart.length === 0) {
      container.html('<p>Your cart is empty.</p>');
    } else {
      cart.forEach(item => {
        const product = products.find(p => p.id === item.id);
        const html = `
          <div class="row align-items-center mb-4">
            <div class="col-md-2"><img src="${product.image}" class="img-fluid rounded"></div>
            <div class="col-md-4 fw-bold">${product.name}</div>
            <div class="col-md-2">$${product.price.toFixed(2)}</div>
            <div class="col-md-2">
              <input type="number" class="form-control qty-input" data-id="${item.id}" value="${item.qty}" min="1">
            </div>
            <div class="col-md-2">
              <button class="btn btn-danger remove-btn" data-id="${item.id}">Remove</button>
            </div>
          </div>`;
        container.append(html);
      });

      calculateTotals();
    }

    $(document).on("change", ".qty-input", function () {
      const id = parseInt($(this).data("id"));
      const qty = parseInt($(this).val());
      updateQty(id, qty);
      calculateTotals();
    });

    $(document).on("click", ".remove-btn", function () {
      const id = parseInt($(this).data("id"));
      removeFromCart(id);
      location.reload();
    });
  }
});

// Calculate Order Totals
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

  $("#subtotal").text(subtotal.toFixed(2));
  $("#tax").text(tax.toFixed(2));
  $("#shipping").text(shipping.toFixed(2));
  $("#total").text(total.toFixed(2));
}

// Checkout Logic
$(document).ready(function () {
  if (window.location.pathname.includes("checkout.html")) {
    const cart = getCart();
    const container = $("#order-summary");
    container.empty();

    if (cart.length === 0) {
      container.html("<p>Your cart is empty.</p>");
      $("#checkout-form").hide();
    } else {
      let summary = "";
      let subtotal = 0;
      cart.forEach(item => {
        const product = products.find(p => p.id === item.id);
        subtotal += product.price * item.qty;
        summary += `<p>${product.name} (x${item.qty}) — $${(product.price * item.qty).toFixed(2)}</p>`;
      });
      const tax = subtotal * 0.05;
      const shipping = 5;
      const total = subtotal + tax + shipping;

      summary += `<p>Subtotal: $${subtotal.toFixed(2)}</p>`;
      summary += `<p>Tax: $${tax.toFixed(2)}</p>`;
      summary += `<p>Shipping: $${shipping.toFixed(2)}</p>`;
      summary += `<h5>Total: $${total.toFixed(2)}</h5>`;
      container.html(summary);
    }

    $("#checkout-form").submit(function (e) {
      e.preventDefault();
      alert("Order placed successfully!");
      localStorage.removeItem("cart");
      window.location.href = "index.html";
    });
  }
});

// Newsletter form (optional small functionality)
$('#newsletter-form').submit(function (e) {
  e.preventDefault();
  alert("Thank you for subscribing!");
  $(this).trigger("reset");
});

// Authentication Logic (Login / Signup)
$(document).ready(function () {
  if (window.location.pathname.includes("login.html")) {
    function getUsers() {
      return JSON.parse(localStorage.getItem("users")) || [];
    }
    function saveUsers(users) {
      localStorage.setItem("users", JSON.stringify(users));
    }

    $("#signup-form").submit(function (e) {
      e.preventDefault();
      const name = $("#signupName").val();
      const email = $("#signupEmail").val();
      const password = $("#signupPassword").val();
      const confirm = $("#signupConfirm").val();

      if (password !== confirm) {
        alert("Passwords do not match.");
        return;
      }

      const users = getUsers();
      if (users.find(u => u.email === email)) {
        alert("User already exists.");
        return;
      }

      users.push({ name, email, password });
      saveUsers(users);
      alert("Signup successful! Please login.");
      $(this).trigger("reset");
    });

    $("#login-form").submit(function (e) {
      e.preventDefault();
      const email = $("#loginEmail").val();
      const password = $("#loginPassword").val();
      const users = getUsers();

      const user = users.find(u => u.email === email && u.password === password);
      if (user) {
        // alert(`Welcome, ${user.name}!`);
        window.location.href = "index.html";
      } else {
        // alert("Invalid credentials.");
      }
    });
  }
});

//  // Add to Cart Functionality`
function addToCart(id, qty) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  let existing = cart.find(item => item.id === id);
  if (existing) {
    existing.qty += qty;
  } else {
    cart.push({ id: id, qty: qty });
  }
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
}

// login functionality
  // const allowed = window.location.pathname.includes("login.html");
  // const isLoggedIn = localStorage.getItem("user");

  // if (!isLoggedIn && !allowed) {
  //   window.location.href = "login.html";
  // }