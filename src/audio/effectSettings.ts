import { setSettings, settings } from "./settingsStore"
import longImpulse from "../../public/impulses/long.wav"
import mediumImpulse from "../../public/impulses/medium.wav"
import shortImpulse from "../../public/impulses/short.wav"
import { audioContext } from "./audioContextWrapper"

export const setReverbImpulse = async (id: number, impulse: string) => {
  // @ts-expect-error
  setSettings("effects", id, "impulse", impulse)
  const node = settings.effects[id].node as ConvolverNode
  if (!node) return

  const url = {
    "long.wav": longImpulse,
    "medium.wav": mediumImpulse,
    "short.wav": shortImpulse,
  }[impulse]

  const response = await fetch(url)
  const array = await response.arrayBuffer()
  node.buffer = await audioContext().decodeAudioData(array)
}

export const setBitcrusherBits = (id: number, bits: number) => {
  // @ts-expect-error
  setSettings("effects", id, "bits", bits)
  const node = settings.effects[id].node as AudioWorkletNode
  if (!node) return

  node.parameters.get("bits").value = bits
}
