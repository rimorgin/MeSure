import { Animated, Dimensions, Easing, FlatList, StyleSheet, Text, View, ListRenderItemInfo } from 'react-native';
import React, { useRef, useState } from 'react';
import { appData } from '@/data/appData';

// Get the screen dimensions for layout
const { width, height } = Dimensions.get('screen');
const halfWidth = width / 2;

// Define the type for each item in the data array
interface SlideItemType {
  img: any; // Type for image source, can be string or number for images
  title: string;
  description: string;
  price?: string;
}

interface PaginationProps {
  data: SlideItemType[];
  scrollX: Animated.Value;
  index: number;
}

interface SlideItemProps {
  item: SlideItemType;
}

const Pagination: React.FC<PaginationProps> = ({ data, scrollX, index }) => {
  return (
    <View style={styles.paginationcontainer}>
      {data.map((_, idx) => {
        const inputRange = [(idx - 1) * halfWidth, idx * halfWidth, (idx + 1) * halfWidth];

        const dotWidth = scrollX.interpolate({
          inputRange,
          outputRange: [12, 30, 12],
          extrapolate: 'clamp',
        });

        const opacity = scrollX.interpolate({
          inputRange,
          outputRange: [0.2, 1, 0.1],
          extrapolate: 'clamp',
        });

        const backgroundColor = scrollX.interpolate({
          inputRange,
          outputRange: ['#ccc', '#000', '#ccc'],
          extrapolate: 'clamp',
        });

        return (
          <Animated.View
            key={idx.toString()}
            style={[
              styles.dot,
              { width: dotWidth, backgroundColor },
            ]}
          />
        );
      })}
    </View>
  );
};

const SlideItem: React.FC<SlideItemProps> = ({ item }) => {
  const translateYImage = useRef(new Animated.Value(60)).current;

  // Trigger animation once the component mounts
  React.useEffect(() => {
    Animated.timing(translateYImage, {
      toValue: 0,
      duration: 1000,
      useNativeDriver: true,
      easing: Easing.bounce,
    }).start();
  }, [translateYImage]);

  return (
    <View style={styles.container}>
      <Animated.Image
        source={item.img}
        resizeMode="contain"
        style={[
          styles.image,
          {
            transform: [
              {
                translateY: translateYImage,
              },
            ],
          },
        ]}
      />

      <View style={styles.content}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.description}>{item.description}</Text>
        <Text style={styles.price}>{item.price}</Text>
      </View>
    </View>
  );
};

const Slider: React.FC = () => {
  const [index, setIndex] = useState<number>(0);
  const scrollX = useRef(new Animated.Value(0)).current;

  const handleOnScroll = (event: any) => {
    Animated.event(
      [
        {
          nativeEvent: {
            contentOffset: {
              x: scrollX,
            },
          },
        },
      ],
      {
        useNativeDriver: false,
      },
    )(event);
  };

  const handleOnViewableItemsChanged = useRef(({ viewableItems }: { viewableItems: any[] }) => {
    setIndex(viewableItems[0]?.index || 0);
  }).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 100,
  }).current;

  return (
    <View>
      <FlatList
        data={appData.intro}
        renderItem={({ item }: ListRenderItemInfo<SlideItemType>) => <SlideItem item={item} />}
        horizontal
        pagingEnabled
        snapToAlignment="center"
        showsHorizontalScrollIndicator={false}
        onScroll={handleOnScroll}
        onViewableItemsChanged={handleOnViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
      />
      <Pagination data={appData.intro} scrollX={scrollX} index={index} />
    </View>
  );
};

export default Slider;

const styles = StyleSheet.create({
  container: {
    width: halfWidth ,
    height: height/2,
    alignItems: 'center',
  },
  image: {
    flex: 0.6,
    width: '100%',
  },
  content: {
    flex: 0.4,
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  description: {
    fontSize: 12,
    marginVertical: 12,
    color: '#333',
  },
  price: {
    fontSize: 14,
    fontWeight: 'bold',
  },

  //pagination
  paginationcontainer: {
    position: 'absolute',
    bottom: 35,
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginHorizontal: 3,
    backgroundColor: '#ccc',
  },
  dotActive: {
    backgroundColor: '#000',
  },
});
