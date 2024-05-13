import { createStore } from "solid-js/store"

export interface PresetSettings {
  showSavePopup: boolean
}

const getDefaults = (): PresetSettings => ({
  showSavePopup: false,
})

export const [presetSettings, setPresetSettings] = createStore<PresetSettings>(getDefaults())

export const showPresetPopup = () => setPresetSettings("showSavePopup", true)
export const hidePresetPopup = () => setPresetSettings("showSavePopup", false)
