import { Component } from "solid-js"

export const AboutTab: Component = () => {
  return (
    <div class="p-4 mb-8">
      <h3 class="font-bold">Solid Synth</h3>
      <p>A subtractive synthesizer built with SolidJS and Web Audio API.</p>
      <h3 class="font-bold mt-4">Code</h3>
      <a
        class="text-blue-500 hover:underline cursor-pointer"
        target="_blank"
        href="https://github.com/nikug/solid-synth"
      >
        github.com/nikug/solid-synth
      </a>
      <h3 class="font-bold mt-4">Attributions</h3>
      <p>Reverb samples from freesound.org</p>
      <ul class="list-disc ml-4 text-sm max-w-3xl">
        <li>
          (Short) IR_Abandoned Brick Building.Long Corridor 8_EM.wav by newlocknew --
          https://freesound.org/s/704186/ -- License: Attribution NonCommercial 4.0
        </li>
        <li>
          (Medium) Large Bright Plate 01 by recordinghopkins -- https://freesound.org/s/175311/ --
          License: Attribution 4.0
        </li>
        <li>
          (Long) Alesis Microverb IR Large 6 by joeribraams -- https://freesound.org/s/414178/ --
          License: Creative Commons 0
        </li>
      </ul>
    </div>
  )
}
