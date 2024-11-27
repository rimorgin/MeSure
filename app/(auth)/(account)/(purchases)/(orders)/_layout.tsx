import { MaterialTopTabs } from '@/components/navigation/MaterialTopTabs';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { bg, darkBrown, mustard } from '@/constants/Colors';
import { useFont } from '@/provider/FontContext';
import { FontAwesome6, MaterialCommunityIcons } from '@expo/vector-icons';

export default function Layout() {
  const { fontStyles } = useFont();

  return (
    <MaterialTopTabs
      screenOptions={{
        tabBarIndicatorStyle: { backgroundColor: darkBrown },
        tabBarLabelStyle: {
          fontSize: 11, 
          textTransform: 'capitalize',
          fontFamily: fontStyles.cocoGothicBold 
        },
        tabBarActiveTintColor: mustard, // Active tab color
        swipeEnabled: true,
      }}
    >
      <MaterialTopTabs.Screen 
        name="index" 
        options={{ 
          title: 'All orders',
          tabBarLabel: ({ focused, color }) => (
            <>
              {/* Display the title and dynamically change the color */}
              <ThemedView transparent style={{alignItems: 'center', justifyContent:'center'}}>
                <FontAwesome6 
                    name="boxes-stacked" 
                    size={24} 
                    color={focused ? mustard : darkBrown}
                />
                <ThemedText
                    style={{
                    fontSize: 12,
                    color: focused ? mustard : darkBrown, // Change the text color based on focus
                    fontFamily: fontStyles.cocoGothicBold,
                    marginLeft: 8, // Add space between the icon and title
                    }}
                >
                    All orders
                </ThemedText>
              </ThemedView>
            </>
          ),
        }}
      />
      <MaterialTopTabs.Screen 
        name="processing" 
        options={{ 
          title: "Processing",
          tabBarLabel: ({ focused, color }) => (
            <>
              <ThemedView transparent style={{alignItems: 'center', justifyContent:'center'}}>
                <MaterialCommunityIcons
                    name="package-variant-closed"
                    size={24}
                    color={focused ? mustard : darkBrown}
                />
                <ThemedText
                    style={{
                    fontSize: 12,
                    color: focused ? mustard : darkBrown,
                    fontFamily: fontStyles.cocoGothicBold,
                    marginLeft: 8,
                    }}
                >
                    Pending
                </ThemedText>
              </ThemedView>
            </>
          ),
        }}
      />
      <MaterialTopTabs.Screen 
        name="shipped" 
        options={{ 
          title: "Shipped",
          tabBarLabel: ({ focused, color }) => (
            <>
              <ThemedView transparent style={{alignItems: 'center', justifyContent:'center'}}>
                <MaterialCommunityIcons
                    name="truck-fast"
                    size={24}
                    color={focused ? mustard : darkBrown}
                />
                <ThemedText
                    style={{
                    fontSize: 12,
                    color: focused ? mustard : darkBrown,
                    fontFamily: fontStyles.cocoGothicBold,
                    marginLeft: 8,
                    }}
                >
                    Shipped
                </ThemedText>
              </ThemedView>
            </>
          ),
        }}
      />
      <MaterialTopTabs.Screen 
        name="delivered" 
        options={{ 
          title: "Delivered",
          tabBarLabel: ({ focused, color }) => (
            <>
              <ThemedView transparent style={{alignItems: 'center', justifyContent:'center'}}>
                <MaterialCommunityIcons
                    name="check-circle"
                    size={24}
                    color={focused ? mustard : darkBrown}
                />
                <ThemedText
                    style={{
                    fontSize: 12,
                    color: focused ? mustard : darkBrown,
                    fontFamily: fontStyles.cocoGothicBold,
                    marginLeft: 8,
                    }}
                >
                    Delivered
                </ThemedText>
              </ThemedView>
            </>
          ),
        }}
      />
      <MaterialTopTabs.Screen 
        name="returns" 
        options={{ 
          title: "Returns",
          tabBarLabel: ({ focused, color }) => (
            <>
              <ThemedView transparent style={{alignItems: 'center', justifyContent:'center'}}>
                <MaterialCommunityIcons
                    name="package-variant"
                    size={24}
                    color={focused ? mustard : darkBrown}
                />
                <ThemedText
                    style={{
                    fontSize: 12,
                    color: focused ? mustard : darkBrown,
                    fontFamily: fontStyles.cocoGothicBold,
                    marginLeft: 8,
                    }}
                >
                    Returns
                </ThemedText>
              </ThemedView>
            </>
          ),
        }}
      />
    </MaterialTopTabs>
  );
}
