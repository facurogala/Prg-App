import { useState, useCallback, useMemo } from 'react';
import { StyleSheet, Text, View, ScrollView, Pressable, Dimensions, Modal } from 'react-native';
import { BlurView } from 'expo-blur';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { VictoryChart, VictoryLine, VictoryAxis, VictoryArea, VictoryClipContainer } from 'victory-native';
import { Trash2, Filter } from 'lucide-react-native';
import { useFocusEffect } from '@react-navigation/native';
import type { LiftType } from './index';
import Svg, { Defs, LinearGradient, Stop } from 'react-native-svg';
import SwipeableHistoryItem from '../../components/SwipeableHistoryItem';

type HistoryEntry = {
  date: string;
  weight: number;
  reps: number;
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

export default function History() {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [selectedLift, setSelectedLift] = useState<LiftType>('squat');
  const [filter, setFilter] = useState<'date' | 'highest' | 'lowest'>('date');
  const [isFilterVisible, setIsFilterVisible] = useState(false);

  const loadHistory = useCallback(async () => {
    try {
      const savedHistory = await AsyncStorage.getItem('calculationHistory');
      if (savedHistory) {
        const parsedHistory = JSON.parse(savedHistory);
        const validatedHistory = parsedHistory.map((entry: HistoryEntry) => ({
          ...entry,
          id: entry.id || Date.now().toString() + Math.random().toString(36).substr(2, 9),
          date: new Date(entry.date).toString() === 'Invalid Date' ? new Date().toISOString() : entry.date,
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

  const clearHistory = async () => {
    try {
      await AsyncStorage.removeItem('calculationHistory');
      setHistory([]);
    } catch (error) {
      console.error('Error clearing history:', error);
    }
  };

  const deleteHistoryItem = async (itemId: string) => {
    try {
      const newHistory = history.filter(item => item.id !== itemId);
      await AsyncStorage.setItem('calculationHistory', JSON.stringify(newHistory));
      setHistory(newHistory);
    } catch (error) {
      console.error('Error deleting history item:', error);
    }
  };

  const undoDelete = async (item: HistoryEntry) => {
    try {
      const newHistory = [...history, item];
      await AsyncStorage.setItem('calculationHistory', JSON.stringify(newHistory));
      setHistory(newHistory);
    } catch (error) {
      console.error('Error restoring history item:', error);
    }
  };

  const filteredHistory = history.filter(entry => entry.liftType === selectedLift);

  const sortedList = useMemo(() => {
    let sorted = [...filteredHistory];
    if (filter === 'date') {
      sorted.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    } else if (filter === 'highest') {
      sorted.sort((a, b) => b.oneRM - a.oneRM);
    } else if (filter === 'lowest') {
      sorted.sort((a, b) => a.oneRM - b.oneRM);
    }
    return sorted;
  }, [filteredHistory, filter]);

  const chartData = filteredHistory.map((entry, index) => ({
    x: index + 1,
    y: entry.oneRM,
    date: entry.date,
  }));

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
                  >
                    <Svg style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
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
                    </Svg>
                    <VictoryAxis
                      tickFormat={(x) => {
                        const entry = filteredHistory[x - 1];
                        if (!entry || new Date(entry.date).toString() === 'Invalid Date') {
                          return '';
                        }
                        return new Date(entry.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
                      }}
                      style={{
                        axis: { stroke: '#525252' },
                        tickLabels: { 
                          fill: '#525252', 
                          fontSize: 10,
                          angle: -45,
                          textAnchor: 'end'
                        }
                      }}
                    />
                    <VictoryAxis
                      dependentAxis
                      tickFormat={(y) => `${Math.round(y)}kg`}
                      style={{
                        axis: { stroke: '#525252' },
                        tickLabels: { fill: '#525252', fontSize: 10 }
                      }}
                    />
                    <VictoryArea
                      data={chartData}
                      interpolation="monotoneX"
                      style={{
                        data: {
                          fill: "url(#chartGradient)",
                        }
                      }}
                      groupComponent={<VictoryClipContainer clipPadding={{ top: 5, right: 5 }}/>}
                    />
                    <VictoryLine
                      data={chartData}
                      interpolation="monotoneX"
                      style={{
                        data: {
                          stroke: LIFT_COLORS[selectedLift],
                          strokeWidth: 3
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
                <Pressable onPress={() => setIsFilterVisible(true)} style={styles.iconButton}>
                  <Filter size={20} color="#B8B8B8" />
                </Pressable>
                <Pressable onPress={clearHistory} style={styles.iconButton}>
                  <Trash2 size={20} color="#B8B8B8" />
                </Pressable>
              </View>
            </View>

            <BlurView intensity={20} tint="dark" style={styles.card}>
              <View style={styles.historyList}>
                {sortedList.map((entry) => (
                  <SwipeableHistoryItem
                    key={entry.id}
                    date={entry.date}
                    weight={entry.weight}
                    reps={entry.reps}
                    oneRM={entry.oneRM}
                    rpe={entry.rpe}
                    onDelete={() => deleteHistoryItem(entry.id!)}
                    onUndoDelete={() => undoDelete(entry)}
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
          <BlurView intensity={20} tint="dark" style={styles.popupContainer}>
            <Pressable
              style={[
                styles.filterButton,
                filter === 'date' && styles.filterButtonSelected,
              ]}
              onPress={() => {
                setFilter('date');
                setIsFilterVisible(false);
              }}>
              <Text
                style={[
                  styles.filterButtonText,
                  filter === 'date' && styles.filterButtonTextSelected,
                ]}>
                Date
              </Text>
            </Pressable>
            <Pressable
              style={[
                styles.filterButton,
                filter === 'highest' && styles.filterButtonSelected,
              ]}
              onPress={() => {
                setFilter('highest');
                setIsFilterVisible(false);
              }}>
              <Text
                style={[
                  styles.filterButtonText,
                  filter === 'highest' && styles.filterButtonTextSelected,
                ]}>
                Highest
              </Text>
            </Pressable>
            <Pressable
              style={[
                styles.filterButton,
                filter === 'lowest' && styles.filterButtonSelected,
              ]}
              onPress={() => {
                setFilter('lowest');
                setIsFilterVisible(false);
              }}>
              <Text
                style={[
                  styles.filterButtonText,
                  filter === 'lowest' && styles.filterButtonTextSelected,
                ]}>
                Lowest
              </Text>
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
    alignItems: 'center',
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
    alignItems: 'center',
    marginVertical: 16,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
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
  popupContainer: {
    borderRadius: 20,
    padding: 16,
    width: '80%',
    backgroundColor: 'rgba(20, 20, 20, 0.8)',
    borderWidth: 1,
    borderColor: '#525252',
  },
  filterButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: '#1a1a1a',
    alignItems: 'center',
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#525252',
  },
  filterButtonSelected: {
    backgroundColor: '#525252',
    borderColor: '#B8B8B8',
  },
  filterButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#B8B8B8',
  },
  filterButtonTextSelected: {
    color: '#B8B8B8',
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
  },
  historyList: {
    gap: 8,
  },
  emptyCard: {
    borderRadius: 20,
    overflow: 'hidden',
    padding: 32,
    backgroundColor: 'rgba(20, 20, 20, 0.8)',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#525252',
  },
  emptyText: {
    color: '#525252',
    fontSize: 16,
  },
});