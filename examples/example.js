const BoxPacker = require('../src/')

BoxPacker.pack({
  container: {
    dimensions: [15, 20, 13],
    weight_limit: 50
  },
  items: [
    {
      dimensions: [2, 3, 5],
      weight: 47
    },
    {
      dimensions: [2, 3, 5],
      weight: 47
    },
    {
      dimensions: [3, 3, 1],
      weight: 24
    },

    {
      dimensions: [1, 1, 4],
      weight: 7
    }
  ]
})
  .then(packings => {
    console.dir(packings, {depth: null})
  })
  .catch(err => {
    // Handle error
    console.error(err)
  })
