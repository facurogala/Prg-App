import React, { useCallback, useMemo, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, Pressable, Dimensions, Modal, Animated, TextInput, Alert, TouchableOpacity } from 'react-native';
import { BlurView } from 'expo-blur';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { VictoryChart, VictoryLine, VictoryAxis, VictoryArea, VictoryClipContainer } from 'victory-native';
import { Filter, Trash2, Calendar, Clock, ChevronLeft, ChevronRight, Check } from 'lucide-react-native';
import { useFocusEffect } from '@react-navigation/native';
import type { LiftType } from './index';
import Svg, { Defs, LinearGradient, Stop } from 'react-native-svg';
import { LinearGradient as ExpoLinearGradient } from 'expo-linear-gradient';

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

const formatTick = (date: Date) => {
  return date.toLocaleDateString([], { day: 'numeric', month: 'short' });
};

function CustomDatePicker({
  visible,
  onClose,
  selectedDate,
  onDateChange
}: {
  visible: boolean;
  onClose: () => void;
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}) {
  const [currentDate, setCurrentDate] = useState(new Date(selectedDate));
  const [currentMonth, setCurrentMonth] = useState(selectedDate.getMonth());
  const [currentYear, setCurrentYear] = useState(selectedDate.getFullYear());

  React.useEffect(() => {
    setCurrentDate(new Date(selectedDate));
    setCurrentMonth(selectedDate.getMonth());
    setCurrentYear(selectedDate.getFullYear());
  }, [selectedDate]);

  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month: number, year: number) => {
    return new Date(year, month, 1).getDay();
  };

  const goToPreviousMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const goToNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const handleDayPress = (day: number) => {
    const newDate = new Date(currentYear, currentMonth, day);
    newDate.setHours(currentDate.getHours());
    newDate.setMinutes(currentDate.getMinutes());
    setCurrentDate(newDate);
  };

  const confirmSelection = () => {
    onDateChange(currentDate);
    onClose();
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentMonth, currentYear);
    const firstDayOfMonth = getFirstDayOfMonth(currentMonth, currentYear);
    
    const days = [];
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<View key={`empty-${i}`} style={styles.calendarDay} />);
    }
    
    for (let i = 1; i <= daysInMonth; i++) {
      const isSelected = i === currentDate.getDate() && 
        currentMonth === currentDate.getMonth() && 
        currentYear === currentDate.getFullYear();
      
      days.push(
        <TouchableOpacity 
          key={`day-${i}`} 
          style={[styles.calendarDay, isSelected && styles.selectedCalendarDay]}
          onPress={() => handleDayPress(i)}
        >
          <Text style={[styles.calendarDayText, isSelected && styles.selectedCalendarDayText]}>{i}</Text>
        </TouchableOpacity>
      );
    }
    
    return days;
  };

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  if (!visible) return null;

  return (
    <Modal transparent={true} visible={visible} animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.modalOverlay} onPress={onClose}>
        <Pressable>
          <BlurView intensity={20} tint="dark" style={styles.customPickerContainer}>
            <View style={styles.pickerHeader}>
              <Text style={styles.pickerTitle}>Select Date</Text>
            </View>
            
            <View style={styles.calendarHeader}>
              <TouchableOpacity onPress={goToPreviousMonth} style={styles.calendarNavButton}>
                <ChevronLeft size={24} color="#B8B8B8" />
              </TouchableOpacity>
              
              <Text style={styles.calendarMonthYear}>
                {monthNames[currentMonth]} {currentYear}
              </Text>
              
              <TouchableOpacity onPress={goToNextMonth} style={styles.calendarNavButton}>
                <ChevronRight size={24} color="#B8B8B8" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.calendarDaysOfWeek}>
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <Text key={day} style={styles.calendarDayOfWeekText}>{day}</Text>
              ))}
            </View>
            
            <View style={styles.calendarGrid}>
              {renderCalendar()}
            </View>
            
            <View style={styles.pickerActions}>
              <TouchableOpacity style={styles.pickerCancelButton} onPress={onClose}>
                <Text style={styles.pickerButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.pickerConfirmButton} onPress={confirmSelection}>
                <Text style={styles.pickerButtonText}>Confirm</Text>
                <Check size={16} color="#FFFFFF" style={{ marginLeft: 4 }} />
              </TouchableOpacity>
            </View>
          </BlurView>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

function CustomTimePicker({
  visible,
  onClose,
  selectedDate,
  onTimeChange
}: {
  visible: boolean;
  onClose: () => void;
  selectedDate: Date;
  onTimeChange: (date: Date) => void;
}) {
  const [hours, setHours] = useState(selectedDate.getHours());
  const [minutes, setMinutes] = useState(selectedDate.getMinutes());
  
  React.useEffect(() => {
    setHours(selectedDate.getHours());
    setMinutes(selectedDate.getMinutes());
  }, [selectedDate]);

  const confirmSelection = () => {
    const newDate = new Date(selectedDate);
    newDate.setHours(hours);
    newDate.setMinutes(minutes);
    onTimeChange(newDate);
    onClose();
  };

  const renderHours = () => {
    const hourItems = [];
    for (let i = 0; i < 24; i++) {
      hourItems.push(
        <TouchableOpacity 
          key={`hour-${i}`} 
          style={[styles.timeItem, hours === i && styles.selectedTimeItem]}
          onPress={() => setHours(i)}
        >
          <Text style={[styles.timeItemText, hours === i && styles.selectedTimeItemText]}>
            {i.toString().padStart(2, '0')}
          </Text>
        </TouchableOpacity>
      );
    }
    return hourItems;
  };

  const renderMinutes = () => {
    const minuteItems = [];
    for (let i = 0; i < 60; i += 5) {
      minuteItems.push(
        <TouchableOpacity 
          key={`minute-${i}`} 
          style={[styles.timeItem, minutes === i && styles.selectedTimeItem]}
          onPress={() => setMinutes(i)}
        >
          <Text style={[styles.timeItemText, minutes === i && styles.selectedTimeItemText]}>
            {i.toString().padStart(2, '0')}
          </Text>
        </TouchableOpacity>
      );
    }
    return minuteItems;
  };

  if (!visible) return null;

  return (
    <Modal transparent={true} visible={visible} animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.modalOverlay} onPress={onClose}>
        <Pressable>
          <BlurView intensity={20} tint="dark" style={styles.customPickerContainer}>
            <View style={styles.pickerHeader}>
              <Text style={styles.pickerTitle}>Select Time</Text>
            </View>
            
            <View style={styles.timePickerContainer}>
              <View style={styles.timeColumn}>
                <Text style={styles.timeColumnHeader}>Hour</Text>
                <ScrollView style={styles.timeScroller}>
                  {renderHours()}
                </ScrollView>
              </View>
              
              <View style={styles.timeColumnSeparator}>
                <Text style={styles.timeColumnSeparatorText}>:</Text>
              </View>
              
              <View style={styles.timeColumn}>
                <Text style={styles.timeColumnHeader}>Minute</Text>
                <ScrollView style={styles.timeScroller}>
                  {renderMinutes()}
                </ScrollView>
              </View>
            </View>
            
            <View style={styles.timeDisplay}>
              <Text style={styles.timeDisplayText}>
                {hours.toString().padStart(2, '0')}:{minutes.toString().padStart(2, '0')}
              </Text>
            </View>
            
            <View style={styles.pickerActions}>
              <TouchableOpacity style={styles.pickerCancelButton} onPress={onClose}>
                <Text style={styles.pickerButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.pickerConfirmButton} onPress={confirmSelection}>
                <Text style={styles.pickerButtonText}>Confirm</Text>
                <Check size={16} color="#FFFFFF" style={{ marginLeft: 4 }} />
              </TouchableOpacity>
            </View>
          </BlurView>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

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

  // Log the props received by HistoryItem
  console.log('HistoryItem props:', { date, weight, reps, oneRM, rpe });

  const showRPE = rpe !== undefined && rpe !== null && !isNaN(rpe);

  return (
    <Pressable onLongPress={onLongPress} onPressIn={handlePressIn} onPressOut={handlePressOut} delayLongPress={500}>
      <Animated.View style={[animatedStyle]}>
        <View style={styles.itemWrapper}>
          <ExpoLinearGradient colors={['#52525250', '#52525210']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.gradientBorder}>
            <View style={styles.item}>
              <View style={styles.leftContent}>
                <Text style={styles.date}>
                  {/* Ensure date string is valid before converting */}
                  {new Date(date).toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </Text>
                <Text style={styles.details}>
                  {/* Handle null/undefined for weight and reps */}
                  {weight === null ? '--' : weight}kg × {reps === null ? '--' : reps} reps
                  {showRPE && <Text style={styles.rpe}> @RPE {rpe}</Text>}
                </Text>
              </View>
              <View style={styles.rightContent}>
                <Text style={styles.oneRMLabel}>1RM</Text>
                <Text style={styles.oneRM}>{Math.round(oneRM)}kg</Text>
              </View>
            </View>
          </ExpoLinearGradient>
        </View>
      </Animated.View>
    </Pressable>
  );
}

export default function History() {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [selectedLift, setSelectedLift] = useState<LiftType>('squat');
  const [filter, setFilter] = useState<'newest' | 'oldest' | 'heaviest' | 'lightest'>('newest');
  const [timeRange, setTimeRange] = useState<'all' | 'week' | 'month' | '6months' | 'year'>('all');
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<HistoryEntry | null>(null);
  const [showCustomDatePicker, setShowCustomDatePicker] = useState(false);
  const [showCustomTimePicker, setShowCustomTimePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const loadHistory = useCallback(async () => {
    console.log('Attempting to load history from AsyncStorage...');
    try {
      const savedHistory = await AsyncStorage.getItem('calculationHistory');
      console.log('Raw saved history:', savedHistory); // Log 1: What was retrieved from AsyncStorage

      if (savedHistory) {
        let parsedHistory: HistoryEntry[];
        try {
          parsedHistory = JSON.parse(savedHistory);
          console.log('Parsed history (before validation):', parsedHistory); // Log 2: What JSON.parse returns
        } catch (parseError) {
          console.error('Error parsing saved history JSON:', parseError); // Log if JSON is malformed
          Alert.alert("Error", "Failed to parse saved history data. It might be corrupted.");
          setHistory([]); // Clear history to prevent further errors
          return;
        }

        const validatedHistory = parsedHistory.map((entry: HistoryEntry) => {
          // Log each entry during validation
          console.log('Validating entry:', entry);
          return {
            ...entry,
            // Ensure ID exists for React keys
            id: entry.id || Date.now().toString() + Math.random().toString(36).substr(2, 9),
            // Validate date string
            date: new Date(entry.date).toString() === 'Invalid Date' ? new Date().toISOString() : entry.date,
            // Ensure weight/reps are numbers or null
            weight: entry.weight === undefined || entry.weight === null ? null : Number(entry.weight),
            reps: entry.reps === undefined || entry.reps === null ? null : Number(entry.reps),
            // Ensure oneRM is a number
            oneRM: typeof entry.oneRM === 'number' ? entry.oneRM : calculateOneRM(entry.weight, entry.reps, entry.rpe) // Recalculate if oneRM is missing/invalid
          };
        });
        console.log('Validated and set history:', validatedHistory); // Log 3: The final history array after validation
        setHistory(validatedHistory);
      } else {
        console.log('No history found in AsyncStorage.'); // Log if AsyncStorage is empty
        setHistory([]); // Ensure history is empty array if nothing found
      }
    } catch (error) {
      console.error('Error loading history (AsyncStorage retrieval error):', error);
      Alert.alert("Error", "Failed to load history data.");
      setHistory([]); // Clear history on error
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadHistory();
      // Reset selectedItem and modals when screen gains focus
      setSelectedItem(null);
      setIsEditModalVisible(false);
      setIsDeleteModalVisible(false);
    }, [loadHistory])
  );

  const calculateOneRM = (weight: number | null, reps: number | null, rpe?: number) => {
    const w = weight === null ? 0 : weight;
    const r = reps === null ? 0 : reps;
    if (r === 1) return w;
    // You might want to use the same formula as in your Calculator.tsx for consistency
    // For now, using the one provided here:
    return w * (1 + r / 30);
  };

  const filterAndGroupChartData = (data: {date: string, y: number, x: Date}[], range: string) => {
    const now = new Date();
    let filteredData = [...data];
    
    switch (range) {
      case 'week': {
        const weekAgo = new Date(now);
        weekAgo.setDate(weekAgo.getDate() - 7);
        filteredData = filteredData.filter(entry => {
          const entryDate = new Date(entry.date);
          return entryDate >= weekAgo;
        });
        break;
      }
      case 'month': {
        const monthAgo = new Date(now);
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        filteredData = filteredData.filter(entry => {
          const entryDate = new Date(entry.date);
          return entryDate >= monthAgo;
        });
        break;
      }
      case '6months': {
        const sixMonthsAgo = new Date(now);
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
        filteredData = filteredData.filter(entry => {
          const entryDate = new Date(entry.date);
          return entryDate >= sixMonthsAgo;
        });
        break;
      }
      case 'year': {
        const yearAgo = new Date(now);
        yearAgo.setFullYear(yearAgo.getFullYear() - 1);
        filteredData = filteredData.filter(entry => {
          const entryDate = new Date(entry.date);
          return entryDate >= yearAgo;
        });
        break;
      }
      case 'all':
      default:
        break;
    }
  
    const groupedByDate: Record<string, {date: string, y: number, x: Date}> = {};
    
    filteredData.forEach(entry => {
      const entryDate = new Date(entry.date);
      const dateKey = entryDate.toISOString().split('T')[0];
      
      if (!groupedByDate[dateKey] || entry.y > groupedByDate[dateKey].y) {
        groupedByDate[dateKey] = entry;
      }
    });
  
    // Log the data used for the chart after filtering and grouping
    console.log('Chart data (filtered and grouped):', Object.values(groupedByDate).sort((a, b) => a.x.getTime() - b.x.getTime()));
    return Object.values(groupedByDate).sort((a, b) => a.x.getTime() - b.x.getTime());
  };

  const filteredHistory = useMemo(() => {
    console.log('Filtering history for selectedLift:', selectedLift); // Log 4: What lift type is being filtered
    const filtered = history.filter(entry => entry.liftType === selectedLift);
    console.log('Filtered history results:', filtered); // Log 5: The results of the lift type filter
    return filtered;
  }, [history, selectedLift]);

  const sortedList = useMemo(() => {
    console.log('Sorting history by filter:', filter); // Log 6: What sort order is applied
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
    console.log('Sorted history results:', sorted); // Log 7: The final sorted list
    return sorted;
  }, [filteredHistory, filter]);

  const chartData = useMemo(() => {
    console.log('Generating chart data for selectedLift:', selectedLift, 'and timeRange:', timeRange);
    const rawData = history
      .filter(entry => entry.liftType === selectedLift)
      .map(entry => ({
        date: entry.date,
        y: entry.oneRM,
        x: new Date(entry.date)
      }));
    
    return filterAndGroupChartData(rawData, timeRange);
  }, [history, selectedLift, timeRange]);

  const updateHistoryItem = async (updatedItem: HistoryEntry) => {
    if (!selectedItem) return;

    try {
      const newHistory = history.map(item =>
        item.id === selectedItem.id ? updatedItem : item
      );
      await AsyncStorage.setItem('calculationHistory', JSON.stringify(newHistory));
      setHistory(newHistory);
      setIsEditModalVisible(false);
      console.log('History item updated successfully:', updatedItem); // Log after successful update
    } catch (error) {
      console.error('Error updating item:', error);
      Alert.alert("Error", "Failed to update record");
    }
  }

  // --- Additions for Edit/Delete Modals and Handlers ---
  const handleLongPressItem = (item: HistoryEntry) => {
    console.log('Long pressed item:', item);
    setSelectedItem(item);
    setSelectedDate(new Date(item.date)); // Set selectedDate for date/time pickers
    setIsEditModalVisible(true);
  };

  const handleDeleteItem = async () => {
    if (!selectedItem) return;

    Alert.alert(
      "Delete Entry",
      "Are you sure you want to delete this history entry?",
      [
        {
          text: "Cancel",
          style: "cancel",
          onPress: () => setIsDeleteModalVisible(false),
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const newHistory = history.filter(item => item.id !== selectedItem.id);
              await AsyncStorage.setItem('calculationHistory', JSON.stringify(newHistory));
              setHistory(newHistory);
              setIsDeleteModalVisible(false);
              setSelectedItem(null);
              console.log('History item deleted successfully:', selectedItem); // Log after successful delete
            } catch (error) {
              console.error('Error deleting item:', error);
              Alert.alert("Error", "Failed to delete record");
            }
          }
        }
      ]
    );
  };

  const handleEditModalSave = () => {
    if (selectedItem) {
      // Recalculate oneRM if weight or reps changed during edit
      const newOneRM = calculateOneRM(selectedItem.weight, selectedItem.reps, selectedItem.rpe);
      updateHistoryItem({ ...selectedItem, oneRM: newOneRM, date: selectedDate.toISOString() });
    }
  };

  // Log before the main component return to see current state
  console.log('History component rendering. Current history length:', history.length);
  console.log('Current selectedLift:', selectedLift);
  console.log('Current filter:', filter);
  console.log('Current timeRange:', timeRange);
  console.log('Is edit modal visible:', isEditModalVisible);
  console.log('Selected item for edit/delete:', selectedItem);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Text style={styles.title}>History</Text>

        {/* Lift Type Selector */}
        <BlurView intensity={20} tint="dark" style={styles.card}>
          <Text style={styles.sectionTitle}>Select Lift</Text>
          <View style={styles.liftSelector}>
            {Object.entries(LIFT_COLORS).map(([liftType, color]) => (
              <Pressable
                key={liftType}
                onPress={() => setSelectedLift(liftType as LiftType)}
                style={({ pressed }) => [
                  styles.liftButton,
                  selectedLift === liftType && styles.liftButtonSelected,
                  { borderColor: selectedLift === liftType ? color : '#525252' },
                  pressed && { opacity: 0.8 },
                ]}
              >
                <Text style={[styles.liftButtonText, { color: selectedLift === liftType ? color : '#B8B8B8' }]}>
                  {liftType.charAt(0).toUpperCase() + liftType.slice(1)}
                </Text>
              </Pressable>
            ))}
          </View>
        </BlurView>

        {/* Chart Section */}
        <Text style={styles.sectionTitle}>Progress Chart ({selectedLift.charAt(0).toUpperCase() + selectedLift.slice(1)})</Text>
        <BlurView intensity={20} tint="dark" style={styles.card}>
          <View style={styles.timeRangeSelector}>
            {['all', 'week', 'month', '6months', 'year'].map(range => (
              <TouchableOpacity
                key={range}
                style={[styles.rangeButton, timeRange === range && styles.rangeButtonSelected]}
                onPress={() => setTimeRange(range as 'all' | 'week' | 'month' | '6months' | 'year')}
              >
                <Text style={styles.rangeButtonText}>{range.charAt(0).toUpperCase() + range.slice(1)}</Text>
              </TouchableOpacity>
            ))}
          </View>
          {chartData.length > 1 ? ( // Only render chart if there's enough data
            <View style={styles.chartContainer}>
              <Svg width={screenWidth - 64} height={200} style={{ position: 'absolute' }}>
                <Defs>
                  <LinearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <Stop offset="0%" stopColor={LIFT_COLORS[selectedLift]} stopOpacity={0.4} />
                    <Stop offset="100%" stopColor={LIFT_COLORS[selectedLift]} stopOpacity={0.05} />
                  </LinearGradient>
                </Defs>
              </Svg>
              <VictoryChart
                width={screenWidth - 64}
                height={200}
                padding={{ left: 50, right: 30, top: 20, bottom: 50 }}
                domainPadding={{ x: 10 }}
              >
                <VictoryArea
                  data={chartData}
                  x="x"
                  y="y"
                  style={{
                    data: {
                      fill: "url(#chartGradient)",
                      stroke: LIFT_COLORS[selectedLift],
                      strokeWidth: 2,
                    },
                  }}
                  interpolation="natural"
                  animate={{
                    duration: 500,
                    onLoad: { duration: 200 }
                  }}
                />
                <VictoryLine
                  data={chartData}
                  x="x"
                  y="y"
                  style={{
                    data: {
                      stroke: LIFT_COLORS[selectedLift],
                      strokeWidth: 3,
                    },
                  }}
                  interpolation="natural"
                  animate={{
                    duration: 500,
                    onLoad: { duration: 200 }
                  }}
                />
                <VictoryAxis
                  dependentAxis
                  style={{
                    axis: { stroke: '#525252' },
                    tickLabels: { fill: '#B8B8B8', fontSize: 12 },
                    grid: { stroke: '#2a2a2a', strokeDasharray: '4, 4' },
                  }}
                  tickFormat={(tick) => `${Math.round(tick)}kg`}
                />
                <VictoryAxis
                  fixLabelOverlap={true}
                  style={{
                    axis: { stroke: '#525252' },
                    tickLabels: { fill: '#B8B8B8', fontSize: 10, angle: -30, verticalAnchor: "middle", textAnchor: "end" },
                    grid: { stroke: '#2a2a2a', strokeDasharray: '4, 4' },
                  }}
                  tickFormat={formatTick}
                  tickCount={chartData.length > 5 ? 5 : chartData.length} // Limit ticks for readability
                />
              </VictoryChart>
            </View>
          ) : (
            <View style={styles.noDataContainer}>
              <Text style={styles.noDataText}>Not enough data to display chart. Perform more calculations!</Text>
            </View>
          )}
        </BlurView>

        {/* History List */}
        <Text style={styles.sectionTitle}>Lift History</Text>
        <BlurView intensity={20} tint="dark" style={styles.card}>
          <View style={styles.filterBar}>
            <Text style={styles.filterLabel}>Sort by:</Text>
            {['newest', 'oldest', 'heaviest', 'lightest'].map(f => (
              <Pressable
                key={f}
                onPress={() => setFilter(f as typeof filter)}
                style={({ pressed }) => [
                  styles.filterButton,
                  filter === f && styles.filterButtonSelected,
                  pressed && { opacity: 0.8 },
                ]}
              >
                <Text style={[styles.filterButtonText, filter === f && styles.filterButtonTextSelected]}>
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </Text>
              </Pressable>
            ))}
          </View>
          {sortedList.length > 0 ? (
            <View>
              {sortedList.map((item) => {
                // Log each item right before rendering the HistoryItem component
                console.log('Rendering HistoryItem for:', item.id, 'with data:', item);
                return (
                  <HistoryItem
                    key={item.id} // Essential for lists!
                    date={item.date}
                    weight={item.weight}
                    reps={item.reps}
                    oneRM={item.oneRM}
                    rpe={item.rpe}
                    onLongPress={() => handleLongPressItem(item)}
                  />
                );
              })}
            </View>
          ) : (
            <View style={styles.noDataContainer}>
              <Text style={styles.noDataText}>No {selectedLift} history found.</Text>
              <Text style={styles.noDataText}>Go to the Calculator tab to save your first 1RM!</Text>
            </View>
          )}
        </BlurView>
      </ScrollView>

      {/* Edit Modal */}
      <Modal
        visible={isEditModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => {
          setIsEditModalVisible(false);
          setSelectedItem(null);
        }}
      >
        <Pressable style={styles.modalOverlay} onPress={() => {
          setIsEditModalVisible(false);
          setSelectedItem(null);
        }}>
          <Pressable onPress={() => { /* Prevent closing when clicking inside modal content */ }}>
            <BlurView intensity={20} tint="dark" style={styles.editModalContent}>
              <Text style={styles.modalTitle}>Edit History Entry</Text>
              {selectedItem && (
                <View>
                  <View style={styles.editInputGroup}>
                    <Text style={styles.editLabel}>Weight (kg)</Text>
                    <TextInput
                      style={styles.editInput}
                      keyboardType="numeric"
                      value={selectedItem.weight !== null ? String(selectedItem.weight) : ''}
                      onChangeText={(text) => setSelectedItem({ ...selectedItem, weight: Number(text) || null })}
                    />
                  </View>
                  <View style={styles.editInputGroup}>
                    <Text style={styles.editLabel}>Reps</Text>
                    <TextInput
                      style={styles.editInput}
                      keyboardType="numeric"
                      value={selectedItem.reps !== null ? String(selectedItem.reps) : ''}
                      onChangeText={(text) => setSelectedItem({ ...selectedItem, reps: Number(text) || null })}
                    />
                  </View>
                  <View style={styles.editInputGroup}>
                    <Text style={styles.editLabel}>RPE</Text>
                    <TextInput
                      style={styles.editInput}
                      keyboardType="numeric"
                      value={selectedItem.rpe !== undefined && selectedItem.rpe !== null ? String(selectedItem.rpe) : ''}
                      onChangeText={(text) => {
                        const numValue = Number(text);
                        setSelectedItem({ ...selectedItem, rpe: isNaN(numValue) ? undefined : numValue });
                      }}
                      maxLength={2}
                    />
                  </View>
                  <View style={styles.editInputGroup}>
                    <Text style={styles.editLabel}>Date & Time</Text>
                    <View style={styles.dateTimeRow}>
                      <TouchableOpacity onPress={() => setShowCustomDatePicker(true)} style={styles.dateTimeButton}>
                        <Calendar size={18} color="#B8B8B8" />
                        <Text style={styles.dateTimeButtonText}>{selectedDate.toLocaleDateString()}</Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => setShowCustomTimePicker(true)} style={styles.dateTimeButton}>
                        <Clock size={18} color="#B8B8B8" />
                        <Text style={styles.dateTimeButtonText}>{selectedDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
                      </TouchableOpacity>
                    </View>
                  </View>

                  <View style={styles.editModalActions}>
                    <TouchableOpacity style={styles.modalCancelButton} onPress={() => {
                      setIsEditModalVisible(false);
                      setSelectedItem(null);
                    }}>
                      <Text style={styles.modalButtonText}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.modalDeleteButton} onPress={handleDeleteItem}>
                      <Trash2 size={16} color="#B8B8B8" style={{ marginRight: 5 }} />
                      <Text style={styles.modalButtonText}>Delete</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.modalSaveButton} onPress={handleEditModalSave}>
                      <Text style={styles.modalButtonText}>Save</Text>
                      <Check size={16} color="#FFFFFF" style={{ marginLeft: 5 }} />
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </BlurView>
          </Pressable>
        </Pressable>
      </Modal>

      <CustomDatePicker
        visible={showCustomDatePicker}
        onClose={() => setShowCustomDatePicker(false)}
        selectedDate={selectedDate}
        onDateChange={setSelectedDate}
      />
      <CustomTimePicker
        visible={showCustomTimePicker}
        onClose={() => setShowCustomTimePicker(false)}
        selectedDate={selectedDate}
        onTimeChange={setSelectedDate}
      />

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
    marginBottom: 16,
  },
  liftSelector: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  liftButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#525252',
    minWidth: 100,
    alignItems: 'center',
  },
  liftButtonSelected: {
    backgroundColor: 'rgba(184, 184, 184, 0.1)',
  },
  liftButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#B8B8B8',
  },
  timeRangeSelector: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
    paddingHorizontal: 5,
  },
  rangeButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 15,
    backgroundColor: '#1a1a1a',
    borderWidth: 1,
    borderColor: '#333',
  },
  rangeButtonSelected: {
    backgroundColor: '#DBFF00',
    borderColor: '#DBFF00',
  },
  rangeButtonText: {
    color: '#B8B8B8',
    fontSize: 12,
    fontWeight: '600',
  },
  chartContainer: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    borderRadius: 10,
    marginTop: 10,
  },
  noDataContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 100,
  },
  noDataText: {
    color: '#666',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 5,
  },
  filterBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    backgroundColor: '#1a1a1a',
    borderRadius: 15,
    padding: 8,
  },
  filterLabel: {
    color: '#B8B8B8',
    fontSize: 14,
    fontWeight: '600',
    marginRight: 10,
  },
  filterButton: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 12,
    backgroundColor: '#2a2a2a',
    marginHorizontal: 4,
  },
  filterButtonSelected: {
    backgroundColor: '#DBFF00',
  },
  filterButtonText: {
    color: '#B8B8B8',
    fontSize: 12,
    fontWeight: '500',
  },
  filterButtonTextSelected: {
    color: '#1a1a1a',
  },
  itemWrapper: {
    marginBottom: 10,
  },
  gradientBorder: {
    borderRadius: 12,
    padding: 1, // simulates border width
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: 'transparent', // controlled by gradientBorder
  },
  leftContent: {
    flex: 2,
  },
  rightContent: {
    flex: 1,
    alignItems: 'flex-end',
  },
  date: {
    color: '#525252',
    fontSize: 12,
    marginBottom: 4,
    fontWeight: '500',
  },
  details: {
    color: '#B8B8B8',
    fontSize: 16,
    fontWeight: '600',
  },
  rpe: {
    color: '#DBFF00',
    fontSize: 12,
    fontWeight: '500',
  },
  oneRMLabel: {
    color: '#DBFF00',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 2,
  },
  oneRM: {
    color: '#B8B8B8',
    fontSize: 20,
    fontWeight: '700',
  },
  // Modal Styles (for Edit/Delete)
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 20,
  },
  editModalContent: {
    width: '90%',
    borderRadius: 20,
    padding: 20,
    backgroundColor: 'rgba(30, 30, 30, 0.9)',
    overflow: 'hidden', // Ensures blur is contained
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#B8B8B8',
    marginBottom: 20,
    textAlign: 'center',
  },
  editInputGroup: {
    marginBottom: 15,
  },
  editLabel: {
    color: '#B8B8B8',
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 5,
  },
  editInput: {
    backgroundColor: '#1a1a1a',
    color: '#B8B8B8',
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#525252',
  },
  dateTimeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  dateTimeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1a1a1a',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#525252',
  },
  dateTimeButtonText: {
    color: '#B8B8B8',
    fontSize: 14,
    marginLeft: 8,
    fontWeight: '500',
  },
  editModalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  modalCancelButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#525252',
    alignItems: 'center',
  },
  modalDeleteButton: {
    backgroundColor: '#FF634720', // Light red for delete
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FF6347',
  },
  modalSaveButton: {
    backgroundColor: '#DBFF00',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#B8B8B8',
    fontSize: 15,
    fontWeight: '600',
  },
  // Custom Picker Styles
  customPickerContainer: {
    width: '90%',
    borderRadius: 20,
    padding: 20,
    backgroundColor: 'rgba(30, 30, 30, 0.9)',
    alignItems: 'center',
  },
  pickerHeader: {
    marginBottom: 20,
  },
  pickerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#B8B8B8',
    textAlign: 'center',
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 15,
  },
  calendarNavButton: {
    padding: 8,
  },
  calendarMonthYear: {
    fontSize: 18,
    fontWeight: '600',
    color: '#B8B8B8',
  },
  calendarDaysOfWeek: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 10,
  },
  calendarDayOfWeekText: {
    color: '#DBFF00',
    fontWeight: '700',
    width: '13%', // Approx 1/7th
    textAlign: 'center',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '100%',
  },
  calendarDay: {
    width: '13%', // Approx 1/7th
    aspectRatio: 1, // Make it square
    justifyContent: 'center',
    alignItems: 'center',
    margin: 1,
    borderRadius: 8,
  },
  selectedCalendarDay: {
    backgroundColor: '#DBFF00',
  },
  calendarDayText: {
    color: '#B8B8B8',
    fontSize: 16,
    fontWeight: '500',
  },
  selectedCalendarDayText: {
    color: '#1a1a1a',
  },
  pickerActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 20,
  },
  pickerCancelButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#525252',
    alignItems: 'center',
  },
  pickerConfirmButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    backgroundColor: '#DBFF00',
    flexDirection: 'row',
    alignItems: 'center',
  },
  pickerButtonText: {
    color: '#B8B8B8',
    fontSize: 16,
    fontWeight: '600',
  },
  // Time Picker Specific
  timePickerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    maxHeight: 180, // Limit height to make it scrollable
  },
  timeColumn: {
    flex: 1,
    alignItems: 'center',
  },
  timeColumnHeader: {
    color: '#DBFF00',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
  },
  timeScroller: {
    flexGrow: 1,
    width: '80%',
    borderRadius: 10,
    backgroundColor: '#1a1a1a',
  },
  timeItem: {
    paddingVertical: 10,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#2a2a2a',
  },
  selectedTimeItem: {
    backgroundColor: '#525252',
  },
  timeItemText: {
    color: '#B8B8B8',
    fontSize: 18,
  },
  selectedTimeItemText: {
    color: '#DBFF00',
    fontWeight: '700',
  },
  timeColumnSeparator: {
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  timeColumnSeparatorText: {
    color: '#B8B8B8',
    fontSize: 24,
    fontWeight: 'bold',
  },
  timeDisplay: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    backgroundColor: '#1a1a1a',
    borderWidth: 1,
    borderColor: '#525252',
  },
  timeDisplayText: {
    color: '#DBFF00',
    fontSize: 24,
    fontWeight: '700',
  },
});