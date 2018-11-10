import { easeOut } from '@popmotion/easing'
import { mix } from '@popmotion/popcorn'
import durationProgress from 'callbag-duration-progress'
import flatten from 'callbag-flatten'
import fromEvent from 'callbag-from-event'
import map from 'callbag-map'
import merge from 'callbag-merge'
import subject from 'callbag-subject'
import subscribe from 'callbag-subscribe'
import takeUntil from 'callbag-take-until'
import pipe from 'pipeline.macro'
import { useCallback, useEffect, useMemo } from 'react'

const ONCE = []

export default function useSmoothScroll(axis, ref, easing = easeOut) {
  const scrollProperty = axis === 'x' ? 'scrollLeft' : 'scrollTop'
  const command$ = useMemo(subject, ONCE)

  const scrollTo = useCallback((target, duration = 300) => {
    command$(1, [target, duration])
  }, ONCE)

  useEffect(
    () =>
      pipe(
        command$,
        map(([target, duration]) => {
          const start = ref.current[scrollProperty]
          return pipe(
            durationProgress(
              typeof duration === 'function'
                ? duration(Math.abs(target - start))
                : duration,
            ),
            map(p => mix(start, target, easing(p))),
            takeUntil(
              merge(
                fromEvent(ref.current, 'wheel'),
                fromEvent(ref.current, 'touchstart'),
              ),
            ),
          )
        }),
        flatten,
        subscribe(v => {
          ref.current[scrollProperty] = v
        }),
      ),
    ONCE,
  )

  return scrollTo
}
