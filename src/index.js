const rejectPromise = (message) => {
  return Promise.reject({
    message
  })
}

const pack = ({container, items}) => {
  let packings = []
  const itemsLength = items.length - 1
  for (let i = 0; i <= itemsLength; ++i) {

    // If the item is just too big for the container lets give up on this
    if (parseFloat(items[i].weight) > parseFloat(container.weight_limit)) {
      return rejectPromise('Item is too heavy for container')
    }

    // Need a bool so we can break out nested loops once it's been packed
    let itemHasBeenPacked = false

    if (packings && packings.length !== 0) {
      const packingsLength = packings.length - 1
      for (let j = 0; j <= packingsLength; ++j) {
        // If this packings going to be too big with this
        // item as well then skip on to the next packing
        if (packings[j].weight + items[i].weight > container.weight_limit) {
          continue
        }

        const packingSpacesLength = packings[j].spaces.length - 1
        for (let k = 0; k <= packingSpacesLength; ++k) {
          // Try placing the item in this space,
          // if it doesn't fit skip on the next space
          const placement = place(items[i], packings[j].spaces[k])
          if (placement === null) continue

          packings[j].placements.push(placement)
          packings[j].weight += items[i].weight
          const currSpace = packings[j].spaces[k]
          packings[j].spaces.splice(k, 1)
          packings[j].spaces.push(breakUpSpace(currSpace, placement))
          itemHasBeenPacked = true
          break
        }
        if (itemHasBeenPacked) break
      }
      if (itemHasBeenPacked) continue
    }
    const space = {
      dimensions: container.dimensions.sort().reverse(),
      position: [0, 0, 0]
    }

    const placement = place(items[i], space)
    if (placement === null) return rejectPromise('Item cannot be placed in container')

    packings.push({
      placements: [placement],
      weight: items[i].weight || 0,
      spaces: breakUpSpace(space, placement)
    })
  }
  return Promise.resolve(packings)
}

const place = (item, space) => {
  item.dimensions = item.dimensions.sort().reverse()
  const itemWidth = item.dimensions[0]
  const itemHeight = item.dimensions[1]
  const itemLength = item.dimensions[2]

  const permutations = [
    [itemWidth, itemHeight, itemLength],
    [itemWidth, itemLength, itemHeight],
    [itemHeight, itemWidth, itemLength],
    [itemHeight, itemLength, itemWidth],
    [itemLength, itemWidth, itemHeight],
    [itemLength, itemHeight, itemWidth]
  ]

  for (let i = 0; i < permutations.length - 1; ++i) {
    // Skip if the item does not fit with this orientation
    if (permutations[i][0] >= space.dimensions[0] ||
      permutations[i][1] >= space.dimensions[1] ||
      permutations[i][2] >= space.dimensions[2]) {
      continue
    }

    return {
      dimensions: permutations[i],
      position: space.position,
      weight: item.weight
    }
  }
  return null
}

const breakUpSpace = (space, placement) => {
  return [
    {
      dimensions: [
        space.dimensions[0] - placement.dimensions[0],
        space.dimensions[1],
        space.dimensions[2]
      ],
      position: [
        space.position[0] + placement.dimensions[0],
        space.position[1],
        space.position[2]
      ]
    }
    , {
      dimensions: [
        placement.dimensions[0],
        space.dimensions[1] - placement.dimensions[1],
        space.dimensions[2]
      ],
      position: [
        space.position[0],
        space.position[1] + placement.dimensions[1],
        space.position[2]
      ]
    }
    , {
      dimensions: [
        placement.dimensions[0],
        placement.dimensions[1],
        space.dimensions[2] - placement.dimensions[2]
      ],
      position: [
        space.position[0],
        space.position[1],
        space.position[2] + placement.dimensions[2]
      ]
    }
  ]
}

module.exports = {pack, place, breakUpSpace}