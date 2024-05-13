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
    </div>
  )
}
