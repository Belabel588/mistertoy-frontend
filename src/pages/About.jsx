import React from 'react'
import PropTypes from 'prop-types'


import { useRef, useState } from 'react'
import { Outlet, NavLink } from 'react-router-dom'

import { utilService } from '../services/util.service.js'
import { AboutTeam } from '../cmps/AboutTeam.jsx'
import { AboutVision } from '../cmps/AboutVision.jsx'

export function About() {
  const titleRef = useRef()
  const count = 1000001

  function onViewMore() {
    alert('curiosity killed the cat')
  }
  return (
    <section className="about">
      <h1 ref={titleRef}>About toys and us...</h1>
      <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Optio dolore sapiente, iste animi corporis nisi atque tempora assumenda dolores. Nobis nam dolorem rerum illo facilis nemo sit voluptatibus laboriosam necessitatibus!</p>
      <button onClick={() => {
        utilService.animateCSS(titleRef.current)
      }}>Animate</button>

      <nav>
        <NavLink to="/about/team">Team</NavLink> |
        <NavLink to="/about/vision">Vision</NavLink>
      </nav>

      <section>
        <Outlet />
      </section>
      <hr />
      <ul>
        {['Ja', 'Ka', 'La'].map(name => <React.Fragment key={name}>
          <li>{name}</li>
          <li className="divider">---</li>
        </React.Fragment>)}
      </ul>
      <hr />
      <FancyBox title="Hola!" onClose={() => console.log('ok, closing')}>
        <h3>{count.toLocaleString()} Followers</h3>
        <button onClick={onViewMore}>Tell me More</button>
      </FancyBox>
      <hr />
      <h3>Click to resize:</h3>
      <SplitPane
        left={
          <AboutTeam />
        }
        right={
          <AboutVision />
        }
      />

      <hr />
    </section>
  )
}

function FancyBox({ title = 'Hello', onClose, children }) {
  return <div className="fancy-box">
    <button style={{ float: 'right' }} onClick={onClose}>x</button>
    <h3>{title}</h3>
    {children}
  </div>
}

function SplitPane(props) {

  const [width, setWidth] = useState(30)

  return (
    <div className="split-pane" style={{
      display: 'flex'
    }}>
      <div style={{ width: width + '%' }} onClick={() => {
        if (width + 10 <= 100) setWidth(width + 10)
      }}>
        {props.left}
      </div>
      <div style={{ flex: 1 }} onClick={() => {
        if (width > 10) setWidth(width - 10)
      }}>
        {props.right}
      </div>
    </div>
  )
}