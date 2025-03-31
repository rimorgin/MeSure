import { darkBrown, mustard } from '@/constants/Colors';
import useColorSchemeTheme from '@/hooks/useColorScheme';
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import StarRating, { StarRatingDisplay } from 'react-native-star-rating-widget';

interface Ratings {
  rating: number;
  count?: number;
  size?: number;
  interactive?: boolean; // Optional, defaults to false
  onChange?: (newRating: number) => void;
}

const RatingStars: React.FC<Ratings> = ({ rating, count, size = 15, interactive = false, onChange }) => {
  const theme = useColorSchemeTheme();
  return (
    <View>
      {interactive ? (
        <StarRating
          rating={rating}
          starSize={size}
          color={theme === 'light' ? darkBrown : mustard}
          onChange={onChange || (() => {})}
        />
      ) : (
        <StarRatingDisplay
          rating={rating}
          starSize={size}
          color={theme === 'light' ? darkBrown : mustard}
          style={{marginLeft: -5}}
        />
      )}
      {count !== undefined && (
        <Text style={styles.text}>{count} Reviews</Text>
      )}
    </View>
  );
};

export default RatingStars;

const styles = StyleSheet.create({
  text: {
    fontSize: 14,
    color: '#333',
  },
  staticStars: {
    fontSize: 20,
  },
});
