import { softClipCurve } from "../math/curves"
import Oscillator from "../worklets/Oscillator.js?url"
import { setSettings, settings } from "./settingsStore"
import { WaveCache, initializeWaves } from "./waves"

let _audioContext: AudioContext = null
let _outputGain: GainNode = null
let _analyserNode: AnalyserNode = null
let _waveCache: WaveCache = null
let _filterNode: BiquadFilterNode = null
let _lowpass: BiquadFilterNode = null
let _softClip: WaveShaperNode = null

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

export const lowpass = () => {
  if (!_lowpass) {
    return null
  }
  return _lowpass
}

export const filterNode = () => {
  if (!_filterNode) {
    return null
  }
  return _filterNode
}

export const softClip = () => {
  if (!_softClip) {
    return null
  }
  return _softClip
}

const initialize = async () => {
  setSettings("state", "initializing")
  _audioContext = new AudioContext()
  _outputGain = _audioContext.createGain()
  _outputGain.gain.value = settings.volume
  _filterNode = _audioContext.createBiquadFilter()

  _lowpass = _audioContext.createBiquadFilter()
  _lowpass.type = "lowpass"
  _lowpass.frequency.value = _audioContext.sampleRate / 2

  _softClip = _audioContext.createWaveShaper()
  _softClip.curve = softClipCurve()

  _analyserNode = _audioContext.createAnalyser()
  _analyserNode.fftSize = 1024

  _outputGain.connect(_lowpass)
  _lowpass.connect(_softClip)
  _softClip.connect(_analyserNode)
  _analyserNode.connect(_audioContext.destination)
  await registerWorklets()
  _waveCache = initializeWaves()
  setSettings("active", true)
  setSettings("state", "initialized")
}

const registerWorklets = async () => {
  await audioContext().audioWorklet.addModule(Oscillator)
}
