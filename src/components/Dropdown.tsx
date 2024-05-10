import { Component, For, JSX, Show, createSignal, onCleanup, onMount } from "solid-js"
import { Portal } from "solid-js/web"

export interface Option<T, V> {
  id: T
  value: V
}

interface Props<T extends string | number, V extends JSX.Element> {
  key: T
  options: Option<T, V>[]
  onChange: (key: T, value: V) => void
}

export const Dropdown = <T extends string | number, V extends JSX.Element>(props: Props<T, V>) => {
  let dropdownRef: HTMLDivElement | undefined
  let panelRef: HTMLDivElement | undefined
  const [open, setOpen] = createSignal(false)

  onMount(() => {
    addEventListener("click", handleClick)
  })
  onCleanup(() => {
    removeEventListener("click", handleClick)
  })

  const handleClick = (event: MouseEvent) => {
    if (!open) return

    const target = event.target
    if (!dropdownRef?.contains(target as Node) && !panelRef?.contains(target as Node)) {
      setOpen(false)
    }
  }

  const handleButtonClick = (event: MouseEvent) => {
    if (!dropdownRef?.contains(event.target as Node)) {
      return
    }

    setOpen(!open())
  }

  const dropdownPosition = (): JSX.CSSProperties => {
    if (!dropdownRef) return {}
    const bounds = dropdownRef.getBoundingClientRect()
    return {
      top: `${bounds.y + dropdownRef.clientHeight + window.scrollY + 4}px`,
      left: `${bounds.x}px`,
      "min-width": `${dropdownRef.getBoundingClientRect().width}px`,
    }
  }

  const selectedValue = () => {
    return props.options.find((option) => option.id === props.key)?.value
  }

  return (
    <div
      ref={dropdownRef}
      onclick={handleButtonClick}
      class="cursor-pointer border rounded w-min h-min px-4 py-0.5 bg-gray-200"
    >
      <p>{selectedValue()}</p>
      <Show when={open()}>
        <Portal mount={document.getElementById("root") ?? undefined}>
          <div
            ref={panelRef}
            class="absolute border rounded bg-gray-200 border-gray-300"
            style={{ ...dropdownPosition() }}
          >
            <For each={props.options}>
              {(option) => (
                <div
                  class="hover:bg-gray-300 px-4 py-1 cursor-pointer"
                  onClick={() => {
                    props.onChange(option.id, option.value)
                    setOpen(false)
                  }}
                >
                  {option.value}
                </div>
              )}
            </For>
          </div>
        </Portal>
      </Show>
    </div>
  )
}
