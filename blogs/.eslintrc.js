module.exports = {
  'env': {
    // 'browser': true,  // error  'process' is not defined        no-undef
    'node': true,
    'commonjs': true,
    'es2021': true
  },
  'extends': 'eslint:recommended',
  'parserOptions': {
    'ecmaVersion': 'latest'
  },
  'rules': {
    'indent': [
      'error',
      2
    ],
    // 'linebreak-style': [
    //   'error',
    //   // 'unix'
    //   'windows'  // NOTE: 1st way
    // ],
    'linebreak-style': 0,  // NOTE: 2nd way
    'quotes': [
      'error',
      'single'
    ],
    'semi': [
      'error',
      'never'
    ],
    'eqeqeq': 'error',
    'no-trailing-spaces': 'error',
    'object-curly-spacing': [
      'error', 'always'
    ],
    'arrow-spacing': [
      'error', { 'before': true, 'after': true }
    ],
    'no-console': 0,
  }
}