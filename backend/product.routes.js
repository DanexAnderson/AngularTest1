module.exports = (app) => {
    const products = require('./product.controller.js');
    const checkAuth = require('./user/auth-check');

    // Create a new Product
    app.post('/products', checkAuth, products.create);

    // Retrieve all Products
    app.get('/products', products.findAll);

    // Retrieve a single Product with productId
    app.get('/products/:productId', products.findOne);

    // Update a Note with productId
    app.put('/products/:productId', checkAuth, products.update);

    // Delete a Note with productId
    app.delete('/products/:productId',  checkAuth, products.delete);
}
