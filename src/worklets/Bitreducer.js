import { Worklets, Message } from "./constants"

export default class Bitreducer extends AudioWorkletProcessor {
  active = true

  constructor(args) {
    super(args)

    this.port.onmessage = (event) => {
      if (event.data.id === Message.stop) {
        this.active = false
      }
    }
  }

  static get parameterDescriptors() {
    return [
      {
        name: "bits",
        defaultValue: 10,
        minValue: 2,
        maxValue: 500,
        automationRate: "a-rate",
      },
    ]
  }

  process(inputs, outputs, parameters) {
    if (!this.active) return false

    const input = inputs[0]
    const output = outputs[0]

    const { bits } = parameters

    for (let i = 0, ilimit = output[0].length; i < ilimit; ++i) {
      const sampleBits = bits.length > 1 ? bits[i] : bits[0]

      if (input[0] === undefined || input[1] === undefined) {
        break
      }

      output[0][i] = Math.round(input[0][i] * sampleBits) / sampleBits
      output[1][i] = Math.round(input[1][i] * sampleBits) / sampleBits
    }

    return true
  }
}

registerProcessor(Worklets.bitreducer, Bitreducer)
