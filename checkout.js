// Checkout Page Logic
if (window.location.pathname.includes("checkout.html")) {
    const cart = getCart();

    if (cart.length === 0) {
        $('#order-summary').html('<p>Your cart is empty.</p>');
        $('#checkout-form').hide();
    } else {
        let summaryHTML = '';
        let subtotal = 0;
        cart.forEach(item => {
            const product = products.find(p => p.id === item.id);
            subtotal += product.price * item.qty;
            summaryHTML += `
                <p>${product.name} (x${item.qty}) - $${(product.price * item.qty).toFixed(2)}</p>
            `;
        });
        const tax = subtotal * 0.05;
        const shipping = subtotal > 0 ? 5 : 0;
        const total = subtotal + tax + shipping;

        summaryHTML += `<p>Subtotal: $${subtotal.toFixed(2)}</p>`;
        summaryHTML += `<p>Tax: $${tax.toFixed(2)}</p>`;
        summaryHTML += `<p>Shipping: $${shipping.toFixed(2)}</p>`;
        summaryHTML += `<h4>Total: $${total.toFixed(2)}</h4>`;

        $('#order-summary').html(summaryHTML);
    }

    $('#checkout-form').submit(function(e){
        e.preventDefault();
        alert('Order confirmed! Thank you for shopping.');
        localStorage.removeItem('cart');
        window.location.href = "index.html";
    });
}

// // logout functionality
//   const allowed = window.location.pathname.includes("login.html");
//   const isLoggedIn = localStorage.getItem("user");

//   if (!isLoggedIn && !allowed) {
//     window.location.href = "login.html";
//   }
