export type CrmOrder = {
  id: string
  status: string
  total: number
  updatedAt: string
  guestName: string
}

export type CrmBooking = {
  id: string
  status: string
  partySize: number
  startsAt: string
  updatedAt: string
  guestName: string
}

export type CrmSnapshot = {
  type: "snapshot"
  orders: CrmOrder[]
  bookings: CrmBooking[]
}

export type CrmChange = {
  type: "change"
  kind: "order" | "booking"
  event: "created" | "updated"
  id: string
  status: string
  updatedAt: string
  total?: number
  partySize?: number
  guestName?: string
}

export type CrmMessage = CrmSnapshot | CrmChange
