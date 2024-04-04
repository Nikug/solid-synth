import { Component, For } from "solid-js"
import { NoteFrequencies } from "../constants"
import { PianoKey } from "./PianoKey"
import { noteBuffer, setOctave } from "../audio/noteStore"

export const Piano: Component = () => {
  const getOctave = (): [string, number][] => Object.entries(NoteFrequencies[noteBuffer.octave])

  const handleOctaveChange = (increment: number) => {
    const newOctave = noteBuffer.octave + increment
    if (newOctave < 0 || newOctave > 8) return
    setOctave(newOctave)
  }

  return (
    <div>
      <div class="flex mb-8">
        <For each={getOctave()}>
          {(note) => <PianoKey note={note[0]} frequency={note[1]} isBlack={note[0].length > 1} />}
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
