import { createEffect, createRoot } from "solid-js"
import { SetStoreFunction, Store, createStore } from "solid-js/store"

export function createLocalStore<T extends object>(
  name: string,
  defaultValue: T,
): [Store<T>, SetStoreFunction<T>] {
  const localState = localStorage.getItem(name)
  const [state, setState] = createStore<T>(localState ? JSON.parse(localState) : defaultValue)
  createRoot((_dispose) => {
    createEffect(() => {
      localStorage.setItem(name, JSON.stringify(state))
    })
  })

  return [state, setState]
}
