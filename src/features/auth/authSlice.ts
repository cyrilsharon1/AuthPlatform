import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { authService } from './authService'
import type { AuthStatus, Credentials, RegistrationInput, RequestStatus, User } from './authTypes'

interface AuthState { user: User | null; status: AuthStatus; error: string | null; login: RequestStatus; registration: RequestStatus; logout: RequestStatus; passwordReset: RequestStatus; verification: RequestStatus }
const initialState: AuthState = { user: null, status: 'checking', error: null, login: 'idle', registration: 'idle', logout: 'idle', passwordReset: 'idle', verification: 'idle' }
const failure = (error: unknown) => error instanceof Error ? error.message : 'Please try again.'
export const restoreSession = createAsyncThunk<User>('auth/restore', () => authService.currentUser())
export const login = createAsyncThunk<User, Credentials>('auth/login', async (input, { rejectWithValue }) => { try { return await authService.login(input) } catch (e) { return rejectWithValue(failure(e)) } })
export const register = createAsyncThunk<User, RegistrationInput>('auth/register', async (input, { rejectWithValue }) => { try { return await authService.register(input) } catch (e) { return rejectWithValue(failure(e)) } })
export const logout = createAsyncThunk<void>('auth/logout', () => authService.logout())
export const requestPasswordReset = createAsyncThunk<void, string>('auth/forgot', async (email, { rejectWithValue }) => { try { await authService.forgotPassword(email) } catch (e) { return rejectWithValue(failure(e)) } })
export const confirmPasswordReset = createAsyncThunk<void, { token: string; password: string }>('auth/reset', async (input, { rejectWithValue }) => { try { await authService.resetPassword(input.token, input.password) } catch (e) { return rejectWithValue(failure(e)) } })
export const resendVerification = createAsyncThunk<void, string>('auth/resend', async (email, { rejectWithValue }) => { try { await authService.resendVerification(email) } catch (e) { return rejectWithValue(failure(e)) } })
export const verifyEmail = createAsyncThunk<void, string>('auth/verify', async (token, { rejectWithValue }) => { try { await authService.verifyEmail(token) } catch (e) { return rejectWithValue(failure(e)) } })
const authSlice = createSlice({ name: 'auth', initialState, reducers: { clearError(s) { s.error = null }, resetRequests(s) { s.login = 'idle'; s.registration = 'idle'; s.passwordReset = 'idle'; s.verification = 'idle'; s.error = null } }, extraReducers: builder => {
  builder.addCase(restoreSession.fulfilled, (s, a) => { s.user = a.payload; s.status = 'authenticated' }).addCase(restoreSession.rejected, s => { s.user = null; s.status = 'unauthenticated' })
    .addCase(login.pending, s => { s.login = 'pending'; s.error = null }).addCase(login.fulfilled, (s, a) => { s.user = a.payload; s.status = 'authenticated'; s.login = 'succeeded' }).addCase(login.rejected, (s, a) => { s.login = 'failed'; s.error = a.payload as string ?? 'Unable to sign in.' })
    .addCase(register.pending, s => { s.registration = 'pending'; s.error = null }).addCase(register.fulfilled, (s, a) => { s.user = a.payload; s.status = 'authenticated'; s.registration = 'succeeded' }).addCase(register.rejected, (s, a) => { s.registration = 'failed'; s.error = a.payload as string ?? 'Unable to create your account.' })
    .addCase(logout.pending, s => { s.logout = 'pending' }).addCase(logout.fulfilled, s => { s.user = null; s.status = 'unauthenticated'; s.logout = 'succeeded' }).addCase(logout.rejected, (s, a) => { s.logout = 'failed'; s.error = failure(a.error) })
    .addCase(requestPasswordReset.pending, s => { s.passwordReset = 'pending'; s.error = null }).addCase(requestPasswordReset.fulfilled, s => { s.passwordReset = 'succeeded' }).addCase(requestPasswordReset.rejected, (s, a) => { s.passwordReset = 'failed'; s.error = a.payload as string ?? 'Please try again.' })
    .addCase(confirmPasswordReset.pending, s => { s.passwordReset = 'pending'; s.error = null }).addCase(confirmPasswordReset.fulfilled, s => { s.passwordReset = 'succeeded' }).addCase(confirmPasswordReset.rejected, (s, a) => { s.passwordReset = 'failed'; s.error = a.payload as string ?? 'This reset link may have expired.' })
    .addMatcher(a => a.type.startsWith('auth/resend/') || a.type.startsWith('auth/verify/'), (s, a) => { if (a.type.endsWith('/pending')) { s.verification = 'pending'; s.error = null } if (a.type.endsWith('/fulfilled')) s.verification = 'succeeded'; if (a.type.endsWith('/rejected')) { s.verification = 'failed'; s.error = 'Please try again.' } })
} })
export const { clearError, resetRequests } = authSlice.actions
export default authSlice.reducer
