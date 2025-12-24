// Jest setup file
// Add any global test setup here

import PropTypes from 'prop-types'; // Import PropTypes

// Mock DateTimePicker
jest.mock('@react-native-community/datetimepicker', () => {
  const React = require('react');
  const { View } = require('react-native');

  // Cria um componente mockado simples
  const DateTimePicker = (props) => {
    return React.createElement(View, { testID: props.testID || 'DateTimePicker' });
  };

  // Adiciona a validação dos tipos de props
  DateTimePicker.propTypes = {
    testID: PropTypes.string, // Valida `testID` como uma string
  };

  return DateTimePicker;
});
