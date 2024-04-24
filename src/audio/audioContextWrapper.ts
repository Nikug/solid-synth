import Osc from "../worklets/Osc.js?url"

let _audioContext: AudioContext = null
let _outputGain: GainNode = null

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

const initialize = () => {
  _audioContext = new AudioContext()
  _outputGain = _audioContext.createGain()
  _outputGain.connect(_audioContext.destination)
  registerWorklets()
}

const registerWorklets = () => {
  audioContext().audioWorklet.addModule(Osc)
}
