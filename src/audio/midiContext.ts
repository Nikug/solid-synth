import { createStore } from "solid-js/store"
import { settings } from "./settingsStore"
import { MidiMessage } from "../constants"
import { midiToGain, midiToKeyAndOctave } from "./midiUtils"
import { addNote, removeNote } from "./noteStore"

interface MidiContext {
  midi: MIDIAccess | null
}

export const [midiContext, setMidiContext] = createStore<MidiContext>({
  midi: null,
})

export const createMidiContext = async () => {
  try {
    const midi = await navigator.requestMIDIAccess()
    setMidiContext({ midi })
    setupMidiMessageHandler()
  } catch (e) {
    console.log("MIDI access not available")
  }
}

const onMidiMessage = (event: MIDIMessageEvent) => {
  if (!settings.active) return

  const [command, note, velocity] = event.data

  if (command >= MidiMessage.NoteOnChannel0 && command <= MidiMessage.NoteOnChannel16) {
    const noteVelocity = settings.midiVelocity ? midiToGain(velocity) : 1
    const { key, octave } = midiToKeyAndOctave(note)
    if (noteVelocity > 0) {
      addNote(key, octave, noteVelocity)
    } else {
      removeNote(key, octave)
    }
  } else if (command >= MidiMessage.NoteOffChannel0 && command <= MidiMessage.NoteOffChannel16) {
    const { key, octave } = midiToKeyAndOctave(note)
    removeNote(key, octave)
  }
}

const setupMidiMessageHandler = () => {
  if (!midiContext.midi) return

  midiContext.midi.inputs.forEach((input) => (input.onmidimessage = onMidiMessage))
}

export const cleanupMidiMessageHandler = () => {
  if (!midiContext.midi) return
  midiContext.midi.inputs.forEach((input) => (input.onmidimessage = null))
}
