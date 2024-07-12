export interface User {
  id: string
  name: string
  email: string
  phone: string

  language: string

  biography: string

  avatar: string | null

  defaultCity: string

  knownIps: string[]
  userAgents: string[]

  points: number

  subscriptionId?: string | null
  hasSubscription: boolean

  disabled?: boolean

  isGastronautAdmin?: boolean

  emailVerified: boolean

  createdAt: string
}

export interface Favorites {
  userId: string
  venues: {
    id: string
    visited: boolean
    rating?: number
    liked: boolean
  }[]
  deals: {
    id: string
    visited: boolean
    rating?: number
    bookings: string[]
    liked: boolean
  }[]
}
