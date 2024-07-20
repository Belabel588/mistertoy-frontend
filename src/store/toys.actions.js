import { toyService } from '../services/toy.service.js'
import { ADD_TOY, SET_TOYS, REMOVE_TOY, UPDATE_TOY, store, SET_IS_LOADING } from './store.js'

export function loadToys(filterBy) {
  store.dispatch({ type: SET_IS_LOADING, isLoading: true })

  return toyService.query(filterBy)
    .then(toys => store.dispatch({ type: SET_TOYS, toys }))
    .finally(() => store.dispatch({ type: SET_IS_LOADING, isLoading: false }))
}

export function removeToy(toyId) {
  return toyService.remove(toyId)
    .then(() => store.dispatch({ type: REMOVE_TOY, toyId }))
}

export function saveToy(toy) {
  const type = toy._id ? UPDATE_TOY : ADD_TOY

  return toyService.save(toy)
    .then(savedToy => store.dispatch({ type: type, toy: savedToy }))
}