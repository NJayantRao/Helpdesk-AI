class ApiResponse<T> {
  statusCode: number;
  success: boolean;
  message: string;
  data?: T | undefined;
  constructor(statusCode: number, message: string, data?: T) {
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
    this.success = statusCode < 400;
  }
}

export default ApiResponse;
