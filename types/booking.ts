import { Amount } from '.'
import { User } from './users'

export interface Booking {
  id: string
  deal: {
    id: string
    title: string
    instructions: string
    image: string
    tags: string[]
  }

  venue: {
    id: string
    title: string
    city: string
    tags: string[]
    timezone: string
  }

  date: string
  time: string

  user: User

  guests?: number

  comment: string

  status: 'pending' | 'confirmed' | 'done' | 'cancelled' | 'no-show' | 'failed'

  canBeRedeemedByUser: boolean

  reservation?: {
    id: string
    restaurantId: string
    pricePaid?: Amount
    occassionId: string
  }

  rating?: {
    id: string
    comment: string
    rating: number
  }

  validTill?: number

  createdAt: number
  createdBy: string

  updatedAt?: number
  updatedBy?: string

  redeemedAt?: number
  redeemedBy?: string
}

export interface Rating {
  id: string

  rating: number

  visitedAt: string

  anonymous: boolean

  venueId: string
  dealId?: string
  bookingId?: string
  date?: string

  user: User

  comment: string

  translations?: {
    [lang: string]: string
  }

  linksClicked: {
    tripAdvisor?: boolean
    google?: boolean
    yelp?: boolean
    facebook?: boolean
  }
}
