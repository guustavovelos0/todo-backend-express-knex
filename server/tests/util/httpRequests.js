const request = require('supertest');

const app = require('../../server.js');


// a helper function to make a POST request.
function post(url, body, headers) {
  const httpRequest = request(app).post(url);
  httpRequest.send(body);
  httpRequest.set('Accept', 'application/json')
  httpRequest.set('Origin', 'http://localhost:5000')
  if (headers && headers.Authorization) {
    httpRequest.set('Authorization', headers.Authorization);
  }
  return httpRequest;
}

// a helper function to make a GET request.
function get(url, headers) {
  const httpRequest = request(app).get(url);
  httpRequest.set('Accept', 'application/json')
  httpRequest.set('Origin', 'http://localhost:5000')
  if (headers && headers.Authorization) {
    httpRequest.set('Authorization', headers.Authorization);
  }

  return httpRequest;
}

// a helper function to make a PATCH request.
function patch(url, body, headers) {
  const httpRequest = request(app).patch(url);
  httpRequest.send(body);
  httpRequest.set('Accept', 'application/json')
  httpRequest.set('Origin', 'http://localhost:5000')
  if (headers && headers.Authorization) {
    httpRequest.set('Authorization', headers.Authorization);
  }
  return httpRequest;
}

// a helper function to make a DELETE request.
function del(url, headers) {
  const httpRequest = request(app).delete(url);
  httpRequest.set('Accept', 'application/json')
  httpRequest.set('Origin', 'http://localhost:5000')
  if (headers && headers.Authorization) {
    httpRequest.set('Authorization', headers.Authorization);
  }
  return httpRequest;
}


module.exports = {
  post,
  get,
  patch,
  del,
  delete: del
};
