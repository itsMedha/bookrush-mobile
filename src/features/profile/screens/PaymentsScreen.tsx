import { View } from 'react-native';
import { OptionCard } from '@/components/commerce/OptionCard';
import { Text } from '@/components/ui/Text';
import { paymentMethods } from '@/data/users';
import { toast } from '@/store/toastStore';
import { useUserStore } from '@/store/userStore';
import { spacing } from '@/theme';
import type { PaymentMethodId } from '@/types';
import type { IconName } from '@/components/ui/Icon';
import { SubScreen } from '../components/SubScreen';

const icons: Record<PaymentMethodId, IconName> = {
  upi: 'logo-apple',
  card: 'card-outline',
  cod: 'cash-outline',
};

export default function PaymentsScreen() {
  const selected = useUserStore((state) => state.paymentMethod);
  const setPaymentMethod = useUserStore((state) => state.setPaymentMethod);

  return (
    <SubScreen title="Payment methods">
      <Text variant="bodySmall" color="textSecondary">
        Your default method is preselected at checkout.
      </Text>
      <View style={{ gap: spacing.md }}>
        {paymentMethods.map((method) => (
          <OptionCard
            key={method.id}
            testID={`payment-method-${method.id}`}
            icon={icons[method.id]}
            title={method.title}
            subtitle={method.subtitle}
            selected={selected === method.id}
            onPress={() => {
              setPaymentMethod(method.id);
              toast.show(`${method.title} set as default`);
            }}
          />
        ))}
      </View>
      <Text variant="caption" color="textTertiary">
        This is a portfolio demo — no real payment details are collected or stored.
      </Text>
    </SubScreen>
  );
}
