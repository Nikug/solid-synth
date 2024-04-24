import { Component, createSignal } from "solid-js"
import { unnormalize, normalize } from "../math/curves"
import { setSettings } from "../audio/settingsStore"

const dragDistanceMultiplier = 0.01

interface Props {
  value: number
  defaultValue: number
  min: number
  max: number
  label: string
  onChange: (value: number) => void
}

export const NumberKnob: Component<Props> = (props) => {
  const [dragStart, setDragStart] = createSignal<number | null>(null)
  const [originalValue, setOriginalValue] = createSignal<number | null>(null)

  const handleDragStart = (event: MouseEvent) => {
    if (event.buttons === 4) {
      props.onChange(props.defaultValue)
      return
    }

    setDragStart(event.clientY)
    setOriginalValue(normalize(props.value, props.min, props.max))
    setSettings("isKnobActive", true)
    addEventListener("mousemove", handleDrag)
  }

  const handleDragEnd = () => {
    setDragStart(null)
    setOriginalValue(null)
    setSettings("isKnobActive", false)
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

    const change = (dragStart() - event.clientY) * dragDistanceMultiplier
    let newValue = originalValue() + change
    if (newValue < 0) newValue = 0
    if (newValue > 1) newValue = 1

    const unnormalized = unnormalize(newValue, props.min, props.max)
    props.onChange(Math.round(unnormalized))
  }

  const handleScrollWheel = (event: WheelEvent) => {
    event.preventDefault()
    const isUp = event.deltaY < 0
    let newValue = isUp ? props.value + 1 : props.value - 1
    if (newValue < props.min) newValue = props.min
    if (newValue > props.max) newValue = props.max
    props.onChange(newValue)
  }

  return (
    <div class="flex flex-col items-center w-14 text-center text-wrap">
      <div class="">
        <div
          class="px-1 py-2 rounded border flex justify-center items-center cursor-pointer bg-gray-200"
          onMouseDown={handleDragStart}
          onWheel={handleScrollWheel}
        >
          <p class="text-sm text-gray-600 leading-3">{props.value}</p>
        </div>
        <p class="text-sm text-gray-600 leading-3 mt-2">{props.label}</p>
      </div>
    </div>
  )
}
