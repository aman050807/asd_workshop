const {readFile,writeFile} = require('../database/db');

function validateProduct(data) {
    if (!data || typeof data.name !== 'string' || !data.name.trim()) {
        const error = new Error('Product name is required');
        error.statusCode = 400;
        throw error;
    }
    if (!Number.isFinite(Number(data.price)) || Number(data.price) < 0) {
        const error = new Error('Product price must be a non-negative number');
        error.statusCode = 400;
        throw error;
    }
}
async function getProducts() {
    const products = await readFile();
    return products;
}
async function getProductById(id) {
    const products = await readFile();
    id = Number(id);
    const product = products.find((item) => {
        return item.id === id;
    });
    return product;
}
async function createProduct(product) {
    validateProduct(product);
    const products = await readFile();
    const nextId = products.reduce((highestId, item) => {
        return Math.max(highestId, Number(item.id) || 0);
    }, 0) + 1;
    const newProduct = {
        ...product,
        id: nextId
    };
    products.push(newProduct);
    await writeFile(products);
    return newProduct;
}
async function updateProduct(id, data) {
    validateProduct(data);
    const products = await readFile();
    const index = products.findIndex((item) => {
        return item.id === Number(id);
    });
    if (index === -1) {
        return null;
    }
    products[index] = {
        ...products[index],
        ...data
    };
    await writeFile(products);
    return products[index];
}
async function patchProduct(id, data) {
    const existingProduct = await getProductById(id);
    if (!existingProduct) {
        return null;
    }
    return updateProduct(id, { ...existingProduct, ...data });
}
async function deleteProduct(id) {
    const products = await readFile();

    const index = products.findIndex((item) => {
        return item.id === Number(id);
    });
    if (index === -1) {
        return null;
    }
    const deletedProduct = products.splice(index, 1)[0];
    await writeFile(products);
    return deletedProduct;
}
module.exports = {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    patchProduct,
    deleteProduct
};
