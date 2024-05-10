import { Worklets } from "./constants"

export default class Bitcrusher extends AudioWorkletProcessor {
  currentValue = 0
  currentIndex = 0

  constructor(...args) {
    super(...args)
  }

  static get parameterDescriptors() {
    return [
      {
        name: "bits",
        defaultValue: 10,
        minValue: 1,
        maxValue: 500,
        automationRate: "a-rate",
      },
    ]
  }

  process(inputs, outputs, parameters) {
    if (inputs.length === 0) return false

    const { bits } = parameters

    for (const output of outputs) {
      for (let c = 0, limit = output.length; c < limit; ++c) {
        const outputChannel = output[c]
        const inputChannel = inputs[0][c]
        const values = new Float32Array(inputChannel.length)

        for (let i = 0, ilimit = inputChannel.length; i < ilimit; ++i) {
          const sampleBits = bits.length > 1 ? bits[i] : bits[0]

          if (this.currentIndex > sampleBits - 1) {
            this.currentIndex = 0
          }

          if (this.currentIndex === 0) {
            this.currentValue = inputChannel[i]
          }

          values[i] = this.currentValue
          currentIndex++
        }

        outputChannel.set(values)
      }
    }

    return true
  }
}

registerProcessor(Worklets.bitcrusher, Bitcrusher)
