export type AuthStatus = 'checking' | 'authenticated' | 'unauthenticated'
export type RequestStatus = 'idle' | 'pending' | 'succeeded' | 'failed'
export interface User { id: string; fullName: string; email: string; emailVerified: boolean }
export interface Credentials { email: string; password: string; remember?: boolean }
export interface RegistrationInput extends Credentials { fullName: string; phone: string }
export interface AuthResponse { user: User }

