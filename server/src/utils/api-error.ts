class ApiError extends Error {
  statusCode: number;
  success: boolean;
  message: string;
  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
    this.message = message;
    this.success = false;
  }
}

export default ApiError;
