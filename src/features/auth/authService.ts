import { apiRequest } from '../../services/apiClient'
import type { AuthResponse, Credentials, RegistrationInput, User } from './authTypes'

const demoKey = 'cv-foods-demo-user'
const demoAccountsKey = 'cv-foods-demo-accounts'
const demoEnabled = import.meta.env.VITE_AUTH_MODE === 'mock'
interface DemoAccount { user: User; passwordHash: string }
function demoUser(): User | null {
  if (!demoEnabled) return null
  try {
    const user = JSON.parse(sessionStorage.getItem(demoKey) ?? 'null') as User | null
    if (!user) return null
    const verifiedUser = { ...user, emailVerified: true }
    if (!user.emailVerified) saveDemo(verifiedUser)
    return verifiedUser
  } catch { return null }
}
function saveDemo(user: User | null) { if (user) sessionStorage.setItem(demoKey, JSON.stringify(user)); else sessionStorage.removeItem(demoKey) }
function demoAccounts(): DemoAccount[] {
  try {
    const accounts = JSON.parse(sessionStorage.getItem(demoAccountsKey) ?? '[]') as DemoAccount[]
    return accounts.map(account => ({ ...account, user: { ...account.user, emailVerified: true } }))
  } catch { return [] }
}
async function hashDemoPassword(password: string): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(password))
  return Array.from(new Uint8Array(digest), byte => byte.toString(16).padStart(2, '0')).join('')
}
export const authService = {
  async currentUser(): Promise<User> {
    if (demoEnabled) { const user = demoUser(); if (!user) throw new Error('No demo session'); return user }
    return (await apiRequest<AuthResponse>('/auth/me')).user
  },
  async login(input: Credentials): Promise<User> {
    if (demoEnabled) {
      const account = demoAccounts().find(item => item.user.email.toLowerCase() === input.email.trim().toLowerCase())
      if (!account || account.passwordHash !== await hashDemoPassword(input.password)) {
        throw new Error('Wrong email or password. If you are new to CV Foods, create an account.')
      }
      saveDemo(account.user); return account.user
    }
    const result = await apiRequest<AuthResponse>('/auth/login', { method: 'POST', body: JSON.stringify(input) }); return result.user
  },
  async register(input: RegistrationInput): Promise<User> {
    if (demoEnabled) {
      const email = input.email.trim()
      const accounts = demoAccounts()
      if (accounts.some(item => item.user.email.toLowerCase() === email.toLowerCase())) throw new Error('An account with this email already exists. Sign in instead.')
      const user = { id: crypto.randomUUID(), fullName: input.fullName.trim(), email, emailVerified: true }
      accounts.push({ user, passwordHash: await hashDemoPassword(input.password) })
      sessionStorage.setItem(demoAccountsKey, JSON.stringify(accounts))
      saveDemo(user)
      return user
    }
    const result = await apiRequest<AuthResponse>('/auth/register', { method: 'POST', body: JSON.stringify(input) }); return result.user
  },
  async logout(): Promise<void> { if (demoEnabled) { saveDemo(null); return } await apiRequest<void>('/auth/logout', { method: 'POST' }) },
  async forgotPassword(email: string): Promise<void> { await apiRequest<void>('/auth/forgot-password', { method: 'POST', body: JSON.stringify({ email }) }) },
  async resetPassword(token: string, password: string): Promise<void> { await apiRequest<void>('/auth/reset-password', { method: 'POST', body: JSON.stringify({ token, password }) }) },
  async resendVerification(email: string): Promise<void> { await apiRequest<void>('/auth/verify-email/resend', { method: 'POST', body: JSON.stringify({ email }) }) },
  async verifyEmail(token: string): Promise<void> { await apiRequest<void>('/auth/verify-email', { method: 'POST', body: JSON.stringify({ token }) }) },
}
