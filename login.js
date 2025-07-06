// AUTH: Signup & Login Logic
if (window.location.pathname.includes("login.html")) {

    // Get stored users
    function getUsers() {
        return JSON.parse(localStorage.getItem('users')) || [];
    }

    // Save users to localStorage
    function saveUsers(users) {
        localStorage.setItem('users', JSON.stringify(users));
    }

    // Signup Form
    $('#signup-form').submit(function(e){
        e.preventDefault();
        const name = $('#signupName').val();
        const email = $('#signupEmail').val();
        const password = $('#signupPassword').val();
        const confirm = $('#signupConfirm').val();

        if (password !== confirm) {
            alert("Passwords do not match!");
            return;
        }

        let users = getUsers();
        if (users.find(u => u.email === email)) {
            // alert("User already exists!");
             Swal.fire("User already exists!..!");
            return;
        }

        users.push({ name, email, password });
        saveUsers(users);
        Swal.fire({
        title: "Congratulations",
        text: "Registration Successfull.!",
        icon: "success"
        });
      $('#signup-form')[0].reset();
         });

    // // Login Form
    $('#login-form').submit(function(e){
        e.preventDefault();
        const email = $('#loginEmail').val();
        const password = $('#loginPassword').val();

        let users = getUsers();
        let user = users.find(u => u.email === email && u.password === password);

        if (user) {
           
            // alert(`Welcome ${user.name}! You are logged in.`);
            const Toast = Swal.mixin({
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            didOpen: (toast) => {
                toast.onmouseenter = Swal.stopTimer;
                toast.onmouseleave = Swal.resumeTimer;
            }
            });
            Toast.fire({
            icon: "success",
            title: `Signed in successfully ${user.name}!`
            });
            setTimeout(() => {
                            window.location.href = "index.html";
                        }, timeout = 2000);
                    
                    } else {
                        Swal.fire("Invalid Id Password..!");
                    }
                });
            }

// document.getElementById("#login-Form").addEventListener("submit", function (e) {
//     e.preventDefault();

//     const email = document.getElementById("#loginEmail").value;
//     const password = document.getElementById("#loginPassword").value;

//     // Simple validation for demo
//     if (email.trim() && password.trim()) {
//       // Save user to localStorage
//       const user = { email: email };
//       localStorage.setItem("user", JSON.stringify(user));

//       // ✅ Redirect to homepage after login
//       window.location.href = "index.html";
//     } else {
//       alert("Please enter both email and password");
//     }
//   });
