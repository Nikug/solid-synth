import { Component, For } from "solid-js"
import { deletePreset, getPresetNames, loadPreset } from "../presets/presetUtils"
import { Button } from "./Button"

export const PresetsTab: Component = () => {
  const handleDelete = (name: string) => {
    deletePreset(name)
    getPresetNames()
  }

  return (
    <div class="rounded-lg border p-4 mb-4">
      <h3 class="font-bold mb-2">Saved presets</h3>
      <div class="max-h-64 overflow-y-auto divide-y">
        <For each={getPresetNames()}>
          {(preset) => (
            <div class="py-2 flex justify-between items-center">
              <div class="flex-grow">
                <p>{preset.name}</p>
                <p class="text-gray-500">{preset.description}</p>
              </div>
              <div class="flex gap-4 px-4">
                <Button onClick={() => loadPreset(preset.name)}>Load</Button>
                <Button onClick={() => handleDelete(preset.name)}>Delete</Button>
              </div>
            </div>
          )}
        </For>
      </div>
    </div>
  )
}
