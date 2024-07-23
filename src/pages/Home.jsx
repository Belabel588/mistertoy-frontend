import { ToggleButton } from "../cmps/ToggleButton.jsx"

import { useState } from 'react'
import { useSelector } from 'react-redux'

export function Home() {
  const counter = useSelector(state => state.counter)
  const [isOn, setIsOn] = useState(false)

  return (
    <section className="home">
      <h1>Toys R Us!</h1>
      <p>{counter}</p>
      <ToggleButton val={isOn} setVal={setIsOn} />
      {isOn && <img src="../assets/img/toy.png" alt="" />}
    </section>
  )
}