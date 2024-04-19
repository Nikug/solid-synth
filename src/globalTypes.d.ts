declare class AudioWorkletProcessor {
  public sampleRate: number
  public currentTime: number

  constructor(options: AudioWorkletNodeOptions)

  process(
    inputs: Float32Array[][],
    outputs: Float32Array[][],
    parameters: Record<string, Float32Array>,
  ): boolean
}
