# Hooks can do them all (but you gotta twist it a bit)

In this article I'll cover a couple of use cases achievable by hooks, but sometimes not as straightforward.

## The referential equality game

When writing for performance optimization, writing in React Hooks' idiom can quickly become a sort of puzzle-solving,
where you aim more than simply making the variables reaching to their places, but also to keep referential
equality in order to avoid re-renders.

It was not always like this. When the idiom was class components, the game we played was different. While hooks has its problems, at least it scared two monsters from the room: _render props_ and _HOCs_.

## The tools

Those present in the [hooks reference](https://reactjs.org/docs/hooks-reference.html);

  - useState
  - useEffect
  - useContext
  - useReducer
  - useCallback
  - useMemo
  - useRef
  - memo
  - and others...


## Dependency injection

In my previous article about [redux state management](../2021-2021-04-redux-state-mgmt) I talked about why is it important to travel data through "Dependency Injection Portals" -- aka Context.

With Redux you send the state through its Provider, then use the `useSelector()` API to pull the data and selectively re-render data only when the consumed data changes.

The "vanilla hooks" alternatives are `createContext()` and `useContext`. But there are caveats:

  - The context consumer always re-renders when the provided value changes;
  - You will likely pass an object through the provider; Unless you cache this object with `useMemo` (or any of the other hooks), it will always have its reference changed;
  - Different consumers may want to consume only a part of the source object; You'd like them to only re-render when its partion changes;

Redux (and Zustand) solves this by the use of the selector pattern.

In order to achieve something similar to a selector with "vanilla hooks", you can split your consumer in two components:

  - A parent, which handles the job of selecting the values, then passing it to a child; The parent will continue to always render, but it will do only light work;
  - The child, wrapped in `memo()`;

```tsx
function Selector() {
  const ctx = useContext(rootContext)
  const selected = { brand: ctx.brand, color: ctx.color }
  return <Consumer {...selected} />
}

const Consumer = memo((props) => {
  //render something
})
```

Attempting to factor it out (not tested):

```tsx
function ConsumeFromContext({ context, selector, Consumer }) {
  const contextValue = useContext(context)
  const selected = selector(contextValue)
  const ConsumerMemo = useMemo(() => {
    return memo(Consumer)
  }, [Consumer])
  return <ConsumerMemo {...selected} />
}
```

(leaving the TS part for another day, but we can leverage some generics here)

## Derived state

Let's say you store an object A in state, but for some reason you need to remap A before consuming it. So you create B where `f(A) => B`.

One way of doing it is just creating another variable, which is recalculated every render.

```tsx
function Component({ listOfPeople }) {
  const peopleGrouped = groupBy(listOfPeople, 'age')
  return <Something prop={peopleGrouped}/>
}
```

You can use `useMemo()` for that, so the value is cached, and most importantly, its object reference is kept the same.

```tsx
function Component({ listOfPeople }) {
  const peopleGrouped = useMemo(
    () => groupBy(listOfPeople, 'age'),
    [listOfPeople]
  )
  useEffect(() => {
    // do something
  }, [peopleGrouped])
  return <Something prop={peopleGrouped}/>
}
```

Keeping the reference is important because you never know when that data can be fed into an `useEffecct` or an `memo()`. As states the informal React law, "is data hasn't changed, its reference also shouldn't change".


There's also an uglier way for doing the same thing: a pair of `useState` and `useEffect`. You should avoid it, but if the derived state calculation is async that's your only path.

```tsx
function Component({ listOfPeople }) {
  const [peopleGrouped, setPeopleGrouped] = useState(null)
  useEffect(() => {
    groupByAsync(listOfPeople, 'age').then((result) => {
      setPeopleGrouped(result)
    })
  }, [listOfPeople])
  useEffect(() => {
    // do something
  }, [peopleGrouped])
  if (!peopleGrouped) return null; // not ready!
  return <Something prop={peopleGrouped}/>
}
```

Async adds another layer of complexity since the derived state can also be `null` (hasn't been calculated yet). Or it can even be outdated (refer to a source from a previous render).

**Dependency graph**

We see that `peopleGrouped` depends on `listOfPeople`.

## useReducer

(useReducer)

## The useEffect game

(the dependency game)

(what react wants you to do - eslint)

(tricks - forceRenders, getting rid of var deps)

(lifting deps out with useReducer)

(useRef - previous value - component instances)