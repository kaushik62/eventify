// Standard API response helpers

// Send a successful JSON response
export const success = (res, data, status = 200) => {
  return res.status(status).json({ success: true, data });
};

// Send an error JSON response
export const failure = (res, message, status = 400) => {
  return res.status(status).json({ success: false, message });
};

// Custom API Error class with status code
export class ApiError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}
