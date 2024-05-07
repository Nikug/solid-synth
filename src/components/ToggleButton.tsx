import clsx from "clsx"
import { Component, JSXElement } from "solid-js"

interface Props {
  selected: boolean
  onChange: (value: boolean) => void
  children: JSXElement
}

export const ToggleButton: Component<Props> = (props) => {
  return (
    <div
      class={clsx(
        props.selected ? "bg-blue-500 text-white" : "bg-gray-200",
        "border rounded h-6 flex items-center justify-center cursor-pointer text-xs",
      )}
      onClick={() => props.onChange(!props.selected)}
    >
      {props.children}
    </div>
  )
}
