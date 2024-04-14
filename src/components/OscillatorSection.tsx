import { Component } from "solid-js"
import { ToggleButton } from "./ToggleButton"
import { TbTriangle, TbWaveSawTool, TbWaveSine, TbWaveSquare } from "solid-icons/tb"
import { setSettings, settings } from "../audio/settingsStore"
import { Knob } from "./Knob"
import { RiMediaVolumeUpFill } from "solid-icons/ri"
import { NumberKnob } from "./NumberKnob"

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
        </div>
      </div>
    </div>
  )
}
