# use-smooth-scroll

React hook which gives a smooth scrolling function.

## Example ([Codesandbox](https://codesandbox.io/s/github/Andarist/use-smooth-scroll/tree/master/example))

```js
const Example = () => {
  const ref = React.useRef()
  const scrollTo = useSmoothScroll('x', ref)

  return (
    <>
      <button onClick={() => scrollTo(getRandomScrollTarget(ref.current))}>
        Click me
      </button>
      <Carousel innerRef={ref}>
        {range(100).map(i => (
          <Card key={i} />
        ))}
      </Carousel>
    </>
  )
}
```
