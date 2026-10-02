const cache = {};
const TTL = 60 * 1000; 
function cacheMiddleware(req, res, next) {
    const key = req.originalUrl;
    const cached = cache[key];
    if (!cached) {
        res.setHeader('X-Cache', 'MISS');
        return next();
    }
    const age = Date.now() - cached.createdAt;
    if (age >= TTL) {
        delete cache[key];
        res.setHeader('X-Cache', 'MISS');
        return next();
    }
    res.setHeader('X-Cache', 'HIT');
    return res.json(cached.data);
}
function setCache(key, data) {
    cache[key] = {
        data: data,
        createdAt: Date.now()
    };
}
function invalidateCache() {
    Object.keys(cache).forEach((key) => {
        delete cache[key];
    });
}
module.exports = {
    cacheMiddleware,
    setCache,
    invalidateCache
};