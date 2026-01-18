import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface VFLogoProps {
  size?: number;
  backgroundColor?: string;
  textColor?: string;
  style?: any;
}

const VFLogo: React.FC<VFLogoProps> = ({
  size = 40,
  backgroundColor = '#007bff',
  textColor = '#fff',
  style,
}) => {
  return (
    <View
      style={[
        styles.container,
        {
          width: size,
          height: size,
          backgroundColor,
          borderRadius: size / 2,
        },
        style,
      ]}
    >
      <Text
        style={[
          styles.text,
          {
            color: textColor,
            fontSize: size * 0.4,
          },
        ]}
      >
        VF
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  text: {
    fontWeight: 'bold',
    fontFamily: 'System',
  },
});

export default VFLogo;