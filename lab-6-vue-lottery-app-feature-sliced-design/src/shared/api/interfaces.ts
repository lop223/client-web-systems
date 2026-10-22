export interface PaginatedResult<T> {
  items: T[]
  total: number
  skip: number
  limit: number
}

export interface Readable<T> {
  getAll(params?: { limit?: number; skip?: number; q?: string }): Promise<PaginatedResult<T>>

  getById(id: number): Promise<T>
}

export interface Creatable<T, TCreate> {
  create(data: TCreate): Promise<T>
}

export interface Editable<T, TUpdate> {
  update(id: number, data: TUpdate): Promise<T>
}

export interface Deletable<T> {
  delete(id: number): Promise<void>
}
