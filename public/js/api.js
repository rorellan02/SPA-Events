
export const api = {
  base: 'http://localhost:3000', 

  // GET function
  get: async (p) => {
    try {
      const res = await fetch(`${api.base}/${p}`);
      if (!res.ok) throw new Error(`Error GET: ${res.status}`);
      return await res.json();
    } catch (err) {
      console.error(err);
      return null;
    }
  },

  // POST function
  post: async (p, data) => {
    try {
      const res = await fetch(`${api.base}/${p}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error(`Error POST: ${res.status}`);
      return await res.json();
    } catch (err) {
      console.error(err);
      return null;
    }
  },

 // PUT function
  put: async (p, data) => {
    try {
      const res = await fetch(`${api.base}/${p}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error(`Error PUT: ${res.status}`);
      return await res.json();
    } catch (err) {
      console.error(err);
      return null;
    }
  },

 // DELETE function
  del: async (p) => {
    try {
      const res = await fetch(`${api.base}/${p}`, {
        method: 'DELETE'
      });
      if (!res.ok) throw new Error(`Error DELETE: ${res.status}`);
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  }
};
































