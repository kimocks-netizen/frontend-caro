module.exports = {
  parser: '@typescript-eslint/parser',
  extends: [
    'plugin:@typescript-eslint/recommended',
    // ... other configs
  ],
  rules: {
    '@typescript-eslint/no-explicit-any': 'off',
    // other rules you want to override
  },
};

