import { createStore } from "solid-js/store"
import { playNote, stopAllNotes, stopNote } from "./audioEngine"
import { Note, NoteFrequencies, Octave } from "../constants"
import { setSettings, settings } from "./settingsStore"

interface Notes {
  activeNotes: Map<string, ActiveNote>
}

interface ActiveNote {
  note: Note
  octave: Octave
  frequency: number
}

const newStore = (): Notes => {
  return {
    activeNotes: new Map<string, ActiveNote>(),
  }
}

const [notes, setNotes] = createStore<Notes>(newStore())

export const noteBuffer = notes

export const createNoteName = (octave: number, note: string) => `${note}${octave}`

export const setOctave = (octave: Octave) => {
  if (octave < 1 || octave > 7) return

  setSettings("octave", octave as Octave)

  stopAllNotes()
  setNotes("activeNotes", new Map())
}

export const addNote = (note: Note, octave: Octave, gain: number = 1) => {
  if (octave < 1 || octave > 7) return
  const key = createNoteName(octave, note)
  if (notes.activeNotes.has(key)) return

  const activeNote = {
    note: note,
    octave: octave,
    frequency: NoteFrequencies[octave][note],
  }

  setNotes("activeNotes", (activeNotes) => {
    activeNotes.set(key, activeNote)
    return new Map(activeNotes)
  })

  playNote(activeNote.frequency, gain, settings)
}

export const removeNote = (note: Note, octave: Octave) => {
  const key = createNoteName(octave, note)
  let activeNote = notes.activeNotes.get(key)
  if (!activeNote) return

  setNotes("activeNotes", (activeNotes) => {
    activeNotes.delete(key)
    return new Map(activeNotes)
  })

  stopNote(activeNote.frequency)
}
