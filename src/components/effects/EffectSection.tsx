import { Component, Match, Switch } from "solid-js"
import { changeEffect, settings } from "../../audio/settingsStore"
import {
  BitcrusherSettings,
  BitreducerSettings,
  CompressorSettings,
  DelaySettings,
  DistortionSettings,
  EffectKey,
  EffectSettings,
  EffectValue,
  FilterSettings,
  ReverbSettings,
  effects,
  setEffectState,
} from "../../audio/effects"
import { Dropdown } from "../Dropdown"
import { ToggleButton } from "../ToggleButton"
import { RiMediaVolumeUpFill } from "solid-icons/ri"
import { ReverbSection } from "./ReverbSection"
import { DelaySection } from "./DelaySection"
import { DistortionSection } from "./DistortionSection"
import { BitcrusherSection } from "./BitcrusherSection"
import { CompressorSection } from "./CompressorSection"
import { FilterSection } from "./FilterSection"
import { BitreducerSection } from "./BitreducerSection"

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
          onChange={(value) => setEffectState(props.id, value)}
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
        <Match when={effect().effect === "delay"}>
          <DelaySection id={props.id} effect={effect() as EffectSettings & DelaySettings} />
        </Match>
        <Match when={effect().effect === "distortion"}>
          <DistortionSection
            id={props.id}
            effect={effect() as EffectSettings & DistortionSettings}
          />
        </Match>
        <Match when={effect().effect === "bitcrusher"}>
          <BitcrusherSection
            id={props.id}
            effect={effect() as EffectSettings & BitcrusherSettings}
          />
        </Match>
        <Match when={effect().effect === "bitreducer"}>
          <BitreducerSection
            id={props.id}
            effect={effect() as EffectSettings & BitreducerSettings}
          />
        </Match>
        <Match when={effect().effect === "compressor"}>
          <CompressorSection
            id={props.id}
            effect={effect() as EffectSettings & CompressorSettings}
          />
        </Match>
        <Match when={effect().effect === "filter"}>
          <FilterSection id={props.id} effect={effect() as EffectSettings & FilterSettings} />
        </Match>
      </Switch>
    </div>
  )
}
