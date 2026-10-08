export interface Participant {
  id: number
  name: string
  birthDate: string // yyyy-mm-dd
  email: string
  phone: string
}

export type ParticipantForm = Omit<Participant, 'id'>

export type FormErrors = Partial<Record<keyof ParticipantForm, string>>

export type SortKey = 'name' | 'birthDate'
export type SortDirection = 'asc' | 'desc'