import { createStore } from "solid-js/store"
import { playNote, stopAllNotes, stopNote } from "./audioEngine"
import { Note, NoteFrequencies, Octave } from "../constants"
import { settings } from "./settingsStore"

interface Notes {
  octave: Octave
  activeNotes: Map<string, ActiveNote>
}

interface ActiveNote {
  note: Note
  octave: Octave
  frequency: number
}

const newStore = (): Notes => {
  return {
    octave: 4,
    activeNotes: new Map<string, ActiveNote>(),
  }
}

const [notes, setNotes] = createStore<Notes>(newStore())

export const noteBuffer = notes

export const createNoteName = (octave: number, note: string) => `${note}${octave}`

export const setOctave = (octave: Octave) => {
  if (octave < 1 || octave > 7) return

  const difference = octave - notes.octave
  setNotes("octave", octave as Octave)

  // Stop all notes, transpose them to new octave and play again
  stopAllNotes()
  setNotes("activeNotes", (activeNotes) => {
    const newActiveNotes = new Map<string, ActiveNote>()
    activeNotes.forEach((value) => {
      const newNote = {
        octave: (value.octave + difference) as Octave,
        note: value.note,
        frequency: NoteFrequencies[value.octave + difference][value.note],
      }
      newActiveNotes.set(createNoteName(newNote.octave, newNote.note), newNote)
    })
    return newActiveNotes
  })

  notes.activeNotes.forEach((value) => {
    playNote(value.frequency, settings)
  })
}

export const addNote = (note: Note, octave: Octave) => {
  const key = createNoteName(octave, note)
  const activeNote = {
    note: note,
    octave: octave,
    frequency: NoteFrequencies[octave][note],
  }

  setNotes("activeNotes", (activeNotes) => {
    activeNotes.set(key, activeNote)
    return new Map(activeNotes)
  })

  playNote(activeNote.frequency, settings)
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
