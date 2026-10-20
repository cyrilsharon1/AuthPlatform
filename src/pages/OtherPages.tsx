import { Link } from 'react-router-dom'
import { ArrowLeft, ShieldAlert, SearchX } from 'lucide-react'
import { BrandLogo } from '../components/common/BrandLogo'
export function UnauthorizedPage(){return <main className="message-page"><BrandLogo/><ShieldAlert size={42}/><h1>You can’t access this page</h1><p>Your account doesn’t have access here.</p><Link to="/" className="text-link"><ArrowLeft size={15}/> Go back home</Link></main>}
export function NotFoundPage(){return <main className="message-page"><BrandLogo/><SearchX size={42}/><span className="eyebrow">404 · PAGE NOT FOUND</span><h1>Looks like we took a wrong turn.</h1><p>That page isn’t on the menu.</p><Link to="/login" className="text-link"><ArrowLeft size={15}/> Back to CV Foods</Link></main>}
