import { useEffect, useState } from 'react'
import { Chart } from '../cmps/Chart.jsx'
import { toyService } from '../services/toy.service.js'

export function Dashboard() {

  const [toys, setToys] = useState([])
  const [ageRangeStats, setAgeRangeStats] = useState([])

  useEffect(() => {
    toyService.query()
      .then(setToys)
    toyService.getAgeRangeStats()
      .then(setAgeRangeStats)
  }, [])


  return (
    <section className="dashboard">
      <h1>Dashboard</h1>
      <h2>Statistics for {toys.length} Toys</h2>
      <hr />
      <h4>By Age Range</h4>
      <Chart data={ageRangeStats} />
    </section>
  )
}