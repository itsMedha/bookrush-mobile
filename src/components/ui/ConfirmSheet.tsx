import { StyleSheet, View } from 'react-native';
import { spacing } from '@/theme';
import { BottomSheet } from './BottomSheet';
import { Button } from './Button';
import { Text } from './Text';

interface ConfirmSheetProps {
  visible: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel?: string;
  destructive?: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

/** In-app replacement for `Alert.alert`, consistent on iOS, Android and web. */
export function ConfirmSheet({
  visible,
  title,
  message,
  confirmLabel,
  cancelLabel = 'Cancel',
  destructive = false,
  onConfirm,
  onClose,
}: ConfirmSheetProps) {
  return (
    <BottomSheet visible={visible} onClose={onClose} testID="confirm-sheet">
      <View style={styles.content}>
        <Text variant="heading2">{title}</Text>
        <Text variant="body" color="textSecondary">
          {message}
        </Text>
        <View style={styles.actions}>
          <Button
            label={confirmLabel}
            variant={destructive ? 'danger' : 'primary'}
            onPress={() => {
              onClose();
              onConfirm();
            }}
          />
          <Button label={cancelLabel} variant="ghost" onPress={onClose} />
        </View>
      </View>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  content: { gap: spacing.sm, paddingBottom: spacing.sm },
  actions: { gap: spacing.xs, marginTop: spacing.lg },
});
