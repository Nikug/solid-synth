import { Worklets, Message } from "./constants"
import { semitonesToFrequency, loop } from "./math"

const declickSamples = 32

export default class Oscillator extends AudioWorkletProcessor {
  active = null
  pitchOffset = 0
  previousFrequency = 440
  firstRun = true
  cache = null

  constructor(...args) {
    super(...args)

    this.port.onmessage = (event) => {
      if (event.data.id === Message.start) {
        this.active = true
      } else if (event.data.id === Message.stop) {
        this.active = false
      } else if (event.data.id === Message.waveCache) {
        this.cache = event.data.cache
      }
    }
  }

  static get parameterDescriptors() {
    return [
      {
        name: "frequency",
        defaultValue: 440,
        minValue: 0,
        maxValue: sampleRate / 2,
        automationRate: "a-rate",
      },
      {
        name: "detune",
        defaultValue: 0,
        minValue: -144,
        maxValue: 144,
        automationRate: "a-rate",
      },
      {
        name: "phase",
        defaultValue: 0,
        minValue: 0,
        maxValue: 360,
        automationRate: "a-rate",
      },
      {
        name: "wave",
        defaultValue: 0,
        minValue: 0,
        maxValue: 3,
        automationRate: "a-rate",
      },
    ]
  }

  process(_inputs, outputs, parameters) {
    if (this.active === null) return true
    if (this.active === false) return false

    const { frequency, detune, phase, wave } = parameters
    const channelLength = outputs[0][0].length
    const values = new Float32Array(channelLength)

    for (let i = 0; i < channelLength; ++i) {
      let sampleFrequency = frequency.length > 1 ? frequency[i] : frequency[0]
      const samplePhase = phase.length > 1 ? phase[i] : phase[0]
      const sampleDetune = detune.length > 1 ? detune[i] : detune[0]
      sampleFrequency = semitonesToFrequency(sampleDetune, sampleFrequency)
      const sampleWave = wave.length > 1 ? wave[i] : wave[0]

      const sampleTime = currentTime + i / sampleRate

      this.pitchOffset += sampleTime * (this.previousFrequency - sampleFrequency)
      this.previousFrequency = sampleFrequency
      const t = sampleTime * sampleFrequency + this.pitchOffset

      const nextValue = calculateWave(sampleWave, this.cache, t, samplePhase)

      values[i] = nextValue
    }

    // Declick
    if (this.firstRun) {
      for (let i = 0; i < declickSamples; ++i) {
        values[i] = values[i] * (i / declickSamples)
      }
      this.firstRun = false
    }

    for (const output of outputs) {
      for (const channel of output) {
        channel.set(values)
      }
    }

    return true
  }
}

const calculateWave = (wave, cache, t, phase) => {
  let sample = cache[wave].sampled

  const position = t * sample.length
  const phaseOffset = (phase / 360) * sample.length

  const previous = Math.floor(position + phaseOffset) % sample.length
  const next = loop(previous + 1, 0, sample.length - 1)

  // Linearly interpolate between samples
  return (sample[previous] + sample[next]) / 2
}

registerProcessor(Worklets.oscillator, Oscillator)
