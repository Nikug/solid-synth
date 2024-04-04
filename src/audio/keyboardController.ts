import { Keymap } from "../constants"
import { addNote, noteBuffer, removeNote, setOctave } from "./noteStore"

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
  if (event.repeat) return
  if (Keymap[event.code]) {
    event.preventDefault()
    addNote(Keymap[event.code])
  }
}

const handleKeyUp = (event: KeyboardEvent) => {
  if (event.repeat) return
  if (Keymap[event.code]) {
    event.preventDefault()
    removeNote(Keymap[event.code])
  }
}

const handleOctaveKey = (event: KeyboardEvent) => {
  if (event.code === "ArrowUp") {
    event.preventDefault()
    setOctave(noteBuffer.octave + 1)
  } else if (event.code === "ArrowDown") {
    event.preventDefault()
    setOctave(noteBuffer.octave - 1)
  }
}
