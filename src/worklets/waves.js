import { Wave } from "./constants"

const resolution = 128
const waves = {}

const initializeWaves = () => {
  // Saw
  const real = new Float32Array(resolution)
  const imag = new Float32Array(resolution)
  for (let i = 1; i <= resolution; ++i) {
    const piFactor = 2 / (i * Math.PI)
    const point = piFactor * (i & 1 ? 1 : -1)
    real[i - 1] = -point * Math.sin(i)
    imag[i - 1] = point * Math.cos(i)
  }

  waves.saw = { real, imag }

  // Sine
  waves.sine = {
    real: new Float32Array([0, 1]),
    imag: new Float32Array([0, 0]),
  }
}

initializeWaves()

export const inverseFFT = (real, imag, phase) => {
  let sum = 0
  let length = real.length
  for (let i = 0; i < length; ++i) {
    sum += real[i] * Math.cos(i * phase) + imag[i] * Math.sin(i * phase)
  }
  return sum
}

export const calculateWave = (t, wave) => {
  switch (wave) {
    case Wave.sine:
      return inverseFFT(waves.sine.real, waves.sine.imag, t)
    case Wave.square:
      return Math.sign(Math.sin(2 * Math.PI * t + degToRad(phase)))
    case Wave.sawtooth:
      return inverseFFT(waves.saw.real, waves.saw.imag, t)
    case Wave.triangle:
      return (Math.sign(Math.sin(2 * Math.PI * t + degToRad(phase))) + 1) / 2
  }
}
