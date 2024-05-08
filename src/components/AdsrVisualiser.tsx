import { Component, createEffect, onMount } from "solid-js"
import { Adsr } from "../audio/settingsStore"
import { gray } from "tailwindcss/colors"
import { clamp } from "../worklets/math"

interface Props {
  id: string
  adsr: Adsr
}

export const AdsrVisualiser: Component<Props> = (props) => {
  let canvas: HTMLCanvasElement
  const maxDuration = 8000 // ms

  onMount(() => {
    canvas.width = canvas.offsetWidth * 2
    canvas.height = canvas.offsetHeight * 2
  })

  createEffect(() => {
    if (!canvas) return

    let context = canvas.getContext("2d")
    context.clearRect(0, 0, canvas.width, canvas.height)
    context.beginPath()

    context.lineWidth = 4
    context.strokeStyle = gray[500]
    context.fillStyle = gray[700]

    const unit = canvas.width / maxDuration
    const padding = 7
    const top = padding
    const bottom = canvas.height - padding
    const left = padding
    const right = canvas.width - padding
    const pointRadius = 6
    const pointDiameter = 2 * pointRadius

    const attack = { x: left, y: bottom }
    const hold = { x: attack.x + props.adsr.attack * unit, y: top }
    const decay = {
      x: hold.x + props.adsr.hold * unit,
      y: top,
    }
    const release = {
      x: decay.x + props.adsr.decay * unit,
      y: clamp(canvas.height - canvas.height * props.adsr.sustain, top, bottom),
    }
    const end = { x: clamp(release.x + props.adsr.release * unit, left, right), y: bottom }

    context.moveTo(attack.x, attack.y)
    context.lineTo(hold.x, hold.y)
    context.lineTo(decay.x, decay.y)
    context.lineTo(release.x, release.y)
    context.lineTo(end.x, end.y)

    context.stroke()
    context.closePath()

    context.beginPath()
    context.roundRect(
      attack.x - pointRadius,
      attack.y - pointRadius,
      pointDiameter,
      pointDiameter,
      90,
    )
    context.roundRect(hold.x - pointRadius, hold.y - pointRadius, pointDiameter, pointDiameter, 90)
    context.roundRect(
      decay.x - pointRadius,
      decay.y - pointRadius,
      pointDiameter,
      pointDiameter,
      90,
    )
    context.roundRect(
      release.x - pointRadius,
      release.y - pointRadius,
      pointDiameter,
      pointDiameter,
      90,
    )
    context.roundRect(end.x - pointRadius, end.y - pointRadius, pointDiameter, pointDiameter, 90)
    context.fill()
  })

  return (
    <div class="h-8 w-full border rounded mb-1">
      <canvas
        ref={canvas}
        class="w-full h-full bg-transparent"
        id={`adsr-visualiser-${props.id}`}
      />
    </div>
  )
}
