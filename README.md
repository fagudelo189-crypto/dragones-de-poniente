# 🐉 Dragones de Poniente

Sitio web de fans sobre los dragones de *Canción de Hielo y Fuego* y *Casa del Dragón*.

## 📄 Contenido

- **Portada** con dragón SVG animado
- **6 fichas**: Drogon, Rhaegal, Viserion, Balerion, Vermithor y Syrax
- **8 fichas de personajes**: Daenerys, Jon, Tyrion, Aegon, Rhaenyra, Daemon, Jorah y Viserys
- **Cronología** de 8 hitos de la Casa Targaryen
- **Galería** de 8 escenas vectoriales con lightbox
- **Contadores** animados y tema claro/oscuro

## 🛠️ Tecnologías

HTML, CSS y JavaScript puros. Sin frameworks, sin dependencias, sin build.

## 📁 Archivos

```
Proyecto/
├── index.html    estructura y contenido
├── styles.css    estilos, temas y animaciones
├── script.js     filtros, lightbox, contadores, tema
├── README.md
└── .gitignore
```

## 💻 Uso

Abre `index.html` con doble clic. No hace falta servidor ni instalación.

Para probarlo en local:

```bash
python -m http.server 8000
```

Y visita `http://localhost:8000`.

## 🔍 Funcionalidades

- Filtros por era y buscador de texto en las fichas
- Lightbox con navegación por teclado (← → y Esc)
- Contadores animados al hacer scroll
- Tema claro/oscuro guardado en `localStorage`
- Diseño responsive y soporte para `prefers-reduced-motion`

## ⚖️ Aviso legal

Proyecto educativo y de fans, sin ánimo de lucro. Personajes y mundo © George R. R. Martin / HBO.