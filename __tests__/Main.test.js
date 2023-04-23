import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import Main from '../components/Main';

describe('Main component', () => {
  it('renders correctly', () => {
    const { getByTestId } = render(<Main navigation={null} />);
    const mainView = getByTestId('main-view');
    expect(mainView).toBeTruthy();
  });

  it('toggles language multiple times when language button is pressed multiple times', async () => {
    const { getByTestId } = render(<Main navigation={null} />);
    const langButton = getByTestId('lang-button');
    const langText = getByTestId('lang-text');

    expect(langText).toHaveTextContent('🇹🇷');
    fireEvent.press(langButton);
    await waitFor(() => expect(langText).toHaveTextContent('🇬🇧'));
    fireEvent.press(langButton);
    await waitFor(() => expect(langText).toHaveTextContent('🇹🇷'));
    fireEvent.press(langButton);
    await waitFor(() => expect(langText).toHaveTextContent('🇬🇧'));
  });

  it('displays an error message when API request fails', async () => {
    fetch.resetMocks();
    fetch.mockRejectOnce(new Error('API request failed'));

    const { getByTestId } = render(<Main navigation={null} />);
    const input = getByTestId('ingredient-input');
    const submitButton = getByTestId('submit-button');

    fireEvent.changeText(input, 'onions, tomatoes');
    fireEvent.press(submitButton);
    await waitFor(() => {
      const errorText = getByTestId('error-text');
      expect(errorText).toHaveTextContent('An error occurred while getting the recipe.');
    });
  });





  it('toggles language when language button is pressed', async () => {
    const { getByTestId } = render(<Main navigation={null} />);
    const langButton = getByTestId('lang-button');
    const langText = getByTestId('lang-text');

    expect(langText).toHaveTextContent('🇹🇷');
    fireEvent.press(langButton);
    await waitFor(() => expect(langText).toHaveTextContent('🇬🇧'));
  });

  it('clears error message when input is provided', async () => {
    const { getByTestId, queryByTestId } = render(<Main navigation={null} />);
    const submitButton = getByTestId('submit-button');
    const input = getByTestId('ingredient-input');

    fireEvent.press(submitButton);

    await waitFor(() => {
      const errorText = getByTestId('error-text');
      expect(errorText).toHaveTextContent('please enter ingredients.');
    });

    fireEvent.changeText(input, 'onions, tomatoes');

    await new Promise(resolve => setTimeout(resolve, 10));

    const errorText = queryByTestId('error-text');
    expect(errorText).toBeNull();
  });

  it('fetches recipe using ChatGPT API', async () => {

    fetch.resetMocks();


    const mockApiResponse = {
      id: 'someid',
      object: 'text',
      created: 1677649420,
      model: 'text-davinci-003',
      usage: { prompt_tokens: 56, completion_tokens: 31, total_tokens: 87 },
      choices: [
        {
          text: 'Here is a simple recipe for tomato and onion salad:\n\nIngredients:\n- 2 tomatoes\n- 1 onion\n- Salt and pepper to taste\n- Olive oil\n\nInstructions:\n1. Chop the tomatoes and onion into small pieces.\n2. Mix them in a bowl and season with salt and pepper.\n3. Drizzle with olive oil and mix well.\n4. Serve and enjoy!',
          index: 0,
          logprobs: null,
          finish_reason: 'stop',
        },
      ],
    };


    fetch.mockResponseOnce(JSON.stringify(mockApiResponse));

    const { getByTestId } = render(<Main navigation={null} />);
    const input = getByTestId('ingredient-input');
    const submitButton = getByTestId('submit-button');

    fireEvent.changeText(input, 'onions, tomatoes');
    fireEvent.press(submitButton);

    await waitFor(() => {
      const results = getByTestId('recipe-results');
      expect(results).toHaveTextContent('Here is a simple recipe for tomato and onion salad:');
    });
  });





  it('displays error message when no input is provided', async () => {
    const { getByTestId } = render(<Main navigation={null} />);
    const submitButton = getByTestId('submit-button');

    fireEvent.press(submitButton);

    await waitFor(() => {
      const errorText = getByTestId('error-text');
      expect(errorText).toHaveTextContent('please enter ingredients.');
    });
  });




  it('updates input value when text is entered', () => {
    const { getByTestId } = render(<Main navigation={null} />);
    const input = getByTestId('ingredient-input');
    fireEvent.changeText(input, 'onions, tomatoes');
    expect(input.props.value).toEqual('onions, tomatoes');
  });
});
