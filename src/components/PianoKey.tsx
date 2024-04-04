import clsx from "clsx"
import { Component } from "solid-js"
import { addNote, createNoteName, noteBuffer, removeNote } from "../audio/noteStore"

interface Props {
  note: string
  frequency: number
  isBlack: boolean
}

export const PianoKey: Component<Props> = (props) => {
  const handleClickStart = (event: MouseEvent) => {
    event.preventDefault()
    if (event.buttons === 0) return
    addNote(props.note)
  }

  const handleClickEnd = (event: MouseEvent) => {
    event.preventDefault()
    removeNote(props.note)
  }

  const isKeyPressed = () => {
    const activeNotes = noteBuffer.activeNotes
    const noteName = createNoteName(noteBuffer.octave, props.note)
    return activeNotes.has(noteName)
  }

  const getClasses = () => {
    if (isKeyPressed()) {
      return clsx("shadow-2xl", props.isBlack ? "text-white bg-blue-950" : "text-black bg-blue-100")
    } else {
      return props.isBlack ? "text-white bg-black" : "text-black bg-white"
    }
  }

  return (
    <div
      class={clsx(
        getClasses(),
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
