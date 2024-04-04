import { Keymap, NoteFrequencies } from "../constants"
import { playNote, stopNote } from "./audioEngine"

export const initializeKeyboard = () => {
  addEventListener("keydown", handleKeyDown)
  addEventListener("keyup", handleKeyUp)
}

export const teardownKeyboard = () => {
  removeEventListener("keydown", handleKeyDown)
  removeEventListener("keyup", handleKeyUp)
}

const handleKeyDown = (event: KeyboardEvent) => {
  if (event.repeat) return
  if (Keymap[event.code]) {
    event.preventDefault()
    playNote(NoteFrequencies[4][Keymap[event.code]])
  }
}

const handleKeyUp = (event: KeyboardEvent) => {
  if (event.repeat) return
  if (Keymap[event.code]) {
    event.preventDefault()
    stopNote(NoteFrequencies[4][Keymap[event.code]])
  }
}
