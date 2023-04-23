import React from 'react';
import { render } from '@testing-library/react-native';
import Loading from '../components/Loading';

describe('<Loading />', () => {
  it('renders loading image', () => {
    const { getByTestId } = render(<Loading />);
    const image = getByTestId('loading-image');
    expect(image).toBeTruthy();
  });
});
