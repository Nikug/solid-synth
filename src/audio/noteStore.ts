import { createStore } from "solid-js/store"
import { playNote, stopAllNotes, stopNote } from "./audioEngine"
import { Note, NoteFrequencies, Octave } from "../constants"

interface Notes {
  octave: number
  activeNotes: Map<string, ActiveNote>
}

interface ActiveNote {
  note: Note
  octave: Octave
  frequency: number
}

const newStore = () => {
  return {
    octave: 4,
    activeNotes: new Map<string, ActiveNote>(),
  }
}

const [notes, setNotes] = createStore<Notes>(newStore())

export const noteBuffer = notes

export const createNoteName = (octave: number, note: string) => `${note}${octave}`

export const setOctave = (octave: number) => {
  if (octave < 1 || octave > 8) return

  setNotes("octave", octave)

  // Stop all notes, transpose them to new octave and play again
  stopAllNotes()
  setNotes("activeNotes", (activeNotes) => {
    const newActiveNotes = new Map<string, ActiveNote>()
    activeNotes.forEach((value) => {
      const newNote = {
        octave: octave as Octave,
        note: value.note,
        frequency: NoteFrequencies[octave][value.note],
      }
      newActiveNotes.set(createNoteName(octave, value.note), newNote)
    })
    return newActiveNotes
  })

  notes.activeNotes.forEach((value) => {
    playNote(value.frequency)
  })
}

export const addNote = (note: string) => {
  const key = createNoteName(notes.octave, note)
  const activeNote = {
    note: note as Note,
    octave: notes.octave as Octave,
    frequency: NoteFrequencies[notes.octave][note],
  }

  setNotes("activeNotes", (activeNotes) => {
    activeNotes.set(key, activeNote)
    return new Map(activeNotes)
  })

  playNote(activeNote.frequency)
}

export const removeNote = (note: string) => {
  const key = createNoteName(notes.octave, note)
  let activeNote = notes.activeNotes.get(key)
  if (!activeNote) return

  setNotes("activeNotes", (activeNotes) => {
    activeNotes.delete(key)
    return new Map(activeNotes)
  })

  stopNote(activeNote.frequency)
}
