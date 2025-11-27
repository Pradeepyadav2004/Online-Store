// Sample shop data
const shopsData = [
    {
        id: 1,
        name: "Fresh Mart Grocery",
        category: "grocery",
        rating: 4.5,
        distance: "0.5 km",
        deliveryTime: "20-30 min",
        deliveryFee: "₹20",
        image: "https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        badge: "Premium"
    },
    {
        id: 2,
        name: "HealthCare Pharmacy",
        category: "medical",
        rating: 4.8,
        distance: "0.8 km",
        deliveryTime: "15-25 min",
        deliveryFee: "₹25",
        image: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        badge: "Verified"
    },
    {
        id: 3,
        name: "Maa's Kitchen",
        category: "tiffin",
        rating: 4.7,
        distance: "1.2 km",
        deliveryTime: "30-45 min",
        deliveryFee: "₹30",
        image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        badge: "Popular"
    }
];

// Cart data
let cart = [];
let currentFilter = '';

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    loadShops();
    updateCartDisplay();
});

// Load and display shops
function loadShops() {
    const shopsGrid = document.getElementById('shopsGrid');
    shopsGrid.innerHTML = '';
    
    const filteredShops = currentFilter ? shopsData.filter(shop => shop.category === currentFilter) : shopsData;
    
    filteredShops.forEach(shop => {
        const shopCard = createShopCard(shop);
        shopsGrid.appendChild(shopCard);
    });
}

// Create shop card element
function createShopCard(shop) {
    const shopCard = document.createElement('div');
    shopCard.className = 'shop-card';
    
    shopCard.innerHTML = `
        <div class="shop-image">
            <img src="${shop.image}" alt="${shop.name}">
            <div class="shop-badge">${shop.badge}</div>
        </div>
        <div class="shop-content">
            <div class="shop-header">
                <div class="shop-info">
                    <h3>${shop.name}</h3>
                    <div class="shop-rating">
                        <i class="fas fa-star"></i>
                        <span>${shop.rating}</span>
                    </div>
                </div>
            </div>
            <div class="shop-meta">
                <span><i class="fas fa-map-marker-alt"></i> ${shop.distance}</span>
                <span><i class="fas fa-clock"></i> ${shop.deliveryTime}</span>
                <span><i class="fas fa-truck"></i> ${shop.deliveryFee}</span>
            </div>
            <div class="shop-actions">
                <button class="btn-view" onclick="viewShop(${shop.id})">
                    <i class="fas fa-eye"></i> View Products
                </button>
                <button class="btn-primary" onclick="orderFromShop(${shop.id})">
                    <i class="fas fa-shopping-cart"></i> Order Now
                </button>
            </div>
        </div>
    `;
    
    return shopCard;
}

// Filter by category
function filterByCategory(category) {
    currentFilter = category;
    loadShops();
    document.getElementById('categoryFilter').value = category;
}

// Filter shops
function filterShops() {
    currentFilter = document.getElementById('categoryFilter').value;
    loadShops();
}

// Sort shops
function sortShops() {
    const sortBy = document.getElementById('sortFilter').value;
    const shopsGrid = document.getElementById('shopsGrid');
    const shops = Array.from(shopsGrid.children);
    
    shops.sort((a, b) => {
        const ratingA = parseFloat(a.querySelector('.shop-rating span').textContent);
        const ratingB = parseFloat(b.querySelector('.shop-rating span').textContent);
        return sortBy === 'rating' ? ratingB - ratingA : 0;
    });
    
    shops.forEach(shop => shopsGrid.appendChild(shop));
}

// View shop
function viewShop(shopId) {
    const shop = shopsData.find(s => s.id === shopId);
    if (!shop) return;
    
    alert(`Viewing products from ${shop.name}`);
}

// Order from shop
function orderFromShop(shopId) {
    const shop = shopsData.find(s => s.id === shopId);
    if (!shop) return;
    
    const message = `Hi! I want to order from ${shop.name}. Can you please share your menu/products?`;
    const whatsappUrl = `https://wa.me/919876543210?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
}

// Cart functions
function addToCart(productId, name, price, image) {
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: productId,
            name: name,
            price: price,
            image: image,
            quantity: 1
        });
    }
    
    updateCartDisplay();
    showNotification('Item added to cart!');
}

function updateCartDisplay() {
    const cartCount = document.querySelector('.cart-count');
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
    
    cartItems.innerHTML = '';
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p style="text-align: center; color: #6b7280; padding: 20px;">Your cart is empty</p>';
    } else {
        cart.forEach(item => {
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <div class="cart-item-image">${item.image}</div>
                <div class="cart-item-content">
                    <div class="cart-item-title">${item.name}</div>
                    <div class="cart-item-price">₹${item.price}</div>
                    <div class="cart-item-actions">
                        <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                        <span>${item.quantity}</span>
                        <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                    </div>
                </div>
            `;
            cartItems.appendChild(cartItem);
        });
    }
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotal.textContent = `₹${total}`;
}

function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            cart = cart.filter(item => item.id !== productId);
        }
        updateCartDisplay();
    }
}

// Toggle cart
function toggleCart() {
    const cartSidebar = document.getElementById('cartSidebar');
    cartSidebar.classList.toggle('open');
}

// Checkout
function checkout() {
    if (cart.length === 0) {
        showNotification('Your cart is empty!', 'error');
        return;
    }
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    alert(`Order placed successfully! Total: ₹${total}`);
    
    cart = [];
    updateCartDisplay();
    toggleCart();
}

// Modal functions
function openLogin() {
    document.getElementById('loginModal').classList.add('open');
}

function closeLogin() {
    document.getElementById('loginModal').classList.remove('open');
}

function openVendorLogin() {
    document.getElementById('vendorModal').classList.add('open');
}

function closeVendorLogin() {
    document.getElementById('vendorModal').classList.remove('open');
}

function openTracking() {
    document.getElementById('trackingModal').classList.add('open');
}

function closeTracking() {
    document.getElementById('trackingModal').classList.remove('open');
}

// Search location
function searchLocation() {
    const location = document.getElementById('locationInput').value;
    if (location.trim()) {
        showNotification(`Searching for shops in ${location}...`);
        setTimeout(() => {
            document.getElementById('shops').scrollIntoView({ behavior: 'smooth' });
        }, 1000);
    } else {
        showNotification('Please enter a location', 'error');
    }
}

// Show notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'error' ? '#ef4444' : type === 'success' ? '#10b981' : '#2563eb'};
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        z-index: 10000;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        document.body.removeChild(notification);
    }, 3000);
}

// Close modals when clicking outside
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('modal')) {
        e.target.classList.remove('open');
    }
}); 