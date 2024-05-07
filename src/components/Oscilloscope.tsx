import { Component, Show, onCleanup, onMount } from "solid-js"
import { analyserNode } from "../audio/audioContextWrapper"
import * as colors from "tailwindcss/colors"
import { settings } from "../audio/settingsStore"

export const Oscilloscope: Component = () => {
  return (
    <div class="w-48 h-16 border rounded-lg p-1">
      <Show when={settings.active}>
        <OscilloscopeInner />
      </Show>
    </div>
  )
}

export const OscilloscopeInner: Component = () => {
  let canvas: HTMLCanvasElement
  let frame = null

  onMount(() => {
    const bufferLength = analyserNode().frequencyBinCount
    const data = new Float32Array(bufferLength)
    let context = canvas.getContext("2d")
    context.lineWidth = 2
    context.strokeStyle = colors.gray[700]

    const loop = (_time: number) => {
      analyserNode().getFloatTimeDomainData(data)

      context.clearRect(0, 0, canvas.width, canvas.height)
      context.beginPath()

      const sliceWidth = canvas.width / bufferLength
      let x = 0

      for (let i = 0; i < bufferLength; i++) {
        const v = data[i]

        if (v == null) {
          continue
        }

        const y = ((v + 1) / 2) * canvas.height
        if (i === 0) {
          context.moveTo(x, y)
        } else {
          context.lineTo(x, y)
        }
        x += sliceWidth
      }

      context.stroke()

      frame = requestAnimationFrame(loop)
    }

    frame = requestAnimationFrame(loop)
  })

  onCleanup(() => {
    cancelAnimationFrame(frame)
  })

  return <canvas class="bg-transparent w-full h-full" ref={canvas} id="oscilloscope"></canvas>
}
