import { Component, For } from "solid-js"
import { ToggleButton } from "./ToggleButton"
import { setSettings, settings } from "../audio/settingsStore"
import { Knob } from "./Knob"
import { RiMediaVolumeUpFill } from "solid-icons/ri"
import { NumberKnob } from "./NumberKnob"
import { Wave } from "../worklets/constants"

const waves = [
  [Wave.sine, "Sine"],
  [Wave.fatSine, "Fat"],
  [Wave.triangle, "Triangle"],
  [Wave.sawtooth, "Saw"],
  [Wave.square, "Square"],
  [Wave.pulse, "Pulse"],
]

interface Props {
  id: number
}

export const OscillatorSection: Component<Props> = (props) => {
  return (
    <div class="border rounded-lg p-4">
      <div class="flex gap-2">
        <ToggleButton
          selected={settings.oscillators[props.id]?.enabled}
          onChange={(value) => setSettings("oscillators", props.id, "enabled", value)}
        >
          <RiMediaVolumeUpFill size={20} />
        </ToggleButton>
        <h3 class="mb-2">Oscillator {props.id}</h3>
      </div>
      <div class="flex gap-1 mb-2 items-start">
        <div class="grid grid-cols-2 gap-1">
          <For each={waves}>
            {([key, value]: [number, string]) => (
              <ToggleButton
                selected={settings.oscillators[props.id]?.waveform === key}
                onChange={() => setSettings("oscillators", props.id, "waveform", key)}
              >
                {value}
              </ToggleButton>
            )}
          </For>
        </div>
        <div class="grid grid-cols-3">
          <Knob
            label="Gain"
            value={settings.oscillators[props.id]?.gain}
            min={0}
            max={1}
            defaultValue={0.5}
            onChange={(value) => setSettings("oscillators", props.id, "gain", value)}
          />
          <Knob
            label="Pitch"
            value={settings.oscillators[props.id]?.pitch}
            min={-24}
            max={24}
            defaultValue={0}
            step={1}
            onChange={(value) => setSettings("oscillators", props.id, "pitch", value)}
          />
          <Knob
            label="Panning"
            value={settings.oscillators[props.id]?.panning}
            min={-1}
            max={1}
            defaultValue={0}
            onChange={(value) => setSettings("oscillators", props.id, "panning", value)}
          />
          <Knob
            label="Phase"
            value={settings.oscillators[props.id]?.phase}
            min={0}
            max={360}
            defaultValue={0}
            onChange={(value) => setSettings("oscillators", props.id, "phase", value)}
          />
        </div>
      </div>
      <div>
        <h3 class="w-full border-t mb-1">Unison</h3>
        <div class="flex gap-2">
          <NumberKnob
            value={settings.oscillators[props.id]?.unisonVoices}
            min={1}
            max={16}
            defaultValue={1}
            label="Voices"
            onChange={(value) => setSettings("oscillators", props.id, "unisonVoices", value)}
          />
          <Knob
            label="Detune"
            value={settings.oscillators[props.id]?.unisonDetune}
            min={0}
            max={2}
            defaultValue={0}
            onChange={(value) => setSettings("oscillators", props.id, "unisonDetune", value)}
          />
          <Knob
            label="Width"
            value={settings.oscillators[props.id]?.unisonWidth}
            min={0}
            max={1}
            defaultValue={0}
            onChange={(value) => setSettings("oscillators", props.id, "unisonWidth", value)}
          />
        </div>
      </div>
    </div>
  )
}
