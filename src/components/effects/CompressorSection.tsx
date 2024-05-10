import { Component } from "solid-js"
import { EffectSettings, CompressorSettings } from "../../audio/effects"
import { setSettings } from "../../audio/settingsStore"
import { Knob } from "../Knob"

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
          min={-140}
          max={0}
          label="Threshold"
          unit="dB"
          // @ts-expect-error
          onChange={(value) => setSettings("effects", props.id, "threshold", value)}
        />
        <Knob
          value={props.effect.knee}
          defaultValue={-16}
          min={-140}
          max={0}
          label="knee"
          unit="dB"
          // @ts-expect-error
          onChange={(value) => setSettings("effects", props.id, "knee", value)}
        />
        <Knob
          value={props.effect.ratio}
          defaultValue={0.5}
          min={0}
          max={1}
          label="Ratio"
          // @ts-expect-error
          onChange={(value) => setSettings("effects", props.id, "ratio", value)}
        />
        <Knob
          value={props.effect.reduction}
          defaultValue={0.5}
          min={0}
          max={1}
          label="Reduction"
          // @ts-expect-error
          onChange={(value) => setSettings("effects", props.id, "reduction", value)}
        />
      </div>
      <div class="flex gap-2">
        <Knob
          value={props.effect.attack}
          defaultValue={20}
          min={0}
          max={2000}
          label="Attack"
          // @ts-expect-error
          onChange={(value) => setSettings("effects", props.id, "attack", value)}
        />
        <Knob
          value={props.effect.release}
          defaultValue={300}
          min={0}
          max={2000}
          label="Release"
          // @ts-expect-error
          onChange={(value) => setSettings("effects", props.id, "release", value)}
        />
      </div>
    </div>
  )
}
