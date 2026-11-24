import React from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  KeyboardTypeOptions,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { Colors, Radius, Spacing } from '../../theme/colors';
import { SvgIcon, SvgIconName } from './SvgIcon';

export interface InputProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  helperText?: string;
  leftIcon?: SvgIconName;
  rightIcon?: SvgIconName;
  onRightIconPress?: () => void;
  secureTextEntry?: boolean;
  keyboardType?: KeyboardTypeOptions;
  multiline?: boolean;
  numberOfLines?: number;
  editable?: boolean;
  style?: StyleProp<ViewStyle>;
}

export const Input: React.FC<InputProps> = ({
  label,
  placeholder,
  value,
  onChangeText,
  error,
  helperText,
  leftIcon,
  rightIcon,
  onRightIconPress,
  secureTextEntry = false,
  keyboardType = 'default',
  multiline = false,
  numberOfLines = 1,
  editable = true,
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View
        style={[
          styles.inputContainer,
          multiline && { minHeight: 80, alignItems: 'flex-start' },
          error ? styles.inputError : null,
          !editable ? styles.inputDisabled : null,
        ]}
      >
        {leftIcon && (
          <SvgIcon
            name={leftIcon}
            size={18}
            color={Colors.textMuted}
            style={styles.leftIcon}
          />
        )}
        <TextInput
          style={[styles.textInput, multiline && styles.multilineInput]}
          placeholder={placeholder}
          placeholderTextColor={Colors.textMuted}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          multiline={multiline}
          numberOfLines={numberOfLines}
          editable={editable}
        />
        {rightIcon && (
          <Pressable onPress={onRightIconPress} hitSlop={8} style={styles.rightIcon}>
            <SvgIcon name={rightIcon} size={18} color={Colors.textMuted} />
          </Pressable>
        )}
      </View>
      {error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : helperText ? (
        <Text style={styles.helperText}>{helperText}</Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.md,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    minHeight: 48,
  },
  inputError: {
    borderColor: Colors.danger,
    backgroundColor: Colors.dangerLight + '20',
  },
  inputDisabled: {
    backgroundColor: Colors.surfaceSubtle,
    borderColor: Colors.border,
    opacity: 0.7,
  },
  textInput: {
    flex: 1,
    fontSize: 14,
    color: Colors.textPrimary,
    paddingVertical: Spacing.sm,
  },
  multilineInput: {
    textAlignVertical: 'top',
    paddingTop: Spacing.sm,
  },
  leftIcon: {
    marginRight: Spacing.sm,
  },
  rightIcon: {
    marginLeft: Spacing.sm,
  },
  errorText: {
    fontSize: 12,
    color: Colors.danger,
    marginTop: 4,
    fontWeight: '500',
  },
  helperText: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 4,
  },
});
