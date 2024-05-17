import { createStore } from "solid-js/store"
import { settings } from "./settingsStore"
import { playNote, stopNote } from "./audioEngine"
import { MidiMessage } from "../constants"
import { midiToFrequency } from "./midiUtils"

interface MidiContext {
  midiAccess: boolean
  midi: MIDIAccess | null
}

export const [midiContext, setMidiContext] = createStore<MidiContext>({
  midiAccess: false,
  midi: null,
})

export const createMidiContext = async () => {
  try {
    const midi = await navigator.requestMIDIAccess()
    setMidiContext({ midiAccess: true, midi })
    setupMidiMessageHandler()
  } catch (e) {
    setMidiContext("midiAccess", false)
  }
}

const onMidiMessage = (event: MIDIMessageEvent) => {
  if (!settings.active) return

  const [command, note, _velocity] = event.data

  if (command === MidiMessage.NoteOn) {
    playNote(midiToFrequency(note), settings)
  } else if (command === MidiMessage.NoteOff) {
    stopNote(midiToFrequency(note))
  }
}

const setupMidiMessageHandler = () => {
  if (!midiContext.midi || !midiContext.midiAccess) return

  midiContext.midi.inputs.forEach((input) => (input.onmidimessage = onMidiMessage))
}

export const cleanupMidiMessageHandler = () => {
  if (!midiContext.midi || !midiContext.midiAccess) return
  midiContext.midi.inputs.forEach((input) => (input.onmidimessage = null))
}
