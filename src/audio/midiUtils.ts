export const midiToFrequency = (midi: number) => Math.pow(2, (midi - 69) / 12) * 440

export const midiToGain = (midi: number) => midi / 127
