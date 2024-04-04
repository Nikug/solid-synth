import { Keymap } from "../constants"
import { addNote, removeNote } from "./noteStore"

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
