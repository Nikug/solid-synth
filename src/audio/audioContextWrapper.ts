import { softClipCurve } from "../math/curves"
import { setSettings, settings } from "./settingsStore"
import { WaveCache, initializeWaves } from "./waves"
import Oscillator from "../worklets/Oscillator.js?url"
import Bitcrusher from "../worklets/Bitcrusher.js?url"
import Bitreducer from "../worklets/Bitreducer.js?url"
import Distortion from "../worklets/Distortion.js?url"

let _audioContext: AudioContext = null
let _effectsInput: GainNode = null
let _effectsOutput1: GainNode = null
let _effectsOutput2: GainNode = null
let _effectsOutput3: GainNode = null
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

export const analyserNode = () => _analyserNode
export const lowpass = () => _lowpass
export const filterNode = () => _filterNode
export const softClip = () => _softClip
export const effectsInput = () => _effectsInput
export const effectsOutput1 = () => _effectsOutput1
export const effectsOutput2 = () => _effectsOutput2
export const effectsOutput3 = () => _effectsOutput3

const initialize = async () => {
  setSettings("state", "initializing")
  _audioContext = new AudioContext()
  _outputGain = _audioContext.createGain()
  _effectsInput = _audioContext.createGain()
  _effectsOutput1 = _audioContext.createGain()
  _effectsOutput2 = _audioContext.createGain()
  _effectsOutput3 = _audioContext.createGain()
  _outputGain.gain.value = settings.volume
  _filterNode = _audioContext.createBiquadFilter()

  _lowpass = _audioContext.createBiquadFilter()
  _lowpass.type = "lowpass"
  _lowpass.frequency.value = _audioContext.sampleRate / 2

  _softClip = _audioContext.createWaveShaper()
  _softClip.curve = softClipCurve()
  _softClip.oversample = "2x"

  _analyserNode = _audioContext.createAnalyser()
  _analyserNode.fftSize = 1024

  _effectsInput.connect(_effectsOutput1)
  _effectsOutput1.connect(_effectsOutput2)
  _effectsOutput2.connect(_effectsOutput3)
  _effectsOutput3.connect(_outputGain)
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
  await audioContext().audioWorklet.addModule(Bitcrusher)
  await audioContext().audioWorklet.addModule(Bitreducer)
  await audioContext().audioWorklet.addModule(Distortion)
}
