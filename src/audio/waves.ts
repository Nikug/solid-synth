export const Wave = {
  sine: 0,
  square: 1,
  sawtooth: 2,
  triangle: 3,
} as const

const resolution = 2048
const sampleResolution = 1024

export interface CachedWave {
  sampled: Float32Array
}

export type WaveCache = Record<(typeof Wave)[keyof typeof Wave], CachedWave>

export const initializeWaves = (): WaveCache => {
  const cache: Partial<WaveCache> = {}

  // Saw
  const sawSample = new Float32Array(sampleResolution)
  for (let i = 0; i < sampleResolution; ++i) {
    let sum = 0
    for (let j = 1; j <= resolution; ++j) {
      sum +=
        (j % 2 === 0 ? 1 : -1) *
        (Math.sin((2 * Math.PI * j * i + 2 * Math.PI) / sampleResolution) / j)
    }

    sawSample[i] = sum / 2
  }

  cache[Wave.sawtooth] = { sampled: sawSample }

  // Sine
  const sineReal = new Float32Array([0, 1])
  const sineImag = new Float32Array([0, 0])
  cache[Wave.sine] = {
    sampled: sampleWave(sineReal, sineImag),
  }

  return cache as WaveCache
}

const sampleWave = (real: Float32Array, imag: Float32Array): Float32Array => {
  const sampled = new Float32Array(sampleResolution)
  for (let i = 0; i < sampleResolution; ++i) {
    const phase = (i / sampleResolution) * Math.PI * 2 + Math.PI / 2
    sampled[i] = inverseFFT(real, imag, phase)
  }

  return sampled
}

export const inverseFFT = (real: Float32Array, imag: Float32Array, phase: number) => {
  let sum = 0
  let length = real.length
  for (let i = 0; i < length; ++i) {
    sum += real[i] * Math.cos(i * phase) + imag[i] * Math.sin(i * phase)
  }
  return sum
}
