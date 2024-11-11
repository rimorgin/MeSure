import { Animated, Dimensions, FlatList, StyleSheet, Text, View, ListRenderItemInfo } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { appData } from '@/data/appData';
import { Easing } from 'react-native-reanimated';
import { ThemedTouchablePlain } from './ThemedButton';
import { useIsAppFirstLaunchStore } from '@/state/appStore';
import { ThemedText } from './ThemedText';

// Get the screen dimensions for layout
const { width, height } = Dimensions.get('window');

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
  isActive: boolean;
}

const Pagination: React.FC<PaginationProps> = ({ data, scrollX, index }) => {
  const width12 = width / 1.2;
  return (
    <View style={styles.paginationcontainer}>
      {data.map((_, idx) => {
        const inputRange = [(idx - 1) * width12, idx * width12, (idx + 1) * width];

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

const SlideItem: React.FC<SlideItemProps> = ({ item, isActive }) => {
  const translateYImage = useRef(new Animated.Value(60)).current;

  useEffect(() => {
    if (isActive) {
      translateYImage.setValue(10);
      Animated.timing(translateYImage, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
        easing: Easing.elastic(2),
      }).start();
    }
  }, [isActive, translateYImage]);

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
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;

  const { hideIntro } = useIsAppFirstLaunchStore()

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
      { useNativeDriver: false }
    )(event);
  };

  const handleOnViewableItemsChanged = useRef(({ viewableItems }: { viewableItems: any[] }) => {
    setActiveIndex(viewableItems[0]?.index || 0);
  }).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

  return (
    <View>
      <FlatList
        data={appData.intro}
        renderItem={({ item, index }: ListRenderItemInfo<SlideItemType>) => (
          <SlideItem item={item} isActive={index === activeIndex} />
        )}
        horizontal
        pagingEnabled
        snapToAlignment="center"
        initialNumToRender={1}
        showsHorizontalScrollIndicator={false}
        onScroll={handleOnScroll}
        onViewableItemsChanged={handleOnViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        contentContainerStyle={{justifyContent: 'center'}}
      />
      <View style={styles.bottomRowActions}>
          <ThemedTouchablePlain
            onPress={hideIntro}
            variant="opacity"
            disabled={activeIndex !== 0 && activeIndex === 4 && true}
          >
            <ThemedText style={activeIndex !== 0 && activeIndex === 4 && { color: 'transparent' }}>
              Skip
            </ThemedText>
          </ThemedTouchablePlain>

          <Pagination data={appData.intro} scrollX={scrollX} index={activeIndex} />
          
          <ThemedTouchablePlain
            onPress={hideIntro}
            variant='opacity'
            disabled={activeIndex !== 4 && true}
          >
            <ThemedText style={activeIndex !== 4 && { color: 'transparent' }}>
                Finish
            </ThemedText>
          </ThemedTouchablePlain>
      </View>
      
    </View>
  );
};


export default Slider;

const styles = StyleSheet.create({
  container: {
    width: width / 1.2,
    height: height / 1.2,
    alignItems: 'center',
    marginTop: -20,
  },
  image: {
    flex: 0.6,
    width: '100%',
  },
  content: {
    flex: 0.4,
    alignItems: 'center',
    paddingHorizontal: 30,  
    width: '100%', 
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  description: {
    fontSize: 13,
    marginVertical: 12,
    color: '#333',
    textAlign: 'center',  // Center-align text
    flexWrap: 'wrap',
    maxWidth: '90%',  // Limit width to ensure wrapping
  },
  price: {
    fontSize: 14,
    fontWeight: 'bold',
  },

  // pagination
  paginationcontainer: {
    flexDirection: 'row',
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
  bottomRowActions: {
    flexDirection:'row', 
    justifyContent:"space-evenly",
    bottom:10
  }
});
