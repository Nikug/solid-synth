export type KeyOfType<T, V> = keyof {
  [P in keyof T as T[P] extends V ? P : never]: any
}

export interface Vector2 {
  x: number
  y: number
}
