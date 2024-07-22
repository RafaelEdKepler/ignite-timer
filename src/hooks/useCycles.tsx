import { createContext, ReactNode, useContext, useState } from 'react'

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
  markCycleAsInterrupted: () => void
  setActiveCycleId: (activeCycleId: string | null) => void
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
  const [cycles, setCycles] = useState<CycleProps[]>([])
  const [activeCycleId, setActiveCycleId] = useState<string | null>(null)
  const [amountSecondsPassed, setAmountSecondsPassed] = useState(0)

  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId)

  function markCycleAsFinished() {
    setCycles((state) =>
      state.map((cycle) =>
        cycle.id === activeCycleId
          ? { ...cycle, finishedDate: new Date() }
          : cycle,
      ),
    )
  }

  function markCycleAsInterrupted() {
    setCycles((state) =>
      state.map((cycle) =>
        cycle.id === activeCycleId
          ? { ...cycle, interruptedDate: new Date() }
          : cycle,
      ),
    )
  }

  function createNewCycle(data: CreateCycleData) {
    const id = String(new Date().getTime())
    const newCycle: CycleProps = {
      task: data.task,
      minutesAmount: data.minutesAmount,
      id,
      startDate: new Date(),
    }
    setCycles((state) => [...state, newCycle])
    setActiveCycleId(id)
    setAmountSecondsPassed(0)
    // reset()
  }

  function interruptCurrentCycle() {
    setActiveCycleId(null)
    setCycles((state) =>
      state.map((cycle) =>
        cycle.id === activeCycleId
          ? { ...cycle, interruptedDate: new Date() }
          : cycle,
      ),
    )
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
        markCycleAsInterrupted,
        setActiveCycleId,
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
