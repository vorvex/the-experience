import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Text, View } from 'tamagui';

type Option = {
  id: string;
  name: string;
  disabled?: boolean;
};

type PillSelectProps = {
  label?: string;
  options: Option[];
} & (
  | {
      multipleSelect: true;
      value: string[];
      onChange: (nV: string[]) => void | Promise<void>;
    }
  | {
      multipleSelect?: false | undefined;
      value: string;
      onChange: (nV: string) => void | Promise<void>;
    }
);

const PillSelect: React.FC<PillSelectProps> = (props) => {
  const isSelected = (id: string) => {
    if (props.multipleSelect) {
      return props.value.includes(id);
    } else {
      return props.value === id;
    }
  };

  const handleSelect = (id: string) => () => {
    if (props.multipleSelect) {
      if (isSelected(id)) {
        return props.onChange(props.value.filter((x) => x !== id));
      } else {
        return props.onChange([...props.value, id]);
      }
    } else {
      return props.onChange(id);
    }
  };

  return (
    <View style={styles.container}>
      {!!props.label && (
        <Text fontWeight="bold" color="#fff" style={{ marginBottom: 10 }}>
          {props.label}
        </Text>
      )}
      <View style={styles.grid}>
        {props.options.map((o) => (
          <TouchableOpacity
            onPress={handleSelect(o.id)}
            key={o.id}
            style={[
              styles.button,
              isSelected(o.id) && styles.active,
              o.disabled && styles.disabled,
            ]}
          >
            <Text
              fontWeight="bold"
              color={o.disabled ? 'rgba(62, 62, 62, 1)' : '#fff'}
            >
              {o.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 20,
    padding: 10,
  },
  grid: {
    flex: 1,
    flexWrap: 'wrap',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    gap: 10,
  },
  button: {
    backgroundColor: 'rgba(40, 40, 40, 1)',
    borderRadius: 30,
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 13,
  },
  disabled: {
    backgroundColor: 'rgba(28, 28, 28, 1)',
  },
  active: {
    backgroundColor: 'rgba(122, 29, 90, 1)',
  },
});

export default PillSelect;
