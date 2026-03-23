#### Basic instructions:-

CLONE THIS REPO

NAVIGATE TO THIS REPO IN YOUR LOCAL SYSTEM

AND DO THESE IN THE TERMINAL

```
cd frontend/frontend
```

```
npm install
```

CREATE `frontend/frontend/.env` AND ADD:

```
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
```

IN CLERK DASHBOARD:

- Create an application.
- Add your local dev URL (for example `http://localhost:5173`) to allowed origins/redirects.
- Enable the sign-in methods you want (Email, Google, etc).

```
npm run dev
```
