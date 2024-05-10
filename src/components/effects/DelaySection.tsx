import { Component } from "solid-js"
import { EffectSettings, DelaySettings } from "../../audio/effects"
import { setSettings } from "../../audio/settingsStore"
import { Knob } from "../Knob"

interface Props {
  id: number
  effect: EffectSettings & DelaySettings
}

export const DelaySection: Component<Props> = (props) => {
  return (
    <div>
      <Knob
        value={props.effect.duration}
        defaultValue={2000}
        min={0}
        max={10000}
        label="Duration"
        exponential
        // @ts-expect-error
        onChange={(value) => setSettings("effects", props.id, "duration", value)}
      />
    </div>
  )
}
