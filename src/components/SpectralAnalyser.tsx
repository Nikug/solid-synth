import { Component, Show, onCleanup, onMount } from "solid-js"
import { analyserNode } from "../audio/audioContextWrapper"
import { gray } from "tailwindcss/colors"
import { settings } from "../audio/settingsStore"
import { clamp } from "../worklets/math"

export const SpectralAnalyser: Component = () => {
  return (
    <div class="w-48 h-16 border rounded-lg p-1">
      <Show when={settings.active}>
        <SpectralAnalyserInner />
      </Show>
    </div>
  )
}

const SpectralAnalyserInner: Component = () => {
  let canvas: HTMLCanvasElement
  let frame = null

  onMount(() => {
    canvas.width = canvas.offsetWidth * 2
    canvas.height = canvas.offsetHeight * 2

    const bufferLength = analyserNode().frequencyBinCount
    const data = new Float32Array(bufferLength)
    let context = canvas.getContext("2d")
    context.lineWidth = 4
    context.strokeStyle = gray[600]

    const loop = (_time: number) => {
      analyserNode().getFloatFrequencyData(data)

      context.clearRect(0, 0, canvas.width, canvas.height)
      context.beginPath()

      for (let i = 0; i < bufferLength; i++) {
        const v = data[i]

        if (v == null) {
          continue
        }

        const y = clamp((-v / 140) * canvas.height, 0, canvas.height - 1)
        const x = Math.pow(i / bufferLength, 1 / 2) * canvas.width
        if (i === 0) {
          context.moveTo(x, y)
        } else {
          context.lineTo(x, y)
        }
      }

      context.stroke()

      frame = requestAnimationFrame(loop)
    }

    frame = requestAnimationFrame(loop)
  })

  onCleanup(() => {
    cancelAnimationFrame(frame)
  })

  return <canvas class="bg-transparent w-full h-full" ref={canvas} id="spectral-analyser"></canvas>
}
