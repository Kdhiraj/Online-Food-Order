import { CustomError } from "./custom-error";

export class DataBaseConnectionError extends CustomError {
  statusCode:number = 500;
  reason: string = "Error in connecting to DB";
  constructor() {
    super('Error in connecting to DB');
    Object.setPrototypeOf(this, DataBaseConnectionError.prototype);
  }
  serializeErrors() {
    return [{ message: this.reason }];
  }
}
