import { toyService } from "../services/toy.service.js"
import { createStore } from 'redux'

export const INCREMENT = 'INCREMENT'

export const SET_TOYS = 'SET_TOYS'
export const REMOVE_TOY = 'REMOVE_TOY'
export const ADD_TOY = 'ADD_TOY'
export const UPDATE_TOY = 'UPDATE_TOY'

export const SET_FILTER_BY = 'SET_FILTER_BY'

export const SET_IS_LOADING = 'SET_IS_LOADING'

const initialState = {
  counter: 100,
  toys: [],
  filterBy: toyService.getDefaultFilter(),
  isLoading: false,
}

function appReducer(state = initialState, action) {
  switch (action.type) {
    case INCREMENT:
      return { ...state, counter: state.counter + 1 }

    case SET_TOYS:
      return { ...state, toys: action.toys }

    case REMOVE_TOY:
      var toys = state.toys.filter(toy => toy._id !== action.toyId)
      return { ...state, toys }

    case ADD_TOY:
      return { ...state, toys: [...state.toys, action.toy] }

    case UPDATE_TOY:
      toys =
        state.toys.map(toy =>
          toy._id === action.toy._id ? action.toy : toy)
      return { ...state, toys }

    case SET_FILTER_BY:
      return { ...state, filterBy: action.filterBy }

    case SET_IS_LOADING:
      return { ...state, isLoading: action.isLoading }

    default:
      return state
  }
}

export const store = createStore(appReducer)
window.gStore = store