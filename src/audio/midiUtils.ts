import { Note, Octave } from "../constants"

export const midiToFrequency = (midi: number) => Math.pow(2, (midi - 69) / 12) * 440

export const midiToGain = (midi: number) => midi / 127

const keys = "C C# D D# E F F# G G# A A# B".split(" ") as Note[]

export const midiToKeyAndOctave = (midi: number): { key: Note; octave: Octave } => {
  const octave = (Math.floor(midi / 12) - 1) as Octave
  return { key: keys[midi % 12], octave }
}
