import { Component } from "solid-js"
import { EffectSettings, DistortionSettings } from "../../audio/effects"
import { Knob } from "../Knob"
import { setDistortionDrive, setDistortionPostGain } from "../../audio/effectSettings"

interface Props {
  id: number
  effect: EffectSettings & DistortionSettings
}

export const DistortionSection: Component<Props> = (props) => {
  return (
    <div class="flex gap-2">
      <Knob
        value={props.effect.drive}
        defaultValue={0}
        min={-30}
        max={30}
        label="Drive"
        onChange={(value) => setDistortionDrive(props.id, value)}
      />
      <Knob
        value={props.effect.postGain}
        defaultValue={0.5}
        min={-30}
        max={30}
        label="Post gain"
        onChange={(value) => setDistortionPostGain(props.id, value)}
      />
    </div>
  )
}
