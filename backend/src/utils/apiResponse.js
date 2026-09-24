export const success = (res, data, status = 200) => {
  return res.status(status).json({ success: true, data });
};

export const failure = (res, message, status = 400) => {
  return res.status(status).json({ success: false, message });
};

export class ApiError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

