import { Component, onCleanup, onMount } from "solid-js"
import { analyserNode } from "../audio/audioContextWrapper"

export const Oscilloscope: Component = () => {
  let canvas: HTMLCanvasElement
  let frame = null

  onMount(() => {
    const bufferLength = analyserNode().frequencyBinCount
    const data = new Float32Array(bufferLength)
    let context = canvas.getContext("2d")
    context.lineWidth = 2
    context.strokeStyle = "black"

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

        const y = (v * canvas.height) / 2
        if (i === 0) {
          context.moveTo(x, y)
        } else {
          context.lineTo(x, y)
        }
        x += sliceWidth
      }

      context.lineTo(canvas.width, canvas.height / 2)
      context.stroke()

      frame = requestAnimationFrame(loop)
    }

    frame = requestAnimationFrame(loop)
  })

  onCleanup(() => {
    cancelAnimationFrame(frame)
  })

  return (
    <div>
      <canvas class="bg-white" ref={canvas} id="oscilloscope"></canvas>
    </div>
  )
}
