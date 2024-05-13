import { changeSmoothing, setSettings, settings } from "./settingsStore"
import longImpulse from "../assets/impulses/long.wav"
import mediumImpulse from "../assets/impulses/medium.wav"
import shortImpulse from "../assets/impulses/short.wav"
import { audioContext } from "./audioContextWrapper"
import { ReverbSettings } from "./effects"

export const setReverbImpulse = async (id: number, impulse: string) => {
  // @ts-expect-error
  setSettings("effects", id, "impulse", impulse)
  const node = settings.effects[id].node as ConvolverNode
  if (!node) return

  const url = {
    "long.wav": longImpulse,
    "medium.wav": mediumImpulse,
    "short.wav": shortImpulse,
  }[impulse]

  const response = await fetch(url)
  const array = await response.arrayBuffer()
  node.buffer = await audioContext().decodeAudioData(array)
}

export const setReverbMix = (id: number, value: number) => {
  // @ts-expect-error
  setSettings("effects", id, "mix", value)
  const reverbSettings = settings.effects[id] as ReverbSettings
  const dryGain = reverbSettings.dryGain
  const wetGain = reverbSettings.wetGain
  if (!dryGain || !wetGain) return

  dryGain.gain.setValueAtTime(1 - value, audioContext().currentTime + changeSmoothing)
  wetGain.gain.setValueAtTime(value, audioContext().currentTime + changeSmoothing)
}

export const setBitcrusherBits = (id: number, bits: number) => {
  // @ts-expect-error
  setSettings("effects", id, "bits", bits)
  const node = settings.effects[id].node as AudioWorkletNode
  if (!node) return

  node.parameters.get("bits").value = bits
}

export const setBitreducerBits = (id: number, bits: number) => {
  // @ts-expect-error
  setSettings("effects", id, "bits", bits)
  const node = settings.effects[id].node as AudioWorkletNode
  if (!node) return

  node.parameters.get("bits").value = bits
}

export const setDistortionDrive = (id: number, drive: number) => {
  // @ts-expect-error
  setSettings("effects", id, "drive", drive)
  const node = settings.effects[id].node as AudioWorkletNode
  if (!node) return

  node.parameters.get("drive").value = drive
}

export const setDistortionPostGain = (id: number, postGain: number) => {
  // @ts-expect-error
  setSettings("effects", id, "postGain", postGain)
  const node = settings.effects[id].node as AudioWorkletNode
  if (!node) return

  node.parameters.get("postGain").value = postGain
}

export const setFilterFrequency = (id: number, frequency: number) => {
  // @ts-expect-error
  setSettings("effects", id, "value", frequency)
  const node = settings.effects[id].node as BiquadFilterNode
  if (!node) return

  node.frequency.value = frequency
}

export const setFilterResonance = (id: number, resonance: number) => {
  // @ts-expect-error
  setSettings("effects", id, "resonance", resonance)
  const node = settings.effects[id].node as BiquadFilterNode
  if (!node) return

  node.Q.value = resonance
}

export const setFilterGain = (id: number, value: number) => {
  // @ts-expect-error
  setSettings("effects", id, "gain", value)
  const node = settings.effects[id].node as BiquadFilterNode
  if (!node) return

  node.gain.value = value
}

export const setFilterType = (id: number, type: BiquadFilterType) => {
  // @ts-expect-error
  setSettings("effects", id, "type", type)
  const node = settings.effects[id].node as BiquadFilterNode
  if (!node) return

  node.type = type
}

export const setCompressorThreshold = (id: number, value: number) => {
  // @ts-expect-error
  setSettings("effects", id, "threshold", value)
  const node = settings.effects[id].node as DynamicsCompressorNode
  if (!node) return

  node.threshold.value = value
}

export const setCompressorKnee = (id: number, value: number) => {
  // @ts-expect-error
  setSettings("effects", id, "knee", value)
  const node = settings.effects[id].node as DynamicsCompressorNode
  if (!node) return

  node.knee.value = value
}

export const setCompressorRatio = (id: number, value: number) => {
  // @ts-expect-error
  setSettings("effects", id, "ratio", value)
  const node = settings.effects[id].node as DynamicsCompressorNode
  if (!node) return

  node.ratio.value = value
}

export const setCompressorAttack = (id: number, value: number) => {
  // @ts-expect-error
  setSettings("effects", id, "attack", value)
  const node = settings.effects[id].node as DynamicsCompressorNode
  if (!node) return

  node.attack.value = value / 1000
}

export const setCompressorRelease = (id: number, value: number) => {
  // @ts-expect-error
  setSettings("effects", id, "release", value)
  const node = settings.effects[id].node as DynamicsCompressorNode
  if (!node) return

  node.release.value = value / 1000
}

export const setDelayTime = (id: number, value: number) => {
  // @ts-expect-error
  setSettings("effects", id, "time", value)
  const node = settings.effects[id].node as AudioWorkletNode
  if (!node) return

  node.parameters.get("time").value = value
}

export const setDelayFeedback = (id: number, value: number) => {
  // @ts-expect-error
  setSettings("effects", id, "feedback", value)
  const node = settings.effects[id].node as AudioWorkletNode
  if (!node) return

  node.parameters.get("feedback").value = value
}

export const setDelayGain = (id: number, value: number) => {
  // @ts-expect-error
  setSettings("effects", id, "gain", value)
  const node = settings.effects[id].node as AudioWorkletNode
  if (!node) return

  node.parameters.get("gain").value = value
}
