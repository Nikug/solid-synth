import { onCleanup, onMount, type Component } from "solid-js"
import { Piano } from "./components/Piano"
import { initializeKeyboard, teardownKeyboard } from "./audio/keyboardController"

const App: Component = () => {
  onMount(() => {
    initializeKeyboard()
  })

  onCleanup(() => {
    teardownKeyboard()
  })

  return (
    <div class="w-screen h-screen bg-red-100 text-gray-700">
      <div class="max-w-6xl mx-auto h-screen flex justify-center items-center">
        <Piano />
      </div>
    </div>
  )
}

export default App
