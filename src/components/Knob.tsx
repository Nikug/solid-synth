import { Component, Show, createSignal } from "solid-js"
import { easeInCubic, easeOutCubic, unnormalize, normalize } from "../math/curves"
import { setSettings } from "../audio/settingsStore"

const minAngle = -133
const maxAngle = 133
const dragDistanceMultiplier = 0.01

interface Props {
  value: number
  defaultValue: number
  min: number
  max: number
  label: string
  onChange: (value: number) => void
  unit?: string
  exponential?: boolean
  step?: number
}

export const Knob: Component<Props> = (props) => {
  const [dragStart, setDragStart] = createSignal<number | null>(null)
  const [originalValue, setOriginalValue] = createSignal<number | null>(null)

  const knobRotation = () => {
    return props.exponential
      ? easeOutCubic(normalize(props.value, props.min, props.max))
      : normalize(props.value, props.min, props.max)
  }

  const getRotation = () => {
    const range = maxAngle - minAngle
    return minAngle + range * knobRotation()
  }

  const handleDragStart = (event: MouseEvent) => {
    if (event.buttons === 4) {
      props.onChange(props.defaultValue)
      return
    }

    setDragStart(event.clientY)
    setOriginalValue(knobRotation())
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

    if (props.exponential) {
      const cubic = easeInCubic(newValue)
      const unnormalized = unnormalize(cubic, props.min, props.max)
      props.onChange(applyStep(unnormalized))
    } else {
      const unnormalized = unnormalize(newValue, props.min, props.max)
      props.onChange(applyStep(unnormalized))
    }
  }

  const applyStep = (value: number) => {
    if (props.step) {
      return Math.round(value / props.step) * props.step
    } else {
      return value
    }
  }

  const humanReadableNumber = (value: number) => {
    if (value === 0) return "0"

    const positiveValue = Math.abs(value)

    const n = Math.log(positiveValue) / Math.LN10
    let decimals = 3 - n
    if (decimals < 0) decimals = 0
    if (decimals > 3) decimals = 3
    return value.toFixed(decimals)
  }

  return (
    <div class="flex flex-col items-center w-14 text-center text-wrap">
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
      <div class="h-6">
        <Show
          when={dragStart() !== null}
          fallback={<p class="text-sm text-gray-600 leading-3 mt-2">{props.label}</p>}
        >
          <p class="text-sm text-gray-600 leading-3 mt-2">
            {humanReadableNumber(props.value)}
            {props.unit}
          </p>
        </Show>
      </div>
    </div>
  )
}
