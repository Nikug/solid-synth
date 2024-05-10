import { Vector2 } from "../types"

export const normalize = (value: number, min: number, max: number) => {
  const newValue = (value - min) / (max - min)
  if (newValue < 0) return 0
  if (newValue > 1) return 1
  return newValue
}

export const unnormalize = (value: number, min: number, max: number) => {
  return value * (max - min) + min
}

export const easeInCubic = (value: number) => {
  return Math.pow(value, 3)
}

export const easeOutCubic = (value: number) => {
  return Math.pow(value, 1 / 3)
}

export const softClipCurve = () => {
  const points = 256
  const halfPoints = points / 2
  const curve = new Float32Array(halfPoints)

  for (let i = 0; i < halfPoints; ++i) {
    const t = i / halfPoints
    curve[i] = bezierCubic(
      { x: 0, y: 0 },
      { x: 0.9, y: 0.9 },
      { x: 0.9, y: 0.9 },
      { x: 1, y: 0.9 },
      t,
    ).y
  }

  return mirrorCurve(curve)
}

export const mirrorCurve = (curve: Float32Array) => {
  const newArray = new Float32Array(curve.length * 2 - 1)
  const mirrored = curve.toReversed().map((value) => -value)

  newArray.set(mirrored)
  newArray.set(curve, newArray.length / 2)

  return newArray
}

export const lerp = (a: number, b: number, t: number) => {
  return a + (b - a) * t
}

export const vector2Lerp = (a: Vector2, b: Vector2, t: number) => {
  return {
    x: lerp(a.x, b.x, t),
    y: lerp(a.y, b.y, t),
  }
}

export const bezierCubic = (p1: Vector2, p2: Vector2, p3: Vector2, p4: Vector2, t: number) => {
  const p5 = vector2Lerp(p1, p2, t)
  const p6 = vector2Lerp(p2, p3, t)
  const p7 = vector2Lerp(p3, p4, t)
  const p8 = vector2Lerp(p5, p6, t)
  const p9 = vector2Lerp(p6, p7, t)
  const p10 = vector2Lerp(p8, p9, t)

  return p10
}
