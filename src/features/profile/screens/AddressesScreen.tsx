import { useState } from 'react';
import { View } from 'react-native';
import { OptionCard } from '@/components/commerce/OptionCard';
import { BottomSheet } from '@/components/ui/BottomSheet';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { AddressForm } from '@/features/addresses/AddressForm';
import { toast } from '@/store/toastStore';
import { useUserStore } from '@/store/userStore';
import { spacing } from '@/theme';
import { SubScreen } from '../components/SubScreen';

const iconFor = (label: string) =>
  label === 'Home' ? 'home-outline' : label === 'Work' ? 'briefcase-outline' : 'location-outline';

export default function AddressesScreen() {
  const addresses = useUserStore((state) => state.addresses);
  const selectedId = useUserStore((state) => state.selectedAddressId);
  const selectAddress = useUserStore((state) => state.selectAddress);
  const addAddress = useUserStore((state) => state.addAddress);
  const [adding, setAdding] = useState(false);

  return (
    <SubScreen title="Addresses">
      {addresses.length === 0 ? (
        <EmptyState
          icon="location-outline"
          title="No saved addresses"
          message="Add one to get books delivered to your door."
        />
      ) : (
        <View style={{ gap: spacing.md }}>
          {addresses.map((address) => (
            <OptionCard
              key={address.id}
              testID={`address-${address.id}`}
              icon={iconFor(address.label)}
              title={address.id === selectedId ? `${address.label} · Default` : address.label}
              subtitle={`${address.line1}, ${address.line2}, ${address.city} ${address.pincode}`}
              selected={address.id === selectedId}
              onPress={() => {
                selectAddress(address.id);
                toast.show(`${address.label} is now your default address`);
              }}
            />
          ))}
        </View>
      )}
      <Button
        testID="profile-add-address"
        label="Add new address"
        leftIcon="add"
        variant="secondary"
        onPress={() => setAdding(true)}
      />

      <BottomSheet visible={adding} onClose={() => setAdding(false)} title="New address" scrollable>
        <AddressForm
          onCancel={() => setAdding(false)}
          onSubmit={(values) => {
            addAddress(values);
            setAdding(false);
            toast.success('Address added');
          }}
        />
      </BottomSheet>
    </SubScreen>
  );
}
