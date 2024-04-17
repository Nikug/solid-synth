import { test } from "uvu"
import { sineWave } from "../src/math/oscillators"
import { assertClose } from "./util"

test("Sine wave 0 degrees", () => {
  const [real, imag] = sineWave(0)
  assertClose(real[0], 0)
  assertClose(real[1], 1)
  assertClose(imag[0], 0)
  assertClose(imag[1], 0)
})

test("Sine wave 90 degrees", () => {
  const [real, imag] = sineWave(90)
  assertClose(real[0], 1)
  assertClose(real[1], 0)
  assertClose(imag[0], 0)
  assertClose(imag[1], 0)
})

test("Sine wave 180 degrees", () => {
  const [real, imag] = sineWave(180)
  assertClose(real[0], 0)
  assertClose(real[1], -1)
  assertClose(imag[0], 0)
  assertClose(imag[1], 0)
})

test("Sine wave 270 degrees", () => {
  const [real, imag] = sineWave(270)
  assertClose(real[0], -1)
  assertClose(real[1], 0)
  assertClose(imag[0], 0)
  assertClose(imag[1], 0)
})

test("Sine wave 360 degrees", () => {
  const [real, imag] = sineWave(360)
  assertClose(real[0], 0)
  assertClose(real[1], 1)
  assertClose(imag[0], 0)
  assertClose(imag[1], 0)
})

test.run()
