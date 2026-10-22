export interface User {
  id: number
  firstName: string
  lastName: string
  email: string
  username: string
  age: number
  gender: string
  phone: string
  image?: string
  password?: string
}

export type CreateUserDto =
  Omit<User, 'id' | 'image'> & { password: string }

export type UpdateUserDto = Partial<CreateUserDto>