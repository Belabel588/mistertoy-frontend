import { httpService } from './http.service.js'
import { utilService } from './util.service.js'

const BASE_URL = 'toy/'

export const toyService = {
  query,
  getById,
  save,
  remove,
  getEmptyToy,
  getDefaultFilter,
  get,
  getFilterFromSearchParams,
  getImportanceStats,
}

function query(filterBy = {}) {
  console.log('filterBy in toy.service query:', filterBy);
  return httpService.get(BASE_URL, filterBy)
  // .then(toys => {
  //       if (filterBy.name) {
  //         toys = toys.filter(toy => toy.name.toLowerCase().includes(filterBy.name.toLowerCase()));
  //       }
  //       if (filterBy.price) {
  //         toys = toys.filter(toy => toy.price <= filterBy.price);
  //       }
  //       if (filterBy.labels && filterBy.labels.length > 0) {
  //         toys = toys.filter(toy => filterBy.labels.every(label => toy.labels.includes(label)));
  //       }
  //       console.log('Filtered toys:', toys); // Debugging log
  //       return toys;
  //     });
}

function getById(toyId) {
  return httpService.get(BASE_URL + toyId)
}

function get(toyId) {
  return httpService.get(BASE_URL + toyId)
    .then(toy => {
      toy = _setNextPrevToyId(toy)
      return toy
    })
}

function remove(toyId) {
  return httpService.delete(BASE_URL + toyId)
}

function save(toy) {
  if (toy._id) {
    toy.updatedAt = Date.now()
    return httpService.put(BASE_URL + toy._id, toy)
  } else {
    toy.createdAt = toy.updatedAt = Date.now()
    return httpService.post(BASE_URL, toy)
  }
}

function getEmptyToy() {
  const label = ['On wheels', 'Box game', 'Art', 'Baby', 'Doll', 'Puzzle', 'Outdoor', 'Battery Powered'];
  const shuffledLabel = utilService.shuffleArray(label);
  const selectedLabel = shuffledLabel.slice(0, 2);

  return {
    name: 'Toy-' + (Date.now() % 1000),
    price: utilService.getRandomIntInclusive(10, 100),
    label: selectedLabel,
    inStock: utilService.getRandomIntInclusive(0, 1) ? true : false,
    createdAt: Date.now()
  }
}

function getDefaultFilter() {
  return { name: '', price: 0, inStock: false, label: [] }
}

function getFilterFromSearchParams(searchParams) {
  const defaultFilter = getDefaultFilter()
  const filterBy = {}
  for (const field in defaultFilter) {
    filterBy[field] = searchParams.get(field) || ''
  }
  return filterBy
}

function getImportanceStats() {
  return httpService.get(BASE_URL)
    .then(toys => {
      const toyCountByImportanceMap = _getToyCountByImportanceMap(toys)
      const data = Object.keys(toyCountByImportanceMap).map(speedName => ({ title: speedName, value: toyCountByImportanceMap[speedName] }))
      return data
    })
}

function _setNextPrevToyId(toy) {
  return httpService.get(BASE_URL).then((toys) => {
    const toyIdx = toys.findIndex((currToy) => currToy._id === toy._id)
    const nextToy = toys[toyIdx + 1] ? toys[toyIdx + 1] : toys[0]
    const prevToy = toys[toyIdx - 1] ? toys[toyIdx - 1] : toys[toys.length - 1]
    toy.nextToyId = nextToy._id
    toy.prevToyId = prevToy._id
    return toy
  })
}

function _getToyCountByImportanceMap(toys) {
  const toyCountByImportanceMap = toys.reduce((map, toy) => {
    if (toy.importance < 3) map.low++
    else if (toy.importance < 7) map.normal++
    else map.urgent++
    return map
  }, { low: 0, normal: 0, urgent: 0 })
  return toyCountByImportanceMap
}