
//  addToCart function to handle adding items to the cart

$(document).ready(function () {
  if (window.location.pathname.includes("product.html")) {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = parseInt(urlParams.get('id'));
    const product = products.find(p => p.id === productId);

    if (product) {
      $('#productImage').attr('src', product.image);
      $('#productName').text(product.name);
      $('#productPrice').text(`$${product.price.toFixed(2)}`);
      let stars = "";
      for (let i = 0; i < 5; i++) {
        stars += i < product.rating ? '<i class="fas fa-star text-warning"></i>' : '<i class="far fa-star"></i>';
      }
      $('#productRating').html(stars);
    }

    $('#addToCart').click(function () {
      const qty = parseInt($('#quantity').val());
      addToCart(productId, qty);
      // alert("Added to cart!");
        Swal.fire({
        title: "Added to cart!",
        icon: "success",
        draggable: true
      });
    });

    $('#buyNow').click(function () {
      const qty = parseInt($('#quantity').val());
      addToCart(productId, qty);
      window.location.href = "checkout.html";
    });
  }
});


// login functionality
  // const allowed = window.location.pathname.includes("login.html");
  // const isLoggedIn = localStorage.getItem("user");

  // if (!isLoggedIn && !allowed) {
  //   window.location.href = "login.html";
  // }

