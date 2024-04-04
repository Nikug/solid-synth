import { createStore } from "solid-js/store"
import { playNote, stopAllNotes, stopNote } from "./audioEngine"
import { NoteFrequencies } from "../constants"

interface Notes {
  octave: number
  activeNotes: Set<string>
}

const newStore = () => {
  return {
    octave: 4,
    activeNotes: new Set<string>(),
  }
}

const [notes, setNotes] = createStore<Notes>(newStore())

export const noteBuffer = notes

export const createNoteName = (octave: number, note: string) => `${octave}${note}`

export const setOctave = (octave: number) => {
  setNotes("octave", octave)
  stopAllNotes()
  setNotes("activeNotes", new Set())
}

export const addNote = (note: string) => {
  setNotes("activeNotes", (activeNotes) => {
    activeNotes.add(createNoteName(notes.octave, note))
    return new Set(activeNotes)
  })
  playNote(NoteFrequencies[notes.octave][note])
}

export const removeNote = (note: string) => {
  setNotes("activeNotes", (activeNotes) => {
    activeNotes.delete(createNoteName(notes.octave, note))
    return new Set(activeNotes)
  })
  stopNote(NoteFrequencies[notes.octave][note])
}
