import { CycleProps } from '../../hooks/useCycles'

export enum ActionTypes {
  ADD_NEW_CYCLE = 'ADD_NEW_CYCLE',
  FINISH_CYCLE = 'FINISH_CYCLE',
  INTERRUPT_CYCLE = 'INTERRUPT_CYCLE',
}

export function addNewCycleAction(newCycle: CycleProps) {
  return {
    type: ActionTypes.ADD_NEW_CYCLE,
    payload: {
      newCycle,
    },
  }
}

export function finishCycleAction() {
  return {
    type: ActionTypes.FINISH_CYCLE,
    payload: {},
  }
}

export function interruptCycleAction() {
  return {
    type: ActionTypes.INTERRUPT_CYCLE,
    payload: {},
  }
}
