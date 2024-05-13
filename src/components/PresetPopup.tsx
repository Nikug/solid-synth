import { Component, Show, createSignal, onMount } from "solid-js"
import { DefaultPresetName, setSettings, settings } from "../audio/settingsStore"
import { hidePresetPopup } from "../presets/presetStore"
import { Button } from "./Button"
import { doesPresetExist, savePreset } from "../presets/presetUtils"

export const PresetPopup: Component = () => {
  const [overwrite, setOverwrite] = createSignal(false)
  const [defaultError, setDefaultError] = createSignal(false)

  let input: HTMLInputElement
  let descriptionInput: HTMLTextAreaElement

  onMount(() => {
    input.focus()
  })

  const name = () => {
    return input.value
  }

  const description = () => {
    return descriptionInput.value
  }

  const handleSave = () => {
    setDefaultError(false)

    if (name() === DefaultPresetName || !name()) {
      setDefaultError(true)
      return
    }

    if (doesPresetExist(name()) && !overwrite()) {
      setOverwrite(true)
    } else {
      setSettings("presetDescription", description())
      savePreset(name())
      hidePresetPopup()
    }
  }

  return (
    <>
      <div class="fixed bg-black/25 inset-0 z-10" onClick={() => hidePresetPopup()} />
      <div class="fixed bg-gray-100 shadow-xl w-80 min-h-48 border rounded-lg p-4 mx-auto inset-x-0 top-96 z-20">
        <div class="flex flex-col gap-4 justify-between h-full">
          <div class="flex flex-col gap-2">
            <h3 class="font-bold mb-2">Save Preset</h3>
            <label for="preset-name">Name</label>
            <input
              ref={input}
              type="text"
              id="preset-name"
              class="px-1 rounded border focus:border-blue-600 focus:outline-none focus:ring-0"
              value={settings.presetName}
            />
            <label for="preset-name" class="mt-2">
              Description
            </label>
            <textarea
              ref={descriptionInput}
              id="preset-description"
              class="px-1 rounded border focus:border-blue-600 focus:outline-none focus:ring-0"
              value={settings.presetDescription}
            />
          </div>
          <Show when={overwrite()}>
            <p class="text-red-500">
              Preset with that name already exists. Click save to overwrite it.
            </p>
          </Show>
          <Show when={defaultError()}>
            <p class="text-red-500">Cannot save with name '{name()}'.</p>
          </Show>
          <div class="flex justify-end gap-4">
            <Button onClick={() => hidePresetPopup()}>Cancel</Button>
            <Button onClick={() => handleSave()}>Save</Button>
          </div>
        </div>
      </div>
    </>
  )
}
