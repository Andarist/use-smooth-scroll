module.exports = {
  presets: [
    [
      '@babel/env',
      {
        loose: true,
        modules: false,
      },
    ],
  ],
  plugins: [
    'macros',
    process.env.NODE_ENV === 'test' && '@babel/transform-modules-commonjs',
  ].filter(Boolean),
}
