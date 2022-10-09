
import { CustomError } from "./custom-error";

export class ForBiddenError extends CustomError{
  statusCode: number= 403;
 
  constructor(public message:string = 'Forbidden'){
    super(message);
    Object.setPrototypeOf(this, ForBiddenError.prototype)
  }
  serializeErrors() {
    return [{message: this.message}]
  }
}