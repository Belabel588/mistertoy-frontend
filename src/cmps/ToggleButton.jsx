import PropTypes from 'prop-types'

export function ToggleButton({ val, setVal }) {
  return (
    <label className="toggle-btn">
      <input type="checkbox" checked={val} onChange={ev => setVal(ev.target.checked)} />
      <div></div>
    </label>
  )
}

