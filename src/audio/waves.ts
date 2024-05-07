import { Wave } from "../worklets/constants"

const resolution = 2048
const sampleResolution = 1024

export interface CachedWave {
  sampled: Float32Array
}

export type WaveCache = Record<(typeof Wave)[keyof typeof Wave], CachedWave>

export const initializeWaves = (): WaveCache => {
  const cache: Partial<WaveCache> = {}

  cache[Wave.sine] = { sampled: createSine() }
  cache[Wave.sawtooth] = { sampled: createSaw() }
  cache[Wave.square] = { sampled: createSquare() }
  cache[Wave.triangle] = { sampled: createTriangle() }
  cache[Wave.pulse] = { sampled: createPulse() }
  cache[Wave.fatSine] = { sampled: createFatSine() }

  return cache as WaveCache
}

const createPulse = () => {
  const sample = new Float32Array(sampleResolution)
  const d = 0.2
  for (let i = 0; i < sampleResolution; ++i) {
    let sum = 0
    for (let n = 1; n <= resolution; ++n) {
      const insidePart = Math.PI * n
      const sin = Math.sin(insidePart * d)
      const cos = Math.cos((insidePart * i * 2) / sampleResolution)
      sum += (sin * cos) / n
    }

    sample[i] = (sum * 2) / Math.PI
  }

  return sample
}

const createTriangle = () => {
  const sample = new Float32Array(sampleResolution)
  for (let i = 0; i < sampleResolution; ++i) {
    let sum = 0
    for (let n = 1; n <= resolution; n += 2) {
      const insideSin = (2 * Math.PI * n * i) / sampleResolution
      sum += (Math.sin(insideSin) * (-1) ** ((n - 1) / 2)) / (n * n)
    }

    sample[i] = (-2 / Math.PI) * sum
  }

  return sample
}

const createSquare = () => {
  const sample = new Float32Array(sampleResolution)
  for (let i = 0; i < sampleResolution; ++i) {
    let sum = 0
    for (let n = 1; n <= resolution; n += 2) {
      const insideSin = (2 * Math.PI * n * i) / sampleResolution
      sum += Math.sin(insideSin) / n
    }

    sample[i] = (sum * 4) / Math.PI
  }

  return sample
}

const createSaw = () => {
  const sample = new Float32Array(sampleResolution)
  for (let i = 0; i < sampleResolution; ++i) {
    let sum = 0
    for (let n = 1; n <= resolution; ++n) {
      const multiplier = n % 2 === 0 ? 1 : -1
      const insideSin = (2 * Math.PI * n * i) / sampleResolution
      sum += (multiplier * Math.sin(insideSin)) / n
    }

    sample[i] = (-2 * sum) / Math.PI
  }

  return sample
}

const createSine = () => {
  const sample = new Float32Array(sampleResolution)
  for (let i = 0; i < sampleResolution; ++i) {
    sample[i] = Math.sin((2 * Math.PI * i) / sampleResolution)
  }
  return sample
}

const createFatSine = () => {
  const sample = new Float32Array(sampleResolution)
  for (let i = 0; i < sampleResolution; ++i) {
    const inside = (2 * Math.PI * i) / sampleResolution
    sample[i] = Math.tanh(Math.sin(inside) * 2)
  }
  return sample
}

const sampleWave = (real: Float32Array, imag: Float32Array): Float32Array => {
  const sampled = new Float32Array(sampleResolution)
  for (let i = 0; i < sampleResolution; ++i) {
    const phase = (i / sampleResolution) * Math.PI * 2 + Math.PI / 2
    sampled[i] = inverseFFT(real, imag, phase)
  }

  return sampled
}

const inverseFFT = (real: Float32Array, imag: Float32Array, phase: number) => {
  let sum = 0
  let length = real.length
  for (let i = 0; i < length; ++i) {
    sum += real[i] * Math.cos(i * phase) + imag[i] * Math.sin(i * phase)
  }
  return sum
}
