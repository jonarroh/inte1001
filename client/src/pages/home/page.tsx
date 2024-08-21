import { useState } from "react"


function HomePage() {

  const [count, setCount] = useState(0)

  function increment() {
    setCount(count + 1)
  }

  return (
    <main>
      <h1>Contador </h1>
      <p>Contador: {count}</p>
      <button
      onClick={increment}
      >Incrementar</button>

    </main>
  )
}

export default HomePage

