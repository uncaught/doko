module.exports = function override(config, env) {

  const babelLoader = config.module.rules[2].oneOf[1];

  //Also transpile the @doko/common module:
  delete babelLoader.include;
  babelLoader.exclude = /node_modules\/(?!(@doko)\/).*/;

  return config;
};
