
import './api.js'; 
import './auth.js';
import { router } from './router.js'; 

// Initializes the router on page load
window.addEventListener('DOMContentLoaded', router);
window.addEventListener('hashchange', router);



