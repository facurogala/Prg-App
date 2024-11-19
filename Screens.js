// HomeScreen.js
import React, { useState, useEffect, useContext, useMemo, useCallback, useRef } from 'react'
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  BackHandler,
  ScrollView,
  Dimensions,
  Pressable,
  TouchableWithoutFeedback,
  Keyboard,
  Alert
} from 'react-native'
import { styles } from './Styles'
import { GlobalContext } from './GlobalContext'
import AsyncStorage from '@react-native-async-storage/async-storage'
import SettingIcon from './assets/Setting.svg'
import { Picker } from '@react-native-picker/picker'
import moment from 'moment'
import { useFocusEffect } from '@react-navigation/native'
import Svg, { Path, Defs, LinearGradient, Stop, Text as SvgText, Circle } from 'react-native-svg'

const isValidInput = (kg, reps) => {
  return !isNaN(parseFloat(kg)) && !isNaN(parseFloat(reps)) && parseFloat(reps) > 0
}

export const HomeScreen = ({ navigation }) => {
  const [kg, setKg] = useState('')
  const [reps, setReps] = useState('')
  const [date] = useState(new Date())
  const [estimations, setEstimations] = useState(
    Array.from({ length: 20 }, (_, i) => ({ reps: i + 1, weight: '' }))
  )
  const [percentages, setPercentages] = useState([])

  useContext(GlobalContext)

  useEffect(() => {
    const backAction = () => {
      navigation.goBack()
      return true
    }

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction)
    return () => backHandler.remove()
  }, [navigation])

  useEffect(() => {
    if (isValidInput(kg, reps)) {
      const kgValue = parseFloat(kg)
      const repsValue = parseFloat(reps)
      const calculatedOneRM = repsValue === 1 ? kgValue : kgValue * (1 + 0.0333 * (repsValue - 1))
      const repEstimations = [{ reps: '1', weight: calculatedOneRM.toFixed(0) }]

      for (let i = 2; i <= 20; i++) {
        const estimatedKg = (calculatedOneRM / (1 + 0.0333 * (i - 1))).toFixed(0)
        repEstimations.push({ reps: i, weight: estimatedKg })
      }

      setEstimations(repEstimations)

      const newPercentages = Array.from({ length: 12 }, (_, index) => {
        const percentage = 125 - index * 5
        const weight = (calculatedOneRM * (percentage / 100)).toFixed(0)
        return { percentage, weight }
      })

      setPercentages(newPercentages)
    } else {
      setEstimations(Array.from({ length: 20 }, (_, i) => ({ reps: i + 1, weight: '' })))
      setPercentages([])
    }
  }, [kg, reps])

  // División de porcentajes en dos columnas en orden descendente
  const firstColumn = useMemo(() => percentages.slice(0, Math.ceil(percentages.length / 2)), [percentages])
  const secondColumn = useMemo(() => percentages.slice(Math.ceil(percentages.length / 2)), [percentages])

  const handleSave = () => {
    if (estimations[0]?.weight) {
      const oneRM = estimations[0].weight
      navigation.navigate('SaveDetails', {
        kg,
        reps,
        oneRM,
        date: date.toISOString() // Pasa la fecha correctamente
      })
    }
  }

  return (
    <KeyboardAvoidingView style={styles.mainContainer} behavior='padding'>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.mainContainer}>
          <TouchableOpacity
            style={styles.settingButton}
            onPress={() => navigation.navigate('Settings')}
          >
            <SettingIcon width={24} height={24} />
          </TouchableOpacity>
          <Image style={styles.PrgVerde} source={require('./assets/PRG.png')} />
          <Text style={styles.Calcula1Rmhead}>Calcula tu 1RM</Text>

          <View style={styles.containerHomeCalculatorInput}>
            <View style={styles.inputContainerTodo}>
              <View style={styles.inputWrapper}>
                <Text style={styles.labelText}>Kg</Text>
                <TextInput
                  style={styles.textInputKgReps}
                  onChangeText={(text) => setKg(text)}
                  value={kg}
                  keyboardType='numeric'
                  placeholderTextColor='white'
                  maxLength={3}
                />
              </View>
              <View style={styles.inputWrapper}>
                <Text style={styles.labelText}>Reps</Text>
                <TextInput
                  style={styles.textInputKgReps}
                  onChangeText={(text) => setReps(text)}
                  value={reps}
                  keyboardType='numeric'
                  placeholderTextColor='white'
                  maxLength={3}
                />
              </View>
            </View>

            <TouchableOpacity style={styles.saveButton1RM} onPress={handleSave}>
              <Text style={styles.buttonText1RM}>Guardar 1RM</Text>
            </TouchableOpacity>

            <View style={styles.gridContainer}>
              {estimations.map((item) => (
                <View key={item.reps} style={styles.gridItem}>
                  <Text style={styles.repsText}>{item.reps}RM</Text>
                  <Text style={styles.weightTextInput}>
                    {item.weight !== '' ? item.weight : ''}
                  </Text>
                  <Text style={styles.kgText}>kg</Text>
                </View>
              ))}
            </View>

            <View style={styles.percentagesContainer}>
              <Text style={styles.textPorcent}>Porcentajes del 1RM</Text>
              <View style={styles.percentagesBox}>
                {/* Columna 1 */}
                <View style={styles.column1}>
                  {firstColumn.map((item) => (
                    <View key={item.percentage} style={styles.invisibleBox}>
                      <Text style={styles.percentageTextLeft}>{item.percentage}%</Text>
                      <Text style={styles.weightTextLeft}>{item.weight} kg</Text>
                    </View>
                  ))}
                </View>

                {/* Columna 2 */}
                <View style={styles.column2}>
                  {secondColumn.map((item) => (
                    <View key={item.percentage} style={styles.invisibleBox}>
                      <Text style={styles.percentageTextLeft}>{item.percentage}%</Text>
                      <Text style={styles.weightTextLeft}>{item.weight} kg</Text>
                    </View>
                  ))}
                </View>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

export const SettingsScreen = () => {
  return (
    <View style={styles.containerSetting}>
      <Text style={styles.titleConfig}>Pantalla de Configuración</Text>
    </View>
  )
}

const BOX_WIDTH = Dimensions.get('window').width * 1.5 // Ampliado para desplazamiento horizontal
const BOX_HEIGHT = 200
const PADDING_X = 50
const PADDING_Y = 30

export const ChartScreen = () => {
  const [chartData, setChartData] = useState([])
  const [filteredData, setFilteredData] = useState([])
  const [selectedRange, setSelectedRange] = useState('currentMonth')

  const fetchData = async () => {
    try {
      const savedData = await AsyncStorage.getItem('@saved1RMs')
      const parsedData = savedData ? JSON.parse(savedData) : []

      const validData = parsedData.filter(
        (item) => item && moment(item.date, moment.ISO_8601, true).isValid()
      )

      setChartData(validData)
      filterData(validData, 'currentMonth')
    } catch (error) {
      console.error('Error al recuperar los datos', error)
    }
  }

  const groupByMonth = (data) => {
    const grouped = {}
    data.forEach((item) => {
      const month = moment(item.date).startOf('month').format('YYYY-MM') // Agrupar por mes completo
      if (!grouped[month]) {
        grouped[month] = []
      }
      grouped[month].push(item)
    })

    return Object.keys(grouped)
      .sort()
      .map((month) => {
        const monthData = grouped[month]
        const maxOneRM = Math.max(...monthData.map((item) => parseFloat(item.oneRM)))
        return {
          month: moment(monthData[0].date).format('MMM YY'), // Ejemplo: "Dec 24"
          maxOneRM
        }
      })
  }

  const filterData = useCallback((data, range) => {
    const today = moment() // Fecha actual
    let startDate
    let endDate = today.clone().endOf('day') // Por defecto, termina al final del día actual

    switch (range) {
      case 'last30Days':
        startDate = today.clone().subtract(30, 'days')
        break
      case 'last90Days':
        startDate = today.clone().subtract(90, 'days')
        break
      case 'last180Days':
        startDate = today.clone().subtract(180, 'days')
        break
      case 'lastYear':
        startDate = today.clone().subtract(1, 'year').startOf('day') // Inicio hace 1 año
        endDate = today.clone().endOf('year') // Final del año actual
        break
      case 'currentMonth':
      default:
        startDate = today.clone().startOf('month')
    }

    const filtered = data.filter((record) => {
      const recordDate = moment(record.date)
      return recordDate.isBetween(startDate, endDate, 'day', '[]') // Incluye todo el rango
    })

    if (range === 'lastYear') {
      const groupedByMonth = groupByMonth(filtered)
      setFilteredData(groupedByMonth)
    } else {
      const sortedData = filtered.sort((a, b) => new Date(a.date) - new Date(b.date))
      const groupedData = sortedData.map((item) => ({
        date: moment(item.date).format('DD/MM').toString(),
        maxOneRM: parseFloat(item.oneRM)
      }))
      setFilteredData(groupedData)
    }
  }, [])

  useFocusEffect(
    useCallback(() => {
      fetchData()
    }, [])
  )

  const weeklyData = filteredData.map((record) => record.maxOneRM).filter((point) => !isNaN(point))
  const weeklyLabels = filteredData.map((record) => record.month || record.date)

  const maxY = Math.max(Math.ceil(Math.max(...weeklyData) / 100) * 100 || 300, 300)

  const scaleY = (value) => {
    return !isNaN(value)
      ? BOX_HEIGHT - ((value / maxY) * (BOX_HEIGHT - PADDING_Y * 2)) - PADDING_Y
      : 0
  }

  const scaleX = (index) => {
    return weeklyData.length > 1
      ? ((BOX_WIDTH - PADDING_X * 5) / (weeklyData.length - 1)) * index + PADDING_X
      : PADDING_X
  }

  const linePath = weeklyData.reduce((acc, point, index) => {
    const x = scaleX(index)
    const y = scaleY(point)
    if (index === 0) {
      return `M ${x},${y}`
    }
    const prevX = scaleX(index - 1)
    const prevY = scaleY(weeklyData[index - 1])
    const controlX = (prevX + x) / 2
    const controlY1 = prevY
    const controlY2 = y
    return `${acc} C ${controlX},${controlY1} ${controlX},${controlY2} ${x},${y}`
  }, '')

  return (
    <View style={styles.containerChart}>
      <Text style={styles.title}>1RM Chart</Text>
      <Picker
        selectedValue={selectedRange}
        style={{ height: 50, width: 200, backgroundColor: '#212836' }}
        onValueChange={(itemValue) => {
          setSelectedRange(itemValue)
          filterData(chartData, itemValue)
        }}
      >
        <Picker.Item label='Mes Actual' value='currentMonth' />
        <Picker.Item label='Últimos 30 Días' value='last30Days' />
        <Picker.Item label='Últimos 90 Días' value='last90Days' />
        <Picker.Item label='Últimos 180 Días' value='last180Days' />
        <Picker.Item label='Último Año' value='lastYear' />
      </Picker>

      {filteredData.length > 0
        ? (
          <ScrollView horizontal>
            <Svg width={BOX_WIDTH} height={BOX_HEIGHT + PADDING_Y * 2}>
              <Defs>
                <LinearGradient id='grad' x1='0' y1='0' x2='0' y2='1'>
                  <Stop offset='0%' stopColor='#D9E92C' stopOpacity='0.3' />
                  <Stop offset='100%' stopColor='#060B11' stopOpacity='0' />
                </LinearGradient>
              </Defs>

              <Path
                d={`${linePath} L ${BOX_WIDTH - PADDING_X} ${BOX_HEIGHT - PADDING_Y} L ${PADDING_X} ${BOX_HEIGHT - PADDING_Y} Z`}
                fill='url(#grad)'
              />

              <Path d={linePath} fill='none' stroke='#D9E92C' strokeWidth='3' />

              {weeklyData.map((point, index) => {
                const x = scaleX(index)
                const y = scaleY(point)
                return (
                  <React.Fragment key={`point-${index}`}>
                    <SvgText
                      x={x}
                      y={y - 10}
                      fontSize='10'
                      fill='white'
                      textAnchor='middle'
                    >
                      {point}kg
                    </SvgText>
                    <Circle cx={x} cy={y} r='4' fill='#D9E92C' />
                  </React.Fragment>
                )
              })}

              {weeklyLabels.map((label, index) => (
                <SvgText
                  key={`x-label-${index}`}
                  x={scaleX(index)}
                  y={BOX_HEIGHT + PADDING_Y + 15}
                  fontSize='10'
                  fill='white'
                  textAnchor='middle'
                >
                  {label}
                </SvgText>
              ))}

              {[...Array(5)].map((_, i) => {
                const y = ((BOX_HEIGHT - PADDING_Y * 2) / 4) * i + PADDING_Y
                const label = Math.round(maxY - ((maxY / 4) * i))
                return (
                  <SvgText
                    key={`y-label-${i}`}
                    x='5'
                    y={y + 12}
                    fontSize='10'
                    fill='white'
                  >
                    {label} kg
                  </SvgText>
                )
              })}
            </Svg>
          </ScrollView>
          )
        : (
          <Text style={styles.noDataText}>No hay datos disponibles para este rango</Text>
          )}
    </View>
  )
}

export const PercentageScreen = ({ navigation }) => {
  const { saved1RMs, setSaved1RMs } = useContext(GlobalContext)
  const [filter, setFilter] = useState({ exercise: 'Todos', sortBy: 'Fecha (más reciente)' })
  const [visibleFilter, setVisibleFilter] = useState(null)
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0, width: 0 })
  const filterRefs = useRef({})

  useEffect(() => {
    const cargarLevantamientos = async () => {
      try {
        const data = await AsyncStorage.getItem('@saved1RMs')
        const parsedData = data ? JSON.parse(data) : []
        setSaved1RMs(parsedData)
      } catch (error) {
        console.error('Error al cargar levantamientos', error)
      }
    }
    cargarLevantamientos()
  }, [])

  const toggleFilterMenu = (menu, refKey) => {
    if (visibleFilter === menu) {
      setVisibleFilter(null)
      return
    }

    filterRefs.current[refKey].measure((x, y, width, height, pageX, pageY) => {
      setMenuPosition({ top: pageY + height - 5, left: pageX, width })
      setVisibleFilter(menu)
    })
  }

  const getFilteredData = () => {
    let data = [...saved1RMs]
    if (filter.exercise !== 'Todos') {
      data = data.filter((item) => item.exercise === filter.exercise)
    }
    if (filter.sortBy === 'Fecha (más reciente)') {
      data.sort((a, b) => new Date(b.date) - new Date(a.date))
    } else if (filter.sortBy === 'Fecha (más antigua)') {
      data.sort((a, b) => new Date(a.date) - new Date(b.date))
    } else if (filter.sortBy === 'Peso (más pesado)') {
      data.sort((a, b) => b.oneRM - a.oneRM)
    } else if (filter.sortBy === 'Peso (más liviano)') {
      data.sort((a, b) => a.oneRM - b.oneRM)
    }
    return data
  }

  const handleFilterChange = (type, value) => {
    setFilter((prev) => ({ ...prev, [type]: value }))
    setVisibleFilter(null)
  }

  const eliminarLevantamiento = async (id) => {
    try {
      const nuevosLevantamientos = saved1RMs.filter((item) => item.id !== id)
      await AsyncStorage.setItem('@saved1RMs', JSON.stringify(nuevosLevantamientos))
      setSaved1RMs(nuevosLevantamientos)
      console.log(`Levantamiento con ID ${id} eliminado correctamente.`)
    } catch (error) {
      console.error('Error al eliminar el levantamiento', error)
    }
  }

  const confirmarEliminacion = (id) => {
    Alert.alert(
      'Eliminar Levantamiento',
      '¿Estás seguro de que deseas eliminar este levantamiento?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Eliminar', onPress: () => eliminarLevantamiento(id) }
      ]
    )
  }

  const filteredData = getFilteredData()

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        if (visibleFilter) {
          setVisibleFilter(null)
          Keyboard.dismiss()
        }
      }}
    >
      <View style={{ flex: 1, backgroundColor: '#0D1520' }}>
        <View style={styles.filtersContainer}>
          {/* Botón para Filtrar por Ejercicio */}
          <TouchableOpacity
            ref={(ref) => (filterRefs.current.exercise = ref)}
            style={styles.filterButton}
            onPress={() => toggleFilterMenu('exercise', 'exercise')}
          >
            <Text style={styles.filterButtonText}>
              Filtrar por Ejercicio: {filter.exercise}
            </Text>
          </TouchableOpacity>

          {/* Botón para Ordenar */}
          <TouchableOpacity
            ref={(ref) => (filterRefs.current.sortBy = ref)}
            style={styles.filterButton}
            onPress={() => toggleFilterMenu('sortBy', 'sortBy')}
          >
            <Text style={styles.filterButtonText}>
              Ordenar por: {filter.sortBy}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Menú de Opciones para Filtrar por Ejercicio */}
        {visibleFilter === 'exercise' && (
          <View
            style={[
              styles.menuContainer,
              { top: menuPosition.top, left: menuPosition.left, width: menuPosition.width }
            ]}
          >
            <Pressable
              onPress={() => handleFilterChange('exercise', 'Todos')}
              style={styles.menuItem}
            >
              <Text style={styles.menuText}>Todos</Text>
            </Pressable>
            <Pressable
              onPress={() => handleFilterChange('exercise', 'Sentadilla')}
              style={styles.menuItem}
            >
              <Text style={styles.menuText}>Sentadilla</Text>
            </Pressable>
            <Pressable
              onPress={() => handleFilterChange('exercise', 'Peso Muerto')}
              style={styles.menuItem}
            >
              <Text style={styles.menuText}>Peso Muerto</Text>
            </Pressable>
            <Pressable
              onPress={() => handleFilterChange('exercise', 'Banco Plano')}
              style={styles.menuItem}
            >
              <Text style={styles.menuText}>Banco Plano</Text>
            </Pressable>
          </View>
        )}

        {/* Menú de Opciones para Ordenar */}
        {visibleFilter === 'sortBy' && (
          <View
            style={[
              styles.menuContainer,
              { top: menuPosition.top, left: menuPosition.left, width: menuPosition.width }
            ]}
          >
            <Pressable
              onPress={() => handleFilterChange('sortBy', 'Fecha (más reciente)')}
              style={styles.menuItem}
            >
              <Text style={styles.menuText}>Fecha (más reciente)</Text>
            </Pressable>
            <Pressable
              onPress={() => handleFilterChange('sortBy', 'Fecha (más antigua)')}
              style={styles.menuItem}
            >
              <Text style={styles.menuText}>Fecha (más antigua)</Text>
            </Pressable>
            <Pressable
              onPress={() => handleFilterChange('sortBy', 'Peso (más pesado)')}
              style={styles.menuItem}
            >
              <Text style={styles.menuText}>Peso (más pesado)</Text>
            </Pressable>
            <Pressable
              onPress={() => handleFilterChange('sortBy', 'Peso (más liviano)')}
              style={styles.menuItem}
            >
              <Text style={styles.menuText}>Peso (más liviano)</Text>
            </Pressable>
          </View>
        )}

        {/* Lista de Resultados Filtrados */}
        <ScrollView style={styles.containerPercentage}>
          {filteredData.length > 0
            ? (
                filteredData.map((item, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.saved1RMBox}
                    onPress={() => navigation.navigate('SaveDetails', { ...item })}
                    onLongPress={() => confirmarEliminacion(item.id)}
                  >
                    <View style={styles.headerRow}>
                      <Text style={styles.exerciseName}>{item.exercise}</Text>
                      <Text style={styles.dateText}>
                        {item.date ? new Date(item.date).toLocaleDateString() : 'Fecha no disponible'}
                      </Text>
                    </View>
                    <View style={styles.mainRow}>
                      <Text style={styles.oneRMText}>{item.oneRM} kg</Text>
                      <View style={styles.detailsColumn}>
                        <View style={styles.detailItem}>
                          <Text style={styles.detailLabel}>Kilos:</Text>
                          <Text style={styles.detailValue}>{item.kg}</Text>
                        </View>
                        <View style={styles.detailItem}>
                          <Text style={styles.detailLabel}>Series:</Text>
                          <Text style={styles.detailValue}>{item.series || '-'}</Text>
                        </View>
                        <View style={styles.detailItem}>
                          <Text style={styles.detailLabel}>Reps:</Text>
                          <Text style={styles.detailValue}>{item.reps}</Text>
                        </View>
                        <View style={styles.detailItem}>
                          <Text style={styles.detailLabel}>RPE:</Text>
                          <Text style={styles.detailValue}>{item.rpe || '-'}</Text>
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))
              )
            : (
              <Text style={styles.noDataText}>No hay datos para mostrar con este filtro.</Text>
              )}
        </ScrollView>
      </View>
    </TouchableWithoutFeedback>
  )
}

export const ProfileScreen = () => {
  return (
    <View style={styles.containerProfile}>
      <Text style={styles.title}>Profile Screen</Text>
    </View>
  )
}
