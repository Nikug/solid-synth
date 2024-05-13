import { Component, JSX } from "solid-js"

interface Props {
  onClick?: () => void
  children?: JSX.Element
}

export const Button: Component<Props> = (props) => {
  return (
    <button
      class="rounded bg-gray-200 hover:bg-gray-300 cursor-pointer px-2 py-0.5"
      onClick={props.onClick}
    >
      {props.children}
    </button>
  )
}
