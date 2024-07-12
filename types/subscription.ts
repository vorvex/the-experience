import { User } from './users'

export interface Subscription {
  id: string

  active: boolean

  user: User

  type: 'annual' | 'monthly'
  startDate: string
  endDate: string
  autoRenew: boolean
}
