import { render, screen } from '@testing-library/react'
import { useEffect, useContext } from 'react';
import Home from '../pages/index'
import '@testing-library/jest-dom'
import { AppContext } from '../contexts/appContext';

describe('Home', () => {
  it('renders a heading', () => {
    render(<Home />)

    const heading = screen.getByRole('button')

    expect(heading).toBeInTheDocument()
  })
})