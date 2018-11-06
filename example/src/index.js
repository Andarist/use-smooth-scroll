import * as React from 'react'
import * as ReactDOM from 'react-dom'
import styled from 'react-emotion'
import useSmoothScroll from 'use-smooth-scroll'

const range = n => Array.from({ length: n }, (_, i) => i)
const getRandomScrollTarget = node => Math.random() * node.scrollWidth

const Carousel = styled('div')`
  display: flex;
  overflow-x: scroll;
`

const Card = styled('div')`
  flex-grow: 1;
  flex-shrink: 0;

  width: 50px;
  height: 100px;
  margin: 10px;

  background-color: turquoise;
  border-radius: 4px;
`

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

ReactDOM.render(<Example />, document.getElementById('root'))
