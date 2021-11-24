module.exports = {
  mongodbMemoryServerOptions: {
    binary: {
      version: '4.0.3',
      skipMD5: true,
      arch: 'x64',
    },
    instance: {
      dbName: 'jest',
    },
    autoStart: false,
  },
};
