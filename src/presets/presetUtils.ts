import { initialize } from "../audio/audioContextWrapper"
import { setEffectState } from "../audio/effects"
import {
  DefaultPresetName,
  Settings,
  newSettings,
  setSettings,
  settings,
} from "../audio/settingsStore"

const localStoragePresetKey = "presets"
export type LocalStoragePresets = Record<string, Settings>

export const doesPresetExist = (name: string): boolean => {
  if (name === DefaultPresetName) return true

  const presets = localStorage.getItem(localStoragePresetKey)
  const parsed = presets ? JSON.parse(presets) : {}
  return !!parsed[name]
}

export const savePreset = (name: string) => {
  if (name === DefaultPresetName) {
    return
  }

  setSettings("presetName", name)
  const presets = localStorage.getItem(localStoragePresetKey) || "{}"

  const parsed = JSON.parse(presets)
  parsed[name] = settings
  localStorage.setItem(localStoragePresetKey, JSON.stringify(parsed))
}

export const loadPreset = (name: string) => {
  const presets = localStorage.getItem(localStoragePresetKey)

  try {
    const preset = name === DefaultPresetName ? newSettings() : JSON.parse(presets)[name]
    handlePresetLoading(preset)
  } catch (e) {
    console.error("Could not load preset", e)
  }
}

export const getPresetNames = () => {
  const presets = localStorage.getItem(localStoragePresetKey) || "{}"
  const parsed = JSON.parse(presets)
  return Object.keys(parsed)
}

const handlePresetLoading = async (preset: Settings) => {
  if (!settings.active) {
    await initialize()
  }

  preset.active = true
  preset.state = "initialized"
  preset.isKnobActive = false
  setSettings(preset)

  setEffectState(1, preset.effects[1].enabled)
  setEffectState(2, preset.effects[2].enabled)
  setEffectState(3, preset.effects[3].enabled)
  setEffectState(4, preset.effects[4].enabled)
  setEffectState(5, preset.effects[5].enabled)
  setEffectState(6, preset.effects[6].enabled)
}
