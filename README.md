# CoreInventory

A small full-stack inventory app:

- **Backend** — an ASP.NET Core (.NET 9) Web API in `CoreInventory/` exposing product CRUD endpoints plus a health-check ping. Data lives in a thread-safe in-memory store seeded with sample products (no database required to run).
- **Frontend** — a Next.js 16 dashboard (root `app/`, `components/`, `lib/`) that consumes the API with SWR and falls back to sample data when the API is unreachable.

## API endpoints

| Method | Route                  | Description                          |
| ------ | ---------------------- | ------------------------------------ |
| GET    | `/api/status/ping`     | Health check, returns `pong`         |
| GET    | `/api/products`        | List all products                    |
| GET    | `/api/products/{id}`   | Get a single product                 |
| POST   | `/api/products`        | Create a product (`name` required)   |
| PUT    | `/api/products/{id}`   | Update a product                     |
| DELETE | `/api/products/{id}`   | Delete a product                     |

CORS is enabled for `http://localhost:3000`, `https://localhost:3000`, and `http://localhost:3001`.

## Running the API

Requires the [.NET 9 SDK](https://dotnet.microsoft.com/download).

```bash
cd CoreInventory
dotnet run
```

The API listens on `http://localhost:5193` (and `https://localhost:7202` with the `https` profile).
You can exercise every endpoint from `CoreInventory/CoreInventory.http`.

## Running the frontend

```bash
npm install
npm run dev
```

By default the dashboard calls `http://localhost:5193`. Override the API base URL with the
`NEXT_PUBLIC_API_URL` environment variable if your API runs elsewhere.
