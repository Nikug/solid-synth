import { Component } from "solid-js"
import { ToggleButton } from "./ToggleButton"
import { TbTriangle, TbWaveSawTool, TbWaveSine, TbWaveSquare } from "solid-icons/tb"
import { setSettings, settings } from "../audio/settingsStore"
import { Knob } from "./Knob"

interface Props {
  id: number
}

export const OscillatorSection: Component<Props> = (props) => {
  return (
    <div class="border rounded-lg p-4">
      <h3 class="mb-2">Oscillator 1</h3>
      <div class="flex gap-1 mb-2">
        <div class="grid grid-cols-2 gap-1">
          <ToggleButton
            selected={settings.oscillators[props.id]?.waveform === "sine"}
            onChange={() => setSettings("oscillators", props.id, "waveform", "sine")}
          >
            <TbWaveSine size={24} />
          </ToggleButton>
          <ToggleButton
            selected={settings.oscillators[props.id]?.waveform === "triangle"}
            onChange={() => setSettings("oscillators", props.id, "waveform", "triangle")}
          >
            <TbTriangle size={24} />
          </ToggleButton>
          <ToggleButton
            selected={settings.oscillators[props.id]?.waveform === "sawtooth"}
            onChange={() => setSettings("oscillators", props.id, "waveform", "sawtooth")}
          >
            <TbWaveSawTool size={24} />
          </ToggleButton>
          <ToggleButton
            selected={settings.oscillators[props.id]?.waveform === "square"}
            onChange={() => setSettings("oscillators", props.id, "waveform", "square")}
          >
            <TbWaveSquare size={24} />
          </ToggleButton>
        </div>
        <div class="grid grid-cols-3">
          <Knob
            label="Gain"
            value={settings.oscillators[props.id]?.gain}
            min={0}
            max={1}
            onChange={(value) => setSettings("oscillators", props.id, "gain", value)}
          />
          <Knob
            label="Pitch"
            value={settings.oscillators[props.id]?.pitch}
            min={0}
            max={1}
            onChange={(value) => setSettings("oscillators", props.id, "pitch", value)}
          />
          <Knob
            label="Panning"
            value={settings.oscillators[props.id]?.panning}
            min={-1}
            max={1}
            onChange={(value) => setSettings("oscillators", props.id, "panning", value)}
          />
        </div>
      </div>
    </div>
  )
}