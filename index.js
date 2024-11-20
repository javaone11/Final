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
    
    cartSection.style.display = 'none'; 

    basketButton.addEventListener('click', () => {
        toggleCart();
    });

    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
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

document.addEventListener('DOMContentLoaded', () => {
    document.addEventListener('click', (event) => {
        if (event.target.classList.contains('remove-btn')) {
            removeFromCart(event.target);
        } else if (event.target.classList.contains('quantity-btn')) {
            const action = event.target.getAttribute('data-action');
            const productName = event.target.getAttribute('data-product');
            changeQuantity(action, productName);
        }
    });
});


function toggleCart() {
    const cartSection = document.getElementById('cart-section');
    
    if (cartSection.style.display === 'block') {
        cartSection.style.display = 'none';
    } else {
        cartSection.style.display = 'block';
    }
}

function addToCart(button) {
    const productElement = button.closest('.product');
    const productName = productElement.querySelector('.product-name').textContent;
    const productPrice = parseFloat(productElement.querySelector('.product-price').textContent.replace('₱', ''));
    const productSize = productElement.querySelector('.product-size').value; 

    const cartItemHTML = `
        <div class="cart-item">
            <div class="product-name">${productName}</div>
            <div class="product-size">${productSize}</div>
            <div class="cart-item-price">₱${productPrice.toFixed(2)}</div>
            <div class="quantity">
                <button class="decrease" onclick="changeQuantity('decrease', '${productName}')">-</button>
                <span id="quantity-${productName}" class="quantity-text">1</span>
                <button class="increase" onclick="changeQuantity('increase', '${productName}')">+</button>
            </div>
            <button class="remove" onclick="removeFromCart(this)">Remove</button>
        </div>
    `;
    
    const cartItemsContainer = document.getElementById('cart-items');
    cartItemsContainer.insertAdjacentHTML('beforeend', cartItemHTML);

    updateMainCartTotal(); 
    updateCartCounter(); 
    updateFinalTotal();  
}

function changeQuantity(action, productName) {
    const quantityText = document.getElementById(`quantity-${productName}`);
    let currentQuantity = parseInt(quantityText.textContent);

    if (action === 'increase') {
        currentQuantity++;
    } else if (action === 'decrease' && currentQuantity > 1) {
        currentQuantity--;
    }

    quantityText.textContent = currentQuantity;

    updateInlineCartTotal();  
    updateFinalTotal(); 
}

function removeFromCart(button) {
    const cartItem = button.closest('.cart-item');
    const productName = cartItem.querySelector('.cart-item-name h3').textContent.trim();

    if (cartItem) {
        cartItem.remove();
        updateCartCounter();
        updateMainCartTotal();
        updateFinalTotal();
    }

// remove from Mini
    const miniCartItems = document.querySelectorAll('.mini-cart-item');
    miniCartItems.forEach(miniCartItem => {
        const miniProductName = miniCartItem.querySelector('.mini-cart-item-name h5').textContent.trim();
        if (miniProductName === productName) {
            miniCartItem.remove();
        }
    });
}

function updateMainCartTotal() {
    const cartItems = document.querySelectorAll('.cart-item');
    let total = 0;
    const shippingCost = 50; 

    cartItems.forEach(item => {
        const price = parseFloat(item.querySelector('.cart-item-price').textContent.replace('₱', ''));
        total += price;
    });

    const totalWithShipping = total + shippingCost;

    document.getElementById('cart-subtotal').textContent = `Subtotal: ₱${total.toFixed(2)}`;
    document.getElementById('cart-shipping').textContent = `Shipping: ₱${shippingCost.toFixed(2)}`;
    document.getElementById('cart-total').textContent = `₱${totalWithShipping.toFixed(2)}`;
}

function updateCartCounter() {
    const totalItems = document.querySelectorAll('.cart-item').length;
    document.getElementById('total-items').textContent = totalItems;
}

function updateInlineCartTotal() {
    const cartItems = document.querySelectorAll('.cart-item');
    let total = 0;

    cartItems.forEach(item => {
        const price = parseFloat(item.querySelector('.cart-item-price').textContent.replace('₱', ''));
        const quantity = parseInt(item.querySelector('.quantity-text').textContent);
        total += price * quantity;

        document.getElementById('cart-subtotal').textContent = `Subtotal: ₱${total.toFixed(2)}`;
    });
}

function updateFinalTotal() {
    const cartItems = document.querySelectorAll('.cart-item');
    let total = 0;
    const shippingCost = 50; 
    cartItems.forEach(item => {
        const price = parseFloat(item.querySelector('.cart-item-price').textContent.replace('₱', ''));
        const quantity = parseInt(item.querySelector('.quantity-text').textContent);
        total += price * quantity;
    });

    const finalTotal = total + shippingCost;

    document.getElementById('cart-total').textContent = `₱${finalTotal.toFixed(2)}`;
}

// Counter
let cartItemCount = 0;
function updateCartCounter() {
    const cartCounter = document.getElementById('cart-counter');
    const itemCount = document.querySelectorAll('.cart-item').length;
    cartCounter.textContent = itemCount; 
}

// Product Description
document.addEventListener('DOMContentLoaded', () => {
    const sizeOptions = document.querySelectorAll('.size-option');
    const addToCartButton = document.querySelector('.add-to-cart-overlay'); 
    const closeButton = document.getElementById('close-description');
    const overlay = document.getElementById('product-description-overlay');
    const cartItems = document.getElementById('cart-items');
    const miniCartItems = document.getElementById('mini-cart-items');
    let sizeSelected = false; 
    let selectedSize = ''; 

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
            addToCartOverlay();
            displayMessage("Successfully added to cart");
            resetOverlay();
        } else {
            displayMessage("Please select a size before adding to the cart");
        }
    });

    function addToCartOverlay() {
        const productImage = document.getElementById('product-description-img').src;
        const productName = document.getElementById('product-description-name').textContent;
        const productPrice = document.getElementById('product-description-price').textContent;

        const cartItem = document.createElement('div');
        cartItem.classList.add('cart-item');
        cartItem.innerHTML = `
            <div class="cart-item-image">
                <img src="${productImage}" alt="${productName}" class="cart-item-image">
            </div>
            <div class="cart-item-name">
                <h3>${productName}</h3>
            </div>
            <div class="cart-item-size">
                <p>${selectedSize}</p>
            </div>
            <div class="cart-item-price">
                <p>₱${parseFloat(productPrice.replace('₱', '')).toFixed(2)}</p>
            </div>
            <div class="cart-item-quantity">
                <button class="quantity-btn decrease-btn" onclick="changeQuantity('decrease', '${productName}')">-</button>
                <span id="quantity-${productName}" class="quantity-text">1</span>
                <button class="quantity-btn increase-btn" onclick="changeQuantity('increase', '${productName}')">+</button>
            </div>
            <div class="cart-item-actions">
                <button class="remove-btn" data-product="${productName}">Remove</button>
            </div>
        `;
        document.getElementById('cart-items').appendChild(cartItem);
        updateCartCounter();
        updateMainCartTotal();

        const miniCartItem = document.createElement('div');
        miniCartItem.classList.add('mini-cart-item');
        miniCartItem.innerHTML = `
            <div class="mini-cart-item-image">
                <img src="${productImage}" alt="${productName}" class="mini-cart-item-image">
            </div>
            <div class="mini-cart-item-name">
                <h5>${productName}</h5>
            </div>
            <div class="mini-cart-item-price">
                <h5>₱${parseFloat(productPrice.replace('₱', '')).toFixed(2)}</h5>
            </div>
        `;
        miniCartItems.appendChild(miniCartItem);
        updateInlineCartTotal();
    }
    function displayMessage(message) {
        const messageElement = document.getElementById('cart-notification');
        messageElement.textContent = message;
        messageElement.style.display = 'block'; 

        setTimeout(() => {
            messageElement.style.display = 'none'; 
        }, 2000);
    }

    function resetOverlay() {
        sizeOptions.forEach(opt => opt.classList.remove('selected'));
        selectedSize = '';
        sizeSelected = false;
        addToCartButton.disabled = true;
        overlay.style.display = 'none';  
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
        setTimeout(() => {
            if (!miniCart.matches(':hover')) {  
                miniCart.style.display = 'none';  
            }
        }, 300);
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
window.addEventListener('DOMContentLoaded', () => {
    const authContainer = document.getElementById('auth-container');
    const overlay = document.getElementById('auth-container-overlay');
    const signInBtn = document.getElementById('login-btn');
    const signUpBtn = document.getElementById('register-btn');
    const userProfileBtn = document.getElementById('userProfile'); 
    const formExitBtns = document.querySelectorAll('.form-exit-btn'); 
    const signUpForm = document.getElementById('auth-signup'); 
    const signInForm = document.getElementById('auth-signin');

    if (!sessionStorage.getItem('formClosed') && sessionStorage.getItem('signedIn') !== 'true') {
        setTimeout(() => {
            showAuthContainer();
        }, 2000);
    }

    formExitBtns.forEach(button => {
        button.addEventListener('click', () => {
            hideAuthContainer();
            sessionStorage.setItem('formClosed', 'true');
            sessionStorage.setItem('signedIn', 'false');
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

        const emailInput = signUpForm.querySelector('input[type="email"]');
        const passwordInput = signUpForm.querySelector('input[type="password"]');

        const enteredEmail = emailInput.value;
        const enteredPassword = passwordInput.value;

        sessionStorage.setItem('signUpEmail', enteredEmail);
        sessionStorage.setItem('signUpPassword', enteredPassword);

        sessionStorage.setItem('signedUp', 'true');

        authContainer.classList.remove('active');
    });

    const emailInput = signInForm.querySelector('input[type="email"]');
    const passwordInput = signInForm.querySelector('input[type="password"]');
    const signInSubmitBtn = signInForm.querySelector('button[type="submit"]');

    signInSubmitBtn.addEventListener('click', (e) => {
        e.preventDefault(); 

        const validEmail = sessionStorage.getItem('signUpEmail');
        const validPassword = sessionStorage.getItem('signUpPassword');

        const enteredEmail = emailInput.value;
        const enteredPassword = passwordInput.value;

        if (enteredEmail === validEmail && enteredPassword === validPassword) {
            sessionStorage.setItem('signedIn', 'true');
            userProfileBtn.style.color = 'white'; 
            hideAuthContainer();
        } else {
            alert('Invalid credentials. Please try again.');
        }
    });

    userProfileBtn.addEventListener('click', () => {
        if (sessionStorage.getItem('signedIn') === 'false' || !sessionStorage.getItem('signedIn')) {
            showAuthContainer();
        }
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

