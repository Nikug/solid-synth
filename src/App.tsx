import type { Component } from "solid-js"
import { Piano } from "./components/Piano"

const App: Component = () => {
  return (
    <div class="max-w-5xl mx-auto h-screen flex justify-center items-center">
      <Piano />
    </div>
  )
}

export default App
