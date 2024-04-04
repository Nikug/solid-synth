import clsx from "clsx"
import { Component } from "solid-js"

interface Props {
  note: string
  frequency: number
  isBlack: boolean
}

export const PianoKey: Component<Props> = (props) => {
  return (
    <div
      class={clsx(
        props.isBlack ? "bg-black text-white" : "bg-white text-black",
        "border rounded h-32 w-16 flex justify-center items-start",
      )}
      onClick={() => console.log(props.note, props.frequency)}
    >
      {props.note}
    </div>
  )
}
