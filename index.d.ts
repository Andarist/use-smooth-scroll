import { MutableRefObject } from 'react'

export default function useSmoothScroll(
  axis: 'x' | 'y',
  ref: MutableRefObject<HTMLElement>,
): (options?: { duration?: number; easing?: (p: number) => number }) => void
