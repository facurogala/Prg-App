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
    padding: 20,
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
   mainContainer: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#0D1520",
  },
  PrgVerde: {
    width: 130,
    height: 100,
    resizeMode: "contain",
    marginVertical: 20,
    right: 95,
  },
  Calcula1Rmhead: {
    fontSize: 16,
    color: "white",
    marginTop: -90,
    right: 100,
    padding: 45,
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
    alignItems: 'center',
    marginTop: -10,
    width: '100%', // Ajuste el ancho del contenedor de los inputs
  },
  inputWrapper: {
    width: 150,  // Ancho específico de los inputs
    height: 60,
    backgroundColor: '#2b303b',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 8,
  },
  labelText: {
    position: 'absolute',
    top: 5,
    left: 8,
    fontSize: 12,
    color: 'gray',
  },
  textInputKgReps: {
    color: 'white',
    textAlign: 'center',
    fontSize: 50,
    fontWeight: 'bold',
    
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: 10,
    marginTop:10,
    width: '105%', // Mismo ancho que el contenedor de los inputs
  },
  gridItem: {
    width: '22%',
    height: 80,
    marginVertical: 5,
    backgroundColor: '#2b303b',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 1,
  },
  repsText: {
    color: '#D9E92C', // Color verde similar al de la imagen
    fontSize: 20,
    fontWeight: "bold",
    
  },
  weightText: {
    fontSize: 26,
    color: 'white',
    fontWeight: 'bold',
    marginTop: 2,
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
