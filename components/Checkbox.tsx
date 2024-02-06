import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

// Define props for the Checkbox component
interface CheckboxProps {
  isChecked: boolean;
  onCheck: () => void;
  color: string;
  alt: string;
  enabled? : boolean;
  uncheckedColor?: string;
}

const Checkbox: React.FC<CheckboxProps> = ({ isChecked, onCheck, color, alt, enabled = true, uncheckedColor = "gray" }) => {
  const iconName = isChecked ? 'checkbox' : 'square-outline'; // Ionicons names for checked/unchecked

  return (
    <TouchableOpacity onPress={enabled ? onCheck : () => {}} style={{display: "flex"}}>
      <Icon
        name={iconName}
        size={24}
        color={isChecked ? color : uncheckedColor}
        accessibilityLabel={alt}
      />
    </TouchableOpacity>
  );
};



export default Checkbox;
