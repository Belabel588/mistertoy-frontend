import { utilService } from './util.service.js'
import { storageService } from './async-storage.service.js'

const TOY_KEY = 'toyDB'
const labels = ['On wheels', 'Box game', 'Art', 'Baby', 'Doll', 'Puzzle',
  'Outdoor', 'Battery Powered']

_createToys()
export const toyService = {
  query,
  get,
  remove,
  save,
  getEmptyToy,
  getDefaultFilter,
  getFilterFromSearchParams,
  getImportanceStats,
}

window.cs = toyService

function query(filterBy = {}) {
  return storageService.query(TOY_KEY)
    .then(toys => {
      if (filterBy.txt) {
        const regExp = new RegExp(filterBy.txt, 'i')
        toys = toys.filter(toy => regExp.test(toy.txt))
      }

      if (filterBy.status) {
        const isDone = filterBy.status === 'done'
        toys = toys.filter(toy => toy.isDone === isDone)
      }

      if (filterBy.importance) {
        toys = toys.filter(toy => toy.importance >= filterBy.importance)
      }
      return toys
    })
}

function get(toyId) {
  return storageService.get(TOY_KEY, toyId)
    .then(toy => {
      toy = _setNextPrevToyId(toy)
      return toy
    })
}

function remove(toyId) {
  return storageService.remove(TOY_KEY, toyId)
}

function save(toy) {
  if (toy._id) {
    // TODO - updatable fields
    toy.updatedAt = Date.now()
    return storageService.put(TOY_KEY, toy)
  } else {
    toy.createdAt = toy.updatedAt = Date.now()

    return storageService.post(TOY_KEY, toy)
  }
}

function getEmptyToy(name = '', price = 0, labels = []) {
  return {
    _id: utilService.makeId(),
    name,
    price,
    labels,
    createdAt: Date.now(),
    inStock: true,
  }
}

function getDefaultFilter() {
  return { txt: '', importance: 0, status: 'all' }
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
  return storageService.query(TOY_KEY)
    .then(toys => {
      const toyCountByImportanceMap = _getToyCountByImportanceMap(toys)
      const data = Object.keys(toyCountByImportanceMap).map(speedName => ({ title: speedName, value: toyCountByImportanceMap[speedName] }))
      return data
    })

}

function _createToys() {
  let toys = utilService.loadFromStorage(TOY_KEY)
  if (!toys || !toys.length) {
    toys = []
    const txts = ['Learn React', 'Master CSS', 'Practice Redux']
    for (let i = 0; i < 20; i++) {
      const txt = txts[utilService.getRandomIntInclusive(0, txts.length - 1)]
      toys.push(_createToy(txt + (i + 1), utilService.getRandomIntInclusive(1, 10)))
    }
    utilService.saveToStorage(TOY_KEY, toys)
  }
}

function _createToy(txt, importance) {
  const toy = getEmptyToy(txt, importance)
  toy._id = utilService.makeId()
  toy.createdAt = toy.updatedAt = Date.now() - utilService.getRandomIntInclusive(0, 1000 * 60 * 60 * 24)
  return toy
}

function _setNextPrevToyId(toy) {
  return storageService.query(TOY_KEY).then((toys) => {
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