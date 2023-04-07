import { render, screen } from '@testing-library/react';
import Home from '../pages/index';
import '@testing-library/jest-dom';

describe('Home', () => {
  it('renders Home page', () => {
    render(<Home />)

    const buttons = screen.getByRole('button')

    expect(buttons).toBeInTheDocument()
  })
})