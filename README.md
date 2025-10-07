# Tarea PDS — CRUD de Usuarios con Pruebas Basadas en Propiedades


Sitema creado utilizando **Node.js + TypeScript + Express**. Se implementa un CRUD de usuarios en memoria, validado con **Zod**, y probado mediante **property-based testing** usando **fast-check** y **Jest**.

## Tecnologías principales

* Node.js 18+
* TypeScript
* Express
* Zod (validaciones)
* Jest
* fast-check (property-based testing)

## Instalación y ejecución

```bash
git clone https://github.com/CarlosEsteban-afk/tarea-pds.git
cd tarea-pds
npm install
npm run build
npm start   
```

Modo desarrollo:

```bash
npm run dev
```

Ejecutar pruebas:

```bash
npm test
```

## Scripts

* `build`: compila TypeScript a `dist/`
* `start`: ejecuta `node dist/index.js`
* `dev`: ejecuta con `--watch`
* `test`: corre las pruebas con Jest

## API REST

| Método | Ruta       | Descripción        | Códigos       |
| ------ | ---------- | ------------------ | ------------- |
| POST   | /users     | Crear usuario      | 201, 400      |
| GET    | /users     | Listar todos       | 200           |
| GET    | /users/:id | Obtener por id     | 200, 404      |
| PUT    | /users/:id | Actualizar usuario | 200, 400, 404 |
| DELETE | /users/:id | Eliminar usuario   | 204, 404      |



## Validaciones (Zod)

* **Crear**: `name` (string no vacío), `email` (formato válido)
* **Actualizar**: ambos opcionales, mismas reglas

## Pruebas basadas en propiedades

Las pruebas se diseñaron para verificar comportamientos generales, no casos específicos:

* **Create** → crear usuario válido siempre devuelve `201` y datos correctos.
* **Read** → tras crear N usuarios, `/users` devuelve exactamente N.
* **Update** → mantiene el `id` y actualiza campos correctamente.
* **Delete** → tras eliminar, el usuario ya no existe (`404`).

Cada propiedad se ejecuta múltiples veces (`numRuns`) con entradas aleatorias generadas por `fast-check`.

## Estructura del proyecto

```
.
├── jest.config.cjs
├── package.json
├── package-lock.json
├── README.md
├── src
│   └── index.ts
├── tests
│   └── crud.test.ts
└── tsconfig.json

2 directories, 8 files
```

## Integrantes

Integrantes: 
- Agustín Troncoso
- Carlos Iturra
- Carlos Peña