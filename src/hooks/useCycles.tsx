import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useReducer,
  useState,
} from 'react'
import { CyclesReducer } from '../reducers/cycles/reducer'
import {
  ActionTypes,
  finishCycleAction,
  interruptCycleAction,
} from '../reducers/cycles/actions'
import { version } from '../../package.json'

interface CreateCycleData {
  task: string
  minutesAmount: number
}

export interface CycleProps {
  id: string
  task: string
  minutesAmount: number
  startDate: Date
  interruptedDate?: Date
  finishedDate?: Date
}

interface CyclesContextType {
  activeCycle: CycleProps | undefined
  activeCycleId: string | null
  markCycleAsFinished: () => void
  amountSecondsPassed: number | null
  setAmountSecondsPassed: (amountSecondsPassed: number) => void
  cycles: CycleProps[]
  createNewCycle: (handleCreateNewCycle: CreateCycleData) => void
  interruptCurrentCycle: () => void
}

interface CyclesContextProviderProps {
  children: ReactNode
}

export const CyclesContext = createContext({} as CyclesContextType)

export function CyclesContextProvider({
  children,
}: CyclesContextProviderProps) {
  const [cyclesState, dispatch] = useReducer(
    CyclesReducer,
    {
      cycles: [],
      activeCycleId: null,
    },
    (initialState) => {
      const storedStateAsJSON = localStorage.getItem(
        `@timer:cycles-state-${version}`,
      )
      if (storedStateAsJSON) {
        return JSON.parse(storedStateAsJSON)
      }

      return initialState
    },
  )
  const { cycles, activeCycleId } = cyclesState
  const [amountSecondsPassed, setAmountSecondsPassed] = useState(0)

  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId)

  useEffect(() => {
    const stateJSON = JSON.stringify(cyclesState)
    localStorage.setItem(`@timer:cycles-state-${version}`, stateJSON)
  }, [cyclesState])

  function markCycleAsFinished() {
    dispatch(finishCycleAction())
  }

  function createNewCycle(data: CreateCycleData) {
    const id = String(new Date().getTime())
    const newCycle: CycleProps = {
      task: data.task,
      minutesAmount: data.minutesAmount,
      id,
      startDate: new Date(),
    }
    dispatch({
      type: ActionTypes.ADD_NEW_CYCLE,
      payload: {
        newCycle,
      },
    })
    setAmountSecondsPassed(0)
  }

  function interruptCurrentCycle() {
    dispatch(interruptCycleAction())
    setAmountSecondsPassed(0)
  }

  return (
    <CyclesContext.Provider
      value={{
        activeCycle,
        activeCycleId,
        markCycleAsFinished,
        amountSecondsPassed,
        setAmountSecondsPassed,
        cycles,
        createNewCycle,
        interruptCurrentCycle,
      }}
    >
      {children}
    </CyclesContext.Provider>
  )
}

export const useCycles = () => {
  const cyclesContext = useContext(CyclesContext)
  return cyclesContext
}
