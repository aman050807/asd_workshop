const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;
const FILE_PATH = path.join(__dirname, 'products.json');


const getProductsData = () => {
    try {
        const jsonData = fs.readFileSync(FILE_PATH, 'utf-8');
        return JSON.parse(jsonData);
    } catch (error) {
        console.error("Error reading file:", error);
        return [];
    }
};

const saveProductsData = (data) => {
    try {
        fs.writeFileSync(FILE_PATH, JSON.stringify(data, null, 2), 'utf-8');
    } catch (error) {
        console.error("Error writing file:", error);
    }
};


app.get('/products', (req, res) => {
    const products = getProductsData();
    res.json(products);
});

app.get('/products/:id', (req, res) => {
    const products = getProductsData();
    const productId = req.params.id; 
    const product = products.find(p => String(p.id) === productId);

    if (!product) {
        return res.status(404).json({ error: "Product not found" });
    }

    res.json(product);
});

app.post('/products', (req, res) => {
    const products = getProductsData();
    const newProduct = req.body;

    if (!newProduct.name || !newProduct.price) {
        return res.status(400).json({ error: "Product name and price are required" });
    }
    newProduct.id = products.length > 0 ? String(Number(products[products.length - 1].id) + 1) : "1";

    products.push(newProduct);
    saveProductsData(products);
    res.status(201).json(newProduct);
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

