export type ServiceCategory =
  | 'maintenance'
  | 'diagnostics'
  | 'brakes'
  | 'suspension'
  | 'electric'
  | 'ac'

export interface Service {
  readonly id: string
  readonly slug: string
  readonly title: string
  readonly category: ServiceCategory
  readonly shortDescription: string
  readonly description: string
  readonly priceFrom: number
  readonly duration: string
  readonly includes: readonly string[]
  readonly clarifications: readonly string[]
  readonly popular: boolean
}

export interface CategoryOption {
  readonly id: ServiceCategory
  readonly label: string
}

export interface VehicleFormData {
  readonly car: string
  readonly year: string
  readonly task: string
}

export interface ContactFormData {
  readonly name: string
  readonly phone: string
  readonly preferredTime: string
}
