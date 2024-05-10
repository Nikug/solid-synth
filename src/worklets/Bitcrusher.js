import { Worklets, Message } from "./constants"

export default class Bitcrusher extends AudioWorkletProcessor {
  active = true
  currentValue = [0, 0]
  currentIndex = 0

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
        minValue: 1,
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

      if (input[0] === undefined) {
        output[0][i] = 0
        output[1][i] = 0
        continue
      }

      if (this.currentIndex > sampleBits - 1) {
        this.currentIndex = 0
      }

      if (this.currentIndex === 0) {
        this.currentValue[0] = input[0][i]
        this.currentValue[1] = input[1][i]
      }

      output[0][i] = this.currentValue[0]
      output[1][i] = this.currentValue[1]
      this.currentIndex++
    }

    return true
  }
}

registerProcessor(Worklets.bitcrusher, Bitcrusher)
