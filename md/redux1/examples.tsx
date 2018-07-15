import redux from "redux"
import { connect } from "react-redux"
import { ThunkDispatch } from "redux-thunk"
import React from "react"

export type ActionsT =
  | {
      type: "NEW_SLOT_DIALOG"
      date: Date
      slot: number
    }
  | {
      type: "CLOSE_SLOT_DIALOG"
    }
  | {
      type: "REQUEST_WEEK"
    }
  | {
      type: "REPLACE_WEEK"
      weekView: AppStateT["weekView"]
    }

const initialState = {
  detail: undefined as
    | undefined
    | {
        state: "NEW" | "EDIT"
        project: T.Project
        error?: { name: string; message: string }
      },
  list: [] as T.Project[],
  list_error: undefined as { name: string; message: string } | undefined,
  list_is_processing: undefined as undefined | true,
  remove_modal: undefined as undefined | { project: T.Project },
  weekView: [] as any[],
}

export type AppStateT = typeof initialState

declare global {
  namespace T {
    interface Project {
      name: string
    }
  }
}

function caseCheck(i: never) {}

function reducer(state = initialState, action: ActionsT): AppStateT {
  switch (action.type) {
    case "CLOSE_SLOT_DIALOG":
      return state
    default:
      caseCheck(action.type)
  }
}

const store = redux.createStore(reducer)

type MyDispatcher = (i: ActionsT) => void

const Comp = connect(
  (state: AppStateT) => ({
    list: state.list,
  }),
  (dispatch: ThunkDispatch<AppStateT, {}, ActionsT>) => ({ dispatch }),
)(props => {
  props.dispatch({ type: "CLOSE_SLOT_DIALOG" })
  props.dispatch(dispatch => {
    dispatch({ type: "CLOSE_SLOT_DIALO" })
  })
  return null
})

const Consumer = (
  <>
    <Comp />
  </>
)

function switchCase(theCase) {
  switch (theCase) {
    case "CASE1":
      return handleCase1()
    case "CASE2":
      return handleCase2()
  }
  throw Error("Hey!")
}

function dict(theCase) {
  const theDict = {
    CASE1: handleCase1(),
    CASE2: handleCase2(),
  }
  const handlerFound = theDict[theCase]
  if (handlerFound) return handlerFound()
  throw Error("Hey!")
}

export const effects = createEffects(meatball)({
  // - rules -
  reloadRules: () => async dispatch => {
    let rules = await Api.rule.list()
    dispatch(meatball.creators.ruleList_replace({ rules }))
  },
  // ...
  removeRule: (id: number) => async dispatch => {
    await Api.rule.remove(id)
    dispatch(meatball.creators.removeRule({ id }))
  },
})

export function createEffects<Red extends Meatball>(meatball: Meatball) {
  return function<
    FX extends {
      [k: string]: (...i: any[]) => ThunkDispatch<Red["actionTypes"], Red["initialState"]>
    }
  >(fx: FX) {
    return fx
  }
}
