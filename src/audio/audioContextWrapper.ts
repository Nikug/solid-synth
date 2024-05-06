import Oscillator from "../worklets/Oscillator.js?url"
import { setSettings } from "./settingsStore"
import { WaveCache, initializeWaves } from "./waves"

let _audioContext: AudioContext = null
let _outputGain: GainNode = null
let _analyserNode: AnalyserNode = null
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

export const analyserNode = () => {
  if (!_analyserNode) {
    return null
  }
  return _analyserNode
}

const initialize = () => {
  _audioContext = new AudioContext()
  _outputGain = _audioContext.createGain()

  _analyserNode = _audioContext.createAnalyser()
  _analyserNode.fftSize = 2048

  _outputGain.connect(_analyserNode)
  _analyserNode.connect(_audioContext.destination)
  registerWorklets()
  _waveCache = initializeWaves()
  setSettings("active", true)
}

const registerWorklets = async () => {
  await audioContext().audioWorklet.addModule(Oscillator)
}
