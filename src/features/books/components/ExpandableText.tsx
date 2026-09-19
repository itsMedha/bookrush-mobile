import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Text } from '@/components/ui/Text';
import { spacing } from '@/theme';

const COLLAPSED_LINES = 4;
const MIN_LENGTH_TO_COLLAPSE = 180;

/** Body copy that collapses to four lines with a "Read more" toggle. */
export function ExpandableText({ text }: { text: string }) {
  const [expanded, setExpanded] = useState(false);
  const collapsible = text.length > MIN_LENGTH_TO_COLLAPSE;

  return (
    <View style={styles.container}>
      <Text
        variant="body"
        color="textSecondary"
        numberOfLines={collapsible && !expanded ? COLLAPSED_LINES : undefined}
      >
        {text}
      </Text>
      {collapsible ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={expanded ? 'Show less' : 'Read more'}
          hitSlop={12}
          onPress={() => setExpanded((value) => !value)}
        >
          <Text variant="bodySmall" weight="700" color="accentText">
            {expanded ? 'Show less' : 'Read more'}
          </Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({ container: { gap: spacing.sm } });
