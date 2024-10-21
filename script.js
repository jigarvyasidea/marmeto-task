let cartData = null;

async function fetchCartData() {
    showLoader();
    try {
        const response = await fetch('https://cdn.shopify.com/s/files/1/0883/2188/4479/files/apiCartData.json?v=1728384889');
        cartData = await response.json();
        renderCart();
    } catch (error) {
        console.error('Error fetching cart data:', error);
    } finally {
        hideLoader();
    }
}

function renderCart() {
    const cartItemsBody = document.getElementById('cart-items-body');
    cartItemsBody.innerHTML = '';

    cartData.items.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>
                <div class="cart-item">
                    <img src="${item.image}" alt="${item.title}">
                    <span>${item.title}</span>
                </div>
            </td>
            <td>Rs. ${formatPrice(item.price)}</td>
            <td>
                <input type="number" value="${item.quantity}" min="1" data-id="${item.id}" class="quantity-input">
            </td>
            <td>
                Rs. ${formatPrice(item.final_line_price)}
                <button class="remove-item" data-id="${item.id}">🗑️</button>
            </td>
        `;
        cartItemsBody.appendChild(row);
    });

    updateCartTotals();
}



function showFeedbackMessage(message) {
    
    const feedback = document.createElement('div');
    feedback.textContent = message;
    feedback.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background-color: #000;
        color: white;
        padding: 1rem;
        border-radius: 4px;
        z-index: 1000;
        animation: fadeOut 3s forwards;
    `;
    document.body.appendChild(feedback);
    setTimeout(() => feedback.remove(), 3000);
}


function renderCart() {
    const cartItemsBody = document.getElementById('cart-items-body');
    cartItemsBody.innerHTML = '';

    if (!cartData?.items?.length) {
        cartItemsBody.innerHTML = `
            <tr>
                <td colspan="4" style="text-align: center; padding: 2rem;">
                    Your cart is empty
                </td>
            </tr>
        `;
        updateCartTotals();
        return;
    }

    cartData.items.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>
                <div class="cart-item">
                    <img src="${item.image}" alt="${item.title}">
                    <span>${item.title}</span>
                </div>
            </td>
            <td>Rs. ${formatPrice(item.price)}</td>
            <td>
                <input type="number" value="${item.quantity}" min="1" data-id="${item.id}" class="quantity-input">
            </td>
            <td>
                <div class="subtotal-container">
                    <span>Rs. ${formatPrice(item.final_line_price)}</span>
                    <button class="remove-item" data-id="${item.id}" aria-label="Remove item">🗑️</button>
                </div>
            </td>
        `;
        cartItemsBody.appendChild(row);
    });

    updateCartTotals();
}

function showModal(itemId) {
    const modal = document.getElementById('modal');
    modal.style.display = 'flex';
    

    modal.onclick = (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    };
    
    
    const confirmBtn = document.getElementById('confirm-remove');
    const cancelBtn = document.getElementById('cancel-remove');
    
    const newConfirmBtn = confirmBtn.cloneNode(true);
    const newCancelBtn = cancelBtn.cloneNode(true);
    
    confirmBtn.parentNode.replaceChild(newConfirmBtn, confirmBtn);
    cancelBtn.parentNode.replaceChild(newCancelBtn, cancelBtn);
    
    newConfirmBtn.onclick = () => {
        removeItem(itemId);
        modal.style.display = 'none';
        showFeedbackMessage('Item removed from cart');
    };
    
    newCancelBtn.onclick = () => {
        modal.style.display = 'none';
    };
}


function removeItem(itemId) {
    try {
        if (!cartData?.items) {
            throw new Error('Cart data is not available');
        }
        
        const itemIndex = cartData.items.findIndex(item => item.id === itemId);
        if (itemIndex === -1) {
            throw new Error('Item not found in cart');
        }
        
        cartData.items = cartData.items.filter(item => item.id !== itemId);
        renderCart();
        saveCartToLocalStorage();
        
    } catch (error) {
        console.error('Error removing item:', error);
        showFeedbackMessage('Error removing item. Please try again.');
    }
}


async function fetchCartData() {
    showLoader();
    try {
        const response = await fetch('https://cdn.shopify.com/s/files/1/0883/2188/4479/files/apiCartData.json?v=1728384889');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        cartData = await response.json();
        renderCart();
    } catch (error) {
        console.error('Error fetching cart data:', error);
        showFeedbackMessage('Unable to load cart data. Please try again later.');
    } finally {
        hideLoader();
    }
}

function updateCartTotals() {
    const subtotal = cartData.items.reduce((acc, item) => acc + item.final_line_price, 0);
    
    // Format the amounts properly
    document.getElementById('subtotal-amount').textContent = `Rs. ${formatPrice(subtotal)}`;
    document.getElementById('total-amount').textContent = `Rs. ${formatPrice(subtotal)}`; // Using subtotal as total since they're the same in the image
}


function formatPrice(amount) {
    return (amount / 100).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}


function formatCurrency(amount) {
    return `₹${(amount / 100).toLocaleString('en-IN')}`;
}

function handleQuantityChange(event) {
    if (event.target.classList.contains('quantity-input')) {
        const itemId = parseInt(event.target.dataset.id);
        const newQuantity = parseInt(event.target.value);
        
        if (newQuantity < 1) return; // Prevent negative quantities

        const item = cartData.items.find(item => item.id === itemId);
        if (item) {
            item.quantity = newQuantity;
            item.final_line_price = item.price * newQuantity;
            renderCart();
            saveCartToLocalStorage();
        }
    }
}

function handleRemoveItem(event) {
    if (event.target.classList.contains('remove-item')) {
        const itemId = parseInt(event.target.dataset.id);
        showModal(itemId);
    }
}

function showModal(itemId) {
    const modal = document.getElementById('modal');
    modal.style.display = 'flex';
    
    document.getElementById('confirm-remove').onclick = () => {
        removeItem(itemId);
        modal.style.display = 'none';
    };
    
    document.getElementById('cancel-remove').onclick = () => {
        modal.style.display = 'none';
    };
}

function removeItem(itemId) {
    cartData.items = cartData.items.filter(item => item.id !== itemId);
    renderCart();
    saveCartToLocalStorage();
}

function saveCartToLocalStorage() {
    localStorage.setItem('cartData', JSON.stringify(cartData));
}

function loadCartFromLocalStorage() {
    const savedCart = localStorage.getItem('cartData');
    if (savedCart) {
        cartData = JSON.parse(savedCart);
        renderCart();
    } else {
        fetchCartData();
    }
}

function showLoader() {
    document.getElementById('loader').style.display = 'flex';
}

function hideLoader() {
    document.getElementById('loader').style.display = 'none';
}

document.addEventListener('DOMContentLoaded', () => {
    loadCartFromLocalStorage();
    document.querySelector('.cart-items').addEventListener('change', handleQuantityChange);
    document.querySelector('.cart-items').addEventListener('click', handleRemoveItem);
    document.getElementById('checkout-btn').addEventListener('click', () => {
        alert('Proceeding to checkout!');
    });
});