import { Worklets } from "./constants"

export default class Bitcrusher extends AudioWorkletProcessor {
  currentValue = [0, 0]
  currentIndex = [0, 0]

  constructor(args) {
    super(args)
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
    if (inputs.length === 0 || outputs.length === 0) return false

    const input = inputs[0]
    const output = outputs[0]
    const channels = output.length

    if (channels === 1) return true

    const { bits } = parameters

    for (let channel = 0; channel < channels; ++channel) {
      if (input[channel] == null) {
        continue
      }

      for (let i = 0, ilimit = output[channel].length; i < ilimit; ++i) {
        const sampleBits = bits.length > 1 ? bits[i] : bits[0]

        if (this.currentIndex[channel] > sampleBits - 1) {
          this.currentIndex[channel] = 0
        }

        if (this.currentIndex[channel] === 0) {
          this.currentValue[channel] = input[channel][i]
        }

        output[channel][i] = this.currentValue[channel]
        this.currentIndex[channel]++
      }
    }

    return true
  }
}

registerProcessor(Worklets.bitcrusher, Bitcrusher)
