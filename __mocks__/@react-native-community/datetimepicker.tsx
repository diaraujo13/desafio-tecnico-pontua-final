import React from 'react';
import { View } from 'react-native';

// Mock implementation of DateTimePicker
const DateTimePicker = (props: { testID?: string }) => {
  // Render a mock View with a testID so it can be found in tests
  return <View testID={props.testID || 'mock-datetimepicker'} {...props} />;
};

// Export the mock component
export default DateTimePicker;

// Mock implementation of DateTimePickerAndroid
export const DateTimePickerAndroid = {
  open: jest.fn(async (options) => {
    // Mock the open function to return a default 'set' action and date
    options.onChange({ type: 'set' }, new Date(2025, 0, 1));
    return { action: 'set', year: 2025, month: 0, day: 1 };
  }),
  dismiss: jest.fn(),
};
