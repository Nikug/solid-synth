export const effects = {
  reverb: "Reverb",
  delay: "Delay",
  distortion: "Distortion",
  bitcrusher: "Bitcrusher",
  compressor: "Compressor",
  filter: "Filter",
} as const

export type EffectKey = keyof typeof effects
export type EffectValue = (typeof effects)[EffectKey]

export type EffectSettings = {
  id: number
  enabled: boolean
} & (
  | ReverbSettings
  | DelaySettings
  | DistortionSettings
  | BitcrusherSettings
  | CompressorSettings
  | FilterSettings
)

export interface ReverbSettings {
  effect: "reverb"
  impulse: string
}

export interface DelaySettings {
  effect: "delay"
  duration: number
}

export interface DistortionSettings {
  effect: "distortion"
  amount: number
  postGain: number
}

export interface BitcrusherSettings {
  effect: "bitcrusher"
  bits: number
}

export interface CompressorSettings {
  effect: "compressor"
  threshold: number
  knee: number
  ratio: number
  reduction: number
  attack: number
  release: number
}

export interface FilterSettings {
  effect: "filter"
  type: BiquadFilterType
  value: number
  resonance: number
}

export const getDefaultEffectSettings = (id: number, enabled: boolean, effect: EffectKey) => {
  switch (effect) {
    case "reverb":
      return defaultReverbSettings(id, enabled)
    case "delay":
      return defaultDelaySettings(id, enabled)
    case "distortion":
      return defaultDistortionSettings(id, enabled)
    case "bitcrusher":
      return defaultBitcrusherSettings(id, enabled)
    case "compressor":
      return defaultCompressorSettings(id, enabled)
    case "filter":
      return defaultFilterSettings(id, enabled)
    default:
      throw new Error(`Unknown effect: ${effect}`)
  }
}

export const defaultReverbSettings = (
  id: number,
  enabled: boolean,
): EffectSettings & ReverbSettings => ({
  id,
  enabled,
  effect: "reverb",
  impulse: "medium.wav",
})

export const defaultDelaySettings = (
  id: number,
  enabled: boolean,
): EffectSettings & DelaySettings => ({
  id,
  enabled,
  effect: "delay",
  duration: 2000,
})

export const defaultDistortionSettings = (
  id: number,
  enabled: boolean,
): EffectSettings & DistortionSettings => ({
  id,
  enabled,
  effect: "distortion",
  amount: 0.5,
  postGain: 0.5,
})

export const defaultBitcrusherSettings = (
  id: number,
  enabled: boolean,
): EffectSettings & BitcrusherSettings => ({
  id,
  enabled,
  effect: "bitcrusher",
  bits: 10,
})

export const defaultCompressorSettings = (
  id: number,
  enabled: boolean,
): EffectSettings & CompressorSettings => ({
  id,
  enabled,
  effect: "compressor",
  threshold: -24,
  knee: 12,
  ratio: 0.5,
  reduction: 6,
  attack: 20,
  release: 300,
})

export const defaultFilterSettings = (
  id: number,
  enabled: boolean,
): EffectSettings & FilterSettings => ({
  id,
  enabled,
  effect: "filter",
  type: "lowpass",
  value: 500,
  resonance: 1,
})
