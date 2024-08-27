import { useState } from "react"


function HomePage() {

  const [count, setCount] = useState(0)

  function increment() {
    setCount(count + 1)
  }

  return (
    <main>
      <h1 className="text-3xl font-bold underline">
      Hello world!
    </h1>
      <h1>Contador </h1>
      <p>Contador: {count}</p>
      <button
      onClick={increment}
      >Incrementar</button>

    </main>
  )
}

export default HomePage



