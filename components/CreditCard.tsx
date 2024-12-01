
import React, { ReactNode, useEffect, useState } from "react";
import { View, Text, StyleSheet, StyleProp, ViewStyle, Image } from "react-native";
import { ThemedText } from "./ThemedText";
import { darkBrown } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { cardTypeImages } from "@/utils/identifyCardType";

const circleSize = 250;
export function CreditCard({
  name = 'FULL NAME',
  number,
  date,
  suffix,
  type,
  cvv,
  style,
  textColor = "white",
  bgColor = darkBrown,
  noContent = false
}: {
  name?: string;
  number?: string;
  date?: string;
  suffix?: number | string;
  type?: string;
  cvv?: string;
  style?: StyleProp<ViewStyle>;
  textColor?: string;
  bgColor?: string;
  noContent?: boolean;
}) {
  const dotStyle = [cardStyles.dot, { backgroundColor: textColor }];

  return (
    <View style={[cardStyles.container, { backgroundColor: bgColor}, style]}>
      <View style={[cardStyles.bgCircle, cardStyles.rightBgCircle]} />
      <View style={[cardStyles.bgCircle, cardStyles.bottomBgCircle]} />
      {/* Name Section and Logo Section */}
      <View style={cardStyles.nameLogoContainer}>
      <View>
        {name ? (
          <ThemedText  
            font="itcNewBaskerville" 
            customColor="white"
            style={{fontSize: 22}}
          >
            {name}
          </ThemedText>
        ): (
             <ThemedText  
            font="itcNewBaskerville" 
            customColor="white"
            style={{fontSize: 22}}
          >
            FULL NAME
          </ThemedText>
        )}
      </View>
      <View>
        {type ? (
            <Image 
                source={cardTypeImages[type]}
                resizeMode="contain"
                style={{height: 60, width: 60, borderRadius: 10}}
            />
            ) : (
            <View style={{height: 60, width: 60}} />
        )}
      </View>
      </View>
      <ThemedText 
        font="cocoGothicBold" 
        customColor="white"
      >CARD NUMBER
      </ThemedText>
      <View style={cardStyles.cardNumberContainer}>
        {number
            ? number.split(" ").map((chunk, index) => (
                <Text key={index} style={[cardStyles.text, { color: textColor }]}>
                {chunk}
                </Text>
            ))
            : (
                <>
                <View style={cardStyles.cardNumberPart}>
                    <View style={dotStyle} />
                    <View style={dotStyle} />
                    <View style={dotStyle} />
                    <View style={dotStyle} />
                </View>
                <View style={cardStyles.cardNumberPart}>
                    <View style={dotStyle} />
                    <View style={dotStyle} />
                    <View style={dotStyle} />
                    <View style={dotStyle} />
                </View>
                <View style={cardStyles.cardNumberPart}>
                    <View style={dotStyle} />
                    <View style={dotStyle} />
                    <View style={dotStyle} />
                    <View style={dotStyle} />
                </View>
                 <View style={cardStyles.cardNumberPart}>
                    <View style={dotStyle} />
                    <View style={dotStyle} />
                    <View style={dotStyle} />
                    <View style={dotStyle} />
                </View>
                </>
            )}
        </View>
      <View style={cardStyles.footerContainer}>
        <View>
            <ThemedText 
                font="cocoGothicBold" 
                customColor="white"
            >MONTH/YEAR
            </ThemedText>
           <Text style={[cardStyles.text, { color: textColor }]}>{date}</Text>
        </View>
        <View>
            <ThemedText 
                font="cocoGothicBold" 
                customColor="white"
            >CVV
            </ThemedText>
           <Text style={[cardStyles.text, { color: textColor }]}>{cvv}</Text>
        </View>
      </View>
    </View>
  );
}

const cardStyles = StyleSheet.create({
  container: {
    padding: 24,
    borderRadius: 12,
    width: '100%',
    height: '28%',
    position: "relative",
  },
  nameLogoContainer: { flexDirection: 'row', width: '100%', justifyContent: 'space-between', marginBottom: 15, marginTop: -10, alignItems: 'center' },
  circle: { width: 34, height: 34, borderRadius: 17 },
  rightCircle: { backgroundColor: "#f9a000", position: "absolute", left: 20 },
  leftCircle: { backgroundColor: "#ed0006", zIndex: 999 },
  cardNumberContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 10,
    marginBottom: 18
  },
  cardNumberPart: { flexDirection: "row" },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 4,
    marginTop: 7,
    marginBottom: 9
  },
  footerContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 80
  },
  text: {
    fontFamily: "Courier",
    fontSize: 16,
    letterSpacing: 0.53
  },
  bgCircle: {
    position: "absolute",
    backgroundColor: "white",
    opacity: 0.05,
    height: circleSize,
    width: circleSize,
    borderRadius: circleSize
  },
  rightBgCircle: {
    top: (-1 * circleSize) / 4,
    right: (-1 * circleSize) / 2
  },
  bottomBgCircle: {
    bottom: (-1 * circleSize) / 2,
    left: (0 * (-1 * circleSize)) / 2
  }
});

const liteCircleSize = 150;
export function LiteCreditCard({
  style,
  bgColor = darkBrown,
  children
}: {
  style?: StyleProp<ViewStyle>;
  bgColor?: string;
  children?: ReactNode
}) {
  return (
    <View style={[liteCardStyles.container, { backgroundColor: bgColor }, style]}>
      <View style={[liteCardStyles.bgCircle, liteCardStyles.rightBgCircle]} />
      <View style={[liteCardStyles.bgCircle, liteCardStyles.bottomBgCircle]} />
      {children}
    </View>
  );
}

const liteCardStyles = StyleSheet.create({
  container: {
    padding: 40,
    borderRadius: 12,
    width: '100%',
    position: "relative"
  },
  bgCircle: {
    position: "absolute",
    backgroundColor: "white",
    opacity: 0.05,
    height: liteCircleSize,
    width: liteCircleSize,
    borderRadius: liteCircleSize
  },
  rightBgCircle: {
    top: (-1 * liteCircleSize) / 4,
    right: (-1 * liteCircleSize) / 2
  },
  bottomBgCircle: {
    bottom: (-1 * liteCircleSize) / 2,
    left: (0 * (-1 * liteCircleSize)) / 2
  }
});