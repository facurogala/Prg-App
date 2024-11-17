import { StyleSheet, Dimensions } from 'react-native'

const { width, height } = Dimensions.get('window')

export const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#0D1520',
    alignItems: 'center',
    justifyContent: 'center',
    padding: width * 0.05,
    marginTop: height * 0.02
  },
  containerHomeCalculatorInput: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#0D1520',
    marginBottom: -50,
    marginTop: height * 0.02

  },
  welcomeText: {
    fontSize: width * 0.05,
    textAlign: 'center',
    marginBottom: height * 0.02,
    color: '#ffffff',
    fontWeight: 'bold'
  },
  titleConfig: {
    fontSize: width * 0.05,
    color: 'white',
    marginTop: height * 0.02,
    paddingHorizontal: width * 0.1,
    textAlign: 'center'
  },
  SubTitulo: {
    fontSize: width * 0.04,
    textAlign: 'center',
    marginBottom: height * 0.01,
    color: 'white',
    fontWeight: '400'
  },
  PRG: {
    width: 290,
    height: 220,
    marginTop: height * 0.02,
    alignSelf: 'center',
    marginBottom: height * 0.03
  },

  PrgVerde: {
    position: 'absolute',
    top: 15,
    left: width * 0.3, // Ajusta para centrar el elemento
    width: width * 0.4,
    height: height * 0.1,
    resizeMode: 'contain',
    zIndex: 1
  },
  Calcula1Rmhead: {
    fontSize: width * 0.05,
    color: 'white',
    marginTop: height * 0.09, // Ajusta el espacio debajo de la imagen PRG
    paddingHorizontal: width * 0.1,
    textAlign: 'center',
    marginBottom: height * 0.001,
    fontWeight: 'bold',
    position: 'relative'

  },
  iconButton: {
    position: 'absolute',
    top: height * 0.05,
    right: width * 0.05
  },
  contentContainer: {
    flex: 1,
    marginTop: height * 0.22, // Ajusta el espacio superior para el resto del contenido
    justifyContent: 'flex-start'
  },
  inputContainerTodo: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: width * 0.03,
    marginTop: height * 0.015
  },
  inputWrapper: {
    flex: 1,
    marginHorizontal: width * 0.01,
    height: height * 0.08,
    backgroundColor: '#212836',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 15

  },
  labelText: {
    position: 'absolute',
    top: height * 0.01,
    left: width * 0.02,
    fontSize: width * 0.04,
    color: 'gray'
  },
  textInputKgReps: {
    color: 'white',
    textAlign: 'center',
    fontSize: width * 0.1,
    fontWeight: 'bold',
    resizeMode: 'contain',
    flex: 1,
    paddingHorizontal: 35

  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    paddingHorizontal: width * 0.03,
    marginTop: height * 0.001,
    width: '100%',
    height: height * 0.15 // Ajusta según lo que necesites
  },
  gridItem: {
    width: width * 0.21, // Ajusta el tamaño relativo al ancho de la pantalla
    height: height * 0.12, // Ajusta el tamaño relativo al alto de la pantalla
    marginVertical: height * 0.01,
    backgroundColor: '#212836',
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 1
  },

  repsText: {
    color: '#D9E92C',
    fontSize: width * 0.05,
    fontWeight: 'bold',
    marginTop: height * 0.01
  },
  weightTextInput: {
    fontSize: width * 0.080,
    color: 'white',
    fontWeight: 'bold',
    marginTop: height * 0.001
  },
  kgText: {
    marginTop: -1,
    fontSize: width * 0.03,
    color: 'white',
    marginBottom: height * 0.01
  },
  profileChild: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e70000',
    width: width * 0.8,
    height: height * 0.05,
    borderRadius: 5,
    marginTop: height * 0.07
  },
  continuarConGoogle: {
    fontWeight: '500',
    textAlign: 'center',
    color: '#ffffff'
  },
  iconGoogle: {
    width: 22,
    height: 25,
    resizeMode: 'contain',
    marginRight: 10
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  profileFb: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#3D7FFF',
    width: width * 0.8,
    height: height * 0.05,
    borderRadius: 5,
    marginTop: height * 0.1
  },
  continuarConFb: {
    fontWeight: '500',
    textAlign: 'center',
    color: '#ffffff'
  },
  iconFacebook: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
    marginRight: 10
  },
  buttonContentFb: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  containerNavBar: {
    bottom: 60,
    backgroundColor: '#0D1520',
    height: -100,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'absolute'
  },
  navHome: {
    marginHorizontal: 20 // Ajusta el margen según tus necesidades

  },
  Profile: {
    marginHorizontal: 20
  },
  containerProfile: {
    flex: 1,
    backgroundColor: '#0D1520', // Cambia el color de fondo a verde
    justifyContent: 'center', // Opcional, para centrar el contenido verticalmente
    alignItems: 'center' // Opcional, para centrar el contenido horizontalmente
  },

  containerSetting: {
    flex: 1,
    backgroundColor: '#0D1520', // Cambia el color de fondo a verde
    justifyContent: 'center', // Opcional, para centrar el contenido verticalmente
    alignItems: 'center' // Opcional, para centrar el contenido horizontalmente
  },
  settingButton: {
    position: 'absolute',
    top: 10,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    right: 25

  },
  column1: {
    flex: 1,
    alignItems: 'center' // Cambia a 'center' para centrar los elementos de esta columna
  },
  column2: {
    flex: 1,
    alignItems: 'center' // Cambia a 'center' para centrar los elementos de esta columna

  },
  weightTextLeft: {
    color: '#fff',
    fontSize: 24
  },

  scrollViewContent: {
    flexGrow: 1, // Permite que el contenido se expanda para llenar el espacio
    justifyContent: 'flex-start', // Alinea el contenido al inicio
    alignItems: 'center', // Centra los elementos horizontalmente
    padding: 2, // Ajusta el espacio interno alrededor del contenido
    backgroundColor: 'transparent', // Cambia el fondo a transparente para evitar que cubra otros elementos
    paddingHorizontal: 15

  },

  scrollContentContainer: {
    paddingVertical: 20 // Añadir espacio vertical si es necesario

  },
  mainContentContainer: {
    paddingHorizontal: 20,
    marginBottom: 40, // Para asegurar que haya espacio entre el contenido principal y los textos "Hello"
    marginHorizontal: 25
  },

  mainContainer: {
    flex: 1,
    backgroundColor: '#0D1520'

  },

  percentagesContainer: {
    flex: 1, // Ocupa todo el espacio disponible
    flexDirection: 'row',
    justifyContent: 'center', // Centra los elementos horizontalmente
    alignItems: 'center', // Centra los elementos verticalmente
    padding: 10,
    backgroundColor: '#212836',
    borderRadius: 5,
    marginHorizontal: height * 0.02,
    marginTop: height * 0.53,
    marginBottom: height * 0.10,
    height: 290
  },
  percentagesBox: {
    flex: 1,
    flexDirection: 'row', // Alinea las columnas horizontalmente
    marginTop: 50,
    marginBottom: 30,
    height: height * 0.20,
    justifyContent: 'center', // Centra verticalmente en la pantalla
    alignItems: 'center' // Centra horizontalmente en la pantalla

  },
  textPorcent: {
    position: 'absolute',
    top: height * 0.01, // Ajustar para que quede en la parte superior
    width: width * 0.8,
    textAlign: 'center',
    color: '#D9E92C',
    fontSize: 20,
    fontWeight: 'bold'
  },
  buttonText1RM: {
    color: '#D9E92C',
    fontWeight: 'bold',
    fontSize: 16

  },

  saveButton1RM: {
    backgroundColor: '#212836',
    height: height * 0.05, // Ajusta la altura relativa a la altura de la pantalla
    width: width * 0.9 + 7, // Ajusta la anchura relativa al ancho de la pantalla
    maxWidth: 400, // Limita el ancho máximo para pantallas grandes
    borderRadius: 5,
    justifyContent: 'center', // Centra el contenido verticalmente
    alignItems: 'center',
    marginTop: height * 0.01

  },
  percentageTextLeft: {
    color: '#bbb',
    fontSize: 20,
    width: 50, // Establece un ancho fijo para los porcentajes
    textAlign: 'right', // Alinea el texto a la derecha para uniformidad
    marginRight: 5 // Ajusta este valor si necesitas más separación
  },
  invisibleBox: {
    flexDirection: 'row',
    padding: 5,
    marginVertical: height * 0.001,
    marginHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%'
  },
  containerPercentage: {
    paddingHorizontal: 10,
    paddingVertical: 10,
    height,
  },
  saved1RMBox: {
    backgroundColor: '#1D2533',
    height: 80,
    borderRadius: 5,
    marginBottom: 15
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10
  },
  exerciseName: {
    paddingTop: 5,
    fontSize: 18,
    color: '#D9E92C', // Color amarillo para el nombre del ejercicio
    marginHorizontal: 15

  },
  dateText: {
    fontSize: 14,
    color: 'white', // Color gris para la fecha
    marginHorizontal: 15,
    paddingTop: 5
  },
  mainRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  oneRMText: {
    fontSize: 30,
    color: '#fff', // Color blanco para el 1RM
    marginHorizontal: 12,
    marginVertical: 5,
    marginTop: -12
  },
  detailsColumn: {
    flexDirection: 'row',
    width: '100%',
    marginTop: -15

  },
  detailItem: {
    marginLeft: 20, // Espaciado entre cada detalle
    marginHorizontal: 1,
    paddingHorizontal: -10
  },
  detailText: {
    fontSize: 12, // Tamaño de la fuente para los detalles (Kg, Series, Reps, Rpe)2,
    color: '#9E9E9E', // Color gris para los labels (Kg, Series, Reps, Rpe)
    textAlign: 'center'

  },
  detailValue: {
    fontSize: 16,
    color: '#fff', // Color blanco para los valores
    textAlign: 'center'
  },
  savedTextDelete: {
    color: 'red',
    textAlign: 'center',
    marginTop: 10
  },
  tonnageTitle: {
    fontWeight: 'bold',
    color: '#e2e8f0',
    flex: 1,
    textAlign: 'center'
  },
  weekBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8
  },
  weekText: {
    color: '#cbd5e0',
    flex: 1,
    textAlign: 'center'
  },
  detailLabel: {
    color: '#cbd5e0',
    marginRight: 4
  },
  entrenamientoMensualContainer: {
    backgroundColor: '#0d1117',
    padding: 20,
    borderRadius: 10,
    width: '90%'
  },
  entrenamientoMensualTitle: {
    fontSize: 18,
    marginBottom: 10,
    color: '#ffffff'
  },
  headerText: {
    fontSize: 12,
    color: '#ffffff'
  },
  highlightText: {
    fontSize: 12,
    color: '#00c853'
  },
  totalsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10
  },
  totalsText: {
    fontSize: 12,
    color: '#ffffff'
  },
  semanaContainer: {
    backgroundColor: '#21262d',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10
  },
  semanaText: {
    fontSize: 12,
    color: '#ffffff'
  },
  totalText: {
    textAlign: 'right'
  },
  nuevaSemanaContainer: {
    backgroundColor: '#00c853',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10
  },
  nuevaSemanaText: {
    fontSize: 12,
    color: '#ffffff',
    textAlign: 'center'
  },
  swipeableContainer: {
    overflow: 'hidden' // Evita el fade al deslizar
  },
  deleteButtonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 80, // Asegúrate de que el ancho sea constante
    height: '100%',
    backgroundColor: 'red' // Asegura que el fondo del botón sea visible
  },
  deleteButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 85,
    height: 80,
    backgroundColor: 'red',
    borderRadius: 5
  },
  deleteButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16
  },
  titleChart: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16
  },
  containerChart: {
    flex: 1,
    padding: 20,
    backgroundColor: '#0A0F16'
  },
  title: {
    fontSize: 24,
    color: '#D9E92C',
    textAlign: 'center',
    marginBottom: 20
  },
  chartContainer: {
    backgroundColor: '#1A2132',
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20
  },
  noDataText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center'
  },
  menuContainer: {
    position: 'absolute',
    backgroundColor: '#FFF',
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 10, // Para Android
    zIndex: 1000, // Para asegurar que esté sobre otros elementos
    width: 200 // Ancho del menú desplegable
  },
  menuItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#DDD',
    position: 'relative',
    paddingVertical: 10
  },
  menuText: {
    fontSize: 16,
    color: '#000'
  },
  filterButtonText: {
    color: '#FFF',
    fontSize: 16
  },
  filterButton: {
    padding: 10,
    backgroundColor: '#313649',
    borderRadius: 5
  },
  filtersContainer: {
    backgroundColor: '#0D1520', // Fondo igual que la pantalla
    paddingVertical: 15,
    paddingHorizontal: 15,
    marginBottom: 15,
    borderRadius: 5,
    borderColor: '#212836',
    borderWidth: 1,
    gap: 20,
  }
})
