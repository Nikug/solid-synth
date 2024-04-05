import { Adsr } from "./audio/settingsStore"

export const copyAdsr = (adsr: Adsr) => ({
  attack: adsr.attack,
  hold: adsr.hold,
  decay: adsr.decay,
  sustain: adsr.sustain,
  release: adsr.release,
})
