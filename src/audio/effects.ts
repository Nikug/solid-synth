export const effects = {
  reverb: "Reverb",
  delay: "Delay",
  distortion: "Distortion",
  bitcrusher: "Bitcrusher",
  compressor: "Compressor",
} as const

export type EffectKey = keyof typeof effects
export type EffectValue = (typeof effects)[EffectKey]

export type EffectSettings = {
  id: number
  enabled: boolean
} & (ReverbSettings | DelaySettings | DistortionSettings | BitcrusherSettings)

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
