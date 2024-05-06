import Oscillator from "../worklets/Oscillator.js?url"
import { WaveCache, initializeWaves } from "./waves"

let _audioContext: AudioContext = null
let _outputGain: GainNode = null
let _waveCache: WaveCache = null

export const audioContext = () => {
  if (!_audioContext) {
    initialize()
  }

  return _audioContext
}

export const outputGain = () => {
  if (!_outputGain) {
    initialize()
  }
  return _outputGain
}

export const waveCache = () => {
  if (!_waveCache) {
    initialize()
  }
  return _waveCache
}

const initialize = () => {
  _audioContext = new AudioContext()
  _outputGain = _audioContext.createGain()
  _outputGain.connect(_audioContext.destination)
  registerWorklets()
  _waveCache = initializeWaves()
}

const registerWorklets = async () => {
  await audioContext().audioWorklet.addModule(Oscillator)
}
