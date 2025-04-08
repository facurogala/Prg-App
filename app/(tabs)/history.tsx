import React, { useCallback, useMemo, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, Pressable, Dimensions, Modal, Animated, TextInput, Alert } from 'react-native';
import { BlurView } from 'expo-blur';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { VictoryChart, VictoryLine, VictoryAxis, VictoryArea, VictoryClipContainer, VictoryScatter } from 'victory-native';
import { Filter, Trash2 } from 'lucide-react-native';
import { useFocusEffect } from '@react-navigation/native';
import type { LiftType } from './index';
import Svg, { Defs, LinearGradient, Stop } from 'react-native-svg';
import { LinearGradient as BorderGradient } from 'expo-linear-gradient';

// Extend Date with getWeek function
declare global {
  interface Date {
    getWeek(): number;
  }
}

Date.prototype.getWeek = function() {
  const date = new Date(this);
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
  const week1 = new Date(date.getFullYear(), 0, 4);
  return 1 + Math.round(((date - week1) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7);
};

type HistoryEntry = {
  date: string;
  weight: number | null;
  reps: number | null;
  oneRM: number;
  rpe?: number;
  liftType: LiftType;
  id?: string;
};

const screenWidth = Dimensions.get('window').width;
const LIFT_COLORS = {
  squat: '#98FB98',
  bench: '#87CEEB',
  deadlift: '#FF6347',
} as const;

// Group entries within thresholdHours of each other
const groupCloseEntries = (data: {date: string, y: number}[], thresholdHours = 1) => {
  return data.reduce((acc: {date: string, y: number, x: Date}[], entry) => {
    const lastGroup = acc[acc.length - 1];
    const entryDate = new Date(entry.date);

    if (lastGroup &&
        (entryDate.getTime() - new Date(lastGroup.date).getTime()) / (1000 * 60 * 60) < thresholdHours) {
      // Keep only the max value for the session
      lastGroup.y = Math.max(lastGroup.y, entry.y);
      lastGroup.date = entry.date;
    } else {
      acc.push({
        ...entry,
        x: entryDate
      });
    }
    return acc;
  }, []);
};

// Format X-axis labels
const formatTick = (date: Date, index: number, data: any[]) => {
  return date.toLocaleDateString([], { day: 'numeric', month: 'short' });
};

function HistoryItem({
  date,
  weight,
  reps,
  oneRM,
  rpe,
  onLongPress
}: {
  date: string;
  weight: number | null;
  reps: number | null;
  oneRM: number;
  rpe?: number;
  onLongPress: () => void;
}) {
  const scaleValue = new Animated.Value(1);

  const handlePressIn = () => {
    Animated.spring(scaleValue, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleValue, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  const animatedStyle = {
    transform: [{ scale: scaleValue }],
  };

  const showRPE = rpe !== undefined && rpe !== null && !isNaN(rpe);

  return (
    <Pressable
      onLongPress={onLongPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      delayLongPress={500}
    >
      <Animated.View style={[animatedStyle]}>
        <View style={styles.itemWrapper}>
          <BorderGradient
            colors={['#52525250', '#52525210']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradientBorder}
          >
            <View style={styles.item}>
              <View style={styles.leftContent}>
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
                  {showRPE && <Text style={styles.rpe}> @RPE {rpe}</Text>}
                </Text>
              </View>
              <View style={styles.rightContent}>
                <Text style={styles.oneRMLabel}>1RM</Text>
                <Text style={styles.oneRM}>{Math.round(oneRM)}kg</Text>
              </View>
            </View>
          </BorderGradient>
        </View>
      </Animated.View>
    </Pressable>
  );
}

export default function History() {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [selectedLift, setSelectedLift] = useState<LiftType>('squat');
  const [filter, setFilter] = useState<'newest' | 'oldest' | 'heaviest' | 'lightest'>('newest');
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<HistoryEntry | null>(null);

  const loadHistory = useCallback(async () => {
    try {
      const savedHistory = await AsyncStorage.getItem('calculationHistory');
      if (savedHistory) {
        const parsedHistory = JSON.parse(savedHistory);
        const validatedHistory = parsedHistory.map((entry: HistoryEntry) => ({
          ...entry,
          id: entry.id || Date.now().toString() + Math.random().toString(36).substr(2, 9),
          date: new Date(entry.date).toString() === 'Invalid Date' ? new Date().toISOString() : entry.date,
          weight: entry.weight === undefined ? null : entry.weight,
          reps: entry.reps === undefined ? null : entry.reps,
        }));
        setHistory(validatedHistory);
      }
    } catch (error) {
      console.error('Error loading history:', error);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadHistory();
    }, [loadHistory])
  );

  const calculateOneRM = (weight: number | null, reps: number | null, rpe?: number) => {
    const w = weight === null ? 0 : weight;
    const r = reps === null ? 0 : reps;
    if (r === 1) return w;
    return w * (1 + r / 30);
  };

  const updateHistoryItem = async (updatedItem: HistoryEntry) => {
    if (!selectedItem) return;

    try {
      const newHistory = history.map(item =>
        item.id === selectedItem.id ? updatedItem : item
      );
      await AsyncStorage.setItem('calculationHistory', JSON.stringify(newHistory));
      setHistory(newHistory);
      console.log('History updated:', newHistory); // Log para verificar la actualización del historial
      setIsEditModalVisible(false);
      // Record updated successfully
    } catch (error) {
      console.error('Error updating item:', error);
      Alert.alert("Error", "Failed to update record");
    }
  };

  const deleteItem = async () => {
    if (!selectedItem) return;

    try {
      const newHistory = history.filter(item => item.id !== selectedItem.id);
      await AsyncStorage.setItem('calculationHistory', JSON.stringify(newHistory));
      setHistory(newHistory);
      setIsDeleteModalVisible(false);
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const handleLongPress = (item: HistoryEntry) => {
    setSelectedItem(item);
    setIsEditModalVisible(true);
  };

  const filteredHistory = useMemo(() => {
    console.log('filteredHistory called with selectedLift:', selectedLift); // Log para verificar el filtrado
    return history.filter(entry => entry.liftType === selectedLift);
  }, [history, selectedLift]);

  const sortedList = useMemo(() => {
    let sorted = [...filteredHistory];
    if (filter === 'newest') {
      sorted.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    } else if (filter === 'oldest') {
      sorted.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    } else if (filter === 'heaviest') {
      sorted.sort((a, b) => b.oneRM - a.oneRM);
    } else if (filter === 'lightest') {
      sorted.sort((a, b) => a.oneRM - b.oneRM);
    }
    return sorted;
  }, [filteredHistory, filter]);

  const chartData = useMemo(() => {
    console.log('chartData useMemo called with history:', history, 'and selectedLift:', selectedLift);
    const filtered = history.filter(entry => entry.liftType === selectedLift);
    const rawData = filtered.map(entry => ({
        date: entry.date,
        y: entry.oneRM,
        x: new Date(entry.date)
    }));

    const sortedData = rawData.sort((a, b) => a.x.getTime() - b.x.getTime());
    console.log('chartData:', sortedData);
    return sortedData;
}, [history, selectedLift]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Text style={styles.title}>History</Text>

        {history.length > 0 ? (
          <>
            <BlurView intensity={20} tint="dark" style={styles.card}>
              <View style={styles.liftSelector}>
                {(['squat', 'bench', 'deadlift'] as const).map((lift) => (
                  <Pressable
                    key={lift}
                    style={[
                      styles.liftButton,
                      selectedLift === lift && styles.liftButtonSelected,
                    ]}
                    onPress={() => setSelectedLift(lift)}>
                    <Text
                      style={[
                        styles.liftButtonText,
                        selectedLift === lift && styles.liftButtonTextSelected,
                      ]}>
                      {lift.charAt(0).toUpperCase() + lift.slice(1)}
                    </Text>
                  </Pressable>
                ))}
              </View>

              <Text style={styles.subtitle}>Progress Chart</Text>

              {filteredHistory.length > 0 ? (
                <View style={styles.chartContainer}>
        <VictoryChart
    height={220}
    width={screenWidth - 64}
    padding={{ top: 20, bottom: 40, left: 50, right: 30 }}
    domainPadding={{ x: [20, 20], y: [20, 20] }}
    scale={{ x: "time", y: "linear" }}
    domain={{ y: [Math.min(...chartData.map(d => d.y)), Math.max(...chartData.map(d => d.y))] }} // Configurar el dominio del eje Y
>
                    <Defs>
                      <LinearGradient
                        id="chartGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <Stop
                          offset="0%"
                          stopColor={LIFT_COLORS[selectedLift]}
                          stopOpacity="0.3"
                        />
                        <Stop
                          offset="100%"
                          stopColor={LIFT_COLORS[selectedLift]}
                          stopOpacity="0.05"
                        />
                      </LinearGradient>
                    </Defs>

                    <VictoryAxis
                      scale="time"
                      tickFormat={(x) => formatTick(x, 0, chartData)}
                      style={{
                        axis: { stroke: '#525252' },
                        tickLabels: {
                          fill: '#B8B8B8',
                          fontSize: 10,
                          angle: -45,
                          textAnchor: 'end',
                          padding: 5
                        }
                      }}
                    />
                    <VictoryAxis
                      dependentAxis
                      tickFormat={(y) => `${Math.round(y)}kg`}
                      style={{
                        axis: { stroke: '#525252' },
                        tickLabels: {
                          fill: '#B8B8B8',
                          fontSize: 10,
                          padding: 5
                        }
                      }}
                    />
                    <VictoryArea
                      data={chartData}
                      interpolation="linear"
                      style={{
                        data: {
                          fill: "url(#chartGradient)",
                          stroke: "transparent"
                        }
                      }}
                      groupComponent={<VictoryClipContainer clipPadding={{ top: 5, right: 5 }} />}
                    />
                    <VictoryLine
                      data={chartData}
                      interpolation="linear"
                      style={{
                        data: {
                          stroke: LIFT_COLORS[selectedLift],
                          strokeWidth: 3,
                          strokeLinecap: "round"
                        }
                      }}
                    />
                  </VictoryChart>
                </View>
              ) : (
                <Text style={styles.noDataText}>No data for {selectedLift}</Text>
              )}
            </BlurView>

            <View style={styles.filterHeader}>
              <Text style={styles.sectionTitle}>Recent Calculations</Text>
              <View style={styles.headerActions}>
                <Pressable
                  onPress={() => setIsFilterVisible(true)}
                  style={styles.iconButton}
                >
                  <Filter size={20} color="#B8B8B8" />
                </Pressable>
              </View>
            </View>

            <BlurView intensity={20} tint="dark" style={styles.card}>
              <View style={styles.historyList}>
                {sortedList.map((entry) => (
                  <HistoryItem
                    key={entry.id}
                    date={entry.date}
                    weight={entry.weight}
                    reps={entry.reps}
                    oneRM={entry.oneRM}
                    rpe={entry.rpe}
                    onLongPress={() => handleLongPress(entry)}
                  />
                ))}
              </View>
            </BlurView>
          </>
        ) : (
          <BlurView intensity={20} tint="dark" style={styles.emptyCard}>
            <Text style={styles.emptyText}>No calculations yet</Text>
          </BlurView>
        )}
      </ScrollView>

      {/* Edit Modal */}
      <Modal
        transparent={true}
        visible={isEditModalVisible}
        animationType="fade"
        onRequestClose={() => setIsEditModalVisible(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setIsEditModalVisible(false)}
        >
          <BlurView intensity={20} tint="dark" style={styles.editModalContainer}>
            {selectedItem && (
              <>
                <Text style={styles.editModalTitle}>Edit Record</Text>

                <View style={styles.editInputContainer}>
                  <Text style={styles.editLabel}>Weight (kg)</Text>
                  <TextInput
                    style={styles.editInput}
                    keyboardType="numeric"
                    value={selectedItem.weight === null ? '' : String(selectedItem.weight)}
                    onChangeText={(text) => {
                      if (text === '') {
                        setSelectedItem({
                          ...selectedItem,
                          weight: null,
                          oneRM: calculateOneRM(null, selectedItem.reps, selectedItem.rpe)
                        });
                        return;
                      }
                      const num = parseFloat(text);
                      if (!isNaN(num) && num >= 0) {
                        setSelectedItem({
                          ...selectedItem,
                          weight: num,
                          oneRM: calculateOneRM(num, selectedItem.reps, selectedItem.rpe)
                        });
                      }
                    }}
                  />
                </View>

                <View style={styles.editInputContainer}>
                  <Text style={styles.editLabel}>Reps</Text>
                  <TextInput
                    style={styles.editInput}
                    keyboardType="numeric"
                    value={selectedItem.reps === null ? '' : String(selectedItem.reps)}
                    onChangeText={(text) => {
                      if (text === '') {
                        setSelectedItem({
                          ...selectedItem,
                          reps: null,
                          oneRM: calculateOneRM(selectedItem.weight, null, selectedItem.rpe)
                        });
                        return;
                      }
                      const num = parseInt(text);
                      if (!isNaN(num) && num >= 0) {
                        setSelectedItem({
                          ...selectedItem,
                          reps: num,
                          oneRM: calculateOneRM(selectedItem.weight, num, selectedItem.rpe)
                        });
                      }
                    }}
                  />
                </View>

                <View style={styles.editInputContainer}>
                  <Text style={styles.editLabel}>RPE (optional)</Text>
                  <TextInput
                    style={styles.editInput}
                    keyboardType="numeric"
                    placeholder="8.5"
                    value={selectedItem.rpe ? String(selectedItem.rpe) : ''}
                    onChangeText={(text) => {
                      if (text === '') {
                        setSelectedItem({
                          ...selectedItem,
                          rpe: undefined,
                          oneRM: calculateOneRM(selectedItem.weight, selectedItem.reps)
                        });
                        return;
                      }

                      const num = parseFloat(text);
                      if (!isNaN(num) && num >= 0 && num <= 10) {
                        setSelectedItem({
                          ...selectedItem,
                          rpe: num,
                          oneRM: calculateOneRM(selectedItem.weight, selectedItem.reps, num)
                        });
                      }
                    }}
                  />
                </View>

                <View style={styles.editModalButtons}>
                  <Pressable
                    style={[styles.editModalButton, styles.editModalDeleteButton]}
                    onPress={() => {
                      setIsEditModalVisible(false);
                      setIsDeleteModalVisible(true);
                    }}
                  >
                    <Trash2 size={16} color="#fff" style={styles.deleteIcon} />
                    <Text style={styles.editModalButtonText}>Delete</Text>
                  </Pressable>

                  <Pressable
                    style={[styles.editModalButton, styles.editModalSaveButton]}
                    onPress={() => updateHistoryItem(selectedItem)}
                  >
                    <Text style={styles.editModalButtonText}>Save Changes</Text>
                  </Pressable>
                </View>
              </>
            )}
          </BlurView>
        </Pressable>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
  transparent={true}
  visible={isDeleteModalVisible}
  animationType="fade"
  onRequestClose={() => setIsDeleteModalVisible(false)}
>
  <Pressable
    style={styles.modalOverlay}
    onPress={() => setIsDeleteModalVisible(false)}
  >
    <BlurView intensity={20} tint="dark" style={styles.deleteModalContainer}>
      <Text style={styles.deleteModalTitle}>Delete Record</Text>
      <Text style={styles.deleteModalText}>
        Are you sure you want to delete this record? This action cannot be undone.
      </Text>

      <View style={styles.deleteModalButtons}>
        <Pressable
          style={[styles.deleteModalButton, styles.deleteModalCancelButton]}
          onPress={() => setIsDeleteModalVisible(false)}
        >
          <Text style={styles.deleteModalButtonText}>Cancel</Text>
        </Pressable>

        <Pressable
          style={[styles.deleteModalButton, styles.deleteModalConfirmButton]}
          onPress={deleteItem}
        >
          <Trash2 size={16} color="#fff" style={styles.deleteIcon} />
          <Text style={styles.deleteModalButtonText}>Delete</Text>
        </Pressable>
      </View>
    </BlurView>
  </Pressable>
</Modal>

{/* Filter Modal (keep this one separate) */}
<Modal
  transparent={true}
  visible={isFilterVisible}
  animationType="fade"
  onRequestClose={() => setIsFilterVisible(false)}
>
  <Pressable
    style={styles.modalOverlay}
    onPress={() => setIsFilterVisible(false)}
  >
    <BlurView intensity={20} tint="dark" style={styles.filterModalContainer}>
      <Pressable style={styles.filterOption} onPress={() => { setFilter('newest'); setIsFilterVisible(false); }}>
        <Text style={styles.filterOptionText}>Most recent first</Text>
        {filter === 'newest' && <View style={styles.filterSelectedIndicator} />}
      </Pressable>
      <Pressable style={styles.filterOption} onPress={() => { setFilter('oldest'); setIsFilterVisible(false); }}>
        <Text style={styles.filterOptionText}>Oldest first</Text>
        {filter === 'oldest' && <View style={styles.filterSelectedIndicator} />}
      </Pressable>
      <Pressable style={styles.filterOption} onPress={() => { setFilter('heaviest'); setIsFilterVisible(false); }}>
        <Text style={styles.filterOptionText}>Heaviest first</Text>
        {filter === 'heaviest' && <View style={styles.filterSelectedIndicator} />}
      </Pressable>
      <Pressable style={styles.filterOption} onPress={() => { setFilter('lightest'); setIsFilterVisible(false); }}>
        <Text style={styles.filterOptionText}>Lightest first</Text>
        {filter === 'lightest' && <View style={styles.filterSelectedIndicator} />}
      </Pressable>
    </BlurView>
  </Pressable>
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
  card: {
    borderRadius: 20,
    overflow: 'hidden',
    padding: 16,
    backgroundColor: 'rgba(20, 20, 20, 0.8)',
  },
  chartContainer: {
    backgroundColor: 'rgba(26, 26, 26, 0.5)',
    borderRadius: 12,
    padding: 8,
    marginVertical: 8,
  },
  liftSelector: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  liftButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: '#1a1a1a',
    textAlign: 'center',
    borderWidth: 1,
    borderColor: '#525252',
  },
  liftButtonSelected: {
    backgroundColor: '#525252',
    borderColor: '#B8B8B8',
  },
  liftButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#B8B8B8',
  },
  liftButtonTextSelected: {
    color: '#B8B8B8',
  },
  filterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    textAlign: 'center',
    marginVertical: 16,
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1a1a1a',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#525252',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  editModalContainer: {
    borderRadius: 20,
    padding: 24,
    width: '90%',
    backgroundColor: 'rgba(20, 20, 20, 0.9)',
    borderWidth: 1,
    borderColor: '#525252',
  },
  editModalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#B8B8B8',
    marginBottom: 16,
    textAlign: 'center',
  },
  editInputContainer: {
    marginBottom: 16,
  },
  editLabel: {
    color: '#B8B8B8',
    marginBottom: 8,
    fontSize: 14,
  },
  editInput: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 12,
    color: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#525252',
  },
  editModalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    gap: 16,
  },
  editModalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  editModalSaveButton: {
    backgroundColor: '#4CAF50',
  },
  editModalDeleteButton: {
    backgroundColor: '#FF4444',
  },
  editModalButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  deleteModalContainer: {
    borderRadius: 20,
    padding: 24,
    width: '80%',
    backgroundColor: 'rgba(20, 20, 20, 0.9)',
    borderWidth: 1,
    borderColor: '#FF4444',
    alignItems: 'center',
  },
  deleteModalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FF4444',
    marginBottom: 8,
  },
  deleteModalText: {
    fontSize: 16,
    color: '#B8B8B8',
    textAlign: 'center',
    marginBottom: 24,
  },
  deleteModalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    gap: 16,
  },
  deleteModalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  deleteModalCancelButton: {
    backgroundColor: '#525252',
  },
  deleteModalConfirmButton: {
    backgroundColor: '#FF4444',
  },
  deleteModalButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  deleteIcon: {
    marginRight: 8,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#B8B8B8',
    marginBottom: 16,
  },
  noDataText: {
    color: '#525252',
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 40,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#B8B8B8',
    flex: 1,
  },
  historyList: {
    gap: 8,
  },
  emptyCard: {
    borderRadius: 20,
    overflow: 'hidden',
    padding: 32,
    backgroundColor: 'rgba(20, 20, 20, 0.8)',
    textAlign: 'center',
    borderWidth: 1,
    borderColor: '#525252',
  },
  emptyText: {
    color: '#525252',
    fontSize: 16,
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
  leftContent: {
    flex: 1,
  },
  rightContent: {
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 16,
    minWidth: 70,
  },
  date: {
    fontSize: 14,
    marginBottom: 4,
    color: '#B8B8B8',
  },
  details: {
    color: '#B8B8B8',
    fontSize: 16,
  },
  rpe: {
    color: '#DBFF00',
    fontSize: 16,
  },
  oneRM: {
    fontSize: 18,
    fontWeight: '600',
    color: '#B8B8B8',
    textAlign: 'center',
  },
  oneRMLabel: {
    fontSize: 14,
    color: '#525252',
    fontWeight: 'normal',
    textAlign: 'center',
    marginBottom: 2,
  },
  filterModalContainer: {
    borderRadius: 20,
    padding: 16,
    width: '80%',
    backgroundColor: 'rgba(20, 20, 20, 0.9)',
    borderWidth: 1,
    borderColor: '#525252',
  },
  filterOption: {
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#525252',
  },
  filterOptionText: {
    fontSize: 16,
    color: '#B8B8B8',
  },
  filterSelectedIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4CAF50',
  },
});
