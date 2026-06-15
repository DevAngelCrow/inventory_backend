const http = require('http');

fetch('http://localhost:3000/api/v1/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ user_name: 'angelguille1@hotmail.com', password: '$Admin123' })
})
.then(r => r.json())
.then(data => {
  if (!data.data?.access_token) return;
  fetch('http://localhost:3000/api/v1/security/menus/', {
    headers: { Authorization: 'Bearer ' + data.data.access_token }
  })
  .then(r => r.json())
  .then(menus => console.log(JSON.stringify(menus, null, 2)));
});
