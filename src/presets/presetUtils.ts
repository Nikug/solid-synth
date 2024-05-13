import { initialize } from "../audio/audioContextWrapper"
import { setEffectState } from "../audio/effects"
import {
  DefaultPresetName,
  Settings,
  newSettings,
  setSettings,
  settings,
} from "../audio/settingsStore"
import { produce, unwrap } from "solid-js/store"
import { createLocalStore } from "../hooks"
import rfdc from "rfdc"
import { stopAllNotes } from "../audio/audioEngine"

const clone = rfdc()
const localStoragePresetKey = "presets"
export type LocalStoragePresets = Record<string, Settings>

export const [presets, setPresets] = createLocalStore<LocalStoragePresets>(
  localStoragePresetKey,
  {},
)

export const doesPresetExist = (name: string): boolean => {
  if (name === DefaultPresetName) return true
  return !!presets[name]
}

export const savePreset = (name: string) => {
  if (name === DefaultPresetName) {
    return
  }

  setSettings("presetName", name)
  setPresets(produce((state) => (state[name] = clone(unwrap(settings)))))
}

export const loadPreset = (name: string) => {
  try {
    stopAllNotes()
    const preset = name === DefaultPresetName ? newSettings() : clone(unwrap(presets[name]))
    handlePresetLoading(preset)
  } catch (e) {
    console.error("Could not load preset", e)
  }
}

export const deletePreset = (name: string) => {
  if (name === DefaultPresetName) {
    return
  }
  setPresets(produce((presets) => delete presets[name]))
}

export const getPresetNames = (): { name: string; description: string }[] => {
  return Object.values(presets).map((preset: Settings) => ({
    name: preset.presetName,
    description: preset.presetDescription,
  }))
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
