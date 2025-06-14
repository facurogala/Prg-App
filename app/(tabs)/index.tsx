import { useState, useCallback, useMemo } from 'react';
import { Text, View, TextInput, ScrollView, Pressable, Modal, TouchableOpacity, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFormulas } from '../../contexts/FormulaContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';

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

const GradientBox = ({ children, color }: { children: React.ReactNode; color: string }) => (
  <View style={{ width: '23%', position: 'relative' }}>
    <LinearGradient
      colors={[`${color}30`, '#52525210']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, borderRadius: 12 }}
    />
    <View style={{ backgroundColor: '#1a1a1a', borderRadius: 12, padding: 8, margin: 1, textAlign: 'center' }}>
      {children}
    </View>
  </View>
);

export default function Calculator() {
  const [weight, setWeight] = useState('');
  const [reps, setReps] = useState('');
  const [rpe, setRpe] = useState('');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'selecting'>('idle');
  const [showLiftModal, setShowLiftModal] = useState(false);
  const [selectedLift, setSelectedLift] = useState<LiftType>('squat');
  const { selectedFormulas } = useFormulas();

  // SOLO NÚMEROS ENTEROS PARA WEIGHT
  const handleWeightChange = useCallback((text: string) => {
    const numericValue = text.replace(/[^0-9]/g, '');
    if (numericValue.length <= 6) {
      setWeight(numericValue);
      setSaveStatus('idle');
    }
  }, []);

  // SOLO NÚMEROS ENTEROS PARA REPS
  const handleRepsChange = useCallback((text: string) => {
    const numericValue = text.replace(/[^0-9]/g, '');
    if (numericValue.length <= 3) {
      setReps(numericValue);
      setSaveStatus('idle');
    }
  }, []);

  // SOLO NÚMEROS ENTEROS PARA RPE (0 a 10)
  const handleRPEChange = useCallback((text: string) => {
    const numericValue = text.replace(/[^0-9]/g, '');
    if (numericValue === '') {
      setRpe('');
      setSaveStatus('idle');
      return;
    }
    const value = parseInt(numericValue, 10);
    if (!isNaN(value) && value >= 0 && value <= 10) {
      setRpe(numericValue);
      setSaveStatus('idle');
    }
  }, []);

  // Memoized calculation function
  const calculateOneRM = useCallback((w: number, r: number) => {
    if (r === 1) return w;
    const oneRMs = selectedFormulas.map(formulaId =>
      formulas[formulaId].calculate(w, r)
    );
    return oneRMs.reduce((a, b) => a + b, 0) / oneRMs.length;
  }, [selectedFormulas]);

  // Memoized RM values calculation
  const rmValues = useMemo(() => {
    if (!weight || !reps) {
      return Array.from({ length: 20 }, () => null);
    }
    const w = parseFloat(weight);
    const r = parseInt(reps);
    if (isNaN(w) || isNaN(r) || w <= 0 || r <= 0) {
      return Array.from({ length: 20 }, () => null);
    }
    const oneRMs = selectedFormulas.map(formulaId =>
      formulas[formulaId].calculate(w, r)
    );
    const estimated1RM = oneRMs.reduce((a, b) => a + b, 0) / oneRMs.length;
    const dropFactor = 0.025;
    return Array.from({ length: 20 }, (_, i) => {
      const n = i + 1;
      if (n < r) {
        return estimated1RM / (1 + 0.0333 * (n - 1));
      } else if (n === r) {
        return w;
      } else {
        const falloff = 1 - dropFactor * (n - r);
        return Math.max(0, w * falloff);
      }
    });
  }, [weight, reps, selectedFormulas]);

  // Memoized rows calculation
  const rows = useMemo(() => {
    const result = [];
    for (let i = 0; i < 20; i += 4) {
      result.push(rmValues.slice(i, i + 4));
    }
    return result;
  }, [rmValues]);

  const handleSavePress = useCallback(() => {
    if (!weight || !reps || rmValues.length === 0) return;
    setShowLiftModal(true);
    setSaveStatus('selecting');
  }, [weight, reps, rmValues.length]);

  const confirmSaveCalculation = useCallback(async (liftType: LiftType) => {
    try {
      setSaveStatus('saving');
      setSelectedLift(liftType);
      setShowLiftModal(false);

      const numericRpe = rpe && !isNaN(Number(rpe)) ? Number(rpe) : undefined;

      const newEntry = {
        date: new Date().toISOString(),
        weight: parseFloat(weight) || null,
        reps: parseFloat(reps) || null,
        oneRM: typeof rmValues[0] === 'number' && !isNaN(rmValues[0])
          ? rmValues[0]
          : (parseFloat(weight) || 0),
        rpe: numericRpe,
        liftType: liftType,
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      };

      const existingHistory = await AsyncStorage.getItem('calculationHistory');
      const history = existingHistory ? JSON.parse(existingHistory) : [];
      history.push(newEntry);
      await AsyncStorage.setItem('calculationHistory', JSON.stringify(history));

      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (error) {
      setSaveStatus('idle');
    }
  }, [weight, reps, rpe, rmValues]);

  const handleModalClose = useCallback(() => {
    setShowLiftModal(false);
    setSaveStatus('idle');
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#111111' }}>
      <ScrollView style={{ flex: 1, padding: 16 }} keyboardShouldPersistTaps="handled">
        <Text style={{
          fontSize: 28,
          fontWeight: '700',
          color: '#B8B8B8',
          marginBottom: 24,
          textAlign: 'center'
        }}>
          1RM Calculator
        </Text>
        <BlurView intensity={20} tint="dark" style={{
          borderRadius: 20,
          overflow: 'hidden',
          padding: 16,
          backgroundColor: 'rgba(20, 20, 20, 0.8)'
        }}>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <View style={{ flex: 2 }}>
              <Text style={{
                color: '#B8B8B8',
                fontSize: 14,
                fontWeight: '600',
                marginBottom: 8
              }}>Weight (kg)</Text>
              <View style={{
                backgroundColor: '#1a1a1a',
                borderRadius: 12,
                borderWidth: 1,
                borderColor: '#525252'
              }}>
                <TextInput
                  style={{
                    color: '#B8B8B8',
                    padding: 12,
                    fontSize: 16,
                    textAlign: 'center',
                    minHeight: 44
                  }}
                  value={weight}
                  onChangeText={handleWeightChange}
                  keyboardType="number-pad"
                  maxLength={6}
                  placeholderTextColor="#666"
                  placeholder="Weight"
                  returnKeyType="next"
                  blurOnSubmit={false}
                />
              </View>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{
                color: '#B8B8B8',
                fontSize: 14,
                fontWeight: '600',
                marginBottom: 8
              }}>Reps</Text>
              <View style={{
                backgroundColor: '#1a1a1a',
                borderRadius: 12,
                borderWidth: 1,
                borderColor: '#525252'
              }}>
                <TextInput
                  style={{
                    color: '#B8B8B8',
                    padding: 12,
                    fontSize: 16,
                    textAlign: 'center',
                    minHeight: 44
                  }}
                  value={reps}
                  onChangeText={handleRepsChange}
                  keyboardType="number-pad"
                  maxLength={3}
                  placeholderTextColor="#666"
                  placeholder="Reps"
                  returnKeyType="next"
                  blurOnSubmit={false}
                />
              </View>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{
                color: '#B8B8B8',
                fontSize: 14,
                fontWeight: '600',
                marginBottom: 8
              }}>RPE</Text>
              <View style={{
                backgroundColor: '#1a1a1a',
                borderRadius: 12,
                borderWidth: 1,
                borderColor: '#525252'
              }}>
                <TextInput
                  style={{
                    color: '#B8B8B8',
                    padding: 12,
                    fontSize: 16,
                    textAlign: 'center',
                    minHeight: 44
                  }}
                  value={rpe}
                  onChangeText={handleRPEChange}
                  keyboardType="number-pad"
                  maxLength={2}
                  placeholderTextColor="#666"
                  placeholder="1-10"
                  returnKeyType="done"
                />
              </View>
            </View>
          </View>

          {rmValues.some(val => val !== null) && (
            <Pressable
              onPress={handleSavePress}
              style={{ marginTop: 24, height: 44, borderRadius: 22, overflow: 'hidden', alignSelf: 'center', width: '80%' }}>
              <LinearGradient
                colors={saveStatus === 'saved' ? ['#DBFF00', '#DBFF00'] : ['#1a1a1a', '#1a1a1a']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{ flex: 1, padding: 1 }}>
                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', backgroundColor: 'transparent', borderRadius: 21 }}>
                  <Text style={{
                    color: saveStatus === 'saved' ? '#111111' : '#B8B8B8',
                    fontSize: 15,
                    fontWeight: '600',
                    letterSpacing: 0.5,
                  }}>
                    {saveStatus === 'saving' ? 'Saving...' :
                      saveStatus === 'saved' ? 'Saved!' :
                        'Save Calculation'}
                  </Text>
                </View>
              </LinearGradient>
            </Pressable>
          )}
        </BlurView>

        <Text style={{
          fontSize: 20,
          fontWeight: '600',
          color: '#B8B8B8',
          marginTop: 24,
          marginBottom: 16,
        }}>Repetition Maximums</Text>
        <BlurView intensity={20} tint="dark" style={{
          borderRadius: 20,
          overflow: 'hidden',
          padding: 16,
          backgroundColor: 'rgba(20, 20, 20, 0.8)'
        }}>
          {rows.map((row, rowIndex) => (
            <View key={rowIndex} style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingVertical: 12,
              borderBottomWidth: rowIndex < rows.length - 1 ? 1 : 0,
              borderBottomColor: '#525252'
            }}>
              {row.map((value, colIndex) => {
                const rmNumber = rowIndex * 4 + colIndex + 1;
                const percentage = 100 - ((rmNumber - 1) * 2.5);
                return (
                  <GradientBox key={rowIndex * 4 + colIndex} color="#B8B8B8">
                    <Text style={{ color: '#DBFF00', fontSize: 12, fontWeight: '600', marginBottom: 2, textAlign: 'center' }}>
                      {rmNumber}RM
                    </Text>
                    <Text style={{ color: '#B8B8B8', fontSize: 16, fontWeight: '700', marginBottom: 2, textAlign: 'center' }}>
                      {value ? Math.round(value) : '--'}
                    </Text>
                    <Text style={{ color: '#525252', fontSize: 11, fontWeight: '500', textAlign: 'center' }}>
                      {value ? `${percentage}%` : '--%'}
                    </Text>
                  </GradientBox>
                );
              })}
            </View>
          ))}
        </BlurView>
      </ScrollView>

      <Modal
        visible={showLiftModal}
        transparent={true}
        animationType="fade"
        onRequestClose={handleModalClose}>
        <View style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          padding: 20
        }}>
          <BlurView intensity={20} tint="dark" style={{
            width: '80%',
            borderRadius: 20,
            padding: 20,
            backgroundColor: 'rgba(30, 30, 30, 0.9)'
          }}>
            <Text style={{
              fontSize: 18,
              fontWeight: '600',
              color: '#B8B8B8',
              marginBottom: 20,
              textAlign: 'center'
            }}>Select Lift Type</Text>

            {(['squat', 'bench', 'deadlift'] as LiftType[]).map((lift) => (
              <TouchableOpacity
                key={lift}
                style={{
                  padding: 15,
                  borderRadius: 12,
                  backgroundColor: '#1a1a1a',
                  marginBottom: 10,
                  borderWidth: 1,
                  borderColor: '#525252'
                }}
                onPress={() => confirmSaveCalculation(lift)}>
                <Text style={{
                  color: '#B8B8B8',
                  fontSize: 16,
                  fontWeight: '500',
                  textAlign: 'center'
                }}>
                  {lift.charAt(0).toUpperCase() + lift.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}

            <TouchableOpacity
              style={{
                marginTop: 10,
                padding: 15,
                borderRadius: 12
              }}
              onPress={handleModalClose}>
              <Text style={{
                color: '#DBFF00',
                fontSize: 16,
                fontWeight: '500',
                textAlign: 'center'
              }}>Cancel</Text>
            </TouchableOpacity>
          </BlurView>
        </View>
      </Modal>
    </SafeAreaView>
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
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#B8B8B8',
    marginTop: 24,
    marginBottom: 16,
  },
  card: {
    borderRadius: 20,
    overflow: 'hidden',
    padding: 16,
    backgroundColor: 'rgba(20, 20, 20, 0.8)',
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
    padding: 12,
    fontSize: 16,
    textAlign: 'center',
    minHeight: 44,
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