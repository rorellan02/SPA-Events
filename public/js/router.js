
import { auth } from './auth.js';
import {
  showLogin, 
  showRegister, 
  showDashboard, 
  showEvents, 
  showEditEvents,
  showCreateEvents,
  showDelateEvents,
  renderNotFound 
} from './views.js';


const routes = {
  '#/login': showLogin, 
  '#/register': showRegister, 
  '#/dashboard': showDashboard, 
  '#/dashboard/events': showEvents, 
  '#/dashboard/events/create': showCreateEvents, 
 
};

export function router() {
  const path = location.hash || '#/login';
  const user = auth.getUser();

 
  if (path.startsWith('#/dashboard') && !auth.isAuthenticated()) {
    location.hash = '#/login';
    return;
  }

  
  if ((path === '#/login' || path === '#/register') && auth.isAuthenticated()) {
    location.hash = '#/dashboard';
    return;
  }
  if (path.startsWith('#/dashboard/events/delate/')) {
    showDelateEvents(); 
  }
 
  if (path.startsWith('#/dashboard/events/edit/')) {
    showEditEvents(); 
  }

 
  const view = routes[path];
  if (view) {
    view();
  } else {
    renderNotFound(); 
  }
}

