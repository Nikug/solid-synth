import { Component } from "solid-js"

interface Props {
  note: string
  frequency: number
}

export const PianoKey: Component<Props> = (props) => {
  return (
    <div class="border rounded h-16 w-8" onClick={() => console.log(props.note, props.frequency)}>
      {props.note}
    </div>
  )
}
