const alpha = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"; //0 = A, 25 = Z

const iToA = i => {
  let current = i;

  let a = "";

  while (current > -1) {
    let digit = current % 26;
    a = alpha[digit] + "" + a;

    //This is not a straight number base conversion, we need to
    //treat A as
    current = Math.floor(current / 26) - 1;
  }

  return a;
};

const aToI = a => {
  let index = (alpha.indexOf(a[0]) + 1) * Math.pow(26, a.length - 1) - 1;

  for (let i = a.length - 1; i > 0; i--) {
    index += (alpha.indexOf(a[i]) + 1) * Math.pow(26, a.length - i - 1);
  }

  return index;
};

/*
 ** Получить массив листовых узлов
 */
const toLeaf = (arr = []) => {
  let tmp = []
  arr.forEach(item => {
      if (item.children) {
          tmp = tmp.concat(toLeaf(item.children))
      } else {
          tmp.push(item)
      }
  })
  return tmp
}
/*
 ** получить максимальную глубину - calCrossSpan
 */
const getMaxRow = (config) => {
  if (config) {
      return config.map(item => {
          return getMaxRow(item.children) + 1
      }).sort((a, b) => b - a)[0]
  } else {
      return 0
  }
}
/*
 ** Рассчитать количество перекрестных строк и перекрестных столбцов составного заголовка в соответствии с иерархическими отношениями структуры данных.
 */
const calCrossSpan = (arr = [], maxRow, level = 0) => {
  if (maxRow === undefined) {
    maxRow = getMaxRow(arr)
  }

  if (arr) {
    return arr.map((config) => {
      if (config.children) {
        let colspan = 0
        const children = calCrossSpan(config.children, maxRow - 1, level + 1)

        children.forEach((item) => {
          colspan += item.colspan
        })

        return {
          level,
          rowspan: 1,
          colspan,
          ...config,
          children
        }
      } else {
        return {
          level,
          rowspan: maxRow,
          colspan: 1,
          ...config
        }
      }
    })
  }
}

export {
  toLeaf,
  getMaxRow,
  calCrossSpan
}
