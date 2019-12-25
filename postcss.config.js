module.exports = {
    plugins: [
      require('postcss-uncss')({
        html: [
          './index.html'
        ],
        ignore: [
        ]
    }),
      require('cssnano')({
        preset: 'default'
    })
    ]
}
