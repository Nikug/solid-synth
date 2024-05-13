import { Settings, setSettings, settings } from "../audio/settingsStore"

const localStoragePresetKey = "presets"
export type LocalStoragePresets = Record<string, Settings>

export const doesPresetExist = (name: string): boolean => {
  const presets = localStorage.getItem(localStoragePresetKey)
  const parsed = presets ? JSON.parse(presets) : {}
  return !!parsed[name]
}

export const savePreset = (name: string) => {
  const presets = localStorage.getItem(localStoragePresetKey) ?? "{}"

  const parsed = JSON.parse(presets)
  parsed[name] = settings
  localStorage.setItem(localStoragePresetKey, JSON.stringify(parsed))
}

export const loadPreset = (name: string) => {
  const presets = localStorage.getItem(localStoragePresetKey)

  try {
    const preset = JSON.parse(presets)[name]
    setSettings(preset)
  } catch (e) {
    console.error("Could not load preset", e)
  }
}
