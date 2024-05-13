import { Component } from "solid-js"
import { EffectSettings, DelaySettings } from "../../audio/effects"
import { Knob } from "../Knob"
import { setDelayFeedback, setDelayTime, setDelayGain } from "../../audio/effectSettings"

interface Props {
  id: number
  effect: EffectSettings & DelaySettings
}

export const DelaySection: Component<Props> = (props) => {
  return (
    <div class="flex gap-2">
      <Knob
        value={props.effect.time}
        defaultValue={1000}
        min={1}
        max={5000}
        label="time"
        unit="ms"
        exponential
        onChange={(value) => setDelayTime(props.id, value)}
      />
      <Knob
        value={props.effect.feedback}
        defaultValue={0.5}
        min={0}
        max={1}
        label="Feedback"
        onChange={(value) => setDelayFeedback(props.id, value)}
      />
      <Knob
        value={props.effect.gain}
        defaultValue={0.5}
        min={0}
        max={1}
        label="Gain"
        onChange={(value) => setDelayGain(props.id, value)}
      />
    </div>
  )
}
