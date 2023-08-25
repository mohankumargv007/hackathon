import { render, screen } from '@testing-library/react';
import { useRouter } from 'next/router'
import Home from '../pages/index';
import '@testing-library/jest-dom';

jest.mock('next/router', () => ({
  useRouter: jest.fn()
}))

describe('Home', () => {
  it('renders Home page', () => {
    useRouter.mockReturnValue({ query: {}})
    render(<Home />)

    const button = screen.getByRole('map-merchandise')

    expect(button).toBeInTheDocument()
  })
})