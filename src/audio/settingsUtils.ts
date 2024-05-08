import { Adsr, Filter } from "./settingsStore"

export const createVolumeAdsr = (audioContext: AudioContext, volumeAdsr: Adsr) => {
  const adsrGain = audioContext.createGain()

  adsrGain.gain.setValueAtTime(0, audioContext.currentTime)
  adsrGain.gain.linearRampToValueAtTime(1, audioContext.currentTime + volumeAdsr.attack / 1000)

  adsrGain.gain.linearRampToValueAtTime(
    1,
    audioContext.currentTime + volumeAdsr.attack / 1000 + volumeAdsr.hold / 1000,
  )

  adsrGain.gain.linearRampToValueAtTime(
    volumeAdsr.sustain,
    audioContext.currentTime +
      volumeAdsr.attack / 1000 +
      volumeAdsr.hold / 1000 +
      volumeAdsr.decay / 1000,
  )

  return adsrGain
}

export const createFilterAdsr = (audioContext: AudioContext, filter: Filter, filterAdsr: Adsr) => {
  const filterNode = audioContext.createBiquadFilter()
  filterNode.frequency.value = filter.value
  filterNode.Q.value = filter.resonance
  filterNode.type = filter.type

  const frequency = filterNode.frequency
  const amountSize = audioContext.sampleRate / 2 - filter.value
  const maxAmount = filter.value + amountSize * filter.amount
  const sustainAmount = filter.value + amountSize * filter.amount * filterAdsr.sustain
  frequency.setValueAtTime(filter.value, audioContext.currentTime)
  frequency.linearRampToValueAtTime(maxAmount, audioContext.currentTime + filterAdsr.attack / 1000)

  frequency.linearRampToValueAtTime(
    maxAmount,
    audioContext.currentTime + filterAdsr.attack / 1000 + filterAdsr.hold / 1000,
  )

  frequency.linearRampToValueAtTime(
    sustainAmount,
    audioContext.currentTime +
      filterAdsr.attack / 1000 +
      filterAdsr.hold / 1000 +
      filterAdsr.decay / 1000,
  )

  return filterNode
}
