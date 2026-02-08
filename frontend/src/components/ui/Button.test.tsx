import { render } from '@testing-library/react';
import { Button } from './Button';
import { describe, it, expect } from 'vitest';
import '@testing-library/jest-dom'; 

describe('Button Component', () => {
  it('should render correct text', () => {
    const { getByText } = render(<Button>Click me</Button>);
    const buttonElement = getByText('Click me');
    expect(buttonElement).toBeTruthy();
  });
});