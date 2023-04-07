import { render, screen } from '@testing-library/react'
import Reports from '../pages/reports/index'
import '@testing-library/jest-dom'

describe('Reports', () => {
  it('renders Report page', () => {
    render(<Reports />)

    const reports = screen.getByText('Reports')

    expect(reports).toBeInTheDocument()
  })
})