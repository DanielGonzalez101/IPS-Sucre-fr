Instrucciones de UI: Sección de Servicios con Grilla y Persona Superpuesta

Construir una sección de servicios interactiva posicionada debajo del Hero Section y el componente de estadísticas.

1. Contenedor Principal (Wrapper)

position: relative.

background-color: Gris muy claro o hueso. Implementar un gradiente radial verde muy suave o una mancha difuminada en el fondo hacia la derecha.

border-radius: 24px a 32px.

padding: 40px a 48px.

Importante: No usar overflow: hidden en este contenedor padre, ya que la imagen del doctor debe sobresalir por el borde superior.

2. Cabecera de la Sección

Etiqueta superior (Chip): Forma de píldora, fondo verde/lima claro, texto "Servicios" o "+ Servicios".

Título: Etiqueta H2, fuente audaz, tamaño grande, color oscuro.

3. Grilla de Servicios (CSS Grid)

Contenedor para las 10 tarjetas proporcionadas.

Usar CSS Grid: display: grid. Configurar columnas responsivas (ej. grid-template-columns: repeat(auto-fit, minmax(180px, 1fr))).

gap: 16px a 24px.

Asignar un max-width a la grilla para dejar espacio libre a la derecha donde irá la imagen del doctor (ej. width: 70% del contenedor principal).

4. Anatomía de la Tarjeta Individual (Card)

background-color: Blanco sólido.

border-radius: 16px.

padding: 20px.

display: flex, flex-direction: column, justify-content: space-between.

Parte Superior de la Tarjeta:

display: flex, justify-content: space-between, align-items: flex-start.

Izquierda: Espacio para un icono SVG representativo del servicio.

Derecha: Un icono de flecha diagonal (↗).

Parte Inferior de la Tarjeta:

Título (ej. "Consulta", "Ecocardiograma"): Fuente peso medio/audaz, color oscuro.

Subtítulo (ej. "Cardiología Pediátrica"): Fuente tamaño pequeño, peso regular, color gris secundario.

Estado Hover:

Al hacer hover sobre la tarjeta, el contenedor del icono de la flecha debe adquirir un fondo circular negro y la flecha cambiar a blanco.

5. Imagen Superpuesta (Efecto Pop-out)

position: absolute.

bottom: 0, right: 0 o right: 5%.

z-index: 10.

El borde inferior de la imagen debe alinearse con el borde inferior del contenedor principal.

La altura de la imagen debe ser mayor que la altura del contenedor principal para que la cabeza/hombros sobresalgan del límite superior (efecto pop-out).

Ruta estricta de la imagen: '/Users/camilo/Bindeg/Desarrollo/CardioCentro Sucre/IPS-Cardiocentro-pediatrico-de-sucre/public/personal Medico/Dr. Leandro Ruiz Moreno/perso9.png'. Ajustar ruta según configuración del framework.

6. Enlace de Acción

Colocar el enlace "Saber más" debajo de la grilla de servicios.

Estilo: Texto con subrayado o acompañado de un icono de flecha, manteniendo el diseño limpio.

Datos para iterar en las tarjetas:

Consulta / Cardiología Pediátrica

Ecocardiograma / Cardiología Pediátrica

Electrocardiograma / Cardiología Pediátrica

Holter 24 Horas / Cardiología Pediátrica

Monitoreo de presión arterial 24 horas (mapa) / Cardiología Pediátrica

Ecografía General / Radiología / Diagnóstico por imágenes

Doppler color / Radiología / Diagnóstico por imágenes

Rayos X / Radiología / Diagnóstico por imágenes

Mamografía / Radiología / Diagnóstico por imágenes

Tomografía / Radiología / Diagnóstico por imágenes