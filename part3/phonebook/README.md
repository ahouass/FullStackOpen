# Phonebook Backend

Backend service for the Full Stack Open part 3 phonebook app.

## Prerequisites

- Node.js (LTS recommended)
- MongoDB connection string in `MONGODB_URI`

## Setup

```bash
npm install
```

Create a `.env` file in this folder:

```
MONGODB_URI=your_mongodb_connection_string
PORT=3001
```

## Run

```bash
npm run dev
```

## Lint

```bash
npm run lint
```

## Build (optional)

```bash
npm run build
```

## API

- GET `/api/persons`
- GET `/api/persons/:id`
- POST `/api/persons`
- PUT `/api/persons/:id`
- DELETE `/api/persons/:id`
