import { ChevronRight, LucideIcon } from 'lucide-react-native';
import React from 'react';
import { Text, View } from 'tamagui';

const LineItemWithIcon: React.FC<{
  icon: LucideIcon;
  onPress?: () => void;
  label: string;
  bold?: boolean;
  children?: React.ReactNode;
}> = (props) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        gap: 10,
        flex: 1,
        paddingHorizontal: 20,
        paddingVertical: 16,
        alignItems: 'flex-start',
      }}
      onPress={props.onPress}
    >
      {<props.icon size={24} color="rgba(62, 62, 62, 1)" />}
      <View style={{ flex: 1, gap: 10 }}>
        <View
          style={{
            flexDirection: 'row',
            gap: 10,
            alignItems: 'center',
            justifyContent: 'space-between',
            height: 24,
          }}
        >
          <Text
            color="rgba(237, 237, 237, 1)"
            fontSize="14px"
            fontWeight={props.bold ? 'bold' : 'normal'}
          >
            {props.label}
          </Text>
          {props.onPress && (
            <ChevronRight size={24} color="rgba(62, 62, 62, 1)" />
          )}
        </View>
        {props.children}
      </View>
    </View>
  );
};

export default LineItemWithIcon;
