import { Component } from "solid-js"
import { EffectSettings, BitreducerSettings } from "../../audio/effects"
import { Knob } from "../Knob"
import { setBitreducerBits } from "../../audio/effectSettings"

interface Props {
  id: number
  effect: EffectSettings & BitreducerSettings
}

export const BitreducerSection: Component<Props> = (props) => {
  return (
    <div class="flex gap-2">
      <Knob
        value={props.effect.bits}
        defaultValue={16}
        min={2}
        max={256}
        label="Bits"
        step={1}
        exponential
        onChange={(value) => setBitreducerBits(props.id, value)}
      />
    </div>
  )
}
