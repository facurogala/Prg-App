import React, { useState, useEffect, useCallback, useMemo, useRef, forwardRef } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  ScrollView, 
  Pressable, 
  Modal, 
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  StatusBar
} from 'react-native';
import { BlurView } from 'expo-blur';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFormulas } from '../../contexts/FormulaContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type Formula = {
  name: string;
  calculate: (weight: number, reps: number) => number;
};

export type LiftType = 'squat' | 'bench' | 'deadlift';

const formulas: { [key: string]: Formula } = {
  lander: {
    name: 'Lander',
    calculate: (w, r) => r === 1 ? w : (100 * w) / (101.3 - 2.67123 * r),
  },
  oconner: {
    name: "O'Conner",
    calculate: (w, r) => r === 1 ? w : w * (1 + 0.025 * r),
  },
  lombardi: {
    name: 'Lombardi',
    calculate: (w, r) => r === 1 ? w : w * Math.pow(r, 0.1),
  },
  mayhem: {
    name: 'Mayhem',
    calculate: (w, r) => r === 1 ? w : w * (1 + 0.033 * r),
  },
  wathen: {
    name: 'Wathen',
    calculate: (w, r) => r === 1 ? w : (100 * w) / (48.8 + 53.8 * Math.exp(-0.075 * r)),
  },
  brzycki: {
    name: 'Brzycki',
    calculate: (w, r) => r === 1 ? w : w * (36 / (37 - r)),
  },
  epley: {
    name: 'Epley',
    calculate: (w, r) => r === 1 ? w : w * (1 + 0.0333 * r),
  },
};

const useKeyboardHeight = () => {
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    const showSubscription = Keyboard.addListener('keyboardDidShow', (e) => {
      setKeyboardHeight(e.endCoordinates.height);
    });
    const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardHeight(0);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  return keyboardHeight;
};

const Backdrop = React.memo(({ onClose }: { onClose: () => void }) => {
  return (
    <AnimatedPressable
      entering={FadeIn.duration(200)}
      exiting={FadeOut.duration(100)}
      onPress={() => {
        Keyboard.dismiss();
        onClose();
      }}
      style={[
        StyleSheet.absoluteFillObject,
        { backgroundColor: 'rgba(0,0,0,0.7)' },
      ]}
    />
  );
});

interface NumericInputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  maxLength?: number;
  style?: any;
  integerOnly?: boolean;
}

const NumericInput = React.memo(forwardRef<TextInput, NumericInputProps>(
  ({ value, onChangeText, placeholder, maxLength = 3, style, integerOnly = false }, ref) => {
    const [internalValue, setInternalValue] = useState(value);
    const [isFocused, setIsFocused] = useState(false);

    useEffect(() => {
      setInternalValue(value);
    }, [value]);

    const handleChangeText = (text: string) => {
      let cleanedText = text.replace(/[^0-9]/g, '');
      
      if (maxLength && cleanedText.length > maxLength) {
        cleanedText = cleanedText.substring(0, maxLength);
      }
      
      setInternalValue(cleanedText);
      onChangeText(cleanedText);
    };

    const handleFocus = () => {
      setIsFocused(true);
      setTimeout(() => {
        const inputRef = ref as React.RefObject<TextInput>;
        if (inputRef?.current) {
          inputRef.current.setNativeProps({
            selection: { start: 0, end: internalValue.length }
          });
        }
      }, 50);
    };

    const handleBlur = () => {
      setIsFocused(false);
      if (internalValue === '0') {
        setInternalValue('');
        onChangeText('');
      }
    };

    return (
      <Animated.View entering={FadeIn.duration(200)}>
        <TextInput
          ref={ref}
          style={[
            styles.input,
            style
          ]}
          value={internalValue}
          onChangeText={handleChangeText}
          onFocus={handleFocus}
          onBlur={handleBlur}
          keyboardType="number-pad"
          maxLength={maxLength}
          placeholderTextColor="#666"
          placeholder={placeholder}
          returnKeyType="done"
          contextMenuHidden={true}
          selectTextOnFocus={true}
          textAlign="center"
        />
      </Animated.View>
    );
  }
));

const RmItem = React.memo(({ value, rmNumber }: { value: number | null; rmNumber: number }) => {
  const percentage = 100 - ((rmNumber - 1) * 2.5);
  
  return (
    <View style={styles.gradientWrapper}>
      <LinearGradient
        colors={['#B8B8B830', '#52525210']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradientBorder}
      />
      <View style={styles.gradientContent}>
        <Text style={styles.rmNumber}>{rmNumber}RM</Text>
        <Text style={styles.rmValue}>
          {value ? Math.round(value) : '--'}
        </Text>
        <Text style={styles.rmPercentage}>
          {value ? `${percentage}%` : '--%'}
        </Text>
      </View>
    </View>
  );
});

const SaveButton = React.memo(({ 
  status, 
  onPress 
}: { 
  status: 'idle' | 'saving' | 'saved' | 'selecting'; 
  onPress: () => void 
}) => {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.saveButton,
        status === 'saved' && styles.saveButtonSuccess,
        pressed && styles.saveButtonPressed
      ]}>
      <LinearGradient
        colors={status === 'saved' ? ['#DBFF00', '#DBFF00'] : ['#1a1a1a', '#1a1a1a']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.saveButtonGradient}>
        <View style={styles.saveButtonContent}>
          <Text style={[
            styles.saveButtonText,
            status === 'saved' && styles.saveButtonTextSuccess
          ]}>
            {status === 'saving' ? 'Saving...' :
              status === 'saved' ? 'Saved!' :
                'Save Calculation'}
          </Text>
        </View>
      </LinearGradient>
    </Pressable>
  );
});

const LiftModal = React.memo(({ 
  visible, 
  onClose, 
  onSelect 
}: { 
  visible: boolean; 
  onClose: () => void; 
  onSelect: (lift: LiftType) => void 
}) => {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}>
      <Backdrop onClose={onClose} />
      <View style={styles.modalOverlay}>
        <BlurView intensity={20} tint="dark" style={styles.modalContent}>
          <Text style={styles.modalTitle}>Select Lift Type</Text>
          
          {(['squat', 'bench', 'deadlift'] as LiftType[]).map((lift) => (
            <TouchableOpacity
              key={lift}
              style={styles.modalOption}
              onPress={() => {
                Keyboard.dismiss();
                onSelect(lift);
              }}>
              <Text style={styles.modalOptionText}>
                {lift.charAt(0).toUpperCase() + lift.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
          
          <TouchableOpacity
            style={styles.modalCancel}
            onPress={() => {
              Keyboard.dismiss();
              onClose();
            }}>
            <Text style={styles.modalCancelText}>Cancel</Text>
          </TouchableOpacity>
        </BlurView>
      </View>
    </Modal>
  );
});

export default function Calculator() {
  const [weight, setWeight] = useState('');
  const [reps, setReps] = useState('');
  const [rpe, setRpe] = useState('');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'selecting'>('idle');
  const [showLiftModal, setShowLiftModal] = useState(false);
  const [selectedLift, setSelectedLift] = useState<LiftType>('squat');
  const { selectedFormulas } = useFormulas();
  const keyboardHeight = useKeyboardHeight();
  const scrollViewRef = useRef<ScrollView>(null);
  const weightInputRef = useRef<TextInput>(null);
  const repsInputRef = useRef<TextInput>(null);
  const rpeInputRef = useRef<TextInput>(null);

  useEffect(() => {
    if (Platform.OS === 'android') {
      StatusBar.setBackgroundColor('#111111');
      StatusBar.setTranslucent(false);
    }
    
    const timer = setTimeout(() => {
      weightInputRef.current?.focus();
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);

  const handleWeightChange = useCallback((text: string) => {
    setWeight(text);
    setSaveStatus('idle');
  }, []);

  const handleRepsChange = useCallback((text: string) => {
    setReps(text);
    setSaveStatus('idle');
  }, []);

  const handleRPEChange = useCallback((text: string) => {
    if (text) {
      const value = parseInt(text, 10);
      if (value >= 1 && value <= 10) {
        setRpe(text);
      } else if (text === '') {
        setRpe('');
      }
    } else {
      setRpe('');
    }
    setSaveStatus('idle');
  }, []);

  const calculateOneRM = useCallback((w: number, r: number) => {
    if (r === 1) return w;
    const oneRMs = selectedFormulas.map(formulaId => formulas[formulaId].calculate(w, r));
    return oneRMs.reduce((a, b) => a + b, 0) / oneRMs.length;
  }, [selectedFormulas]);

  const handleSavePress = useCallback(() => {
    if (!weight || !reps) return;
    Keyboard.dismiss();
    setShowLiftModal(true);
    setSaveStatus('selecting');
  }, [weight, reps]);

  const confirmSaveCalculation = useCallback(async (liftType: LiftType) => {
    try {
      setSaveStatus('saving');
      setSelectedLift(liftType);
      setShowLiftModal(false);
      
      const numericRpe = rpe && !isNaN(Number(rpe)) ? Number(rpe) : undefined;
      const w = parseFloat(weight);
      const r = parseFloat(reps);
  
      const newEntry = {
        date: new Date().toISOString(), // Cambiado a ISO string
        weight: w,
        reps: r,
        oneRM: calculateOneRM(w, r),
        rpe: numericRpe,
        liftType: liftType,
        id: Date.now().toString(),
      };
  
      const existingHistory = await AsyncStorage.getItem('calculationHistory');
      const history = existingHistory ? JSON.parse(existingHistory) : [];
      history.push(newEntry);
      await AsyncStorage.setItem('calculationHistory', JSON.stringify(history));
  
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (error) {
      console.error('Error saving calculation:', error);
      setSaveStatus('idle');
    }
  }, [weight, reps, rpe, calculateOneRM]);

  const rmValues = useMemo(() => {
    if (!weight || !reps) return Array(20).fill(null);
    
    const w = parseFloat(weight);
    const r = parseFloat(reps);

    if (isNaN(w) || isNaN(r)) return Array(20).fill(null);

    if (r === 1) {
      return Array.from({ length: 20 }, (_, i) => {
        if (i === 0) return w;
        const repFactor = 1 - (i * 0.025);
        return w * repFactor;
      });
    }

    const avgOneRM = calculateOneRM(w, r);
    return Array.from({ length: 20 }, (_, i) => {
      const repFactor = 1 - (i * 0.025);
      return avgOneRM * repFactor;
    });
  }, [weight, reps, calculateOneRM]);

  const rows = useMemo(() => {
    const result = [];
    for (let i = 0; i < 20; i += 4) {
      result.push(rmValues.slice(i, i + 4));
    }
    return result;
  }, [rmValues]);

  return (
    <View style={{ flex: 1, backgroundColor: '#111111' }}>
      <StatusBar backgroundColor="#111111" barStyle="light-content" />
      
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.select({ ios: 0, android: 20 })}
        style={{ flex: 1 }}
      >
        <SafeAreaView 
          style={[styles.container, { marginBottom: keyboardHeight > 0 ? -1 : 0 }]}
          edges={['top', 'left', 'right']}
        >
          <ScrollView 
            ref={scrollViewRef}
            style={styles.scrollView}
            contentContainerStyle={{ paddingBottom: keyboardHeight > 0 ? keyboardHeight + -200 : -10 }}
            keyboardShouldPersistTaps="handled"
          >
            <Text style={styles.title}>1RM Calculator</Text>

            <BlurView intensity={20} tint="dark" style={styles.card}>
              <View style={styles.inputRow}>
                <View style={[styles.inputWrapper, { flex: 2 }]}>
                  <Text style={styles.label}>Weight (kg)</Text>
                  <View style={styles.inputContainer}>
                    <NumericInput
                      ref={weightInputRef}
                      value={weight}
                      onChangeText={handleWeightChange}
                      placeholder="Weight"
                      maxLength={3}
                    />
                  </View>
                </View>
                <View style={[styles.inputWrapper, { flex: 1 }]}>
                  <Text style={styles.label}>Reps</Text>
                  <View style={styles.inputContainer}>
                    <NumericInput
                      ref={repsInputRef}
                      value={reps}
                      onChangeText={handleRepsChange}
                      placeholder="Reps"
                      maxLength={2}
                    />
                  </View>
                </View>
                <View style={[styles.inputWrapper, { flex: 1 }]}>
                  <Text style={styles.label}>RPE</Text>
                  <View style={styles.inputContainer}>
                    <NumericInput
                      ref={rpeInputRef}
                      value={rpe}
                      onChangeText={handleRPEChange}
                      placeholder="1-10"
                      maxLength={2}
                    />
                  </View>
                </View>
              </View>

              {rmValues.length > 0 && (
                <SaveButton 
                  status={saveStatus} 
                  onPress={handleSavePress} 
                />
              )}
            </BlurView>

            <BlurView intensity={20} tint="dark" style={styles.card}>
              <View>
                {rows.map((row, index) => (
                  <View key={index} style={[styles.rmRow, index < rows.length - 1 && styles.rmRowBorder]}>
                    {row.map((value, colIndex) => {
                      const rmNumber = index * 4 + colIndex + 1;
                      return <RmItem key={rmNumber} value={value} rmNumber={rmNumber} />;
                    })}
                  </View>
                ))}
              </View>
            </BlurView>
          </ScrollView>
        </SafeAreaView>
      </KeyboardAvoidingView>

      <LiftModal
        visible={showLiftModal}
        onClose={() => {
          setShowLiftModal(false);
          setSaveStatus('idle');
        }}
        onSelect={confirmSaveCalculation}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111111',
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#B8B8B8',
    marginBottom: 24,
    textAlign: 'center',
  },
  card: {
    borderRadius: 20,
    overflow: 'hidden',
    padding: 3,
    backgroundColor: 'rgba(20, 20, 20, 0.8)',
    marginBottom: 16,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 8,
  },
  inputWrapper: {
    flex: 1,
  },
  label: {
    color: '#B8B8B8',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  inputContainer: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#525252',
  },
  input: {
    color: '#B8B8B8',
    padding: 10,
    fontSize: 16,
    textAlign: 'center',
    backgroundColor: 'transparent',
  },
  rmRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  rmRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#525252',
  },
  gradientWrapper: {
    width: '23%',
    position: 'relative',
  },
  gradientBorder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 12,
  },
  gradientContent: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 8,
    margin: 1,
    textAlign: 'center',
  },
  rmNumber: {
    color: '#DBFF00',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 2,
    textAlign: 'center',
  },
  rmValue: {
    color: '#B8B8B8',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 2,
    textAlign: 'center',
  },
  rmPercentage: {
    color: '#525252',
    fontSize: 11,
    fontWeight: '500',
    textAlign: 'center',
  },
  saveButton: {
    marginTop: 24,
    height: 44,
    borderRadius: 22,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    alignSelf: 'center',
    width: '80%',
  },
  saveButtonPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  saveButtonSuccess: {
    elevation: 0,
    shadowOpacity: 0,
  },
  saveButtonGradient: {
    flex: 1,
    padding: 1,
  },
  saveButtonContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderRadius: 21,
  },
  saveButtonText: {
    color: '#B8B8B8',
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  saveButtonTextSuccess: {
    color: '#111111',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 20,
  },
  modalContent: {
    width: '80%',
    borderRadius: 20,
    padding: 20,
    backgroundColor: 'rgba(30, 30, 30, 0.9)',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#B8B8B8',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalOption: {
    padding: 15,
    borderRadius: 12,
    backgroundColor: '#1a1a1a',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#525252',
  },
  modalOptionText: {
    color: '#B8B8B8',
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
  modalCancel: {
    marginTop: 10,
    padding: 15,
    borderRadius: 12,
  },
  modalCancelText: {
    color: '#DBFF00',
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
});