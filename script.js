let cartData = null;

// Cart data ko fetch karne ka function
async function fetchCartData() {
    showLoader(); // Loader dikhana shuru karte hain
    try {
        const response = await fetch('https://cdn.shopify.com/s/files/1/0883/2188/4479/files/apiCartData.json?v=1728384889');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`); // Agar response theek nahi hai toh error throw karte hain
        }
        cartData = await response.json(); // Response ko JSON mein convert karte hain
        renderCart(); // Cart render karne ka function call karte hain
    } catch (error) {
        console.error('Error fetching cart data:', error); // Error ko console par print karte hain
        showFeedbackMessage('Unable to load cart data. Please try again later.'); // User ko feedback dikhate hain
    } finally {
        hideLoader(); // Loader ko chhupana
    }
}

// Cart items ko render karne ka function
function renderCart() {
    const cartItemsBody = document.getElementById('cart-items-body'); // Cart items ka table body
    cartItemsBody.innerHTML = ''; // Purana content clear karte hain

    if (!cartData?.items?.length) {
        // Agar cart empty hai
        cartItemsBody.innerHTML = `
            <tr>
                <td colspan="4" style="text-align: center; padding: 2rem;">
                    Your cart is empty
                </td>
            </tr>
        `;
        updateCartTotals(); // Totals update karte hain
        return; // Function se return karte hain
    }

    // Cart items ko render karte hain
    cartData.items.forEach(item => {
        const row = document.createElement('tr'); // Naya row create karte hain
        row.innerHTML = `
            <td>
                <div class="cart-item">
                    <img src="${item.image}" alt="${item.title}"> <!-- Item ki image -->
                    <span>${item.title}</span> <!-- Item ka title -->
                </div>
            </td>
            <td>Rs. ${formatPrice(item.price)}</td> <!-- Item ka price -->
            <td>
                <input type="number" value="${item.quantity}" min="1" data-id="${item.id}" class="quantity-input"> <!-- Quantity input -->
            </td>
            <td>
                <div class="subtotal-container">
                    <span>Rs. ${formatPrice(item.final_line_price)}</span> <!-- Final line price -->
                    <button class="remove-item" data-id="${item.id}" aria-label="Remove item">🗑️</button> <!-- Remove button -->
                </div>
            </td>
        `;
        cartItemsBody.appendChild(row); // Row ko table body mein add karte hain
    });

    updateCartTotals(); // Cart totals update karte hain
}

// Feedback message dikhane ka function
function showFeedbackMessage(message) {
    // Yahan feedback message dikhana
}

// Cart totals ko update karne ka function
function updateCartTotals() {
    const subtotal = cartData.items.reduce((acc, item) => acc + item.final_line_price, 0); // Subtotal calculate karte hain
    
    // Amount ko properly format karte hain
    document.getElementById('subtotal-amount').textContent = `Rs. ${formatPrice(subtotal)}`;
    document.getElementById('total-amount').textContent = `Rs. ${formatPrice(subtotal)}`; // Total aur subtotal same hain is case mein
}

// Price ko format karne ka function
function formatPrice(amount) {
    return (amount / 100).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ","); // Amount ko formatted string mein convert karte hain
}

// Quantity change handle karne ka function
function handleQuantityChange(event) {
    if (event.target.classList.contains('quantity-input')) {
        const itemId = parseInt(event.target.dataset.id); // Item ID lete hain
        const newQuantity = parseInt(event.target.value); // Nayi quantity lete hain
        
        if (newQuantity < 1) return; // Negative quantities ko prevent karte hain

        const item = cartData.items.find(item => item.id === itemId); // Item ko dhoondte hain
        if (item) {
            item.quantity = newQuantity; // Quantity update karte hain
            item.final_line_price = item.price * newQuantity; // Final line price update karte hain
            renderCart(); // Cart ko dobara render karte hain
            saveCartToLocalStorage(); // Cart ko local storage mein save karte hain
        }
    }
}

// Item remove karne ka function
function handleRemoveItem(event) {
    if (event.target.classList.contains('remove-item')) {
        const itemId = parseInt(event.target.dataset.id); // Item ID lete hain
        showModal(itemId); // Confirmation modal dikhate hain
    }
}

// Confirmation modal dikhane ka function
function showModal(itemId) {
    const modal = document.getElementById('modal');
    modal.style.display = 'flex'; // Modal ko dikhate hain
    
    document.getElementById('confirm-remove').onclick = () => {
        removeItem(itemId); // Item remove karte hain
        modal.style.display = 'none'; // Modal ko chhupate hain
    };
    
    document.getElementById('cancel-remove').onclick = () => {
        modal.style.display = 'none'; // Modal ko chhupate hain
    };
}

// Item ko remove karne ka function
function removeItem(itemId) {
    cartData.items = cartData.items.filter(item => item.id !== itemId); // Item ko filter karte hain
    renderCart(); // Cart ko dobara render karte hain
    saveCartToLocalStorage(); // Cart ko local storage mein save karte hain
}

// Cart ko local storage mein save karne ka function
function saveCartToLocalStorage() {
    localStorage.setItem('cartData', JSON.stringify(cartData)); // Cart data ko JSON string mein convert karke save karte hain
}

// Local storage se cart ko load karne ka function
function loadCartFromLocalStorage() {
    const savedCart = localStorage.getItem('cartData'); // Local storage se cart data lete hain
    if (savedCart) {
        cartData = JSON.parse(savedCart); // JSON string ko object mein convert karte hain
        renderCart(); // Cart ko render karte hain
    } else {
        fetchCartData(); // Agar local storage mein kuch nahi hai toh API se fetch karte hain
    }
}

// Loader dikhane ka function
function showLoader() {
    document.getElementById('loader').style.display = 'flex'; // Loader ko dikhate hain
}

// Loader ko chhupane ka function
function hideLoader() {
    document.getElementById('loader').style.display = 'none'; // Loader ko chhupate hain
}

// Page load hone par functions ko execute karte hain
document.addEventListener('DOMContentLoaded', () => {
    loadCartFromLocalStorage(); // Local storage se cart load karte hain
    document.querySelector('.cart-items').addEventListener('change', handleQuantityChange); // Quantity change ke liye event listener
    document.querySelector('.cart-items').addEventListener('click', handleRemoveItem); // Item remove ke liye event listener
    document.getElementById('checkout-btn').addEventListener('click', () => {
        alert('Proceeding to checkout!'); // Checkout ke liye alert dikhate hain
    });
});
