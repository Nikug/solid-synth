import clsx from "clsx"
import { children, Component, createSignal, For, JSX } from "solid-js"
import { audioContext } from "../audio/audioContextWrapper"

interface Props {
  headers: string[]
  children: JSX.Element
}

export const TabSection: Component<Props> = (props) => {
  const [activeTab, setActiveTab] = createSignal(0)
  const resolved = children(() => props.children).toArray()
  const visibleTab = () => resolved[activeTab()]

  const changeTab = (index: number) => {
    setActiveTab(index)
    audioContext()
  }

  return (
    <div class="w-full h-full">
      <div class="flex gap-4 text-lg mb-2">
        <For each={props.headers}>
          {(header, index) => (
            <p
              class={clsx(
                index() === activeTab() ? "font-bold" : "text-gray-400 hover:text-gray-500",
                "cursor-pointer",
              )}
              onClick={() => changeTab(index())}
            >
              {header}
            </p>
          )}
        </For>
      </div>
      {visibleTab()}
    </div>
  )
}
