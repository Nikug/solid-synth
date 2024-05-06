export const Wave = {
  sine: 0,
  square: 1,
  sawtooth: 2,
  triangle: 3,
} as const

const resolution = 2048
const sampleResolution = 1024

export interface CachedWave {
  real: Float32Array
  imag: Float32Array
  sampled: Float32Array
}

export type WaveCache = Record<(typeof Wave)[keyof typeof Wave], CachedWave>

export const initializeWaves = (): WaveCache => {
  const cache: Partial<WaveCache> = {}

  // Saw
  const sawReal = new Float32Array(resolution)
  const sawImag = new Float32Array(resolution)
  for (let i = 1; i <= resolution; ++i) {
    const piFactor = 2 / (i * Math.PI)
    const point = piFactor * (i & 1 ? 1 : -1)
    sawReal[i - 1] = -point * Math.sin(i)
    sawImag[i - 1] = point * Math.cos(i)
  }

  cache[Wave.sawtooth] = { real: sawReal, imag: sawImag, sampled: sampleWave(sawReal, sawImag) }

  // Sine
  const sineReal = new Float32Array([0, 1])
  const sineImag = new Float32Array([0, 0])
  cache[Wave.sine] = {
    real: sineReal,
    imag: sineImag,
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
