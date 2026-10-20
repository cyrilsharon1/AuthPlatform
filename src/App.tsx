import { useEffect } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from './app/store'
import { useAppDispatch } from './app/hooks'
import { restoreSession } from './features/auth/authSlice'
import { ProtectedRoute } from './components/routing/ProtectedRoute'
import { LoginPage, RegisterPage, ForgotPasswordPage, ResetPasswordPage, VerifyEmailPage } from './pages/AuthPages'
import { DashboardPage } from './pages/DashboardPage'
import { OrdersPage } from './pages/OrdersPage'
import { CheckoutPage } from './pages/CheckoutPage'
import { NotFoundPage, UnauthorizedPage } from './pages/OtherPages'
function SessionLoader(){const dispatch=useAppDispatch();useEffect(()=>{void dispatch(restoreSession())},[dispatch]);return <Routes><Route path="/" element={<Navigate to="/login" replace/>}/><Route path="/login" element={<LoginPage/>}/><Route path="/register" element={<RegisterPage/>}/><Route path="/forgot-password" element={<ForgotPasswordPage/>}/><Route path="/reset-password" element={<ResetPasswordPage/>}/><Route path="/verify-email" element={<VerifyEmailPage/>}/><Route element={<ProtectedRoute/>}><Route path="/dashboard" element={<DashboardPage/>}/><Route path="/orders" element={<OrdersPage/>}/><Route path="/checkout" element={<CheckoutPage/>}/></Route><Route path="/unauthorized" element={<UnauthorizedPage/>}/><Route path="*" element={<NotFoundPage/>}/></Routes>}
export default function App(){return <Provider store={store}><BrowserRouter><SessionLoader/></BrowserRouter></Provider>}
