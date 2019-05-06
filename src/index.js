import { easeOut } from '@popmotion/easing'
import { mix } from '@popmotion/popcorn'
import arePassiveEventsSupported from 'are-passive-events-supported'
import durationProgress from 'callbag-duration-progress'
import flatten from 'callbag-flatten'
import fromEvent from 'callbag-from-event'
import map from 'callbag-map'
import merge from 'callbag-merge'
import of from 'callbag-of'
import subject from 'callbag-subject'
import subscribe from 'callbag-subscribe'
import takeUntil from 'callbag-take-until'
import pipe from 'pipeline.macro'
import { useCallback, useEffect, useRef } from 'react'
import useConstant from 'use-constant'

const ONCE = []
const PASSIVE = arePassiveEventsSupported() ? { passive: true } : undefined

export default function useSmoothScroll(axis, ref) {
  const command$ = useConstant(subject)
  const argumentsRef = useRef()

  useEffect(() => {
    argumentsRef.current = [
      axis === 'x' ? 'scrollLeft' : 'scrollTop',
      ref.current,
    ]
  })

  const scrollTo = useCallback(
    (target, { duration = 300, easing = easeOut } = {}) => {
      const [scrollProperty, node] = argumentsRef.current
      command$(1, [scrollProperty, node, target, duration, easing])
    },
    ONCE,
  )

  useEffect(
    () =>
      pipe(
        command$,
        map(([scrollProperty, node, target, duration, easing]) => {
          const recyclable = [node, scrollProperty, 0]
          const start = node[scrollProperty]

          const resolvedDuration = Math.max(
            0,
            typeof duration === 'function'
              ? duration(Math.abs(target - start))
              : duration,
          )

          if (resolvedDuration === 0) {
            recyclable[2] = target
            return of(recyclable)
          }

          return pipe(
            durationProgress(resolvedDuration),
            map(p => {
              recyclable[2] = mix(start, target, easing(p))
              return recyclable
            }),
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
