let walletBalance = 540.00;

function navigateTo(screenId) {
    // Hide all screens
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });

    // Show target screen
    const target = document.getElementById(`screen-${screenId}`);
    if (target) {
        target.classList.add('active');
    }

    // Handle bottom nav visibility
    const mainNav = document.getElementById('main-nav');
    if (screenId === 'login' || screenId === 'confirmation') {
        mainNav.style.display = 'none';
    } else {
        mainNav.style.display = 'flex';
    }

    // Update active state in bottom nav
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
        if (item.innerText.toLowerCase() === screenId.replace('order-', '')) {
            item.classList.add('active');
        }
    });

    // Scroll to top
    window.scrollTo(0, 0);
}

function confirmOrder(mealName, price) {
    if (walletBalance < price) {
        alert('Insufficient balance in wallet!');
        return;
    }

    // Update wallet
    walletBalance -= price;
    document.getElementById('wallet-balance').innerText = walletBalance.toFixed(2);

    // Set confirmation details
    document.getElementById('conf-meal-name').innerText = mealName;
    document.getElementById('conf-price').innerText = `₹${price.toFixed(2)}`;
    document.getElementById('conf-balance').innerText = `₹${walletBalance.toFixed(2)}`;
    document.getElementById('conf-order-id').innerText = `#ORD-${Math.floor(Math.random() * 9000) + 1000}`;

    // Add to history (simple mock)
    const historyList = document.querySelector('.history-list');
    const newItem = document.createElement('div');
    newItem.className = 'card history-item';
    newItem.innerHTML = `
        <div>
            <h3>${mealName}</h3>
            <p>Just now</p>
        </div>
        <div class="status-badge status-pending">Pending</div>
    `;
    historyList.prepend(newItem);

    // Navigate to confirmation
    navigateTo('confirmation');
}

// Initial state
window.onload = () => {
    // Check if we should start at home or login
    // For demo purposes, we stay on login
};
