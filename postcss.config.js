module.exports = {
    plugins: [
      require('postcss-uncss')({
        html: [
          './src/index.html'
        ],
        ignore: [
        ]
    }),
      require('cssnano')({
        preset: 'default'
    })
    ]
}
