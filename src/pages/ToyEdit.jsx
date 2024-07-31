import { toyService } from "../services/toy.service.js"
import { showErrorMsg, showSuccessMsg } from "../services/event-bus.service.js"

import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

export function ToyEdit() {
  const [toyToEdit, setToyToEdit] = useState(null)
  const navigate = useNavigate()
  const params = useParams()

  useEffect(() => {
    if (params.toyId) loadToy()
    else setToyToEdit(toyService.getEmptyToy())
  }, [params.toyId])

  const loadToy = async () => {
    try {
      const toy = await toyService.getById(params.toyId)
      setToyToEdit(toy)
    } catch (err) {
      showErrorMsg('Cannot load toy')
      navigate('/toy')
    }
  }

  const handleChange = (ev) => {
    const { name, value } = ev.target
    setToyToEdit(prevToy => ({ ...prevToy, [name]: value }))
  }

  const onSaveToy = async (ev) => {
    ev.preventDefault()
    try {
      await toyService.save(toyToEdit)
      showSuccessMsg('Toy saved!')
      navigate('/toy')
    } catch (err) {
      showErrorMsg('Cannot save toy')
    }
  }

  if (!toyToEdit) return <div>Loading...</div>

  return (
    <section>
      <h2>{toyToEdit._id ? 'Edit' : 'Add'} Toy</h2>
      <form onSubmit={onSaveToy}>
        <label>
          Name:
          <input type="text" name="name" value={toyToEdit.name || ''} onChange={handleChange} />
        </label>
        <label>
          Price:
          <input type="number" name="price" value={toyToEdit.price || 0} onChange={handleChange} />
        </label>
        <label>
          In Stock:
          <input type="checkbox" name="inStock" checked={toyToEdit.inStock || false} onChange={handleChange} />
        </label>
        <button type="submit">Save</button>
      </form>
    </section>
  )
}