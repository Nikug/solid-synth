import clsx from "clsx"
import { Component } from "solid-js"
import { playNote, stopNote } from "../audio/audioEngine"

interface Props {
  note: string
  frequency: number
  isBlack: boolean
}

export const PianoKey: Component<Props> = (props) => {
  const handleClickStart = (event: MouseEvent) => {
    event.preventDefault()
    if (event.buttons === 0) return
    playNote(props.frequency)
  }

  const handleClickEnd = (event: MouseEvent) => {
    event.preventDefault()
    stopNote(props.frequency)
  }

  return (
    <div
      class={clsx(
        props.isBlack ? "bg-black text-white" : "bg-white text-black",
        "border rounded h-32 w-16 flex justify-center items-start select-none shadow-lg",
      )}
      onMouseDown={handleClickStart}
      onMouseOver={handleClickStart}
      onMouseUp={handleClickEnd}
      onMouseLeave={handleClickEnd}
    >
      {props.note}
    </div>
  )
}
