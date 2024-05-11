import { Worklets, Message } from "./constants"

export default class Delay extends AudioWorkletProcessor {
  active = true
  delayBuffer = [new Float32Array(5 * sampleRate), new Float32Array(5 * sampleRate)]
  delayIndex = 0

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
        name: "time",
        defaultValue: 500,
        minValue: 1,
        maxValue: 5000,
        automationRate: "a-rate",
      },
      {
        name: "feedback",
        defaultValue: 0.5,
        minValue: 0,
        maxValue: 1,
        automationRate: "a-rate",
      },
    ]
  }

  process(inputs, outputs, parameters) {
    if (!this.active) return false

    const input = inputs[0]
    const output = outputs[0]

    const { time, feedback } = parameters

    for (let i = 0, ilimit = output[0].length; i < ilimit; ++i) {
      const sampleTime = time.length > 1 ? time[i] : time[0]
      const sampleFeedback = feedback.length > 1 ? feedback[i] : feedback[0]

      output[0][i] = input[0]?.[i] ?? 0 + this.delayBuffer[0][this.delayIndex]
      output[1][i] = input[1]?.[i] ?? 0 + this.delayBuffer[1][this.delayIndex]

      this.delayBuffer[0][this.delayIndex] = output[0][i] * sampleFeedback
      this.delayBuffer[1][this.delayIndex] = output[1][i] * sampleFeedback

      ++this.delayIndex
      if (
        this.delayIndex >= (sampleTime / 1000) * sampleRate ||
        this.delayIndex >= this.delayBuffer[0].length
      ) {
        this.delayIndex = 0
      }
    }

    return true
  }
}

registerProcessor(Worklets.delay, Delay)
