import { Keymap, Octave } from "../constants"
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
    let octave = noteBuffer.octave
    if (event.code === "KeyL") {
      octave += 1
    }
    event.preventDefault()
    addNote(Keymap[event.code], octave)
  }
}

const handleKeyUp = (event: KeyboardEvent) => {
  if (event.repeat) return
  if (Keymap[event.code]) {
    let octave = noteBuffer.octave
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
    setOctave((noteBuffer.octave + 1) as Octave)
  } else if (event.code === "ArrowDown") {
    event.preventDefault()
    setOctave((noteBuffer.octave - 1) as Octave)
  }
}
