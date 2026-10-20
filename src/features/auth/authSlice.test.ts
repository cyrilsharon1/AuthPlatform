import { describe, expect, it } from 'vitest'
import reducer, { login, logout, restoreSession } from './authSlice'
describe('authentication state', () => {
  const user = { id: '1', fullName: 'Ava Cole', email: 'ava@example.com', emailVerified: true }
  it('restores the user without storing credentials', () => {
    const state = reducer(undefined, restoreSession.fulfilled(user, 'request'))
    expect(state.status).toBe('authenticated'); expect(state.user).toEqual(user); expect(state).not.toHaveProperty('password')
  })
  it('tracks failed login', () => {
    const state = reducer(undefined, login.rejected(new Error('bad'), 'request', { email: user.email, password: 'wrong' }, 'Please try again.'))
    expect(state.login).toBe('failed'); expect(state.error).toBe('Please try again.')
  })
  it('clears user after logout', () => {
    const signedIn = reducer(undefined, login.fulfilled(user, 'request', { email: user.email, password: 'secret' }))
    const signedOut = reducer(signedIn, logout.fulfilled(undefined, 'request'))
    expect(signedOut.status).toBe('unauthenticated'); expect(signedOut.user).toBeNull()
  })
})
