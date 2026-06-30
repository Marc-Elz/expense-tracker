import { describe, it, expect } from 'vitest'
import { formatCurrency } from '../formatCurrency'

const NBSP = ' '

describe('formatCurrency', () => {
  it('formats a positive amount as nl-NL EUR', () => {
    expect(formatCurrency(1234.56)).toBe(`€${NBSP}1.234,56`)
  })

  it('formats zero', () => {
    expect(formatCurrency(0)).toBe(`€${NBSP}0,00`)
  })

  it('formats a negative amount', () => {
    expect(formatCurrency(-1234.56)).toBe(`€${NBSP}-1.234,56`)
  })
})
