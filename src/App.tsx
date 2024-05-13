import { Show, onCleanup, onMount, type Component } from "solid-js"
import { Piano } from "./components/Piano"
import { initializeKeyboard, teardownKeyboard } from "./audio/keyboardController"
import { PresetPopup } from "./components/PresetPopup"
import { presetSettings } from "./presets/presetStore"

const App: Component = () => {
  onMount(() => {
    initializeKeyboard()
  })

  onCleanup(() => {
    teardownKeyboard()
  })

  return (
    <div class="w-screen min-h-screen bg-red-100 text-gray-700">
      <div class="max-w-6xl mx-auto min-h-screen flex justify-center items-start py-24">
        <Piano />
      </div>
      <Show when={presetSettings.showSavePopup}>
        <PresetPopup />
      </Show>
    </div>
  )
}

export default App
