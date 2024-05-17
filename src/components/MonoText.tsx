import { Component, JSX } from "solid-js"

interface Props {
  children: JSX.Element
}

export const MonoText: Component<Props> = (props: Props) => {
  return <span class="bg-gray-300 px-1 font-mono rounded mx-[1px]">{props.children}</span>
}
