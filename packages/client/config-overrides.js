module.exports = function override(config, env) {

  const babelLoader = config.module.rules[1].oneOf[2];
  if (!babelLoader.loader.includes('babel-loader')) {
    throw new Error('Not the babel-loader');
  }

  const include = babelLoader.include;
  if (typeof include !== 'string' || !include.includes('/client/')) {
    throw new Error(`Expected string with 'client' inside, got ${JSON.stringify(include)}`);
  }

  //Also transpile the @doko/common module:
  babelLoader.include = [
    include,
    include.replace('/client/', '/common/'),
  ];

  return config;
};
