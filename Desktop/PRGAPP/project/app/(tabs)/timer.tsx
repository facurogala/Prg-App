import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { BlurView } from 'expo-blur';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Play, Pause, RotateCcw } from 'lucide-react-native';

const PRESET_TIMES = [60, 90, 120, 180, 240, 300];

export default function Timer() {
  const [timeLeft, setTimeLeft] = useState(90);
  const [isRunning, setIsRunning] = useState(false);
  const [selectedTime, setSelectedTime] = useState(90);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsRunning(false);
    }

    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(selectedTime);
  };

  const selectPresetTime = (time: number) => {
    setSelectedTime(time);
    setTimeLeft(time);
    setIsRunning(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Rest Timer</Text>

      <BlurView intensity={20} tint="dark" style={styles.card}>
        <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>

        <View style={styles.controls}>
          <Pressable onPress={resetTimer} style={styles.controlButton}>
            <RotateCcw size={24} color="#DBFF00" />
          </Pressable>
          <Pressable onPress={toggleTimer} style={[styles.controlButton, styles.playButton]}>
            {isRunning ? (
              <Pause size={32} color="#1a1a1a" />
            ) : (
              <Play size={32} color="#1a1a1a" />
            )}
          </Pressable>
        </View>

        <View style={styles.presets}>
          {PRESET_TIMES.map((time) => (
            <Pressable
              key={time}
              style={[
                styles.presetButton,
                selectedTime === time && styles.presetButtonSelected,
              ]}
              onPress={() => selectPresetTime(time)}>
              <Text
                style={[
                  styles.presetText,
                  selectedTime === time && styles.presetTextSelected,
                ]}>
                {formatTime(time)}
              </Text>
            </Pressable>
          ))}
        </View>
      </BlurView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111111',
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#DBFF00',
    marginBottom: 24,
    textAlign: 'center',
  },
  card: {
    borderRadius: 20,
    overflow: 'hidden',
    padding: 24,
    backgroundColor: 'rgba(20, 20, 20, 0.8)',
    alignItems: 'center',
  },
  timerText: {
    fontSize: 72,
    fontWeight: '700',
    color: '#DBFF00',
    fontVariant: ['tabular-nums'],
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 24,
    marginTop: 32,
    marginBottom: 48,
  },
  controlButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#1a1a1a',
    alignItems: 'center',
    justifyContent: 'center',
  },
  playButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#DBFF00',
  },
  presets: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'center',
  },
  presetButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#1a1a1a',
    borderWidth: 1,
    borderColor: '#222',
  },
  presetButtonSelected: {
    backgroundColor: '#DBFF00',
  },
  presetText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  presetTextSelected: {
    color: '#1a1a1a',
  },
});