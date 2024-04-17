import { degToRad } from "./utils"

const resolution = 2048

/**
 * @param phase in degrees
 */
export const sineWave = (phase: number): [real: Float32Array, imag: Float32Array] => {
  const real = new Float32Array(2)
  const imag = new Float32Array(2)
  const radians = degToRad(phase)

  real[0] = Math.sin(radians)
  imag[0] = 0
  real[1] = Math.sin(Math.PI / 2 + radians)
  imag[1] = 0

  return [real, imag]
}
