### Link Manager app


# full stack analogy 

<p>The Full Stack Restaurant:
PostgreSQL = The Storage/Warehouse

Where all the raw ingredients are stored (your data)
Organized in shelves/freezers (tables)
Has inventory lists (rows of data)

Express.js (server.js) = The Kitchen

Takes orders from customers
Goes to the warehouse (PostgreSQL) to get ingredients
Prepares the food (processes data)
Sends it back to the waiter

Frontend api.js = The Waiter

Takes orders from customers
Delivers orders to kitchen
Brings food back to customers

React Components = The Customers

They want food (data)
They tell the waiter what they want
They receive and consume the food

Real example flow:

Customer (React): "I want to see all my links"
Waiter (api.js): Makes request → GET /api/links
Kitchen (Express): "Got it! Let me check the warehouse"
Warehouse (PostgreSQL): Kitchen queries → SELECT * FROM links
Warehouse → Kitchen: Returns rows of data
Kitchen → Waiter: Formats as JSON response
Waiter → Customer: Delivers the data to React component
Customer: Displays links on screen

So PostgreSQL is definitely the supplier/warehouse! It just stores raw data. Express is the one that knows how to get it, process it, and serve it properly.
</p>


# Visual flow of TanStack query data flow 

User clicks "Create"
        │
        ▼
handleSubmit() runs
        │
        ▼
createCategoryMutation.mutate({ name, color })
        │
        ▼
mutationFn(categoryData) → categoriesAPI.create(categoryData)
        │
        ▼
axios.post('/api/categories', { name, color })
        │
        ▼
 Backend creates category in DB
        │
        ▼
 React Query receives response
        │
        ├─ onSuccess → invalidate queries + reset form
        └─ onError → log or display error



1. mutationFn defines how the data is sent or changed on the backend.

2. mutate(argument) provides what data to send.

3. The argument passed to .mutate() becomes the parameter for mutationFn.

4. onSuccess and onError handle post-result actions.

5. queryClient.invalidateQueries() refreshes related cached queries automatically.


# Visual flow of the  whole project

┌─────────────────────────────────────────────────────────────┐
│                        YOUR COMPUTER                         │
├──────────────────────────┬──────────────────────────────────┤
│       FRONTEND           │          BACKEND                  │
│   (React - Port 5173)    │    (Express - Port 3000)         │
│                          │                                   │
│  ┌─────────────────┐     │     ┌──────────────────┐         │
│  │  LinkForm       │     │     │  routes/links.js │         │
│  │  (Customer)     │────HTTP────▶│  (Kitchen)       │        │
│  │                 │  Request│  │                  │         │
│  │ "Create link"   │     │     │ "Got request!"   │         │
│  └─────────────────┘     │     └────────┬─────────┘         │
│           │              │              │                    │
│           ▼              │              ▼                    │
│  ┌─────────────────┐     │     ┌──────────────────┐         │
│  │  api.js         │     │     │  db.js (pool)    │         │
│  │  (Waiter)       │     │     │  (Phone to       │         │
│  │                 │     │     │   warehouse)     │         │
│  │ linksAPI.create │     │     └────────┬─────────┘         │
│  │ axios.post()    │     │              │                    │
│  └─────────────────┘     │              ▼                    │
│           │              │     ┌──────────────────┐         │
│           │              │     │  PostgreSQL      │         │
│           │              │     │  (Warehouse)     │         │
│           ▼              │     │                  │         │
│  ┌─────────────────┐     │     │ INSERT INTO...   │         │
│  │ React Query     │     │     └──────────────────┘         │
│  │ (Manager)       │◀────HTTP Response─────────────────────│
│  │                 │     │                                   │
│  │ Cache & Update  │     │                                   │
│  │ UI automatically│     │                                   │
│  └─────────────────┘     │                                   │
└──────────────────────────┴───────────────────────────────────┘


** To do ** 

- [] break main dashboard to smaller components
- [] check for improvements with AI, expecialy in dashboard component















---------------------------
- [] todo item one
- [x] completed item