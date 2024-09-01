import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0D1520",
    alignItems: "center",
    justifyContent: "center",
    padding: 15,
  },
  containerHomeCalculatorInput: {
    alignItems: "center",
    justifyContent: "center",
    padding: 30,
    top: -170,
    backgroundColor: "#0D1520",
  },
  welcomeText: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 10,
    color: "#ffffff",
    fontWeight: "bold",
  },
  titleConfig: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 10,
    color: "white",
    fontWeight: "bold",
  },
  SubTitulo: {
    fontSize: 12,
    textAlign: "center",
    marginBottom: -20,
    color: "white",
    fontWeight: "400",
  },
  PRG: {
    height: 250,
    width: 200,
    marginTop: -120,
    alignSelf: "center",
    marginBottom: 22,
  },
  PrgVerde: {
    height: 40,
    width: 160,
    marginTop: 40,
    alignSelf: "center",
    right: 80,
    marginBottom: 22,
  },
  Calcula1Rmhead: {
    height: 40,
    width: 160,
    marginTop: -15,
    alignSelf: "center",
    marginBottom: 52,
    right: 70,
    color: "white",
    fontWeight: 'bold',
    fontSize: 20,
  },
  ButtonBack: {
    position: "absolute",
    top: 50,
    left: 20,
  },
  iconButton: {
    position: "absolute",
    top: 50,
    right: 25,
  },
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 100,
    paddingHorizontal: 10,
    
  },
  inputWrapper: {
    flexGrow: 1,
    position: 'relative',
    width: 140, // Ancho específico de los inputs
    height: 52, // Alto específico de los inputs
    backgroundColor: '#2b303b', // Fondo oscuro como en la imagen
    borderRadius: 8, // Bordes redondeados
    justifyContent: 'center',
    marginHorizontal: 9,
    padding: 5,
   

  },
  labelText: {
    position: 'absolute',
    top: 5,
    left: 8,
    fontSize: 12,
    color: 'gray', // Color de las letras pequeñas "Kg" y "Reps"
  },
  textInput: {
    flex: 1,
    color: 'white', // Color del texto dentro del input
    textAlign: 'center',
    fontSize: 24, // Tamaño de la fuente del texto dentro del input
    fontWeight: 'bold',
    paddingLeft: 30, // Aumenta el padding para evitar que el texto del input cubra la etiqueta
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: 1,
    marginTop: -45,
  },
  gridItem: {
    width: 60.87,
    height: 86.49,
    marginVertical: 3,
    backgroundColor: '#2b303b',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  repsText: {
    color: 'white',
    fontSize: 16,
    fontWeight: "bold",
    
  },
  weightText: {
    fontSize: 24,
    color: 'white',
    fontWeight: 'bold',
    marginTop: 5,
  },
  kgText: {
    fontSize: 12,
    color: 'white',
  },
  profileChild: {
    top: 53,
    backgroundColor: "#e70000",
    width: 320,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    borderRadius: 10,
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
    right: 70,
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
  },
  profileFb: {
    top: 70,
    backgroundColor: "#3D7FFF",
    width: 320,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    borderRadius: 10,
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
    right: 60,
  },
  buttonContentFb: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
  },
});
