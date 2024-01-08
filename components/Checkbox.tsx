import { color } from 'native-base/lib/typescript/theme/styled-system';
import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

// Define props for the Checkbox component
interface CheckboxProps {
  isChecked: boolean;
  onCheck: () => void;
  color: string;
}

const Checkbox: React.FC<CheckboxProps> = ({ isChecked, onCheck, color }) => {
  const iconName = isChecked ? 'checkbox' : 'square-outline'; // Ionicons names for checked/unchecked

  return (
    <TouchableOpacity onPress={onCheck} style={{display: "flex"}}>
      <Icon
        name={iconName}
        size={24}
        color={isChecked ? color : 'grey'}
      />
    </TouchableOpacity>
  );
};



export default Checkbox;
