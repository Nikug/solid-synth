import { Component, For } from "solid-js"
import { AdsrSection } from "./AdsrSection"
import { ToggleButton } from "./ToggleButton"
import { RiMediaVolumeUpFill } from "solid-icons/ri"
import { setSettings, settings } from "../audio/settingsStore"
import { Knob } from "./Knob"

const filterTypes: [BiquadFilterType, string][] = [
  ["lowpass", "Low"],
  ["bandpass", "Band"],
  ["highpass", "High"],
]

export const FilterSection: Component = () => {
  return (
    <div class="border rounded-lg p-4">
      <div class="w-full flex justify-between gap-2">
        <div class="flex gap-2">
          <ToggleButton
            selected={settings.filter.enabled}
            onChange={(value) => setSettings("filter", "enabled", value)}
          >
            <RiMediaVolumeUpFill size={20} />
          </ToggleButton>
          <h3 class="mb-2">Filter</h3>
        </div>
        <div class="flex gap-1 mb-1">
          <For each={filterTypes}>
            {([key, value]) => (
              <ToggleButton
                selected={settings.filter.type === key}
                onChange={() => setSettings("filter", "type", key)}
              >
                {value}
              </ToggleButton>
            )}
          </For>
        </div>
      </div>
      <div class="flex gap-2 mb-1">
        <Knob
          label="Cutoff"
          exponential
          value={settings.filter.value}
          min={20}
          max={20000}
          defaultValue={10000}
          onChange={(value) => setSettings("filter", "value", value)}
          unit="hz"
        />
        <Knob
          label="Resonance"
          exponential
          value={settings.filter.resonance}
          min={0.001}
          max={30}
          defaultValue={1}
          onChange={(value) => setSettings("filter", "resonance", value)}
        />
        <Knob
          label="Amount"
          value={settings.filter.amount}
          min={0}
          max={1}
          defaultValue={0}
          onChange={(value) => setSettings("filter", "amount", value)}
        />
      </div>
      <AdsrSection settingKey="filterAdsr" />
    </div>
  )
}
