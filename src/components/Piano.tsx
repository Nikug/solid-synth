import { Component, For } from "solid-js"
import { Note, NoteFrequencies, Octave } from "../constants"
import { PianoKey } from "./PianoKey"
import { noteBuffer, setOctave } from "../audio/noteStore"
import { RiArrowsArrowDownSFill, RiArrowsArrowUpSFill } from "solid-icons/ri"

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
    <div class="flex gap-4">
      <div class="flex flex-col gap-2 justify-center items-center">
        <button
          class="w-8 h-8 border rounded bg-white flex items-center justify-center"
          onclick={() => handleOctaveChange(1)}
        >
          <RiArrowsArrowUpSFill size="1.5em" />
        </button>
        <p>{noteBuffer.octave}</p>
        <button
          class="w-8 h-8 border rounded bg-white flex items-center justify-center"
          onclick={() => handleOctaveChange(-1)}
        >
          <RiArrowsArrowDownSFill size="1.5em" />
        </button>
      </div>
      <div class="flex">
        <For each={getOctave()}>
          {(note) => <PianoKey note={note[0]} octave={note[1]} isBlack={note[0].length > 1} />}
        </For>
      </div>
    </div>
  )
}
