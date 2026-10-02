const test = require('node:test');
const assert = require('node:assert/strict');
const app = require('../app');

test('GET /health reports that the API is available', async () => {
    const server = app.listen(0);
    const { port } = server.address();

    try {
        const response = await fetch(`http://127.0.0.1:${port}/health`);

        assert.equal(response.status, 200);
        assert.deepEqual(await response.json(), { status: 'ok' });
    } finally {
        await new Promise((resolve, reject) => {
            server.close((error) => error ? reject(error) : resolve());
        });
    }
});
