import { softClipCurve } from "../math/curves"
import { setSettings, settings } from "./settingsStore"
import { WaveCache, initializeWaves } from "./waves"
import Oscillator from "../worklets/Oscillator.js?worker&url"
import Bitcrusher from "../worklets/Bitcrusher.js?worker&url"
import Bitreducer from "../worklets/Bitreducer.js?worker&url"
import Distortion from "../worklets/Distortion.js?worker&url"
import Delay from "../worklets/Delay.js?worker&url"
import { createMidiContext } from "./midiContext"

let _audioContext: AudioContext = null
let _effectsInput: GainNode = null
let _effectsOutput1: GainNode = null
let _effectsOutput2: GainNode = null
let _effectsOutput3: GainNode = null
let _effectsOutput4: GainNode = null
let _effectsOutput5: GainNode = null
let _effectsOutput6: GainNode = null
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
export const effectsOutput4 = () => _effectsOutput4
export const effectsOutput5 = () => _effectsOutput5
export const effectsOutput6 = () => _effectsOutput6

export const initialize = async () => {
  setSettings("state", "initializing")
  _audioContext = new AudioContext()
  _outputGain = _audioContext.createGain()
  _effectsInput = _audioContext.createGain()
  _effectsOutput1 = _audioContext.createGain()
  _effectsOutput2 = _audioContext.createGain()
  _effectsOutput3 = _audioContext.createGain()
  _effectsOutput4 = _audioContext.createGain()
  _effectsOutput5 = _audioContext.createGain()
  _effectsOutput6 = _audioContext.createGain()
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
  _effectsOutput3.connect(_effectsOutput4)
  _effectsOutput4.connect(_effectsOutput5)
  _effectsOutput5.connect(_effectsOutput6)
  _effectsOutput6.connect(_outputGain)
  _outputGain.connect(_lowpass)
  _lowpass.connect(_softClip)
  _softClip.connect(_analyserNode)
  _analyserNode.connect(_audioContext.destination)
  await registerWorklets()
  _waveCache = initializeWaves()
  createMidiContext()
  setSettings("active", true)
  setSettings("state", "initialized")
}

const registerWorklets = async () => {
  await audioContext().audioWorklet.addModule(Oscillator)
  await audioContext().audioWorklet.addModule(Bitcrusher)
  await audioContext().audioWorklet.addModule(Bitreducer)
  await audioContext().audioWorklet.addModule(Distortion)
  await audioContext().audioWorklet.addModule(Delay)
}

export const effectConnections = () => ({
  1: {
    input: _effectsInput,
    output: _effectsOutput1,
  },
  2: {
    input: _effectsOutput1,
    output: _effectsOutput2,
  },
  3: {
    input: _effectsOutput2,
    output: _effectsOutput3,
  },
  4: {
    input: _effectsOutput3,
    output: _effectsOutput4,
  },
  5: {
    input: _effectsOutput4,
    output: _effectsOutput5,
  },
  6: {
    input: _effectsOutput5,
    output: _effectsOutput6,
  },
})
