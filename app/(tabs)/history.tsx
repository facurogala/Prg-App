import React, { useCallback, useMemo, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, Pressable, Dimensions, Modal, Animated, TextInput, Alert, TouchableOpacity, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Filter, Trash2, Calendar, Clock, ChevronLeft, ChevronRight, Check } from 'lucide-react-native';
import { useFocusEffect } from '@react-navigation/native';
import type { LiftType } from './index';
import Svg, { Defs, LinearGradient, Stop } from 'react-native-svg';
import { LinearGradient as BorderGradient } from 'expo-linear-gradient';

const VictoryComponents = Platform.select({
  web: () => {
    const victory = require('victory');
    return {
      VictoryChart: victory.VictoryChart,
      VictoryLine: victory.VictoryLine,
      VictoryAxis: victory.VictoryAxis,
      VictoryArea: victory.VictoryArea,
      VictoryClipContainer: victory.VictoryClipContainer,
    };
  },
  default: () => {
    const victoryNative = require('victory-native');
    return {
      VictoryChart: victoryNative.VictoryChart,
      VictoryLine: victoryNative.VictoryLine,
      VictoryAxis: victoryNative.VictoryAxis,
      VictoryArea: victoryNative.VictoryArea,
      VictoryClipContainer: victoryNative.VictoryClipContainer,
    };
  },
})();

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

  const showRPE = rpe !== undefined && rpe !== null && !isNaN(rpe);

  return (
    <Pressable onLongPress={onLongPress} onPressIn={handlePressIn} onPressOut={handlePressOut} delayLongPress={500}>
      <Animated.View style={[animatedStyle]}>
        <View style={styles.itemWrapper}>
          <BorderGradient colors={['#52525250', '#52525210']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.gradientBorder}>
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

function Chart({ data, selectedLift }: { data: any[], selectedLift: LiftType }) {
  const { VictoryChart, VictoryLine, VictoryAxis, VictoryArea, VictoryClipContainer } = VictoryComponents;

  if (data.length === 0) {
    return <Text style={styles.noDataText}>No data for {selectedLift} in selected time range</Text>;
  }

  return (
    <View style={styles.chartContainer}>
      <VictoryChart
        height={220}
        width={screenWidth - 64}
        padding={{ top: 20, bottom: 40, left: 50, right: 30 }}
        domainPadding={{ x: [20, 20], y: [20, 20] }}
        scale={{ x: "time", y: "linear" }}
        domain={{ y: [Math.min(...data.map(d => d.y)), Math.max(...data.map(d => d.y))] }}
      >
        <Defs>
          <LinearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor={LIFT_COLORS[selectedLift]} stopOpacity="0.3" />
            <Stop offset="100%" stopColor={LIFT_COLORS[selectedLift]} stopOpacity="0.05" />
          </LinearGradient>
        </Defs>

        <VictoryAxis
          scale="time"
          tickFormat={(x) => formatTick(x)}
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
          data={data}
          interpolation="basis"
          style={{ data: { fill: "url(#chartGradient)", stroke: "transparent" } }}
          groupComponent={<VictoryClipContainer clipPadding={{ top: 5, right: 5 }} />}
        />
        <VictoryLine
          data={data}
          interpolation="basis"
          style={{ data: { stroke: LIFT_COLORS[selectedLift], strokeWidth: 2, strokeLinecap: "round" } }}
        />
      </VictoryChart>
    </View>
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
  
    return Object.values(groupedByDate).sort((a, b) => a.x.getTime() - b.x.getTime());
  };

  const filteredHistory = useMemo(() => {
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
    setSelectedDate(new Date(item.date));
    setIsEditModalVisible(true);
  };

  const handleDateChange = (date: Date) => {
    if (selectedItem) {
      const newDate = new Date(date);
      setSelectedDate(newDate);
      setSelectedItem({
        ...selectedItem,
        date: newDate.toISOString()
      });
    }
  };

  const handleTimeChange = (date: Date) => {
    if (selectedItem) {
      const newDate = new Date(date);
      setSelectedDate(newDate);
      setSelectedItem({
        ...selectedItem,
        date: newDate.toISOString()
      });
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString(undefined, {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

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
                    style={[styles.liftButton, selectedLift === lift && styles.liftButtonSelected]}
                    onPress={() => setSelectedLift(lift)}>
                    <Text style={[styles.liftButtonText, selectedLift === lift && styles.liftButtonTextSelected]}>
                      {lift.charAt(0).toUpperCase() + lift.slice(1)}
                    </Text>
                  </Pressable>
                ))}
              </View>

              <View style={styles.timeRangeSelector}>
                {(['all', 'week', 'month', '6months', 'year'] as const).map((range) => (
                  <Pressable
                    key={range}
                    style={[styles.timeRangeButton, timeRange === range && styles.timeRangeButtonSelected]}
                    onPress={() => setTimeRange(range)}>
                    <Text style={[styles.timeRangeButtonText, timeRange === range && styles.timeRangeButtonTextSelected]}>
                      {range === 'all' ? 'All' : 
                       range === 'week' ? '1W' : 
                       range === 'month' ? '1M' : 
                       range === '6months' ? '6M' : '1Y'}
                    </Text>
                  </Pressable>
                ))}
              </View>

              <Text style={styles.subtitle}>Progress Chart</Text>
              <Chart data={chartData} selectedLift={selectedLift} />
            </BlurView>

            <View style={styles.filterHeader}>
              <Text style={styles.sectionTitle}>Recent Calculations</Text>
              <View style={styles.headerActions}>
                <Pressable onPress={() => setIsFilterVisible(true)} style={styles.iconButton}>
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

      <CustomDatePicker
        visible={showCustomDatePicker}
        onClose={() => setShowCustomDatePicker(false)}
        selectedDate={selectedDate}
        onDateChange={handleDateChange}
      />

      <CustomTimePicker
        visible={showCustomTimePicker}
        onClose={() => setShowCustomTimePicker(false)}
        selectedDate={selectedDate}
        onTimeChange={handleTimeChange}
      />

      <Modal
        transparent={true}
        visible={isEditModalVisible}
        animationType="fade"
        onRequestClose={() => setIsEditModalVisible(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setIsEditModalVisible(false)}>
          <BlurView intensity={20} tint="dark" style={styles.editModalContainer}>
            {selectedItem && (
              <>
                <Text style={styles.editModalTitle}>Edit Record</Text>

                <View style={styles.editInputContainer}>
                  <Text style={styles.editLabel}>Date</Text>
                  <Pressable style={styles.dateTimeButton} onPress={() => setShowCustomDatePicker(true)}>
                    <Calendar size={16} color="#B8B8B8" style={styles.dateTimeIcon} />
                    <Text style={styles.dateTimeText}>{formatDate(selectedDate)}</Text>
                  </Pressable>
                </View>

                <View style={styles.editInputContainer}>
                  <Text style={styles.editLabel}>Time</Text>
                  <Pressable style={styles.dateTimeButton} onPress={() => setShowCustomTimePicker(true)}>
                    <Clock size={16} color="#B8B8B8" style={styles.dateTimeIcon} />
                    <Text style={styles.dateTimeText}>{formatTime(selectedDate)}</Text>
                  </Pressable>
                </View>

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

      <Modal
        transparent={true}
        visible={isDeleteModalVisible}
        animationType="fade"
        onRequestClose={() => setIsDeleteModalVisible(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setIsDeleteModalVisible(false)}>
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

      <Modal
        transparent={true}
        visible={isFilterVisible}
        animationType="fade"
        onRequestClose={() => setIsFilterVisible(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setIsFilterVisible(false)}>
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
  timeRangeSelector: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
    justifyContent: 'center',
  },
  timeRangeButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: '#1a1a1a',
    borderWidth: 1,
    borderColor: '#525252',
  },
  timeRangeButtonSelected: {
    backgroundColor: '#525252',
    borderColor: '#B8B8B8',
  },
  timeRangeButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#B8B8B8',
  },
  timeRangeButtonTextSelected: {
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
  dateTimeButton: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#525252',
  },
  dateTimeText: {
    color: '#FFFFFF',
    flex: 1,
  },
  dateTimeIcon: {
    marginRight: 8,
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
  customPickerContainer: {
    borderRadius: 20,
    padding: 16,
    width: 300,
    backgroundColor: 'rgba(20, 20, 20, 0.9)',
    borderWidth: 1,
    borderColor: '#525252',
  },
  pickerHeader: {
    borderBottomWidth: 1,
    borderBottomColor: '#525252',
    paddingBottom: 12,
    marginBottom: 16,
  },
  pickerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#B8B8B8',
    textAlign: 'center',
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  calendarNavButton: {
    padding: 8,
  },
  calendarMonthYear: {
    fontSize: 16,
    fontWeight: '600',
    color: '#B8B8B8',
  },
  calendarDaysOfWeek: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 8,
  },
  calendarDayOfWeekText: {
    color: '#525252',
    fontSize: 12,
    width: 36,
    textAlign: 'center',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  calendarDay: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 2,
  },
  calendarDayText: {
    color: '#B8B8B8',
    fontSize: 14,
  },
  selectedCalendarDay: {
    backgroundColor: '#4CAF50',
    borderRadius: 18,
  },
  selectedCalendarDayText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  pickerActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#525252',
    paddingTop: 16,
  },
  pickerCancelButton: {
    backgroundColor: '#525252',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  pickerConfirmButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  pickerButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  timePickerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 16,
  },
  timeColumn: {
    width: 80,
    height: 160,
  },
  timeColumnHeader: {
    color: '#525252',
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 8,
  },
  timeScroller: {
    height: 140,
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
  },
  timeItem: {
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timeItemText: {
    color: '#B8B8B8',
    fontSize: 16,
  },
  selectedTimeItem: {
    backgroundColor: '#4CAF50',
  },
  selectedTimeItemText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  timeColumnSeparator: {
    width: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeColumnSeparatorText: {
    color: '#B8B8B8',
    fontSize: 24,
    fontWeight: 'bold',
  },
  timeDisplay: {
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginVertical: 16,
  },
  timeDisplayText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '600',
  },
});