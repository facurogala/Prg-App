import { StyleSheet, Dimensions } from 'react-native';


const { width, height } = Dimensions.get('window');


export const styles = StyleSheet.create({
  
  container: {
    flex: 1,
    backgroundColor: "#0D1520",
    alignItems: "center",
    justifyContent: "center",
    padding: width * 0.05,
    marginTop: height * 0.02,
  },
  containerHomeCalculatorInput: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#0D1520",
    marginBottom: -50,
    marginTop: height * 0.02,
    
  },
  welcomeText: {
    fontSize: width * 0.05,
    textAlign: "center",
    marginBottom: height * 0.02,
    color: "#ffffff",
    fontWeight: "bold",
  },
  titleConfig: {
    fontSize: width * 0.05,
    color: "white",
    marginTop: height * 0.02,
    paddingHorizontal: width * 0.1,
    textAlign: "center",
  },
  SubTitulo: {
    fontSize: width * 0.04,
    textAlign: "center",
    marginBottom: height * 0.01,
    color: "white",
    fontWeight: "400",
  },
  PRG: {
    width: 290,
    height: 220,
    marginTop: height * 0.02,
    alignSelf: "center",
    marginBottom: height * 0.03,
  },
  mainContainer: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#0D1520",

  },
  PrgVerde: {
    position: 'absolute',
    top: 15,
    width: width * 0.4,
    height: height * 0.1,
    resizeMode: 'contain',
    zIndex: 1,
    marginBottom: height * 0.013,
  },
     Calcula1Rmhead: {
    fontSize: width * 0.05,
    color: 'white',
    marginTop: height * 0.09, // Ajusta el espacio debajo de la imagen PRG
    paddingHorizontal: width * 0.1,
    textAlign: 'center',
    marginBottom: height * 0.001,
    fontWeight: "bold",
    position: 'relative',


  },
  iconButton: {
    position: "absolute",
    top: height * 0.05,
    right: width * 0.05,
  },
  contentContainer: {
    flex: 1,
    marginTop: height * 0.22, // Ajusta el espacio superior para el resto del contenido
    justifyContent: 'flex-start',
  },
  inputContainerTodo: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: width * 0.03,
    marginTop: height * 0.015,
  },
  inputWrapper: {
    flex: 1,
    marginHorizontal: width * 0.01,
    height: height * 0.08,
    backgroundColor: '#212836',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 15,

  },
  labelText: {
    position: 'absolute',
    top: height * 0.01,
    left: width * 0.02,
    fontSize: width * 0.04,
    color: 'gray',
  },
  textInputKgReps: {
    color: 'white',
    textAlign: 'center',
    fontSize: width * 0.1,
    fontWeight: 'bold',
    resizeMode: "contain",
    flex: 1,
    paddingHorizontal: 35,
  
    
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    paddingHorizontal: width * 0.03,
    marginTop: height * 0.005,
    width: '100%',
    height: height * 0.1, // Ajusta según lo que necesites
  },
  gridItem: {
    width: width * 0.21, // Ajusta el tamaño relativo al ancho de la pantalla
    height: height * 0.11, // Ajusta el tamaño relativo al alto de la pantalla
    marginVertical: height * 0.01,
    backgroundColor: '#212836',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 1,
  },
    
  repsText: {
    color: '#D9E92C',
    fontSize: width * 0.05,
    fontWeight: "bold",
  },
  weightTextInput: {
    fontSize: width * 0.080,
    color: 'white',
    fontWeight: 'bold',
    marginTop: height * 0.002,
  },
  kgText: {
    marginBottom: -2,
    fontSize: width * 0.03,
    color: 'white',
  },
  profileChild: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "#e70000",
    width: width * 0.8,
    height: height * 0.05,
    borderRadius: 10,
    marginTop: height * 0.07,
  },
  continuarConGoogle: {
    fontWeight: "500",
    textAlign: "center",
    color: "#ffffff",
  },
  iconGoogle: {
    width: 22,
    height: 25,
    resizeMode: "contain",
    marginRight: 10,
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  profileFb: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "#3D7FFF",
    width: width * 0.8,
    height: height * 0.05,
    borderRadius: 10,
    marginTop: height * 0.1,
  },
  continuarConFb: {
    fontWeight: "500",
    textAlign: "center",
    color: "#ffffff",
  },
  iconFacebook: {
    width: 20,
    height: 20,
    resizeMode: "contain",
    marginRight: 10,
  },
  buttonContentFb: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  containerNavBar: {
    bottom: 60,
    backgroundColor: "#0D1520",
    height: -100,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: 'space-between',
    position: "absolute",
  },
navHome: {
  marginHorizontal: 20, // Ajusta el margen según tus necesidades
},
Chart: {
  marginHorizontal: 20,
},
porcentaje: {
  marginHorizontal: 20,
},
Profile: {
  marginHorizontal: 20,
},
containerChart: {
  flex: 1, 
    backgroundColor: '#0D1520', // Cambia el color de fondo a verde
    justifyContent: 'center', // Opcional, para centrar el contenido verticalmente
    alignItems: 'center', // Opcional, para centrar el contenido horizontalmente
},

containerPercentage: {
  flex: 1, // Asegúrate de que el contenedor ocupe toda la pantalla
    backgroundColor: '#0D1520', // Cambia el color de fondo a verde
    justifyContent: 'center', // Opcional, para centrar el contenido verticalmente
    alignItems: 'center', // Opcional, para centrar el contenido horizontalmente
  },
  containerProfile: {
    flex: 1, 
      backgroundColor: '#0D1520', // Cambia el color de fondo a verde
      justifyContent: 'center', // Opcional, para centrar el contenido verticalmente
      alignItems: 'center', // Opcional, para centrar el contenido horizontalmente
    },
 containerChart: {
      flex: 1, 
        backgroundColor: '#0D1520', // Cambia el color de fondo a consumo
        justifyContent: 'center', // Opcional, para centrar el contenido verticalmente
        alignItems: 'center', // Opcional, para centrar el contenido horizontalmente
      },
   
      containerSetting: {
        flex: 1, 
          backgroundColor: '#0D1520', // Cambia el color de fondo a verde
          justifyContent: 'center', // Opcional, para centrar el contenido verticalmente
          alignItems: 'center', // Opcional, para centrar el contenido horizontalmente
        },
   settingButton: {
     position: "absolute",
      backgroundColor: "white",
      top: 10,        
      width: 30, 
      height: 30, 
      justifyContent: "center",
      alignItems: "center",
      right: 25, 
      },

      containerPercentage: {
        flex: 1,
        backgroundColor: '#f5f5f5', // Color de fondo claro para una mejor visibilidad
        padding: 20,
      },
      title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
      },
      itemContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'red',
        padding: 15,
        marginVertical: 5,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
      },
      percentageText: {
        fontSize: 18,
        fontWeight: '500',
        color: '#333333',
      },
      weightTextPercentage: {
        fontSize: 18,
        fontWeight: '500',
        color: '#333333',
      }, 
      
   

});