# Never ignore the exhaustive-deps rule

[[Tag: React]]

![nazaré](Nazaré_Confusa.jpg)

> (caption: Mrs. Tedesco writing a Todo Application in React with hooks)

It happens when we write `useEffect` hooks. We intend to just run some code when X changes, but then ESLint tells us to add Y and Z to the dependency list.

```tsx
useEffect(() => {
  setCount(count + 1)
  // eslint-disable-next-line
}, [])
```

Ignoring this rule is very bad. It opens up our code to a class of weird bugs (ex: `count` gets a value from the past). But most importantly, it hides bad design in other parts of the component.

I can strongly claim that EVERY `useEffect` can be made compliant with the ESLint rule while still mantaining the desired behavior. The solutions might not be straightforward, but it is always better to change other parts of the code than to add the rule. The overal benefit will be more consistent code.

## Reviewing what useEffect is for

`useEffect` is mostly about _updating derived state_.
  - We have C that depends on A and B.
  - When either A or B changes, update C.
  - This update may be asynchronous.

```tsx
function Page({ id, mode }: { id: number; mode: 'read' | 'edit' }) {
  const [formData, setFormData] = useState<null|FormData>(null)
  const handleError = useErrorHandler()
  useEffect(() => {
    loadFormContents(id, mode)
      .then(setFormData)
      .catch(handleError)
  }, [id, mode])

  if (!formData) return null;
  return <TheForm formData={formData} />
}
```

Sometimes we may not straight notice the existence of derived state. The dependency array and the ESLint rule are there to help us. In the example above, the form contents depend on `id`. What if the page route changes, bringing in a new `id`? We need to handle the prop change.

`useEffect` can also happen with an empty dependency array, which showcases that we also need it for async behavior, even when there's no derived state.


## Identifying stable references

The ESLint plugin is not able to define every variable's lifecycle. It does the basic work of checking if the variable is defined inside of the component (it is not a constant) and if it is one of the known React stable variables.

If you know that a variable is stable (it won't change between renders), you can just safely keep it in the dependency array knowing that it will never trigger an effect.

### Dispatchers have stable reference

The most notable examples of stable variables are  `setState` from `useState()` and `dispatch` from Redux. Dispatchers from other React libs are usually expected to be stable.

### useCallback and useMemo

When you feed the dependency array with variables you have created, you can double-check if those variables just change their references when their underlying data changes. Check opportunities of making your variables' references more stable with the help of `useCallback` and `useMemo`. Forgetting to use `useCallback` on a function and then feeding it to `useEffect` can lead to a disaster.

### Depend on primitives

Even if an object might have changed its reference, one specific property might have stayed the same. So, when possible, it is interesting to depend on specific properties instead of on a whole object.


## Use setState's callback form

We can get rid of dependencies by using the callback form from `setState`.

```tsx
const [state, setState] = useState({ id: 2, label: 'Jessica' })

// good
useEffect(() => {
  setState(previous => ({ ...previous, name: 'Jenn' }))
}, [])

// bad
useEffect(() => {
  setState({ ...state, name: 'Jenn' })
}, [state])
```

In this particular case, we were able to remove the `state` variable from the array (`setState` is already recognized as stable by the plugin).

## Split into smaller effects

We previously said that `useEffect` is made to handle derived state.

Let's say we have an effect which updates `A` and `B` based on `1` and `2`.

```
1, 2 <-- A, B
```

Maybe `A` depends on `1` but not on `2`? In this case, we can split a big `useEffect` into smaller ones.

```
1 <-- A
2 <-- B
```

### Intermediary dependencies

Effect splitting can also be achieved by identifying intermediary dependencies.

Example before refactoring:

```tsx
function Component({ userId, event }: { userId: number, event: Event }) {
  const [subscriptionIsExpired, setSubscriptionExpired] = useState(false)
  useEffect(() => {
    const userSettings: { validUntil: string } = await getUserSettings(userId)
    const isExpired = event.startDate > userSettings.validUntil
    setSubscriptionExpired(isExpired)
  }, [userId, event])
  return (...)
}
```

In the code above, the `getUserSettings()` request will be called when `event` changes. But it actually has nothing to do with the `event`. We may refactor that to:

```tsx
function Component({ userId, event }: { userId: number, event: Event }) {
  const [userSettings, setUserSettings] = useState<null|UserSettings>(null)
  const [subscriptionIsExpired, setSubscriptionExpired] = useState<null|boolean>(null)

  useEffect(() => {
    const userSettings: { validUntil: string } = await getUserSettings(userId)
    setUserSettings(userSettings)
  }, [userId])

  useEffect(() => {
    if (!userSettings) {
      return
    }
    const isExpired = event.startDate > userSettings.validUntil
    setSubscriptionExpired(isExpired)
  }, [userSettings, event])

  return (...)
}
```

Now the async request only depends on `userId`. The second effect continues to depend on both `userId` (through `userSettings`) and `event`.

```
from:
userId, event <-async-- isExpired

to:
userId <-async- userSettings
event, userSettings <-- isExpired
```

### Offtopic: Loading states

When data is fetched asynchronously, an extra state type arises: the "loading" state. In the example above, the loading state is represented by `null`. By aknowledging that some state can be `null` (see the useState line), TypeScript can help us handle edge cases with its null checks.

If we feel that one component became way complex because of multiple loading states, we can choose it to only render when everything is ready; For instance:

 - Split the component into a parent and a child;
 - Specify that the child receives the data as non-nullable props. Effectively this removes loading states handling from the child;
 - Do prior data-fetching in the parent component, which will have the nullable state; Return a loading widget until everything has loaded;
 - Return the child component when everything is ready;

## I actually want to only run an effect once, even if I receive new values

This can still be done without the need for the `eslint-disable` by copying the dependency to a state or to a ref.

```tsx
function Component({ id }) {
  // gets the value from the first render
  const [initialId] = useState(id) // or useState(() => id)
  useEffect(() => {
    // ...
  }, [initialId])
  return (...)
}
```

## Avoiding useEffects

> (new section added as of 2022/10)

Better than optimizing `useEffects` is avoiding them at all, when possible.

Sometimes this can be achieved by calculating the dependencies on dispatch time.

For instance, let's say `document` depends on `name`, one could write:

```tsx

function handleChange(event) {
  const { name, value } = event.target

  setState(previous => {
    const result = { ...previous, [name]: value }
    if (name === 'name') {
      result.document = getDocumentFromName(name)
    }
    return result
  })
}
```

## The case for useRef

React Refs behave a bit differently from React states:

  - A state is tied to a render through lexical scope. Each render can reference a different state object from a different slice of time; This may have impact on future concurrent render modes?

  - A ref is just a property tied to the component. `ref.current` will always point to the same thing and will always be current, regardless of where you call it;

It is a bit dangerous to talk abour refs without giving possibly wrong advice. Refs are analogous to setting a property in a class component (instead of setting a state), and doing that was considered anti-pattern at the time.

Disclaimers being said, refs are not counted as dependencies for `useEffect`, so you could get rid of a dependency by turning it into a ref. I'd pin out the following properties of something that can likely be turned into a ref:

  - It is a value that it is not directly used in the rendered content;
  - Thus, when you change it, you don't want a re-render;
  - It is used as a bridge between multiple events on the same component, for instance: communication between multiple effects, outbound and inbound events;

Refs are also used to read values from previous renders and to write advanced memoing hooks as present in popular [hooks collections](https://usehooks.com/).


## Extra: The force render and force effect hacks

An effect can programatically be triggered by receiving a "signal reference".

```tsx
const [trigger, forceEffect] = useState({})
useEffect(() => {

}, [trigger])

return <button onClick={() => forceEffect({})}>
  Force effect
</button>
```

# References

[Nick Scialli - You probably shouldn't ignore react-hooks/exhaustive-deps linting warnings](https://typeofnan.dev/you-probably-shouldnt-ignore-react-hooks-exhaustive-deps-warnings/) (prev google research)