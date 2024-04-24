import { Worklets, Message } from "./constants"
import { degToRad, semitonesToFrequency } from "./math"

const declickSamples = 32

export default class Oscillator extends AudioWorkletProcessor {
  active = null
  d = 0
  previousFrequency = 440
  firstRun = true

  constructor(...args) {
    super(...args)

    this.port.onmessage = (event) => {
      if (event.data === Message.start) {
        this.active = true
      } else if (event.data === Message.stop) {
        this.active = false
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
    ]
  }

  process(_inputs, outputs, parameters) {
    if (this.active === null) return true
    if (this.active === false) return false

    const { frequency, detune, phase } = parameters
    const channelLength = outputs[0][0].length
    const values = new Float32Array(channelLength)

    for (let i = 0; i < channelLength; ++i) {
      let sampleFrequency = frequency.length > 1 ? frequency[i] : frequency[0]
      const samplePhase = phase.length > 1 ? phase[i] : phase[0]
      const sampleDetune = detune.length > 1 ? detune[i] : detune[0]
      sampleFrequency = semitonesToFrequency(sampleDetune, sampleFrequency)

      const globalTime = currentTime + i / sampleRate

      this.d += globalTime * (this.previousFrequency - sampleFrequency)
      this.previousFrequency = sampleFrequency
      const time = globalTime * sampleFrequency + this.d

      values[i] = Math.sin(2 * Math.PI * time + degToRad(samplePhase))
    }

    // Declick
    if (this.firstRun) {
      for (let i = 0; i < declickSamples; ++i) {
        values[i] = values[i] * (i / declickSamples)
      }
    }

    for (const output of outputs) {
      for (const channel of output) {
        channel.set(values)
      }
    }

    this.firstRun = false
    return true
  }
}

registerProcessor(Worklets.oscillator, Oscillator)
