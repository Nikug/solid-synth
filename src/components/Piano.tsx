import { Component, For, Show } from "solid-js"
import { Keymap, Note, Octave } from "../constants"
import { PianoKey } from "./PianoKey"
import { noteBuffer, setOctave } from "../audio/noteStore"
import { RiArrowsArrowDownSFill, RiArrowsArrowUpSFill } from "solid-icons/ri"
import { Knob } from "./Knob"
import { settings, setGlobalVolume } from "../audio/settingsStore"
import { AdsrSection } from "./AdsrSection"
import { OscillatorSection } from "./OscillatorSection"
import { Oscilloscope } from "./Oscilloscope"
import { SpectralAnalyser } from "./SpectralAnalyser"
import { FilterSection } from "./FilterSection"
import { TabSection } from "./TabSection"
import { EffectSection } from "./effects/EffectSection"
import { PresetSection } from "./PresetSection"

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
      <div class="flex gap-4 items-center mb-4">
        <div class="relative text-gray-400 tracking-widest">
          <p class="tracking-widest font-bold text-gray-600">Solid Synth</p>
          <p class="text-sm">{settings.state}</p>
          <Show when={settings.state === "uninitialized"}>
            <p class="text-xs animate-pulse absolute -bottom-4">Press any key</p>
          </Show>
        </div>
        <Oscilloscope />
        <SpectralAnalyser />
        <Knob
          value={settings.volume}
          min={0}
          max={1}
          defaultValue={0.5}
          onChange={(value) => setGlobalVolume(value)}
          label="Main volume"
        />
        <div class="flex-grow" />
        <PresetSection />
      </div>
      <TabSection headers={["Oscillators", "Effects"]}>
        <div class="grid grid-cols-3 grid-rows-auto gap-x-2 gap-y-4 mb-4">
          <OscillatorSection id={1} />
          <OscillatorSection id={2} />
          <OscillatorSection id={3} />
          <div class="border rounded-lg p-4">
            <AdsrSection label="Volume" settingKey="volumeAdsr" />
          </div>
          <FilterSection />
          <div id="placeholder"></div>
        </div>
        <div>
          <div class="grid grid-cols-3 grid-rows-auto gap-x-2 gap-y-4">
            <EffectSection id={1} arrow />
            <EffectSection id={2} arrow />
            <EffectSection id={3} />
          </div>
          <div class="relative w-2/3 mx-auto h-8">
            <div class="border-gray-200 border-b-2 border-r-2 rounded-br-lg h-4 absolute left-1/2 right-0 top-[1px]" />
            <div class="border-gray-200 border-t-2 border-l-2 rounded-tl-lg h-4 absolute top-1/2 left-0 right-1/2 -mt-[1px]" />
          </div>
          <div class="grid grid-cols-3 grid-rows-auto gap-x-2 gap-y-4 mb-4">
            <EffectSection id={4} arrow />
            <EffectSection id={5} arrow />
            <EffectSection id={6} />
          </div>
        </div>
      </TabSection>
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
