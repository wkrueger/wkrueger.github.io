import { configureStore, createSlice } from "@reduxjs/toolkit"
import { Provider, useDispatch, useSelector } from "react-redux"
import { useEffect } from "react"

/**
 * Person slice
 */

interface PersonPageState {}

const personPageSlice = createSlice({
  name: "personPage",
  initialState: null as null | PersonPageState,
  reducers: {
    init: (state) => {
      // do something...
      return state
    },
    unmount: (state) => null,
  },
})

/**
 * Product slice
 */

interface ProductPageState {}

const productPageSlice = createSlice({
  name: "personPage",
  initialState: null as null | ProductPageState,
  reducers: {
    init: (state) => {
      // do something...
      return state
    },
    unmount: (state) => null,
  },
})

/**
 * Building the store
 */

const store = configureStore({
  reducer: {
    personPage: personPageSlice.reducer,
    productPage: productPageSlice.reducer,
  },
})

/**
 * Set up typescript.
 */

type RootState = ReturnType<typeof store.getState>
type AppDispatch = typeof store.dispatch
const useAppDispatch = () => useDispatch<AppDispatch>()

declare module "react-redux" {
  // allow `useSelector` to recognize our app state
  interface DefaultRootState extends RootState {}
}

/**
 * Wire up react and redux
 */

function AppRoot() {
  return (
    <Provider store={store}>
      <PersonPage />
    </Provider>
  )
}

/**
 * Our consumer component
 */

function PersonPage() {
  const dispatch = useAppDispatch()
  const person = useSelector((state) => state.personPage)
  useEffect(() => {
    dispatch(initPersonPage())
    return () => {
      dispatch(personPageSlice.actions.unmount())
    }
  }, [])

  if (!person) return <Loading />
  return <Something person={person} />
}
