import { Keymap, Octave } from "../constants"
import { presetSettings } from "../presets/presetStore"
import { audioContext } from "./audioContextWrapper"
import { addNote, removeNote, setOctave } from "./noteStore"
import { settings } from "./settingsStore"

export const initializeKeyboard = () => {
  addEventListener("keydown", handleKeyDown)
  addEventListener("keyup", handleKeyUp)
  addEventListener("keydown", handleOctaveKey)
}

export const teardownKeyboard = () => {
  removeEventListener("keydown", handleKeyDown)
  removeEventListener("keyup", handleKeyUp)
  removeEventListener("keydown", handleOctaveKey)
}

const handleKeyDown = (event: KeyboardEvent) => {
  if (presetSettings.showSavePopup) return

  if (event.repeat) return

  if (!settings.active && event.key.length === 1) {
    audioContext()
  }

  if (Keymap[event.code]) {
    let octave = settings.octave
    if (event.code === "KeyL") {
      octave += 1
    }
    event.preventDefault()
    addNote(Keymap[event.code], octave)
  }
}

const handleKeyUp = (event: KeyboardEvent) => {
  if (presetSettings.showSavePopup) return
  if (event.repeat) return
  if (Keymap[event.code]) {
    let octave = settings.octave
    if (event.code === "KeyL") {
      octave += 1
    }
    event.preventDefault()
    removeNote(Keymap[event.code], octave)
  }
}

const handleOctaveKey = (event: KeyboardEvent) => {
  if (event.code === "ArrowUp") {
    event.preventDefault()
    setOctave((settings.octave + 1) as Octave)
  } else if (event.code === "ArrowDown") {
    event.preventDefault()
    setOctave((settings.octave - 1) as Octave)
  }
}
