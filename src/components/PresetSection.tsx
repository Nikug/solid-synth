import { Component } from "solid-js"
import { DefaultPresetName, settings } from "../audio/settingsStore"
import { Button } from "./Button"
import { showPresetPopup } from "../presets/presetStore"
import { Dropdown } from "./Dropdown"
import { getPresetNames, loadPreset } from "../presets/presetUtils"

export const PresetSection: Component = () => {
  const options = () => {
    const names = getPresetNames()
    const options = names.map((name) => ({ id: name, value: name }))
    options.unshift({ id: DefaultPresetName, value: DefaultPresetName })
    return options
  }

  return (
    <div class="p-4 h-full">
      <h3 class="mb-2 text-gray-500">
        Preset: <span class="text-gray-700">{settings.presetName}</span>
      </h3>
      <div class="flex gap-2">
        <Button onClick={() => showPresetPopup()}>Save</Button>
        <Dropdown
          key={null}
          placeholder="Load"
          options={options()}
          onChange={(value) => loadPreset(value)}
        />
      </div>
    </div>
  )
}
