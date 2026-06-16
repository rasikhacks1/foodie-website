const userSection = document.getElementById("userSection");
const loginPage = document.getElementById("loginPage");
const closebtn = document.getElementById("closeBtn");
const loginbtn = document.getElementById("loginBtn");
const userName = document.getElementById("userName");
const logoutbtn = document.getElementById("logOutBtn");

const savedUser = localStorage.getItem("userName");

function showToast(message, type = "success") {

    const toast =
        document.getElementById("toast");

    toast.textContent = message;

    if (type === "error") {
        toast.style.color = "#dc3545";
        toast.style.borderLeft = "5px solid #dc3545";
    }
    else {
        toast.style.color = "#007168";
        toast.style.borderLeft = "5px solid #007168";
        toast.style.backdropFilter = "blur(5px)";
    }

    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, 3000);
}


if (savedUser) {
    userName.textContent = savedUser;
    logoutbtn.style.display = "block"
}

userSection.addEventListener("click", () => {
    if (localStorage.getItem("userName")) {
        return;


    }
    loginPage.style.display = "flex";
});

closebtn.addEventListener("click", () => {

    loginPage.style.display = "none";
});

loginbtn.addEventListener("click", () => {

    const name = document.getElementById("name").value.trim();
    const password = document.getElementById("password").value.trim();

    if (name === "" && password === "") {
        showToast("Please fill all details");
        return;
    }
    if (password === "1234") {
        localStorage.setItem("userName", name);
        userName.textContent = name;
        logoutbtn.style.display = "flex";
        loginPage.style.display = "none";
        document.getElementById("loginMessage").textContent = "";

    }
    else {
        document.getElementById("loginMessage").textContent = "Invalid Username or Password";
    }
});

logoutbtn.addEventListener("click", () => {
    localStorage.removeItem("userName");
    location.reload();
});

let cart = [];
const cartCount = document.getElementById("cart-count");

document.querySelectorAll(".add-cart").forEach(button => {
    button.addEventListener("click", () => {
        const item = {
            name: button.dataset.name,
            price: Number(button.dataset.price),
            image: button.dataset.image,
            quantity: 1
        };
        cart.push(item);
        updateCart();

        console.log(cart);
    });
});

document.querySelectorAll(".food-card").forEach(card => {

    const addCartBtn = card.querySelector(".add-cart");
    const quantityControl = card.querySelector(".quantity-controls");

    const plusBtn = card.querySelector(".plus");
    const minusBtn = card.querySelector(".minus");

    const qty = card.querySelector(".qty");

    let count = 1;

    addCartBtn.addEventListener("click", () => {
        addCartBtn.style.display = "none";
        quantityControl.style.display = "flex";
        cartCount.textContent = Number(cartCount.textContent) + 1;

    });

    plusBtn.addEventListener("click", () => {

        count++;
        qty.textContent = count;

        cartCount.textContent = Number(cartCount.textContent) + 1;

        const cartItem = cart.find(
            item => item.name === addCartBtn.dataset.name
        );

        if (cartItem) {
            cartItem.quantity++;
        }

        updateCart();

    });

    minusBtn.addEventListener("click", () => {

        const cartItem = cart.find(
            item => item.name === addCartBtn.dataset.name
        );

        if (count > 1) {

            count--;
            qty.textContent = count;

            cartCount.textContent = Number(cartCount.textContent) - 1;

            if (cartItem) {
                cartItem.quantity--;
            }

        } else {

            addCartBtn.style.display = "block";
            quantityControl.style.display = "none";

            cartCount.textContent = Number(cartCount.textContent) - 1;

            const index = cart.findIndex(
                item => item.name === addCartBtn.dataset.name
            );

            if (index !== -1) {
                cart.splice(index, 1);
            }

        }

        updateCart();

    });
});

const menuToggle = document.querySelector(".menu-toggle");
const nav = document.querySelector("nav");

menuToggle.addEventListener("click", () => {

    nav.classList.toggle("active");
});

const cartIcon = document.querySelector(".cart-icon");
const cartSidebar = document.querySelector(".cart-sidebar");
const closeCart = document.getElementById("close-cart");

cartIcon.addEventListener("click", () => {
    cartSidebar.classList.add("active");
});

closeCart.addEventListener("click", () => {
    cartSidebar.classList.remove("active");
});

function updateCart() {

    const cartItems = document.getElementById("cart-items");
    const totalPrice = document.getElementById("total-price");

    cartItems.innerHTML = "";

    let total = 0;

    cart.forEach(item => {

        total += item.price * item.quantity;

        cartItems.innerHTML += `
            <div class="cart-item">
                <img src="${item.image}">
                <div>
                    <h4>${item.name}</h4>
                    <p>₹${item.price} x ${item.quantity}</p>
                </div>
            </div>
        `;
    });

    const gst = (total - discountAmount) * 0.05;

    const finalTotal =
        (total - discountAmount) + gst;

    document.getElementById("discount")
        .textContent =
        discountAmount.toFixed(2);

    document.getElementById("gst")
        .textContent =
        gst.toFixed(2);

    document.getElementById("final-total")
        .textContent =
        finalTotal.toFixed(2);

    totalPrice.textContent =
        total.toFixed(2);
}

const checkoutBtn = document.getElementById("checkout-btn");
const checkoutModal = document.getElementById("checkoutModel");
const closeCheckout = document.getElementById("closeCheckout");
const placeOrderBtn = document.getElementById("placeOrderBtn");

checkoutBtn.addEventListener("click", () => {
    const cartItems = document.getElementById("cart-items");
    if (cart.length === 0) {
        showToast("Your cart is empty");
        return;
    }
    if (!localStorage.getItem("userName")) {

        document.getElementById("loginMessage").textContent =
            "Please login to continue checkout!";

        loginPage.style.display = "flex";
        return;
    }
    document.getElementById(
        "checkout-total"
    ).textContent =
        document.getElementById(
            "final-total"
        ).textContent;

    checkoutModal.style.display = "flex";
});

closeCheckout.addEventListener("click", () => {
    checkoutModal.style.display = "none";
});
placeOrderBtn.addEventListener("click", () => {

    const name =
        document.getElementById("customerName").value;

    const address =
        document.getElementById("customerAddress").value;

    const phone =
        document.getElementById("customerPhone").value;

    if (!name || !address || !phone) {
        showToast("Please fill all details", "error");
        return;
    }

    const paymentMethod =
        document.querySelector(
            'input[name="payment"]:checked'
        ).value;


    const order = {

        orderId: "FD" + Date.now(),

        customerName: name,

        customerPhone: phone,

        customerAddress: address,

        paymentMethod: paymentMethod,

        items: cart,

        subtotal:
            document.getElementById("total-price")
                .textContent,

        discount:
            document.getElementById("discount")
                .textContent,

        gst:
            document.getElementById("gst")
                .textContent,

        finalTotal:
            document.getElementById("final-total")
                .textContent,

        orderDate:
            new Date().toLocaleString()
    };

    let orders =
        JSON.parse(
            localStorage.getItem("orders")
        ) || [];

    orders.push(order);

    localStorage.setItem(
        "orders",
        JSON.stringify(orders)
    );


    if (paymentMethod === "COD") {

        showToast("Order placed successfully");

        cart = [];
        updateCart();
        cartCount.textContent = 0;

        checkoutModal.style.display = "none";

        return;
    }


    let amount =
        Number(
            document.getElementById("final-total")
                .textContent
        );

    let options = {

        key: "rzp_test_T1OgHw10ATxeFv",

        amount: Math.round(amount * 100),

        currency: "INR",

        name: "Foodie",

        description: "Food Order Payment",

        handler: function (response) {

            showToast(
                "Payment successful and Order Placed!"
            );

            cart = [];
            updateCart();
            cartCount.textContent = 0;

            checkoutModal.style.display = "none";
        }
    };

    let rzp = new Razorpay(options);

    rzp.open();

});

let discountAmount = 0;

function applyCoupon(coupon) {

    let subtotal = cart.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    discountAmount = 0;

    if (coupon === "FOOD10" && subtotal >= 199) {
        discountAmount = subtotal * 0.10;
    }
    else if (coupon === "FOOD20" && subtotal >= 399) {
        discountAmount = subtotal * 0.20;
    }
    else if (coupon === "FOOD30" && subtotal >= 699) {
        discountAmount = subtotal * 0.30;
    }
    else if (coupon === "FOOD40" && subtotal >= 999) {
        discountAmount = subtotal * 0.40;
    }
    else {
        showToast("Coupon not eligible");
        return false;
    }

    updateCart();
    return true;
}
document.querySelectorAll(".coupon-btn").forEach(button => {

    button.addEventListener("click", () => {

        const coupon = button.dataset.code;

        const applied = applyCoupon(coupon);

        if (!applied) {
            return;
        }

        document.getElementById("couponStatus").style.display = "block";

        document.querySelectorAll(".coupon-btn").forEach(btn => {
            btn.style.display = "none";
        });

        button.style.display = "block";
        button.textContent = "Applied ✓";
        button.disabled = true;
        button.style.background = "green";
    });

});


document.getElementById("removeCoupon")
    .addEventListener("click", () => {

        discountAmount = 0;

        updateCart();

        document.getElementById("couponStatus").style.display = "none";

        document.querySelectorAll(".coupon-btn").forEach(btn => {

            btn.style.display = "block";
            btn.textContent = "Apply";
            btn.disabled = false;
            btn.style.background = "#007168";

        });

    });

const themeToggle =
    document.getElementById("themeToggle");

const savedTheme =
    localStorage.getItem("theme");

if (savedTheme === "dark") {
    document.body.classList.add("dark-mode");
    themeToggle.innerHTML =
        '<i class="fa-solid fa-sun"></i>';
}

themeToggle.addEventListener("click", () => {

    document.body.classList.toggle("dark-mode");

    if (document.body.classList.contains("dark-mode")) {

        localStorage.setItem("theme", "dark");

        themeToggle.innerHTML =
            '<i class="fa-solid fa-sun"></i>';

    } else {

        localStorage.setItem("theme", "light");

        themeToggle.innerHTML =
            '<i class="fa-solid fa-moon"></i>';
    }
});

const searchFood =
    document.getElementById("searchFood");

const foodTitle =
    document.getElementById("foodTitle");

const noFoodFound =
    document.getElementById("noFoodFound");

searchFood.addEventListener("keyup", () => {

    const searchValue =
        searchFood.value.toLowerCase();

    let found = false;

    document.querySelectorAll(".food-card")
        .forEach(card => {

            const foodName =
                card.querySelector("h3")
                    .textContent
                    .toLowerCase();

            if (foodName.includes(searchValue)) {

                card.style.display = "block";
                found = true;

            } else {

                card.style.display = "none";

            }

        });

    if (searchValue.length > 0) {

        foodTitle.style.display = "none";

    } else {

        foodTitle.style.display = "block";

    }

    noFoodFound.style.display =
        (!found && searchValue.length > 0)
            ? "block"
            : "none";

});

const foodCards =
    document.querySelectorAll(".food-card");

const categoryContainer =
    document.getElementById("categoryContainer");

/* Show only 6 foods initially */

foodCards.forEach((card, index) => {

    if (index > 5) {
        card.style.display = "none";
    }

});

/* Menu Click */

document
.getElementById("menuLink")
.addEventListener("click",()=>{

    foodTitle.textContent =
    "All Foods";

    categoryContainer.style.display =
    "flex";

    document
    .querySelectorAll(".category-btn")
    .forEach(btn=>btn.classList.remove("active"));

    document
    .querySelector('[data-category="all"]')
    .classList.add("active");

    foodCards.forEach(card=>{

        card.style.display = "block";

    });

});

/* Category Filter */

document
    .querySelectorAll(".category-btn")
    .forEach(btn => {
        
        btn.addEventListener("click", () => {
            foodTitle.textContent =
            "";


            document
                .querySelectorAll(".category-btn")
                .forEach(b => {

                    b.classList.remove("active");

                });

            btn.classList.add("active");

            const category =
                btn.dataset.category;

            foodCards.forEach(card => {

                if (
                    category === "all" ||
                    card.dataset.category === category
                ) {

                    card.style.display = "block";

                }
                else {

                    card.style.display = "none";

                }

            });

        });

    });

const homeLink =
document.querySelector('a[href="#home"]');

homeLink.addEventListener("click",()=>{

    foodTitle.textContent =
    "Popular Foods";

    categoryContainer.style.display =
    "none";

    foodCards.forEach((card,index)=>{

        if(index < 6){

            card.style.display = "block";

        }else{

            card.style.display = "none";

        }

    });

});