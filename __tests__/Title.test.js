import React from 'react';
import { render } from '@testing-library/react-native';
import Title from '../components/Title';

describe('<Title />', () => {
  it('renders with correct font size', () => {
    const { getByText } = render(<Title titleFontSize={42} />);
    const title = getByText('ChefAI');
    expect(title.props.style.fontSize).toBe(42);
  });
});
