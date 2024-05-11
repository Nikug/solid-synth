import { Component } from "solid-js"
import { EffectSettings, CompressorSettings } from "../../audio/effects"
import { setSettings } from "../../audio/settingsStore"
import { Knob } from "../Knob"
import {
  setCompressorAttack,
  setCompressorKnee,
  setCompressorRatio,
  setCompressorRelease,
  setCompressorThreshold,
} from "../../audio/effectSettings"

interface Props {
  id: number
  effect: EffectSettings & CompressorSettings
}

export const CompressorSection: Component<Props> = (props) => {
  return (
    <div>
      <div class="flex gap-2 mb-2">
        <Knob
          value={props.effect.threshold}
          defaultValue={-24}
          min={-40}
          max={0}
          label="Threshold"
          unit="dB"
          onChange={(value) => setCompressorThreshold(props.id, value)}
        />
        <Knob
          value={props.effect.knee}
          defaultValue={30}
          min={0}
          max={40}
          label="knee"
          unit="dB"
          onChange={(value) => setCompressorKnee(props.id, value)}
        />
        <Knob
          value={props.effect.ratio}
          defaultValue={12}
          min={1}
          max={20}
          label="Ratio"
          onChange={(value) => setCompressorRatio(props.id, value)}
        />
      </div>
      <div class="flex gap-2">
        <Knob
          value={props.effect.attack}
          defaultValue={20}
          min={0}
          max={1000}
          label="Attack"
          exponential
          unit="ms"
          onChange={(value) => setCompressorAttack(props.id, value)}
        />
        <Knob
          value={props.effect.release}
          defaultValue={300}
          min={0}
          max={1000}
          label="Release"
          exponential
          unit="ms"
          onChange={(value) => setCompressorRelease(props.id, value)}
        />
      </div>
    </div>
  )
}
