import { Message, Worklets } from "../worklets/constants"
import {
  audioContext,
  effectsInput,
  effectsOutput1,
  effectsOutput2,
  effectsOutput3,
} from "./audioContextWrapper"
import {
  setBitcrusherBits,
  setBitreducerBits,
  setCompressorAttack,
  setCompressorKnee,
  setCompressorRatio,
  setCompressorRelease,
  setCompressorThreshold,
  setDelayFeedback,
  setDelayTime,
  setDistortionDrive,
  setDistortionPostGain,
  setFilterFrequency,
  setFilterGain,
  setFilterResonance,
  setFilterType,
  setReverbImpulse,
} from "./effectSettings"
import { setSettings, settings } from "./settingsStore"

export const effects = {
  reverb: "Reverb",
  delay: "Delay",
  distortion: "Distortion",
  bitcrusher: "Bitcrusher",
  bitreducer: "Bitreducer",
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
  | BitreducerSettings
  | CompressorSettings
  | FilterSettings
)

export interface ReverbSettings {
  effect: "reverb"
  node: ConvolverNode | null
  impulse: string
}

export interface DelaySettings {
  effect: "delay"
  node: DelayNode | null
  time: number
  feedback: number
}

export interface DistortionSettings {
  effect: "distortion"
  node: WaveShaperNode | null
  drive: number
  postGain: number
}

export interface BitcrusherSettings {
  effect: "bitcrusher"
  node: AudioNode | null
  bits: number
}

export interface BitreducerSettings {
  effect: "bitreducer"
  node: AudioNode | null
  bits: number
}

export interface CompressorSettings {
  effect: "compressor"
  node: DynamicsCompressorNode | null
  threshold: number
  knee: number
  ratio: number
  attack: number
  release: number
}

export interface FilterSettings {
  effect: "filter"
  node: BiquadFilterNode | null
  type: BiquadFilterType
  value: number
  resonance: number
  gain: number
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
    case "bitreducer":
      return defaultBitreducerSettings(id, enabled)
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
  node: null,
  effect: "reverb",
  impulse: "medium.wav",
})

export const defaultDelaySettings = (
  id: number,
  enabled: boolean,
): EffectSettings & DelaySettings => ({
  id,
  enabled,
  node: null,
  effect: "delay",
  time: 500,
  feedback: 0.5,
})

export const defaultDistortionSettings = (
  id: number,
  enabled: boolean,
): EffectSettings & DistortionSettings => ({
  id,
  enabled,
  node: null,
  effect: "distortion",
  drive: 0,
  postGain: 0,
})

export const defaultBitcrusherSettings = (
  id: number,
  enabled: boolean,
): EffectSettings & BitcrusherSettings => ({
  id,
  enabled,
  node: null,
  effect: "bitcrusher",
  bits: 10,
})

export const defaultBitreducerSettings = (
  id: number,
  enabled: boolean,
): EffectSettings & BitreducerSettings => ({
  id,
  enabled,
  node: null,
  effect: "bitreducer",
  bits: 16,
})

export const defaultCompressorSettings = (
  id: number,
  enabled: boolean,
): EffectSettings & CompressorSettings => ({
  id,
  enabled,
  node: null,
  effect: "compressor",
  threshold: -24,
  knee: 30,
  ratio: 12,
  attack: 20,
  release: 300,
})

export const defaultFilterSettings = (
  id: number,
  enabled: boolean,
): EffectSettings & FilterSettings => ({
  id,
  enabled,
  node: null,
  effect: "filter",
  type: "lowpass",
  value: 500,
  resonance: 1,
  gain: 0,
})

export const setEffectState = (id: number, enabled: boolean) => {
  setSettings("effects", id, "enabled", enabled)
  const effect = settings.effects[id]

  if (enabled) {
    switch (effect.effect) {
      case "reverb":
        const reverb = audioContext().createConvolver()
        reverb.normalize = true
        setSettings("effects", id, "node", reverb)
        setReverbImpulse(id, effect.impulse)
        createConnections(id, reverb)
        break
      case "bitcrusher":
        const bitcrusher = new AudioWorkletNode(audioContext(), Worklets.bitcrusher, {
          channelCount: 2,
          outputChannelCount: [2],
        })
        setSettings("effects", id, "node", bitcrusher)
        setBitcrusherBits(id, effect.bits)
        createConnections(id, bitcrusher)
        break
      case "bitreducer":
        const bitreducer = new AudioWorkletNode(audioContext(), Worklets.bitreducer, {
          channelCount: 2,
          outputChannelCount: [2],
        })
        setSettings("effects", id, "node", bitreducer)
        setBitreducerBits(id, effect.bits)
        createConnections(id, bitreducer)
        break
      case "distortion":
        const distortion = new AudioWorkletNode(audioContext(), Worklets.distortion, {
          channelCount: 2,
          outputChannelCount: [2],
        })
        setSettings("effects", id, "node", distortion)
        setDistortionDrive(id, effect.drive)
        setDistortionPostGain(id, effect.postGain)
        createConnections(id, distortion)
        break
      case "filter":
        const filter = audioContext().createBiquadFilter()
        setSettings("effects", id, "node", filter)
        setFilterType(id, effect.type)
        setFilterFrequency(id, effect.value)
        setFilterResonance(id, effect.resonance)
        setFilterGain(id, effect.gain)
        createConnections(id, filter)
        break
      case "compressor":
        const compressor = audioContext().createDynamicsCompressor()
        setSettings("effects", id, "node", compressor)
        setCompressorThreshold(id, effect.threshold)
        setCompressorKnee(id, effect.knee)
        setCompressorRatio(id, effect.ratio)
        setCompressorAttack(id, effect.attack)
        setCompressorRelease(id, effect.release)
        createConnections(id, compressor)
        break
      case "delay":
        const delay = new AudioWorkletNode(audioContext(), Worklets.delay, {
          channelCount: 2,
          outputChannelCount: [2],
        })
        setSettings("effects", id, "node", delay)
        setDelayTime(id, effect.time)
        setDelayFeedback(id, effect.feedback)
        createConnections(id, delay)
        break
      default:
        throw new Error("Unknown effect")
    }
  } else {
    disableEffect(id)
  }
}

const createConnections = (id: number, node: AudioNode) => {
  switch (id) {
    case 1:
      effectsInput().disconnect()
      effectsInput().connect(node)
      node.connect(effectsOutput1())
      break
    case 2:
      effectsOutput1().disconnect()
      effectsOutput1().connect(node)
      node.connect(effectsOutput2())
      break
    case 3:
      effectsOutput2().disconnect()
      effectsOutput2().connect(node)
      node.connect(effectsOutput3())
      break
    default:
      throw new Error(`Unknown effect id: ${id}`)
  }
}

const disableEffect = (id: number) => {
  const node = settings.effects[id].node
  node?.disconnect()

  if (node instanceof AudioWorkletNode) {
    node.port.postMessage({ id: Message.stop })
  }

  switch (id) {
    case 1:
      effectsInput().disconnect()
      effectsInput().connect(effectsOutput1())
      break
    case 2:
      effectsOutput1().disconnect()
      effectsOutput1().connect(effectsOutput2())
      break
    case 3:
      effectsOutput2().disconnect()
      effectsOutput2().connect(effectsOutput3())
      break
    default:
      throw new Error(`Unknown effect id: ${id}`)
  }
  setSettings("effects", id, "node", null)
  setSettings("effects", id, "enabled", false)
}
