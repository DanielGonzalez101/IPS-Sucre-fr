# Guía de Estilos UI: Arquitectura "Bento Box"

## 1. Filosofía del Diseño
El estilo visual de esta interfaz se basa en la tendencia conocida como **"Bento Box"** (cajas bento) combinada con un enfoque de **Soft UI** (UI suave). 
* **Sensación transmitida:** El diseño busca ser amigable, altamente estructurado, accesible y moderno. 
* **Ausencia de tensión visual:** Se evita por completo el uso de bordes afilados o líneas divisorias duras; la separación de contenido se logra mediante el contraste sutil de los fondos de las tarjetas y los espacios vacíos (gaps).

## 2. Sistema de Layout General (Grilla)
La vista está construida sobre un contenedor principal que agrupa los elementos en una cuadrícula bidimensional (ideal para **CSS Grid**).

* **Estructura principal:** Se divide visualmente en dos filas principales.
* **Fila Superior (Hero Section):** Compuesta por 2 columnas. La proporción visual es aproximadamente `1fr 1fr` (50% - 50%), aunque en pantallas muy anchas la imagen podría tomar un poco más de protagonismo.
* **Fila Inferior (Features/Details):** Compuesta por 3 columnas de igual tamaño, es decir, una proporción `1fr 1fr 1fr` (33.3% cada una).
* **Espaciado (Gap):** Existe un canal de separación (`gap`) estrictamente uniforme entre todas las tarjetas, tanto vertical como horizontalmente.

## 3. Anatomía de Componentes

### 3.1. Tarjetas (Cards)
* **Contenedores:** Todos los bloques de contenido son tarjetas con un radio de borde (`border-radius`) muy pronunciado (aproximadamente `24px` a `32px`).
* **Fondos:** Utilizan colores planos muy tenues o imágenes completas (`object-cover`).

### 3.2. Tipografía y Jerarquía
* **Títulos (H1/H2):** Fuente *sans-serif*, peso audaz (*bold/semibold*), tamaño grande y un interlineado (*line-height*) ajustado para mantener el texto compacto.
* **Resaltado de texto:** Uso de fondos sutiles con bordes redondeados detrás de ciertas palabras clave dentro del mismo título principal para dar énfasis sin cambiar el color de la letra.
* **Párrafos:** Texto secundario en un peso regular, más pequeño, con un color ligeramente más apagado (menor opacidad o gris oscuro) para no competir con el título.

### 3.3. Elementos Interactivos e Indicadores
* **Botones y Etiquetas (Chips):** Siguen una regla estricta de "forma de píldora" (`border-radius: 9999px`). 
* **Tipos de botones:** Hay un contraste claro entre el botón primario (fondo sólido) y el botón secundario (fondo transparente con borde delgado).
* **Grupo de Avatares:** Uso de imágenes circulares superpuestas (overlapping) con márgenes negativos, terminando con una etiqueta de resumen numérico (ej. "+68").

### 3.4. Elementos Flotantes (Absolute Positioning)
* **Tarjetas superpuestas:** En la imagen principal (arriba a la derecha), se utiliza una pequeña tarjeta blanca de calificación posicionada de forma absoluta en la esquina inferior derecha. Tiene una sombra paralela muy suave (`drop-shadow`) para separarla del fondo fotográfico.

## 4. Reglas de Espaciado (White Space)
* **Padding interno:** Las tarjetas tienen un relleno interior generoso (aprox. `32px` a `40px`). Esto asegura que el texto y los elementos nunca toquen los bordes redondeados, manteniendo la sensación de amplitud.
* **Ritmo vertical:** Dentro de la tarjeta principal (arriba a la izquierda), hay una separación clara: la etiqueta superior respira respecto al título, el título tiene un margen inferior notable antes del párrafo, y hay un espacio amplio antes de llegar a la botonera y los avatares en la base.

## 5. Justificación UX/UI (El "Porqué")
* **Escaneo en "Z" o "F":** La distribución *Bento Box* es excelente para dirigir el ojo. El usuario comienza leyendo la propuesta de valor fuerte arriba a la izquierda, salta a la validación emocional (la fotografía de la derecha) junto con su prueba social (la tarjeta de estrellas), y finalmente escanea los detalles secundarios en las tres cajas inferiores.
* **Agrupación lógica (Ley de Proximidad):** Al agrupar los botones de acción junto con la prueba social (los avatares) en la misma tarjeta, se incrementa la probabilidad de conversión, ya que el usuario siente que otros ya confían en el servicio justo en el momento en que se le pide hacer clic.
* **Reducción de carga cognitiva:** Las esquinas redondeadas y el uso de etiquetas visuales ("chips") hacen que la información compleja se perciba como digerible y fácil de procesar.