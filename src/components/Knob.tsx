import { Component, Show, createSignal } from "solid-js"

const minAngle = -133
const maxAngle = 133
const dragDistanceMultiplier = 0.01

interface Props {
  value: number
  min: number
  max: number
  label: string
  onChange: (value: number) => void
  unit?: string
}

export const Knob: Component<Props> = (props) => {
  const [dragStart, setDragStart] = createSignal<number | null>(null)

  const getPercentage = () => {
    const range = props.max - props.min
    return (props.value - props.min) / range
  }

  const getRotation = () => {
    const percentage = getPercentage()
    const range = maxAngle - minAngle
    return minAngle + range * percentage
  }

  const handleDragStart = (event: MouseEvent) => {
    setDragStart(event.clientY)
    addEventListener("mousemove", handleDrag)
  }

  const handleDragEnd = () => {
    setDragStart(null)
    removeEventListener("mousemove", handleDrag)
  }

  const handleDrag = (event: MouseEvent) => {
    event.preventDefault()
    window.getSelection()?.removeAllRanges()

    // Stop dragging if mouse is no longer down
    if (event.buttons === 0) {
      handleDragEnd()
      return
    }

    const change = (dragStart() - event.clientY) * dragDistanceMultiplier * (props.max - props.min)
    let newValue = props.value + change
    if (newValue < props.min) newValue = props.min
    if (newValue > props.max) newValue = props.max
    props.onChange(newValue)
    setDragStart(event.clientY)
  }

  return (
    <div class="flex flex-col items-center w-14">
      <div class="relative">
        <div
          class="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center cursor-pointer relative"
          style={{ rotate: `${getRotation()}deg` }}
          onMouseDown={handleDragStart}
        >
          <div class="absolute w-0.5 h-2 bg-gray-700 top-0 rounded" />
        </div>
        <div class="absolute inset-0 rounded-full border border-gray-400 shadow-lg pointer-events-none" />
        <div
          style={{ rotate: "-135deg" }}
          class="absolute w-0.5 h-1 bg-gray-700 rounded-full bottom-0.5 left-0.5"
        />
        <div
          style={{ rotate: "135deg" }}
          class="absolute w-0.5 h-1 bg-gray-700 rounded-full bottom-0.5 right-0.5"
        />
      </div>
      <Show
        when={dragStart() !== null}
        fallback={<p class="text-sm text-gray-600">{props.label}</p>}
      >
        <p class="text-sm text-gray-600">
          {props.value.toFixed(2)}
          {props.unit}
        </p>
      </Show>
    </div>
  )
}
