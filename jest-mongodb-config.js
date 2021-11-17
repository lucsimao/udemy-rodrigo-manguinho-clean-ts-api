module.exports = {
  mongodbMemoryServerOptions: {
    binary: {
      version: 'latest',
      skipMD5: true,
      arch: 'x64',
    },
    instance: {
      dbName: 'jest',
    },
    autoStart: false,
  },
};
