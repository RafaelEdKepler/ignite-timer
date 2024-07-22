import { produce } from 'immer'
import { CycleProps } from '../../hooks/useCycles'
import { ActionTypes } from './actions'

interface CyclesState {
  cycles: CycleProps[]
  activeCycleId: string | null
}

export function CyclesReducer(state: CyclesState, action: any) {
  if (action.type === ActionTypes.ADD_NEW_CYCLE) {
    return produce(state, (draft) => {
      draft.cycles.push(action.payload.newCycle)
      draft.activeCycleId = action.payload.newCycle.id
    })
  }
  const currentCycleIndex = state.cycles.findIndex(
    (cycle) => cycle.id === state.activeCycleId,
  )
  if (action.type === ActionTypes.FINISH_CYCLE) {
    if (currentCycleIndex < 0) {
      return state
    }
    return produce(state, (draft) => {
      draft.activeCycleId = null
      draft.cycles[currentCycleIndex].interruptedDate = new Date()
    })
  }
  if (action.type === ActionTypes.INTERRUPT_CYCLE) {
    if (currentCycleIndex < 0) {
      return state
    }
    return produce(state, (draft) => {
      draft.activeCycleId = null
      draft.cycles[currentCycleIndex].finishedDate = new Date()
    })
  }

  return state
}
