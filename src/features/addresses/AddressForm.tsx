import { zodResolver } from '@hookform/resolvers/zod';
import { useRef } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { StyleSheet, View, type TextInput } from 'react-native';
import { Button } from '@/components/ui/Button';
import { Chip } from '@/components/ui/Chip';
import { Text } from '@/components/ui/Text';
import { TextField } from '@/components/ui/TextField';
import { spacing } from '@/theme';
import { ADDRESS_LABELS, addressSchema, type AddressFormValues } from './schemas';

interface AddressFormProps {
  onSubmit: (values: AddressFormValues) => void;
  onCancel?: () => void;
}

/** New-address form (React Hook Form + Zod). Reused by checkout and the profile screen. */
export function AddressForm({ onSubmit, onCancel }: AddressFormProps) {
  const line2Ref = useRef<TextInput>(null);
  const cityRef = useRef<TextInput>(null);
  const pincodeRef = useRef<TextInput>(null);

  const { control, handleSubmit } = useForm<AddressFormValues>({
    resolver: zodResolver(addressSchema),
    defaultValues: { label: 'Home', line1: '', line2: '', city: '', pincode: '' },
    reValidateMode: 'onChange',
  });

  const submit = handleSubmit(onSubmit);

  return (
    <View style={styles.form}>
      <Controller
        control={control}
        name="label"
        render={({ field }) => (
          <View style={styles.labels}>
            <Text variant="bodySmall" weight="600">
              Save as
            </Text>
            <View style={styles.chips}>
              {ADDRESS_LABELS.map((label) => (
                <Chip
                  key={label}
                  label={label}
                  selected={field.value === label}
                  onPress={() => field.onChange(label)}
                />
              ))}
            </View>
          </View>
        )}
      />
      <Controller
        control={control}
        name="line1"
        render={({ field, fieldState }) => (
          <TextField
            testID="address-line1"
            label="Street address"
            placeholder="221B Baker Street"
            value={field.value}
            onChangeText={field.onChange}
            onBlur={field.onBlur}
            error={fieldState.error?.message}
            autoComplete="street-address"
            returnKeyType="next"
            onSubmitEditing={() => line2Ref.current?.focus()}
          />
        )}
      />
      <Controller
        control={control}
        name="line2"
        render={({ field, fieldState }) => (
          <TextField
            testID="address-line2"
            ref={line2Ref}
            label="Area / landmark"
            placeholder="Koramangala 4th Block"
            value={field.value}
            onChangeText={field.onChange}
            onBlur={field.onBlur}
            error={fieldState.error?.message}
            returnKeyType="next"
            onSubmitEditing={() => cityRef.current?.focus()}
          />
        )}
      />
      <View style={styles.split}>
        <View style={styles.flex}>
          <Controller
            control={control}
            name="city"
            render={({ field, fieldState }) => (
              <TextField
                testID="address-city"
                ref={cityRef}
                label="City"
                placeholder="Bengaluru"
                value={field.value}
                onChangeText={field.onChange}
                onBlur={field.onBlur}
                error={fieldState.error?.message}
                returnKeyType="next"
                onSubmitEditing={() => pincodeRef.current?.focus()}
              />
            )}
          />
        </View>
        <View style={styles.flex}>
          <Controller
            control={control}
            name="pincode"
            render={({ field, fieldState }) => (
              <TextField
                testID="address-pincode"
                ref={pincodeRef}
                label="Pincode"
                placeholder="560034"
                value={field.value}
                onChangeText={field.onChange}
                onBlur={field.onBlur}
                error={fieldState.error?.message}
                keyboardType="number-pad"
                maxLength={6}
                autoComplete="postal-code"
                returnKeyType="done"
                onSubmitEditing={submit}
              />
            )}
          />
        </View>
      </View>
      <View style={styles.actions}>
        {onCancel ? (
          <Button
            label="Cancel"
            variant="secondary"
            fullWidth={false}
            style={styles.cancel}
            onPress={onCancel}
          />
        ) : null}
        <Button testID="address-save" label="Save address" style={styles.flex} onPress={submit} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  form: { gap: spacing.lg },
  labels: { gap: spacing.sm },
  chips: { flexDirection: 'row', gap: spacing.sm },
  split: { flexDirection: 'row', gap: spacing.md },
  flex: { flex: 1 },
  actions: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.xs },
  cancel: { paddingHorizontal: spacing.xl },
});
