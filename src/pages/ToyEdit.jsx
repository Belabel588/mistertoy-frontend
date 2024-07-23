import { toyService } from "../services/toy.service.js"
import { showErrorMsg, showSuccessMsg } from "../services/event-bus.service.js"

import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

export function ToyEdit() {

  const [toyToEdit, setToyToEdit] = useState(toyService.getEmptyToy())
  const navigate = useNavigate()
  const params = useParams()

  useEffect(() => {
    if (params.toyId) loadToy()
  }, [])

  function loadToy() {
    toyService.get(params.toyId)
      .then(setToyToEdit)
      .catch(err => console.log('err:', err))
  }

  function handleChange({ target }) {
    const field = target.name
    let value = target.value

    switch (target.type) {
      case 'number':
      case 'range':
        value = +value || ''
        break

      case 'checkbox':
        value = target.checked
        break

      default:
        break
    }

    setToyToEdit(prevToyToEdit => ({ ...prevToyToEdit, [field]: value }))
  }

  function onSaveToy(ev) {
    ev.preventDefault()
    toyService.save(toyToEdit)
      .then((savedToy) => {
        navigate('/toy')
        showSuccessMsg(`Toy Saved (id: ${savedToy._id})`)
      })
      .catch(err => {
        showErrorMsg('Cannot save toy')
        console.log('err:', err)
      })
  }

  const { name, Price, category } = toyToEdit

  return (
    <section className="toy-edit">
      <form onSubmit={onSaveToy} >
        <label htmlFor="name">Name:</label>
        <input onChange={handleChange} value={name} type="text" name="name" id="name" />

        <label htmlFor="Price">Price:</label>
        <input onChange={handleChange} value={Price} type="number" name="Price" id="Price" />

        <label htmlFor="category">Category:</label>
        <input onChange={handleChange} value={category} type="text" name="category" id="category" />

        <button>Save</button>
      </form>
    </section>
  )
}