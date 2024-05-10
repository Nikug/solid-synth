import { Component, Match, Switch } from "solid-js"
import { changeEffect, setSettings, settings } from "../../audio/settingsStore"
import {
  EffectKey,
  EffectSettings,
  EffectValue,
  ReverbSettings,
  effects,
} from "../../audio/effects"
import { Dropdown } from "../Dropdown"
import { ToggleButton } from "../ToggleButton"
import { RiMediaVolumeUpFill } from "solid-icons/ri"
import { ReverbSection } from "./ReverbSection"

const options = Object.entries(effects).map(([key, value]: [EffectKey, EffectValue]) => ({
  id: key,
  value: value,
}))

interface Props {
  id: number
}

export const EffectSection: Component<Props> = (props) => {
  const effect = () => settings.effects[props.id]

  return (
    <div class="border rounded-lg p-4">
      <div class="flex gap-2 items-center mb-4">
        <ToggleButton
          selected={effect().enabled}
          onChange={(value) => setSettings("effects", props.id, "enabled", value)}
        >
          <RiMediaVolumeUpFill size={20} />
        </ToggleButton>
        <Dropdown
          key={effect().effect}
          options={options}
          onChange={(value) => changeEffect(props.id, value)}
        />
      </div>
      <Switch>
        <Match when={effect().effect === "reverb"}>
          <ReverbSection id={props.id} effect={effect() as EffectSettings & ReverbSettings} />
        </Match>
        <Match when={effect().effect === "delay"}>delay</Match>
        <Match when={effect().effect === "distortion"}>distortion</Match>
        <Match when={effect().effect === "bitcrusher"}>bitcrusher</Match>
        <Match when={effect().effect === "compressor"}>compressor</Match>
      </Switch>
    </div>
  )
}
