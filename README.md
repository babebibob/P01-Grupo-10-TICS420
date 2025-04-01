# Proyecto: Procesador de Empresas Nuevas en Chile

## 📄 Descripción

Cada día se publican nuevos PDFs en el "Diario Oficial" con información sobre empresas creadas en Chile.  
Este sistema tiene como objetivo *automatizar la lectura de esos documentos, **extraer la información relevante* y *estructurarla para su consulta* mediante una interfaz web.

## 🚀 Funcionalidades

### 1. Extracción automatizada de datos
- Procesamiento diario de los PDFs publicados en el Diario Oficial.
- Identificación de información clave como:
  - Razón social
  - RUT de la empresa
  - Datos de los accionistas o quienes la conforman

### 2. Base de datos y almacenamiento estructurado
- Almacenamiento de los datos extraídos en una base de datos relacional.
- Relación entre empresas, accionistas y otras entidades registradas.

### 3. Búsqueda y consulta avanzada
- Buscador con filtros por:
  - RUT
  - Razón social
  - Nombre de accionista
- Posibilidad de exportar resultados a *CSV* o *JSON*.

### 4. Visualización en formato grafo
- Visualización interactiva de relaciones entre empresas y personas, al estilo de la web “¿De quién es?”.

---

## 🛠 Tecnologías utilizadas

- *Frontend:* React + Vite
- *Backend:* Node.js + Express
- *Base de datos:* (Por definir: MySQL / PostgreSQL / MongoDB)
- *Otros:* Librerías para parsing de PDF y visualización de grafos

---
