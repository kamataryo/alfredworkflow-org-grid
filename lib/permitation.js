const permitation = (arr1, arr2) => {
  const result = []

  arr1
    .filter(elm => !!elm)
    .forEach(elm1 =>
      arr2
        .filter(elm => !!elm)
        .forEach(elm2 => {
          result.push([elm1, elm2])
          result.push([elm2, elm1])
        })
    )

  return result
}

module.exports = permitation
