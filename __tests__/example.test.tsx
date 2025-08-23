import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

describe('Sample Test', () => {
  it('renders a heading', () => {
    render(<h1>Hello, pokemonstorepj!</h1>);
    expect(screen.getByText('Hello, pokemonstorepk!')).toBeInTheDocument();
  });
});
