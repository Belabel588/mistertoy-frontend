import { eventBusService } from "../services/event-bus.service.js"

import { useState, useEffect } from 'react'

export function UserMsg() {

  const [msg, setMsg] = useState(null)

  useEffect(() => {
    const unsubscribe = eventBusService.on('show-toy-msg', msg => {
      setMsg(msg)
      setTimeout(onCloseMsg, 1500)
    })

    return () => {
      unsubscribe()
    }
  }, [])

  function onCloseMsg() {
    setMsg(null)
  }

  if (!msg) return null

  return (
    <section className={"user-msg " + msg.type}>
      <p>{msg.txt}</p>
    </section>
  )
}