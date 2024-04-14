import clsx from "clsx"
import { Component } from "solid-js"
import { addNote, createNoteName, noteBuffer, removeNote } from "../audio/noteStore"
import { Note, Octave } from "../constants"
import { settings } from "../audio/settingsStore"

interface Props {
  note: Note
  key: string
  octave: Octave
  isBlack: boolean
}

export const PianoKey: Component<Props> = (props) => {
  const handleClickStart = (event: MouseEvent) => {
    event.preventDefault()
    if (event.buttons === 0) return
    if (settings.isKnobActive) return
    addNote(props.note, props.octave)
  }

  const handleMouseLeave = (event: MouseEvent) => {
    if (event.buttons === 0) return
    handleClickEnd(event)
  }

  const handleClickEnd = (event: MouseEvent) => {
    if (settings.isKnobActive) return
    event.preventDefault()
    removeNote(props.note, props.octave)
  }

  const isKeyPressed = () => {
    const activeNotes = noteBuffer.activeNotes
    const noteName = createNoteName(props.octave, props.note)
    return activeNotes.has(noteName)
  }

  const getClasses = () => {
    if (isKeyPressed()) {
      return clsx(
        "shadow",
        props.isBlack
          ? "text-white bg-black bg-gradient-to-b from-transparent to-blue-950"
          : "text-black bg-white bg-gradient-to-b from-transparent to-blue-100",
      )
    } else {
      return clsx("shadow-xl", props.isBlack ? "text-white bg-black" : "text-black bg-white")
    }
  }

  return (
    <div
      class={clsx(
        getClasses(),
        "border-2 rounded h-32 w-16 py-1 flex flex-col justify-between items-center select-none transition-all duration-100",
      )}
      onMouseDown={handleClickStart}
      onMouseEnter={handleClickStart}
      onMouseUp={handleClickEnd}
      onMouseLeave={handleMouseLeave}
    >
      <p>{props.note}</p>
      <p class="opacity-50">{props.key}</p>
    </div>
  )
}
