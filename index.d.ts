import { RefObject } from 'react'

export default function useSmoothScroll(
  axis: 'x' | 'y',
  ref: RefObject<HTMLElement>,
): (
  target: number,
  options?: { duration?: number; easing?: (p: number) => number },
) => void
