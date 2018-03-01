const BoxPacker = require('../src/index')

test('Algorithm should calculate optimal values (port of original ruby test)', () => {
  BoxPacker.pack({
    container: {
      dimensions: [16, 20, 13],
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
      expect(packings.length).toBe(3)
      expect(packings[0].weight).toBe(47.0)
      expect(packings[0].placements.length).toBe(1)
      expect(packings[0].placements[0].dimensions).toEqual([5, 3, 2])
      expect(packings[0].placements[0].position).toEqual([0, 0, 0])
      expect(packings[1].weight).toBe(47.0)
      expect(packings[1].placements.length).toBe(1)
      expect(packings[1].placements[0].dimensions).toEqual([5, 3, 2])
      expect(packings[1].placements[0].position).toEqual([0, 0, 0])
      expect(packings[2].weight).toBe(31.0)
      expect(packings[2].placements.length).toBe(2)
      expect(packings[2].placements[0].dimensions).toEqual([3, 3, 1])
      expect(packings[2].placements[0].position).toEqual([0, 0, 0])
      expect(packings[2].placements[1].dimensions).toEqual([4, 1, 1])
      expect(packings[2].placements[1].position).toEqual([3, 0, 0])
    })
    .catch(err => fail(new Error(err.message)))
})

test('Algorithm should fail as no weight is given (port of original ruby test)', () => {
  BoxPacker.pack({
    container: {
      dimensions: [13, 15, 20]
    },
    items: [
      {
        dimensions: [2, 3, 5]
      },
      {
        dimensions: [2, 3, 5]
      },
      {
        dimensions: [3, 3, 1]
      },
      {
        dimensions: [1, 1, 4]
      },
    ]
  })
    .then(packings => {
      expect(packings.length).toBe(1)
      expect(packings[0].weight).toBe(NaN)
      expect(packings[0].placements.length).toBe(4)
    })
    .catch(err => fail(new Error(err.message)))

})

test('Algorithm should fail because item is heavier than container weight_limit', () => {
  BoxPacker.pack({
    container: {
      dimensions: [16, 20, 13],
      weight_limit: 50
    },
    items: [
      {
        dimensions: [2, 3, 5],
        weight: 60
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
    .then(() => {
      fail(new Error('Pack promise should reject, not resolve'))
    })
    .catch(err => {
      const message = 'Item is too heavy for container'
      expect(err.message).toBe(message)
    })
})

test('Test place method', () => {
  const item = {
    dimensions: [2, 3, 5],
    weight: 47
  }
  const space = {
    dimensions: [20, 15, 13],
    position: [0, 0, 0]
  }
  const result = BoxPacker.place(item, space)
  const expected = {
    dimensions: [5, 3, 2],
    position: [0, 0, 0],
    weight: 47.0
  }
  expect(result).toEqual(expected)
})

test('Test breakUpSpace method', () => {
  const space = {
    dimensions: [20, 15, 13],
    position: [0, 0, 0]
  }
  const placement = {
    dimensions: [5, 3, 2],
    position: [0, 0, 0],
    weight: 47.0
  }
  const result = BoxPacker.breakUpSpace(space, placement)
  const expected = [
    {
      dimensions: [15, 15, 13],
      position: [5, 0, 0]
    },
    {
      dimensions: [5, 12, 13],
      position: [0, 3, 0]
    },
    {
      dimensions: [5, 3, 11],
      position: [0, 0, 2]
    }
  ]
  expect(result).toEqual(expected)
})