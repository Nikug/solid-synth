import { Worklets, Message } from "./constants"

export default class Oscillator extends AudioWorkletProcessor {
  active = null
  d = 0
  previousFrequency = 440

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
    ]
  }

  process(_inputs, outputs, parameters) {
    if (this.active === null) return true
    if (this.active === false) return false

    const { frequency } = parameters
    const channelLength = outputs[0][0].length
    const values = new Float32Array(channelLength)

    for (let i = 0; i < channelLength; ++i) {
      const sampleFrequency = frequency.length > 1 ? frequency[i] : frequency[0]
      const globalTime = currentTime + i / sampleRate
      this.d += globalTime * (this.previousFrequency - sampleFrequency)
      this.previousFrequency = sampleFrequency
      const time = globalTime * sampleFrequency + this.d
      values[i] = Math.sin(2 * Math.PI * time)
    }

    for (const output of outputs) {
      for (const channel of output) {
        channel.set(values)
      }
    }

    return true
  }
}

registerProcessor(Worklets.oscillator, Oscillator)
