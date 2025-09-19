import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Button } from '../Button'

describe('Button', () => {
  it('renders button label and applies variant styles', () => {
    render(<Button variant="secondary">Save</Button>)
    const button = screen.getByRole('button', { name: /save/i })
    expect(button).toBeInTheDocument()
    expect(button.className).toContain('ui-button--secondary')
  })
})
