import { render, screen } from '@testing-library/react'
import { useRouter } from 'next/router'
import Reports from '../pages/reports/index'
import '@testing-library/jest-dom'

jest.mock('next/router', () => ({
  useRouter: jest.fn()
}))

describe('Reports', () => {
  it('renders Report page', () => {
    useRouter.mockReturnValue({ query: {}})
    render(<Reports />)

    const reports = screen.getByText('Reports')

    expect(reports).toBeInTheDocument()
  })
})