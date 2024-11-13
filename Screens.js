// HomeScreen.js
import React, { useState, useEffect, useContext, useMemo, useCallback } from 'react'
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
  Alert
} from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { styles } from './Styles'
import { GlobalContext } from './GlobalContext'
import AsyncStorage from '@react-native-async-storage/async-storage'
import GlobalContainer from './GlobalContainer'
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

const BOX_WIDTH = Dimensions.get('window').width * 0.9
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

      const validData = parsedData.filter(item =>
        item && !isNaN(parseFloat(item.oneRM)) && item.date
      )

      setChartData(validData)
      filterData(validData, 'currentMonth')
    } catch (error) {
      console.error('Error al recuperar los datos', error)
    }
  }

  const groupByMonth = (data) => {
    const grouped = {}
    data.forEach(item => {
      const month = moment(item.date).format('YYYY-MM')
      if (!grouped[month]) {
        grouped[month] = []
      }
      grouped[month].push(item)
    })
    // Convierte los grupos en un array y ordena por fecha
    return Object.keys(grouped)
      .sort() // Asegura el orden cronológico
      .map(month => {
        const monthData = grouped[month]
        const maxOneRM = Math.max(...monthData.map(item => parseFloat(item.oneRM)))
        return {
          month: moment(monthData[0].date).format('MMM YY'),
          maxOneRM
        }
      })
  }

  const filterData = useCallback((data, range) => {
    const today = moment()
    let startDate

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
        startDate = today.clone().subtract(1, 'year')
        break
      case 'currentMonth':
      default:
        startDate = today.clone().startOf('month')
    }

    const filtered = data.filter(record => {
      const recordDate = moment(record.date)
      return recordDate.isSameOrAfter(startDate) && recordDate.isSameOrBefore(today)
    })

    // Agrupar por mes si el rango es "Último Año"
    if (range === 'lastYear') {
      const groupedByMonth = groupByMonth(filtered)
      setFilteredData(groupedByMonth)
    } else {
      // Si no es anual, agrupar por semana o día según prefieras
      const sortedData = filtered.sort((a, b) => new Date(a.date) - new Date(b.date))
      const groupedData = sortedData.map(item => ({
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

  const weeklyData = filteredData.map(record => record.maxOneRM)
  const weeklyLabels = filteredData.map(record => record.month || record.date) // Ajusta etiquetas según el filtro

  const maxY = Math.ceil(Math.max(...weeklyData) * 1 / 100) * 100 || 400
  const scaleY = (value) => BOX_HEIGHT - ((value / maxY) * (BOX_HEIGHT - PADDING_Y * 2)) - PADDING_Y
  const scaleX = (index) => (BOX_WIDTH - PADDING_X * 2) / (weeklyData.length - 1) * index + PADDING_X

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
          <Svg width={BOX_WIDTH} height={BOX_HEIGHT + PADDING_Y * 2}>
            <Defs>
              <LinearGradient id='grad' x1='0' y1='0' x2='0' y2='1'>
                <Stop offset='0%' stopColor='#D9E92C' stopOpacity='0.3' />
                <Stop offset='100%' stopColor='#060B11' stopOpacity='0' />
              </LinearGradient>
            </Defs>

            {/* Área sombreada bajo la línea */}
            <Path
              d={`${linePath} L ${BOX_WIDTH - PADDING_X} ${BOX_HEIGHT - PADDING_Y} L ${PADDING_X} ${BOX_HEIGHT - PADDING_Y} Z`}
              fill='url(#grad)'
            />

            {/* Línea de datos suavizada */}
            <Path
              d={linePath}
              fill='none'
              stroke='#D9E92C'
              strokeWidth='3'
            />

            {/* Puntos de datos y etiquetas de 1RM */}
            {weeklyData.map((point, index) => {
              const x = scaleX(index)
              const y = scaleY(point)
              const offsetY = index % 2 === 0 ? -10 : 20 // Alterna posición: encima o debajo
              return (
                <React.Fragment key={`point-${index}`}>
                  {/* Etiqueta con el valor del 1RM, alternando su posición */}
                  <SvgText
                    x={x}
                    y={y + offsetY} // Alterna posición según el índice
                    fontSize='10'
                    fill='white'
                    textAnchor='middle'
                  >
                    {point} kg
                  </SvgText>

                  {/* Punto de datos */}
                  <Circle
                    cx={x}
                    cy={y}
                    r='4'
                    fill='#D9E92C'
                  />
                </React.Fragment>
              )
            })}

            {/* Etiquetas del eje X con fechas */}
            {weeklyLabels.map((label, index) => (
              <SvgText
                key={`x-label-${index}`}
                x={scaleX(index)}
                y={BOX_HEIGHT + PADDING_Y + 15}
                fontSize='10'
                fill='white'
                textAnchor='middle'
                rotation='45'
                origin={`${scaleX(index)}, ${BOX_HEIGHT + PADDING_Y + 15}`}
              >
                {label}
              </SvgText>
            ))}

            {/* Etiquetas del eje Y */}
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
          )
        : (
          <Text style={styles.noDataText}>No hay datos disponibles para este rango</Text>
          )}
    </View>
  )
}

export const PercentageScreen = ({ navigation }) => {
  const { saved1RMs, setSaved1RMs } = useContext(GlobalContext)

  useEffect(() => {
    const cargarLevantamientos = async () => {
      try {
        const levantamientosGuardados = await AsyncStorage.getItem('@saved1RMs')
        const parsedData = levantamientosGuardados ? JSON.parse(levantamientosGuardados) : []
        setSaved1RMs(parsedData)
      } catch (error) {
        console.error('Error al cargar levantamientos', error)
      }
    }
    cargarLevantamientos()
  }, [])

  const eliminarLevantamiento = async (index) => {
    try {
      const nuevosLevantamientos = saved1RMs.filter((_, i) => i !== index)
      await AsyncStorage.setItem('@saved1RMs', JSON.stringify(nuevosLevantamientos))
      setSaved1RMs(nuevosLevantamientos)
    } catch (error) {
      console.error('Error al eliminar el levantamiento', error)
    }
  }

  const handlePress = (item) => {
    navigation.navigate('SaveDetails', {
      id: item.id,
      exercise: item.exercise,
      kg: item.kg,
      reps: item.reps,
      oneRM: item.oneRM,
      date: item.date,
      series: item.series,
      rpe: item.rpe,
      note: item.note
    })
  }

  const handleLongPress = (_item, index) => {
    Alert.alert(
      'Eliminar',
      '¿Estás seguro de que deseas eliminar este elemento?',
      [
        {
          text: 'Cancelar',
          style: 'cancel'
        },
        {
          text: 'Eliminar',
          onPress: () => eliminarLevantamiento(index)
        }
      ]
    )
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <GlobalContainer style={{ flex: 1 }}>
        <ScrollView style={styles.containerPercentage}>
          {saved1RMs.length > 0
            ? (
                saved1RMs.map((item, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.saved1RMBox}
                    onPress={() => handlePress(item)}
                    onLongPress={() => handleLongPress(item, index)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.headerRow}>
                      <Text style={styles.exerciseName}>{item.exercise}</Text>
                      <Text style={styles.dateText}>
                        {item.date ? new Date(item.date).toLocaleDateString() : 'Fecha no disponible'}
                      </Text>
                    </View>

                    <View style={styles.mainRow}>
                      <Text style={styles.oneRMText}>{item.oneRM}kg</Text>

                      <View style={styles.detailsColumn}>
                        <View style={styles.detailItem}>
                          <Text style={styles.detailLabel}>Kilos</Text>
                          <Text style={styles.detailValue}>{item.kg}</Text>
                        </View>

                        <View style={styles.detailItem}>
                          <Text style={styles.detailLabel}>Series</Text>
                          <Text style={styles.detailValue}>{item.series}</Text>
                        </View>

                        <View style={styles.detailItem}>
                          <Text style={styles.detailLabel}>Reps</Text>
                          <Text style={styles.detailValue}>{item.reps}</Text>
                        </View>

                        <View style={styles.detailItem}>
                          <Text style={styles.detailLabel}>Rpe</Text>
                          <Text style={styles.detailValue}>{item.rpe}</Text>
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))
              )
            : (
              <Text style={styles.noDataText}>No hay datos guardados.</Text>
              )}
        </ScrollView>
      </GlobalContainer>
    </GestureHandlerRootView>
  )
}

export const ProfileScreen = () => {
  return (
    <View style={styles.containerProfile}>
      <Text style={styles.title}>Profile Screen</Text>
    </View>
  )
}
