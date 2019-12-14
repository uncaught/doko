module.exports = function override(config, env) {

  //Also transpile the @doko/common module:
  delete config.module.rules[2].oneOf[1].include;
  config.module.rules[2].oneOf[1].exclude = /node_modules\/(?!(@doko)\/).*/;

  return config;
};
