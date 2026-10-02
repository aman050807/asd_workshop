const fs = require('fs/promises');
const path = require('path');
const pathToFile = path.join(__dirname, '../db.json');
async function readFile() {
    const data = await fs.readFile(pathToFile, 'utf8');
    return JSON.parse(data);
}
async function writeFile(products) {
    await fs.writeFile(
        pathToFile,
        JSON.stringify(products, null, 2)
    );
}
module.exports = {
    readFile,
    writeFile
};