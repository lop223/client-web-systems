import { http } from '@/api/httpClient'
import type { User, CreateUserDto, UpdateUserDto } from '@/types/user'
import type {
  Creatable,
  Deletable,
  Editable,
  PaginatedResult,
  Readable,
} from './interfaces'

interface UsersResponse {
  users: Array<User>
  total: number
  limit: number
  skip: number
}

export class UserService implements Readable<User> {
  async getAll({
    limit = 10,
    skip = 0,
    q = '',
  } = {}): Promise<PaginatedResult<User>> {
    const params = new URLSearchParams({
      limit: String(limit),
      skip: String(skip),
    })

    const query = q.trim()
    const endpoint = query ? '/users/search' : '/users'

    if (query) params.set('q', query)

    const result = await http<UsersResponse>(`${endpoint}?${params}`)

    return {
      items: result.users,
      total: result.total,
      skip: result.skip,
      limit: result.limit,
    }
  }

  getById(id: number): Promise<User> {
    return http<User>(`/users/${id}`)
  }

  create(data: CreateUserDto): Promise<User> {
    return http<User>('/users/add', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  update(id: number, data: UpdateUserDto): Promise<User> {
    return http<User>(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  async delete(id: number): Promise<void> {
    await http(`/users/${id}`, { method: 'DELETE' })
  }
}
