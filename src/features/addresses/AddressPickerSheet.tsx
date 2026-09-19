import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { OptionCard } from '@/components/commerce/OptionCard';
import { BottomSheet } from '@/components/ui/BottomSheet';
import { Button } from '@/components/ui/Button';
import { toast } from '@/stores/toastStore';
import { useUserStore } from '@/stores/userStore';
import { spacing } from '@/theme';
import type { Address } from '@/types';
import { AddressForm } from './AddressForm';

interface AddressPickerSheetProps {
  visible: boolean;
  onClose: () => void;
}

const labelIcon = (label: string) =>
  label === 'Home' ? 'home-outline' : label === 'Work' ? 'briefcase-outline' : 'location-outline';

const summary = (address: Address) =>
  `${address.line1}, ${address.line2}, ${address.city} ${address.pincode}`;

/** Choose a delivery address or add a new one without leaving checkout. */
export function AddressPickerSheet({ visible, onClose }: AddressPickerSheetProps) {
  const [adding, setAdding] = useState(false);
  const addresses = useUserStore((state) => state.addresses);
  const selectedId = useUserStore((state) => state.selectedAddressId);
  const selectAddress = useUserStore((state) => state.selectAddress);
  const addAddress = useUserStore((state) => state.addAddress);

  const close = () => {
    setAdding(false);
    onClose();
  };

  return (
    <BottomSheet
      visible={visible}
      onClose={close}
      title={adding ? 'New address' : 'Delivery address'}
      scrollable
    >
      {adding ? (
        <AddressForm
          onCancel={() => setAdding(false)}
          onSubmit={(values) => {
            addAddress(values);
            toast.success('Address added');
            close();
          }}
        />
      ) : (
        <View style={styles.list}>
          {addresses.map((address) => (
            <OptionCard
              key={address.id}
              testID={`address-option-${address.id}`}
              icon={labelIcon(address.label)}
              title={address.label}
              subtitle={summary(address)}
              selected={address.id === selectedId}
              onPress={() => {
                selectAddress(address.id);
                close();
              }}
            />
          ))}
          <Button
            testID="add-address"
            label="Add new address"
            leftIcon="add"
            variant="secondary"
            onPress={() => setAdding(true)}
          />
        </View>
      )}
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  list: { gap: spacing.md, paddingBottom: spacing.sm },
});
