import React, { useCallback } from 'react';
import { StyleSheet, Text, View, Platform, Pressable } from 'react-native';
import { PanGestureHandler } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

const SWIPE_THRESHOLD = -100;

type Props = {
  date: string;
  weight: number;
  reps: number;
  oneRM: number;
  rpe?: number;
  onDelete: () => void;
};

export default function SwipeableHistoryItem({
  date,
  weight,
  reps,
  oneRM,
  rpe,
  onDelete,
}: Props) {
  const translateX = useSharedValue(0);

  const gestureHandler = useAnimatedGestureHandler({
    onStart: (_, ctx: any) => {
      ctx.startX = translateX.value;
    },
    onActive: (event, ctx) => {
      const newTranslateX = ctx.startX + event.translationX;
      translateX.value = Math.min(0, Math.max(SWIPE_THRESHOLD, newTranslateX));
    },
    onEnd: () => {
      if (translateX.value < SWIPE_THRESHOLD / 2) {
        translateX.value = withSpring(SWIPE_THRESHOLD, { damping: 15 });
      } else {
        translateX.value = withSpring(0);
      }
    },
  });

  const handleDelete = useCallback(() => {
    if (Platform.OS === 'web') {
      const confirmed = window.confirm('Are you sure you want to delete this record?');
      if (confirmed) {
        onDelete();
      } else {
        translateX.value = withSpring(0);
      }
    } else {
      onDelete();
    }
  }, [onDelete, translateX]);

  const rStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const deleteButtonStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      translateX.value,
      [SWIPE_THRESHOLD, 0],
      [1, 0],
      Extrapolate.CLAMP
    );
    
    return {
      opacity,
      transform: [
        { 
          scale: interpolate(
            translateX.value,
            [SWIPE_THRESHOLD, 0],
            [1, 0.8],
            Extrapolate.CLAMP
          )
        }
      ],
    };
  });

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.deleteButton, deleteButtonStyle]}>
        <Pressable onPress={handleDelete} style={styles.deleteButtonInner}>
          <Text style={styles.deleteButtonText}>Delete</Text>
        </Pressable>
      </Animated.View>
      <PanGestureHandler onGestureEvent={gestureHandler}>
        <Animated.View style={[styles.itemWrapper, rStyle]}>
          <LinearGradient
            colors={['#52525250', '#52525210']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradientBorder}
          >
            <View style={styles.item}>
              <View>
                <Text style={styles.date}>
                  {new Date(date).toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </Text>
                <Text style={styles.details}>
                  {weight}kg × {reps} reps
                  {rpe && <Text style={styles.rpe}> @ RPE {rpe}</Text>}
                </Text>
              </View>
              <Text style={styles.oneRM}>{Math.round(oneRM)}kg 1RM</Text>
            </View>
          </LinearGradient>
        </Animated.View>
      </PanGestureHandler>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    marginVertical: 4,
  },
  itemWrapper: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  gradientBorder: {
    padding: 1,
    borderRadius: 12,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#1a1a1a',
    borderRadius: 11,
  },
  deleteButton: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: Math.abs(SWIPE_THRESHOLD),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
  },
  deleteButtonInner: {
    backgroundColor: '#FF4444',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  date: {
    fontSize: 14,
    marginBottom: 4,
    color: '#B8B8B8',
  },
  details: {
    color: '#525252',
    fontSize: 16,
  },
  rpe: {
    color: '#DBFF00',
    fontSize: 14,
  },
  oneRM: {
    fontSize: 18,
    fontWeight: '600',
    color: '#B8B8B8',
  },
});