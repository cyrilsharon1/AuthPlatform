import { act } from 'react'
import { createRoot } from 'react-dom/client'
import { afterEach, describe, expect, it } from 'vitest'
import { PasswordInput } from './PasswordInput'

let host: HTMLDivElement | null = null
let root: ReturnType<typeof createRoot> | null = null
afterEach(() => { if (root) act(() => root?.unmount()); host?.remove(); root = null; host = null })

describe('PasswordInput', () => {
  it('toggles password visibility with accessible labels', () => {
    host = document.createElement('div')
    document.body.append(host)
    root = createRoot(host)
    act(() => root?.render(<PasswordInput label="Password" name="password" value="secret" onChange={() => undefined} />))
    const input = host.querySelector('input')
    const button = host.querySelector('button')
    expect(input?.type).toBe('password')
    expect(button?.getAttribute('aria-label')).toBe('Show password')
    act(() => button?.dispatchEvent(new MouseEvent('click', { bubbles: true })))
    expect(input?.type).toBe('text')
    expect(button?.getAttribute('aria-label')).toBe('Hide password')
  })
})
