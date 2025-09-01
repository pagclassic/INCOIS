import { create } from 'zustand'

export type Severity = 'low' | 'medium' | 'high'

export type Report = {
  id: string
  title: string
  severity: Severity
  coordinates: [number, number]
  timestamp: number
}

type State = {
  reports: Report[]
  selectedId: string | null
  setReports: (list: Report[]) => void
  select: (id: string | null) => void
}

export const useAppStore = create<State>((set) => ({
  reports: [],
  selectedId: null,
  setReports: (list) => set({ reports: list }),
  select: (id) => set({ selectedId: id }),
}))

