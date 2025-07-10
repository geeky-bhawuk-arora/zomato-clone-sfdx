// cartService.js (Singleton module)

const cart = {};

const addItem = (restaurantId, item) => {
    if (!cart[restaurantId]) {
        cart[restaurantId] = [];
    }

    const existingIndex = cart[restaurantId].findIndex(i => i.Id === item.Id);
    if (existingIndex !== -1) {
        cart[restaurantId][existingIndex].Quantity += item.Quantity;
        cart[restaurantId][existingIndex].LineTotal += item.LineTotal;
    } else {
        cart[restaurantId].push({ ...item });
    }
};

const getCart = () => {
    return JSON.parse(JSON.stringify(cart)); // return deep copy
};

const clearCart = () => {
    for (let key in cart) {
        delete cart[key];
    }
};

export {
    addItem,
    getCart,
    clearCart
};
