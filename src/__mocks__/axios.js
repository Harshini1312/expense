// Simple CommonJS mock for axios to avoid ESM issues in Jest
module.exports = {
  create: () => ({
    get: () => Promise.resolve({ data: {} }),
    post: () => Promise.resolve({ data: {} }),
    put: () => Promise.resolve({ data: {} }),
    delete: () => Promise.resolve({ data: {} }),
  }),
};
