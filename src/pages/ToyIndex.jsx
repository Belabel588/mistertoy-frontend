import { ToyFilter } from "../cmps/ToyFilter.jsx"
import { ToyList } from "../cmps/ToyList.jsx"
import { DataTable } from "../cmps/data-table/DataTable.jsx"
import { toyService } from "../services/toy.service.js"
import { showErrorMsg, showSuccessMsg } from "../services/event-bus.service.js"

import { loadToys, removeToy, saveToy } from "../store/toys.actions.js"
import { SET_FILTER_BY } from '../store/store.js'
// import * as toyActionsJs from "../store/toy.actions.js"

import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link, useSearchParams } from 'react-router-dom'

export function ToyIndex() {
  const dispatch = useDispatch()
  const toys = useSelector(state => state.toys)
  const isLoading = useSelector(state => state.isLoading)

  // Special hook for accessing search-params:
  const [searchParams, setSearchParams] = useSearchParams()

  const defaultFilter = toyService.getFilterFromSearchParams(searchParams)

  // const [filterBy, setFilterBy] = useState(defaultFilter)
  const filterBy = useSelector(state => state.filterBy)

  useEffect(() => {
    dispatch({ type: SET_FILTER_BY, filterBy: defaultFilter })
  }, [])

  useEffect(() => {
    setSearchParams(filterBy)
    loadToys(filterBy)
      .catch(err => {
        console.error('err:', err)
        showErrorMsg('Cannot load toys')
      })
  }, [filterBy])

  function setFilterBy(filterBy) {
    dispatch({ type: SET_FILTER_BY, filterBy })
  }

  function onRemoveToy(toyId) {
    removeToy(toyId)
      .then(() => showSuccessMsg(`Toy removed`))
    // .catch(err => showErrorMsg('Cannot remove toy ' + toyId))
  }

  function onToggleToy(toy) {
    const toyToSave = { ...toy, isInStock: !toy.isInStock }
    saveToy(toyToSave)
      .then(savedToy => showSuccessMsg(`Toy is ${(savedToy.isInStock) ? 'back in stock' : 'out of stock'}`))
    // .catch(err => showErrorMsg('Cannot toggle toy status'))
  }

  console.log('ToyIndex toys:', toys);
  return (
    <section className="toy-index">
      <ToyFilter filterBy={filterBy} onSetFilterBy={setFilterBy} />
      <div>
        <Link to="/toy/edit" className="btn" >Add Toy</Link>
      </div>
      <h2>Toys List</h2>
      {isLoading ? <div>Loading...</div> : <ToyList toys={toys} onRemoveToy={onRemoveToy} onToggleToy={onToggleToy} />}
      <hr />
      <h2>Toys Table</h2>
      <div style={{ width: '60%', margin: 'auto' }}>
        <DataTable toys={toys} onRemoveToy={onRemoveToy} />
      </div>
    </section>
  )
}