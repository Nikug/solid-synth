import { Component } from "solid-js"
import { EffectSettings, BitcrusherSettings } from "../../audio/effects"
import { Knob } from "../Knob"
import { setBitcrusherBits } from "../../audio/effectSettings"

interface Props {
  id: number
  effect: EffectSettings & BitcrusherSettings
}

export const BitcrusherSection: Component<Props> = (props) => {
  return (
    <div class="flex gap-2">
      <Knob
        value={props.effect.bits}
        defaultValue={10}
        min={2}
        max={500}
        label="Depth"
        step={1}
        exponential
        onChange={(value) => setBitcrusherBits(props.id, value)}
      />
    </div>
  )
}
