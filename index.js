const itemsPerPage = 20;
let currentPage = 1;
let currentCategory = 'all';  

document.addEventListener('DOMContentLoaded', () => {
    renderItems();  
    renderPagination();  

    const searchInput = document.getElementById('search-input');
    searchInput.addEventListener('input', filterProducts);

    searchInput.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            event.preventDefault(); 
            filterProducts(); 
        }
    });
});

function getItems() {
    return Array.from(document.querySelectorAll('.shop-container .product-list')); 
}

function renderItems() {
    const items = getItems();
    const filteredItems = items.filter(item => {
        const productCategory = item.getAttribute('data-category');
        return (currentCategory === 'all' || productCategory === currentCategory);
    });

    items.forEach(item => item.style.display = 'none');

    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;

    filteredItems.slice(start, end).forEach(item => {
        item.style.display = 'block'; 
    });

    if (filteredItems.length === 0) {
        console.log("Walang Items");
    }
}

// Pagination Links
function renderPagination() {
    const items = getItems();
    const filteredItems = items.filter(item => {
        const productCategory = item.getAttribute('data-category');
        return (currentCategory === 'all' || productCategory === currentCategory);
    });

    const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
    const pagination = document.getElementById('pagination');
    pagination.innerHTML = ''; 

    if (currentPage > 1) {
        createPaginationLink(pagination, currentPage - 1, '<');
    }

    for (let i = 1; i <= totalPages; i++) {
        createPaginationLink(pagination, i, i, currentPage === i);
    }

    if (currentPage < totalPages) {
        createPaginationLink(pagination, currentPage + 1, '>');
    }
}

// Pagination Creator
function createPaginationLink(pagination, page, text, isActive = false) {
    const pageLink = document.createElement('a');
    pageLink.innerHTML = text;
    pageLink.href = '#';
    pageLink.className = isActive ? 'active' : '';
    pageLink.onclick = (e) => {
        e.preventDefault();
        currentPage = page;
        renderItems(); 
        renderPagination(); 
    };
    pagination.appendChild(pageLink);
}

// Search Bar
let typingTimeout;

document.addEventListener('DOMContentLoaded', () => {
    renderItems();
    renderPagination();

    const searchInput = document.getElementById('search-input');
    
    searchInput.addEventListener('input', function () {
        clearTimeout(typingTimeout);

        typingTimeout = setTimeout(function () {
            filterProducts(searchInput.value);
        }, 500);
    });

    searchInput.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            filterProducts(searchInput.value);
            searchInput.value = '';
        }
    });

    showSection('home');
});

function filterProducts(query) {
    const searchInput = document.getElementById('search-input');
    const noMatchMessage = document.getElementById('no-match-message');
    query = query.toLowerCase();

    if (!document.querySelector('#shop').classList.contains('active-section')) {
        showSection('shop');
    }

    const productList = document.querySelectorAll('.product-list');
    let foundMatch = false;

    productList.forEach(product => {
        const category = product.getAttribute('data-category').toLowerCase();
        const type = product.getAttribute('data-type') ? product.getAttribute('data-type').toLowerCase() : '';
        const color = product.getAttribute('data-color') ? product.getAttribute('data-color').toLowerCase() : '';
        const productName = product.querySelector('.description').textContent.toLowerCase();

        if (category.includes(query) || type.includes(query) || color.includes(query) || productName.includes(query)) {
            product.style.display = ''; 
            foundMatch = true;
        } else {
            product.style.display = 'none'; 
        }
    });

    if (!foundMatch) {
        noMatchMessage.style.display = 'block';
        setTimeout(() => {
            noMatchMessage.style.display = 'none';
        }, 1500);
    }
}


function toggleSearchInput() {
    const searchInput = document.getElementById('search-input');
    searchInput.classList.toggle('show'); 

    if (searchInput.classList.contains('show')) {
        searchInput.focus(); 
    }

    searchInput.addEventListener('blur', () => {
        searchInput.classList.remove('show'); 
    });
}

// Section Control
function showSection(sectionId) {
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        section.classList.remove('active-section');
        section.style.display = 'none';
    });

    const activeSection = document.getElementById(sectionId);
    activeSection.classList.add('active-section');
    activeSection.style.display = 'block';

    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.classList.remove('active-link');
    });

    const activeLink = Array.from(navLinks).find(link => link.textContent.toLowerCase() === sectionId);
    if (activeLink) {
        activeLink.classList.add('active-link'); 
    }
}

// Filter Category
function filterByCategory(category) {
    currentCategory = category; 
    currentPage = 1;  
    renderItems(); 
    renderPagination(); 

    setActiveFilter(category);
}

function setActiveFilter(category) {
    const filterItems = document.querySelectorAll('#filter ul li');

    filterItems.forEach(item => {
        item.classList.remove('active'); 
        if (item.onclick.toString().includes(`'${category}'`)) {
            item.classList.add('active'); 
        }
    });
}


// cart
document.addEventListener('DOMContentLoaded', () => {
    const basketButton = document.getElementById('basket');
    const cartSection = document.getElementById('cart-section');
    

    loadCartFromSessionStorage();

    basketButton.addEventListener('click', () => {
        toggleCart();
    });

    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function () {
            addToCart(button);
        });
    });

    const sectionLinks = document.querySelectorAll('.nav-link');
    sectionLinks.forEach(link => {
        link.addEventListener('click', () => {
            cartSection.style.display = 'none';
        });
    });
});


function toggleCart() {
    const cartSection = document.getElementById('container-basket');
    
    if (cartSection.style.display === 'block') {
        cartSection.style.display = 'none';
    } else {
        cartSection.style.display = 'block';
    }
}
document.addEventListener('DOMContentLoaded', () => {
    const sizeOptions = document.querySelectorAll('.size-option');
    const addToCartButton = document.querySelector('.add-to-cart-overlay'); 
    const closeButton = document.getElementById('close-description');
    const overlay = document.getElementById('product-description-overlay');
    const cartItemsContainer = document.getElementById('cart-items');
    const miniCartItems = document.getElementById('mini-cart-items');
    const cartCounter = document.getElementById('cart-counter');
    let sizeSelected = false; 
    let selectedSize = ''; 

    addToCartButton.disabled = true;



    loadCartFromSessionStorage();

    const productElements = document.querySelectorAll('.product-list');
    productElements.forEach(product => {
        product.addEventListener('click', () => {
            const image = product.querySelector('img').src;
            const name = product.querySelector('.description').textContent;
            const price = product.querySelector('.price').textContent;

            document.getElementById('product-description-img').src = image;
            document.getElementById('product-description-name').textContent = name;
            document.getElementById('product-description-price').textContent = price;

            overlay.style.display = 'flex';
        });
    });

    closeButton.addEventListener('click', () => {
        overlay.style.display = 'none';
    });

    sizeOptions.forEach(option => {
        option.addEventListener('click', () => {
            sizeOptions.forEach(opt => opt.classList.remove('selected'));
            option.classList.add('selected');

            sizeSelected = true; 
            selectedSize = option.textContent;

            addToCartButton.disabled = false;
        });
    });

    addToCartButton.disabled = true;

    addToCartButton.addEventListener('click', () => {
        if (sizeSelected) {
            if (localStorage.getItem('signedIn') !== 'true') {
                showAuthContainer();
            } else {
                const productImage = document.getElementById('product-description-img').src;
                const productName = document.getElementById('product-description-name').textContent;
                const productPrice = parseFloat(document.getElementById('product-description-price').textContent.replace('₱', ''));

                const cartItem = {
                    image: productImage,
                    name: productName,
                    size: selectedSize,
                    price: productPrice,
                    quantity: 1,
                };

                addItemToCart(cartItem);
                displayMessage();
                resetOverlay();
            }
        } else {
            displayMessage("Please select a size before adding to the cart");
        }
    });

    function addItemToCart(item) {
        const cart = getCartFromSessionStorage();
        const existingItemIndex = cart.findIndex(cartItem => cartItem.name === item.name && cartItem.size === item.size);

        if (existingItemIndex !== -1) {
            cart[existingItemIndex].quantity += 1;
        } else {
            cart.push(item);
        }


        saveCartToSessionStorage(cart);
        renderCart();
    }

    function removeItemFromCart(name, size) {
        let cart = getCartFromSessionStorage();
        cart = cart.filter(item => !(item.name === name && item.size === size));
        saveCartToSessionStorage(cart);
        renderCart();
    }

    function changeItemQuantity(name, size, action) {
        const cart = getCartFromSessionStorage();
        const itemIndex = cart.findIndex(item => item.name === name && item.size === size);

        if (itemIndex !== -1) {
            if (action === 'increase') {
                cart[itemIndex].quantity += 1;
            } else if (action === 'decrease' && cart[itemIndex].quantity > 1) {
                cart[itemIndex].quantity -= 1;
            }
        }

        saveCartToSessionStorage(cart);
        renderCart();
    }

    function renderCart() {
        const cart = getCartFromSessionStorage();
    
        cartItemsContainer.innerHTML = '';
        miniCartItems.innerHTML = '';
    
        cart.forEach(item => {
            const cartItemHTML = `
                <div class="cart-item" data-name="${item.name}" data-size="${item.size}">
                    <div class="cart-item-image">
                        <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                    </div>
                    <div class="cart-item-name">
                        <h3>${item.name}</h3>
                    </div>
                    <div class="cart-item-size">
                        <p>${item.size}</p>
                    </div>
                    <div class="cart-item-price">
                        <p>₱${item.price.toFixed(2)}</p>
                    </div>
                    <div class="cart-item-quantity">
                        <button class="quantity-btn decrease-btn" data-action="decrease">-</button>
                        <span class="quantity-text">${item.quantity}</span>
                        <button class="quantity-btn increase-btn" data-action="increase">+</button>
                    </div>
                    <div class="cart-item-actions">
                        <button class="remove-btn" data-action="remove">Remove</button>
                    </div>
                </div>
            `;
            cartItemsContainer.insertAdjacentHTML('beforeend', cartItemHTML);
    
            const miniCartItemHTML = `
                <div class="mini-cart-item">
                    <div class="mini-cart-item-image">
                        <img src="${item.image}" alt="${item.name}" class="mini-cart-item-image">
                    </div>
                    <div class="mini-cart-item-name">
                        <h5>${item.name}</h5>
                    </div>
                    <div class="mini-cart-item-price">
                        <h5>₱${item.price.toFixed(2)}</h5>
                    </div>
                </div>
            `;
            miniCartItems.insertAdjacentHTML('beforeend', miniCartItemHTML);
        });
        
        updateCartCounter(cart); 
        updateCartSummary(cart);
    }

    cartItemsContainer.addEventListener('click', (event) => {
        const target = event.target;
        const action = target.dataset.action;
        if (!action) return; 
    
        const cartItemElement = target.closest('.cart-item');
        const name = cartItemElement.getAttribute('data-name');
        const size = cartItemElement.getAttribute('data-size');
    
        if (action === 'remove') {
            removeItemFromCart(name, size);
        } else if (action === 'increase') {
            changeItemQuantity(name, size, 'increase');
        } else if (action === 'decrease') {
            changeItemQuantity(name, size, 'decrease');
        }
    });
    
    function updateCartSummary(cart) {
        const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
        const shipping = 55;
        const total = subtotal + shipping;

        document.getElementById('cart-subtotal').textContent = `Subtotal: ₱${subtotal.toFixed(2)}`;
        document.getElementById('cart-shipping').textContent = `Shipping: ₱${shipping.toFixed(2)}`;
        document.getElementById('cart-total').textContent = `₱${total.toFixed(2)}`;
    }

    function updateCartCounter(cart) {
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        cartCounter.textContent = totalItems; 
    }
    function saveCartToSessionStorage(cart) {
        sessionStorage.setItem('cart', JSON.stringify(cart));
    }

    function getCartFromSessionStorage() {
        const cart = sessionStorage.getItem('cart');
        return cart ? JSON.parse(cart) : [];
    }

    function loadCartFromSessionStorage() {
        renderCart();
    }

    function displayMessage() {
        const messageElement = document.getElementById('cart-notification');
        messageElement.style.display = 'block'; 

        setTimeout(() => {
            messageElement.style.display = 'none'; 
        }, 2000);
    }

    function displayCheckout(){
        const messageCheckout = document.getElementById('checkout-notification');
        messageCheckout.style.display = 'block'; 

        setTimeout(() => {
            messageCheckout.style.display = 'none'; 
        }, 3000);

    }
    function showAuthContainer() {
        showSection('home');
        resetOverlay();
        const authContainer = document.getElementById('auth-container');
        const overlay = document.getElementById('auth-container-overlay');
        overlay.style.visibility = 'visible';
        overlay.style.opacity = '1';
        authContainer.style.visibility = 'visible';
        authContainer.style.opacity = '1';
    }

    function resetOverlay() {
        sizeOptions.forEach(opt => opt.classList.remove('selected'));
        selectedSize = '';
        sizeSelected = false;
        addToCartButton.disabled = true;
        overlay.style.display = 'none';  
    }
    function clearCartItems() {
        const cart = getCartFromSessionStorage();
        if (cart.length > 0) {

            saveCartToSessionStorage([]);
            renderCart(); 

            displayCheckout("Cart has been cleared!");
        } 
    }

    
    const checkoutButton = document.getElementById('checkout-button'); 
    if (checkoutButton) {
        checkoutButton.addEventListener('click', clearCartItems);
    }
    
});





// Mini cartue display
document.addEventListener('DOMContentLoaded', () => {
    const basketButton = document.getElementById('basket');
    const miniCart = document.getElementById('mini-cart');

    basketButton.addEventListener('mouseenter', () => {
        miniCart.style.display = 'block';  
    });

    basketButton.addEventListener('mouseleave', () => {
        miniCart.style.display = 'none';  
    });
});



// mute unmute
let isMuted = true;

function toggleMute() {
    const iframe = document.getElementById('youtube-video');
    const muteIcon = document.getElementById('mute-icon');

    if (isMuted) {
        iframe.src = iframe.src.replace("mute=1", "mute=0");
        muteIcon.classList.remove("fa-volume-xmark");
        muteIcon.classList.add("fa-volume-high"); 
    } else {
        iframe.src = iframe.src.replace("mute=0", "mute=1");
        muteIcon.classList.remove("fa-volume-high"); 
        muteIcon.classList.add("fa-volume-xmark"); 
    }

    isMuted = !isMuted;  
}



// Sizing
const sizeOptions = document.querySelectorAll('.size-options span');

sizeOptions.forEach(option => {
    option.addEventListener('click', function () {
        if (this.classList.contains('selected')) {
            this.classList.remove('selected');
        } else {
            sizeOptions.forEach(opt => opt.classList.remove('selected'));
            
            this.classList.add('selected');
        }
    });
});


//Log in

function showProfile() {
    const logoutForm = document.getElementById('logOut');
    logoutForm.style.visibility = 'visible';
    logoutForm.style.opacity = '1';
}
function hideProfile(){
    const logoutForm = document.getElementById('logOut');
    logoutForm.style.visibility = 'hidden';
    logoutForm.style.opacity = '0';
}

function signedUpMessage() {
    const signedUpMessage = document.getElementById('signUp-notification');
    signedUpMessage.style.display = 'block'; 

    setTimeout(() => {
        signedUpMessage.style.display = 'none'; 
    }, 2000);
}
window.addEventListener('DOMContentLoaded', () => {
    const authContainer = document.getElementById('auth-container');
    const overlay = document.getElementById('auth-container-overlay');
    const signInBtn = document.getElementById('login-btn');
    const signUpBtn = document.getElementById('register-btn');
    const userProfileBtn = document.getElementById('userProfile'); 
    const formExitBtns = document.querySelectorAll('.form-exit-btn'); 
    const signUpForm = document.getElementById('auth-signup'); 
    const signInForm = document.getElementById('auth-signin');
    const logoutBtn = document.getElementById('logout-btn');

    if (!localStorage.getItem('formClosed') && localStorage.getItem('signedIn') !== 'true') {
        setTimeout(() => {
            showAuthContainer();
        }, 2000);
    }

    formExitBtns.forEach(button => {
        button.addEventListener('click', () => {
            hideAuthContainer();
            localStorage.setItem('formClosed', 'true');
            localStorage.setItem('signedIn', 'false');
        });
    });

    signUpBtn.addEventListener('click', () => {
        authContainer.classList.add('active');
    });

    signInBtn.addEventListener('click', () => {
        authContainer.classList.remove('active');
    });

    const signUpSubmitBtn = signUpForm.querySelector('button[type="submit"]');
    signUpSubmitBtn.addEventListener('click', (e) => {
        e.preventDefault(); 
    
        const userName = document.getElementById('userName');
        const emailInput = signUpForm.querySelector('input[type="email"]');
        const passwordInput = signUpForm.querySelector('input[type="password"]');
    
        const enteredEmail = emailInput.value;
        const enteredPassword = passwordInput.value;
    
        localStorage.setItem('signUpEmail', enteredEmail);
        localStorage.setItem('signUpPassword', enteredPassword);
        localStorage.setItem('signedUp', 'true');
    
        userName.value = '';
        emailInput.value = '';
        passwordInput.value = '';
        
        authContainer.classList.remove('active');
        signedUpMessage();
        
    });
    

    const emailInput = signInForm.querySelector('input[type="email"]');
    const passwordInput = signInForm.querySelector('input[type="password"]');
    const signInSubmitBtn = signInForm.querySelector('button[type="submit"]');
    
    signInSubmitBtn.addEventListener('click', (e) => {
        e.preventDefault();
    
        const validEmail = localStorage.getItem('signUpEmail');
        const validPassword = localStorage.getItem('signUpPassword');
    
        const enteredEmail = emailInput.value;
        const enteredPassword = passwordInput.value;
    
        if (enteredEmail === validEmail && enteredPassword === validPassword) {
            localStorage.setItem('signedIn', 'true');
            userProfileBtn.style.color = 'white'; 
            hideAuthContainer();
                
            emailInput.value = '';
            passwordInput.value = '';
        } else {
            alert('Invalid credentials. Please try again.');
        }
    });
    

    userProfileBtn.addEventListener('click', () => {
        if (localStorage.getItem('signedIn') === 'false' || !localStorage.getItem('signedIn')) {
            showAuthContainer();

        } else if (localStorage.getItem('signedIn') === 'true') {
            const logoutForm = document.getElementById('logOut');

            if (logoutForm.style.visibility === 'visible') { 
                hideProfile();
            } else {
                showProfile();
            }
        }
    });
    

logoutBtn.addEventListener('click', () => {

    // Log out the user by updating the local storage
    localStorage.setItem('signedIn', 'false');
    localStorage.setItem('signedUp', 'false');
    localStorage.removeItem('signUpEmail');
    localStorage.removeItem('signUpPassword');
    localStorage.removeItem('formClosed');

    userProfileBtn.style.color = ''; 

    hideProfile();

    location.reload(); 

    setTimeout(() => {
        showAuthContainer(); 
    }, 2000);
});
    

    function showAuthContainer() {
        overlay.style.visibility = 'visible';
        overlay.style.opacity = '1';
        authContainer.style.visibility = 'visible';
        authContainer.style.opacity = '1';
    }
    

    function hideAuthContainer() {
        overlay.style.visibility = 'hidden';
        overlay.style.opacity = '0';
        authContainer.style.visibility = 'hidden';
        authContainer.style.opacity = '0';
    }
});



