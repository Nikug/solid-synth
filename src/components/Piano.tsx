import { Component, For } from "solid-js"
import { Keymap, Note, Octave } from "../constants"
import { PianoKey } from "./PianoKey"
import { noteBuffer, setOctave } from "../audio/noteStore"
import { RiArrowsArrowDownSFill, RiArrowsArrowUpSFill } from "solid-icons/ri"
import { Knob } from "./Knob"
import { settings, setSettings } from "../audio/settingsStore"

interface Key {
  note: Note
  octave: Octave
  key: string
}

export const Piano: Component = () => {
  const getOctave = (): Key[] => {
    const keys = Object.entries(Keymap)
    const entries: Key[] = keys.map(([key, note], i) => ({
      note: note as Note,
      octave: (noteBuffer.octave + Math.floor(i / 12)) as Octave,
      key: key[3].toLowerCase(),
    }))
    return entries
  }

  const handleOctaveChange = (increment: number) => {
    const newOctave = (noteBuffer.octave + increment) as Octave
    setOctave(newOctave)
  }

  return (
    <div class="p-8 border-2 rounded-xl shadow-xl bg-gray-100">
      <div class="w-full flex justify-start mb-4">
        <Knob
          value={settings.volume}
          min={0}
          max={1}
          onChange={(value) => setSettings("volume", value)}
          label="Volume"
        />
      </div>
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
            {(key) => (
              <PianoKey
                note={key.note}
                key={key.key}
                octave={key.octave}
                isBlack={key.note.length > 1}
              />
            )}
          </For>
        </div>
      </div>
    </div>
  )
}
