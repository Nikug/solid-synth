import { Component } from "solid-js"
import { settings } from "../audio/settingsStore"

export const PresetSection: Component = () => {
  return (
    <div class="p-4 h-full">
      <h3 class="mb-2 text-gray-500">
        Preset: <span class="text-gray-700">{settings.presetName}</span>
      </h3>
    </div>
  )
}