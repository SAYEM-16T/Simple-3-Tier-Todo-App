export interface User {
  id: string
  name: string
  email: string
  created_at: string
  updated_at: string
}

export interface LoginPayload {
  email: string
  password: string
}

export interface RegisterPayload extends LoginPayload {
  name: string
}

export interface AuthResponse {
  access_token: string
  token_type: string
  user: User
}
