const productService = require('../services/productService');
const { setCache,invalidateCache} = require('../middleware/cache');

function sendError(res, err) {
    const status = err.statusCode || 500;
    if (status === 500) {
        console.error(err);
    }
    return res.status(status).json({ message: err.message || 'Server error' });
}

async function getProducts(req, res) {
    try {
        const products = await productService.getProducts();
        setCache(req.originalUrl, products);
        res.setHeader('X-Cache', 'MISS');
        return res.json(products);
    } catch (err) {
        return sendError(res, err);
    }
}
async function getProductById(req, res) {
    try {
        const product = await productService.getProductById(
            req.params.id
        );
        if (!product) {
            return res.status(404).json({
                message: 'Product not found'
            });
        }
        setCache(req.originalUrl, product);
        res.setHeader('X-Cache', 'MISS');
        return res.json(product);
    } catch (err) {
        return sendError(res, err);
    }
}
async function createProduct(req, res) {
    try {
        const product = await productService.createProduct(req.body);
        invalidateCache();
        return res.status(201).json(product);

    } catch (err) {
        return sendError(res, err);
    }
}
async function updateProduct(req, res) {
    try {
        const product = await productService.updateProduct(
            req.params.id,
            req.body
        );
        if (!product) {
            return res.status(404).json({
                message: 'Product not found'
            });
        }
        invalidateCache();
        return res.json(product);
    } catch (err) {
        return sendError(res, err);
    }
}
async function patchProduct(req, res) {
    try {
        const product = await productService.patchProduct(
            req.params.id,
            req.body
        );
        if (!product) {
            return res.status(404).json({
                message: 'Product not found'
            });
        }
        invalidateCache();
        return res.json(product);
    } catch (err) {
        return sendError(res, err);
    }
}
async function deleteProduct(req, res) {
    try {
        const product = await productService.deleteProduct(
            req.params.id
        );
        if (!product) {
            return res.status(404).json({
                message: 'Product not found'
            });
        }
        invalidateCache();
        return res.json({
            message: 'Product deleted successfully',
            product
        });
    } catch (err) {
        return sendError(res, err);
    }
}
module.exports = {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    patchProduct,
    deleteProduct
};
