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
    marginTop: height * 0.005,
    width: '100%',
    height: height * 0.1 // Ajusta según lo que necesites
  },
  gridItem: {
    width: width * 0.21, // Ajusta el tamaño relativo al ancho de la pantalla
    height: height * 0.11, // Ajusta el tamaño relativo al alto de la pantalla
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
    fontWeight: 'bold'
  },
  weightTextInput: {
    fontSize: width * 0.080,
    color: 'white',
    fontWeight: 'bold',
    marginTop: height * 0.002
  },
  kgText: {
    marginBottom: -2,
    fontSize: width * 0.03,
    color: 'white'
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
  containerPercentage: {
    flex: 1,
    backgroundColor: '#0D1520'
  },
  saved1RMBox: {
    flex: 1,
    height: height * 0.11,
    backgroundColor: '#212836',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center'
  },
  Profile: {
    marginHorizontal: 20
  },
  containerChart: {
    flex: 1,
    backgroundColor: '#0D1520', // Cambia el color de fondo a verde
    justifyContent: 'center', // Opcional, para centrar el contenido verticalmente
    alignItems: 'center' // Opcional, para centrar el contenido horizontalmente
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
    backgroundColor: 'white',
    top: 10,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    right: 25

  },
  column: {
    flex: 1,
    alignItems: 'center', // Cambia a 'center' para centrar los elementos de esta columna
    paddingHorizontal: 1,
    marginHorizontal: height * 0.01

  },
  column2: {
    flex: 1,
    alignItems: 'center', // Cambia a 'center' para centrar los elementos de esta columna
    paddingHorizontal: 10

  },
  percentageTextRight: {
    color: '#bbb',
    fontSize: 20,
    marginHorizontal: height * 0.01,
    marginRight: height * 0.04
  },
  percentageTextLeft: {
    color: '#bbb',
    fontSize: 20,
    marginRight: height * 0.01
  },
  weightTextLeft: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginHorizontal: height * 0.03
  },

  weightTextRight: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold'
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
    height: 250

  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 5,
    marginHorizontal: -10,
    marginLeft: height * 0.011,
    alignSelf: 'flex-start'

  },
  percentagesBox: {
    flex: 1,
    flexDirection: 'row', // Alinea las columnas horizontalmente
    marginTop: 50,
    marginBottom: 20,
    height: height * 0.20,
    justifyContent: 'center', // Centra verticalmente en la pantalla
    alignItems: 'center' // Centra horizontalmente en la pantalla

  },

  separator: {
    height: 1,
    marginTop: 10,
    marginRight: 10
  },

  textPorcent: {
    position: 'absolute',
    bottom: 90, // Fija la distancia desde la parte inferior de la pantalla
    width: width * 0.4,
    zIndex: 1,
    textAlign: 'center',
    color: '#D9E92C',
    fontSize: 26,
    fontWeight: 'bold',
    left: (width * 0.6) / 2.5
  },
  buttonText1RM: {
    color: '#D9E92C',
    fontWeight: 'bold',
    fontSize: 16
  },

  saveButton1RM: {
    backgroundColor: '#212836',
    height: 40, // Define una altura específica para el botón
    paddingHorizontal: width * 0.1,
    borderRadius: 5,
    justifyContent: 'center', // Centra el contenido verticalmente
    alignItems: 'center',
    marginTop: height * 0.01
  }
})
