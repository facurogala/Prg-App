Aplicación Powerlifting 1RM PRG

Esta es una aplicación Android desarrollada con React Native, diseñada para deportistas de powerlifting. La app permite calcular el 1RM (One Repetition Maximum), trackear levantamientos y visualizar el rendimiento a lo largo del tiempo mediante gráficos.

Características

Cálculo de 1RM: Realiza cálculos automáticos del 1RM según el peso levantado y las repeticiones.

Registro de levantamientos: Guarda tus levantamientos con detalles como el ejercicio, el peso utilizado, las repeticiones, la fecha y notas adicionales.

Visualización de progreso: Gráficos lineales para analizar el progreso en sentadilla, peso muerto y press de banco a lo largo del tiempo.

Historial: Consulta tus levantamientos más pesados de cada semana y filtra por ejercicios o períodos de tiempo.

Instalación

Sigue estos pasos para instalar y ejecutar la aplicación localmente:

Clona el repositorio:

git clone <url_del_repositorio>

Entra en la carpeta del proyecto:

cd nombre_de_la_app

Instala las dependencias necesarias:

npm install

Inicia la aplicación en un dispositivo Android o emulador:

npx react-native run-android

Uso

Pantalla Principal: Calcula el 1RM ingresando el peso y las repeticiones, y guarda el levantamiento.

Pantalla de Detalles: Agrega notas y edita los levantamientos guardados.

Pantalla de Porcentajes: Consulta los levantamientos guardados y observa tu rendimiento semanal.

Gráficos: Selecciona el período de tiempo para visualizar tu progreso.

Estructura del Proyecto

/assets: Imágenes y recursos estáticos.

/screens: Todas las pantallas principales de la aplicación (e.g., HomeScreen, SaveDetailsScreen, PercentageScreen).

/components: Componentes reutilizables que se utilizan en diferentes partes de la app.

/context: Proveedores de contexto para la gestión del estado global.

Dependencias

React Native: Marco de desarrollo para aplicaciones móviles.

React Navigation: Para la navegación entre pantallas.

Biome: Linter para mantener un código limpio y consistente.

Contribución

Si deseas contribuir a este proyecto:

Haz un fork del repositorio.

Crea una rama para tu función (git checkout -b feature/nueva-funcion).

Realiza tus cambios y haz commits descriptivos.

Envía un Pull Request.

Autor

Facundo Cataldo Rogala.

Licencia

Este proyecto está bajo la Licencia MIT.
