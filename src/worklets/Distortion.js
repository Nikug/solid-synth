import { Worklets, Message } from "./constants"

export default class Distortion extends AudioWorkletProcessor {
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
        name: "drive",
        defaultValue: 0,
        minValue: -30,
        maxValue: 30,
        automationRate: "a-rate",
      },
      {
        name: "postGain",
        defaultValue: 0,
        minValue: -30,
        maxValue: 30,
        automationRate: "a-rate",
      },
    ]
  }

  process(inputs, outputs, parameters) {
    if (!this.active) return false

    const input = inputs[0]
    const output = outputs[0]

    const { drive, postGain } = parameters

    for (let i = 0, ilimit = output[0].length; i < ilimit; ++i) {
      const sampleDrive = drive.length > 1 ? drive[i] : drive[0]
      const samplePostGain = postGain.length > 1 ? postGain[i] : postGain[0]

      const linearDrive = Math.pow(10, sampleDrive / 20)
      const linearPostGain = Math.pow(10, samplePostGain / 20)

      if (input[0] === undefined || input[1] === undefined) {
        break
      }

      output[0][i] = Math.tanh(input[0][i] * linearDrive) * linearPostGain
      output[1][i] = Math.tanh(input[1][i] * linearDrive) * linearPostGain
    }

    return true
  }
}

registerProcessor(Worklets.distortion, Distortion)
