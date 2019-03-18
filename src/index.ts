import { easeOut, Easing } from '@popmotion/easing'
import { mix } from '@popmotion/popcorn'
import arePassiveEventsSupported from 'are-passive-events-supported'
import durationProgress from 'callbag-duration-progress'
import flatten from 'callbag-flatten'
import fromEvent from 'callbag-from-event'
import map from 'callbag-map'
import merge from 'callbag-merge'
import subject from 'callbag-subject'
import subscribe from 'callbag-subscribe'
import takeUntil from 'callbag-take-until'
import pipe from 'pipeline.macro'
import { useCallback, useEffect, useMemo, useRef } from 'react'

type Axis = 'x' | 'y'
type Duration = number | ((distance: number) => number)
type Command = [HTMLElement, number, Duration, Axis, Easing]

const ONCE: [] = []
const PASSIVE = arePassiveEventsSupported() ? { passive: true } : undefined

const useArgumentsRef = <T>(args: T) => {
  const ref = useRef(args)
  useEffect(() => {
    ref.current = args
  })
  return ref
}

export default function useSmoothScroll(
  axis: Axis,
  ref: React.RefObject<HTMLElement>,
  easing: Easing = easeOut,
) {
  const command$ = useMemo(subject, ONCE)
  const scrollProperty = axis === 'x' ? 'scrollLeft' : 'scrollTop'
  const argumentsRef = useArgumentsRef([scrollProperty, easing])

  const scrollTo = useCallback((target: number, duration: Duration = 300) => {
    const node = ref.current

    if (!node) {
      return
    }

    const [scrollProperty, easing] = argumentsRef.current
    command$(1, [node, target, duration, scrollProperty, easing])
  }, ONCE)

  useEffect(
    () =>
      pipe(
        command$,
        map(([node, target, duration, scrollProperty, easing]) => {
          const start = node[scrollProperty]
          return pipe(
            durationProgress(
              typeof duration === 'function'
                ? duration(Math.abs(target - start))
                : duration,
            ),
            map(p => [node, scrollProperty, mix(start, target, easing(p))]),
            takeUntil(
              merge(
                fromEvent(node, 'wheel', PASSIVE),
                fromEvent(node, 'touchstart', PASSIVE),
              ),
            ),
          )
        }),
        flatten,
        subscribe(([node, scrollProperty, v]) => {
          node[scrollProperty] = v
        }),
      ),
    ONCE,
  )

  return scrollTo
}
