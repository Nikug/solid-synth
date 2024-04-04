import { Component, For } from "solid-js"
import { Note, NoteFrequencies, Octave } from "../constants"
import { PianoKey } from "./PianoKey"
import { noteBuffer, setOctave } from "../audio/noteStore"

export const Piano: Component = () => {
  const getOctave = (): [Note, Octave][] => {
    const keys = Object.keys(NoteFrequencies[noteBuffer.octave]) as Note[]
    const entries: [Note, Octave][] = keys.map((key) => [key, noteBuffer.octave])
    entries.push(["C", (noteBuffer.octave + 1) as Octave])
    return entries
  }

  const handleOctaveChange = (increment: number) => {
    const newOctave = (noteBuffer.octave + increment) as Octave
    setOctave(newOctave)
  }

  return (
    <div>
      <div class="flex mb-8">
        <For each={getOctave()}>
          {(note) => <PianoKey note={note[0]} octave={note[1]} isBlack={note[0].length > 1} />}
        </For>
      </div>
      <div class="flex gap-2 items-center">
        <button class="w-8 h-8 border rounded bg-white" onclick={() => handleOctaveChange(-1)}>
          -
        </button>
        <p>{noteBuffer.octave}</p>
        <button class="w-8 h-8 border rounded bg-white" onclick={() => handleOctaveChange(1)}>
          +
        </button>
      </div>
    </div>
  )
}
