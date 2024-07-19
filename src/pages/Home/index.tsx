import { createContext, useEffect, useState } from 'react'
import { HandPalm, Play } from 'phosphor-react'
import { FormProvider, useForm } from 'react-hook-form'

import {
  HomeContainer,
  StartCountdownButton,
  StopCountdownButton,
} from './styles'
import { zodResolver } from '@hookform/resolvers/zod'
import * as zod from 'zod'
import { NewCycleFormComponent } from './components/NewCycleForm'
import { CountdownComponent } from './components/Countdown'

const newCycleFormValidationSchema = zod.object({
  task: zod.string().min(1, 'Informe o título da tarefa'),
  minutesAmount: zod
    .number()
    .min(5, 'O ciclo precisa ser no mínimo de 5 minutos.')
    .max(60, 'O ciclo precisa ser no máximo de 60 minutos.'),
})

type NewCycleFormData = zod.infer<typeof newCycleFormValidationSchema>

interface CycleProps {
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
}

export const CyclesContext = createContext({} as CyclesContextType)

export function Home() {
  const [cycles, setCycles] = useState<CycleProps[]>([])
  const [activeCycleId, setActiveCycleId] = useState<string | null>(null)
  const [amountSecondsPassed, setAmountSecondsPassed] = useState(0)

  const newCycleForm = useForm<NewCycleFormData>({
    resolver: zodResolver(newCycleFormValidationSchema),
    defaultValues: {
      task: '',
      minutesAmount: 0,
    },
  })

  const { handleSubmit, watch, reset } = newCycleForm

  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId)
  const isSubmitDisabled = !watch('task')

  function markCycleAsFinished() {
    setCycles((state) =>
      state.map((cycle) =>
        cycle.id === activeCycleId
          ? { ...cycle, finishedDate: new Date() }
          : cycle,
      ),
    )
  }

  function handleCreateNewCycle(data: NewCycleFormData) {
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
    reset()
  }

  function handleInterruptCycle() {
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
    <HomeContainer>
      <form onSubmit={handleSubmit(handleCreateNewCycle)} action="">
        <CyclesContext.Provider
          value={{
            activeCycle,
            activeCycleId,
            markCycleAsFinished,
            amountSecondsPassed,
            setAmountSecondsPassed,
          }}
        >
          <FormProvider {...newCycleForm}>
            <NewCycleFormComponent />
          </FormProvider>
          <CountdownComponent />
        </CyclesContext.Provider>
        {activeCycle ? (
          <StopCountdownButton type="button" onClick={handleInterruptCycle}>
            <HandPalm size={24} />
            Interromper
          </StopCountdownButton>
        ) : (
          <StartCountdownButton type="submit" disabled={isSubmitDisabled}>
            <Play size={24} />
            Começar
          </StartCountdownButton>
        )}
      </form>
    </HomeContainer>
  )
}
