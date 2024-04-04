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
    <div class="max-w-5xl mx-auto h-screen flex justify-center items-center">
      <Piano />
    </div>
  )
}

export default App
