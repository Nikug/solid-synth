import { Component, For, createSignal } from "solid-js"
import { NoteFrequencies } from "../constants"
import { PianoKey } from "./PianoKey"

export const Piano: Component = () => {
  const [octave, setOctave] = createSignal(4)
  const getOctave = (): [string, number][] => Object.entries(NoteFrequencies[octave()])

  const handleOctaveChange = (increment: number) => {
    const newOctave = octave() + increment
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
        <button class="w-8 h-8 border rounded" onclick={() => handleOctaveChange(1)}>
          +
        </button>
        <p>{octave()}</p>
        <button class="w-8 h-8 border rounded" onclick={() => handleOctaveChange(-1)}>
          -
        </button>
      </div>
    </div>
  )
}
