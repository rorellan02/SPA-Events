# Event Management SPA
This is a simple HTML, CSS, and JavaScript SPA that allows the administrator to manage event CRUDs and allows registered visitors to view and register for events.

Features
The administrator can create, view, edit, and delete events.

The administrator can edit the event's capacity and name.

The visitor can view and register for events.

The capacity is dynamic, based on the number of people registering.

# Project Structure

The following files are located in the public folder:
db.json # Local database
index.html    # HTML structure of the form
styles.css    # Styles for the page
js folder     # JavaScript logic
   api.js     # CRUD logic for the JSON server
   apps.js    # The program entry point
   auth.js    # Login and registration logic
   router.js  # Route logic
   views.js   # View rendering logic

# Instructions for Use
Download this repository to your computer.

2. Install dependencies:
```
npm install
```

3. Start the API:
```
npm run start:api
```

4. Start the local server:
```
npm start
```

5. Open in browser: `http://127.0.0.1:8080/login`

## Default users

- **Administrador:** admin@example.com / admin123


# Requirements
Modern browser (Chrome, Firefox, Edge, etc.)
Node.js installed


