import React from 'react';
import App from '../App';
import { render } from '@testing-library/react-native';

test('App mounts without throwing', () => {
  expect(() => render(<App />)).not.toThrow();
});
