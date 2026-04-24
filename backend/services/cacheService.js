// cacheService.js

const cache = new Map();

function getCache(key) {
    return cache.get(key);
}

function setCache(key, value) {
    cache.set(key, value);
}

function hasCache(key) {
    return cache.has(key);
}

module.exports = { getCache, setCache, hasCache };