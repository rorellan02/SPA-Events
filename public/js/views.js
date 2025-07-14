
import { api } from './api.js'; 
import { auth } from './auth.js'; 

// Display a page not found message
export function renderNotFound() {
  document.getElementById('app').innerHTML = '<h2>Page not found</h2>';
}

// Login function
export async function showLogin() {
  document.getElementById('app').innerHTML = `
    <div class="login-container">
      <form id="form" class="login-form card">
        <h2 style="text-align:center; margin-bottom:1em;">Login</h2>
        <input type="email" id="e" placeholder="email">
        <input type="password" id="p" placeholder="pass">
        <button>Enter</button>
        <br>
        <a href="#/register" data-link>Don't have an account? Sign up</a>
      </form>
    </div>`;
  document.getElementById('form').onsubmit = async e => {
    e.preventDefault();
    try {
      await auth.login(e.target.e.value, e.target.p.value);
      location.hash = '#/dashboard';
      router();
    } catch (err) {
      alert(err.message);
    }
  };
}

// Implements the log view
export async function showRegister() {
  document.getElementById('app').innerHTML = `
    <div class="login-container">
      <form id="f" class="login-form card">
        <h2 style="text-align:center; margin-bottom:1em;">Registration</h2>
        <input placeholder="nombre" id="n">
        <input placeholder="email" id="e">
        <input placeholder="pass" id="p">
        <button>Register</button>
      </form>
    </div>`;
  document.getElementById('f').onsubmit = async e => {
    e.preventDefault();
    try {
      await auth.register(e.target.n.value, e.target.e.value, e.target.p.value);
      location.hash = '#/dashboard';
      router();
    } catch (err) {
      alert(err.message);
    }
  };
}

// Implements the main view of the dashboard
export async function showDashboard() {
  const u = auth.getUser();
  document.getElementById('app').innerHTML = `
    <h2>Welcome, ${u.name} (${u.role})</h2>
    <button id="out">Go out</button>
    <nav>
      <a href="#/dashboard/events" data-link>See event</a>
      ${u.role === 'admin' ? `<a href="#/dashboard/events/create" data-link>Create Event</a>` : ''}
    </nav>`;
  document.getElementById('out').onclick = auth.logout;
  document.querySelectorAll('[data-link]').forEach(a => {
    a.onclick = e => {
      e.preventDefault();
      location.hash = a.getAttribute('href');
    };
  });
}

// function for the list of courses
export async function showEvents() {
  const u = auth.getUser();
  const events = await api.get('events'); 
  document.getElementById('app').innerHTML = `
    <h2>Available events</h2>
    <a href="#/dashboard">← Back to top</a>
    <ul>${events.map(c => `
      <li> #Id ${c.id} - ${c.title || 'Untitled'} (${c.capacity || 0} slots) — Planner: ${c.planner || 'N/A'}
        ${u.role === 'admin' ? `<a href="#/dashboard/events/edit/${c.id}">Edit</a>` : ''}
        ${u.role === 'admin' ? `<a href="#/dashboard/events/delate/${c.id}">Delate</a>` : ''}
        ${u.role === 'visitor' ? `<button class="enroll-btn" data-id="${c.id}">Enrool</button>` : ''}
      </li>`).join('')}</ul>`;

  if (u.role === 'visitor') {
    document.querySelectorAll('.enroll-btn').forEach(btn => {
      btn.onclick = async () => {
        const eventId = btn.dataset.id;
        const event = await api.get('events/' + eventId); 

        if (!event.enrolled) event.enrolled = [];
        if (event.enrolled.includes(u.email)) {
          alert('You are already registered for this event.');
          return;
        }

        if (event.enrolled.length >= event.capacity) {
          alert('This course is already full.');
          return;
        }

        event.enrolled.push(u.email);
        event.capacity -= 1;
        await api.put('events/' + eventId, event); 
        alert('Successful event registration!');
        showEvents();
      };
    });
  }
}


// Function to create an event
export function showCreateEvents() {
  document.getElementById('app').innerHTML = `
    <h2>Create events </h2>
    <a href="#/dashboard">← Back to top</a>
    <form id="f">
      <input placeholder="Title" id="title" required>
      <input placeholder="Planner" id="planner" required>
      <input type="number" placeholder="Capacity" id="capacity" required min="1">
      <button>Save</button>
    </form>
  `;

  document.getElementById('f').onsubmit = async e => {
    e.preventDefault();

    const data = {
      title: e.target.title.value.trim(),
      planner: e.target.planner.value.trim(),
      capacity: parseInt(e.target.capacity.value),
      enrolled: [] 
    };

    if (!data.title || !data.planner || isNaN(data.capacity) || data.capacity < 1) {
      alert('.Please complete all fields correctly.');
      return;
    }

    await api.post('events', data); 
    location.hash = '#/dashboard/events';
  showEvents();
  };
}


// Implements the view to edit a course
export async function showEditEvents() {
  const user = auth.getUser();

  if (!user || user.role !== 'admin') {
    renderNotFound();
    return;
  }

  const eventId = location.hash.split('/').pop();
  const event = await api.get('events/' + eventId); 

  if (!event) {
    renderNotFound();
    return;
  }

  document.getElementById('app').innerHTML = `
    <h2>Edit Event</h2>
    <a href="#/dashboard">← Back to top</a>

    <form id="f">
      <input id="title" placeholder="Title" value="${event.title}" required>
      <input id="planner" placeholder="Planner" value="${event.planner}" required>
      <input type="number" id="capacity" placeholder="Capacity" value="${event.capacity}" min="1" required>
      <button>Save</button>
    </form>`;

  document.getElementById('f').onsubmit = async e => {
    e.preventDefault();

    const updated = {
      title: e.target.title.value.trim(),
      planner: e.target.planner.value.trim(),
      capacity: parseInt(e.target.capacity.value),
      enrolled: event.enrolled || [] 
    };

    if (!updated.title || !updated.planner || isNaN(updated.capacity) || updated.capacity < 1) {
      alert('Please complete all fields correctly.');
      return;
    }

    await api.put('events/' + eventId, updated); 
    location.hash = '#/dashboard/events';
    showEvents();
  };
}
export async function showDelateEvents() {
  const user = auth.getUser();

  if (!user || user.role !== 'admin') {
    renderNotFound();
    return;
  }

  const eventId = location.hash.split('/').pop();
  const event = await api.get('events/' + eventId); 

  if (!event) {
    renderNotFound();
    return;
  }

  document.getElementById('app').innerHTML = `
    <h2>Delate Event</h2>

    <a href="#/dashboard">← Back to top</a>
    <h2>Are you sure you want to delete the event ${event.title} with ID number ${event.id} <h2>

    <form id="f">
     <p>confirm the id number to delete<p>
      <input id="id" placeholder="ID"  required>
     
      <button>Delate</button>
    </form>`;

  document.getElementById('f').onsubmit = async e => {
    e.preventDefault();

    const id = parseInt(e.target.id.value);
    
    
    if (id === event.id) {
      await api.del('events/' + eventId, id); 
      alert("successfully removed")
    location.hash = '#/dashboard/events';
    showEvents();
      
     
    }
    else {
    alert('Please the ID number is incorrect.');
     return;
    }
  };
}



