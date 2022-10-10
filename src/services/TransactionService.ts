import { NotFoundError } from "./../errors";
import { TransactionRepository } from "../database";

class TransactionService {
  private txnRepository;
  constructor() {
    this.txnRepository = new TransactionRepository();
  }
  async createTransaction(data: any) {
    try {
      const transaction = await this.txnRepository.createTransaction(data);
      return transaction;
    } catch (error) {
      throw error;
    }
  }
  async getAllTransaction() {
    try {
      const transactions = await this.txnRepository.allTransactions({});
      if (transactions.length === 0) {
        throw new NotFoundError("No Transactions Found");
      }
      return transactions;
    } catch (error) {
      throw error;
    }
  }
  async viewTransactionDetails(txnId: string) {
    try {
      const transaction = await this.txnRepository.findTransactionById(txnId);
      if (!transaction) {
        throw new NotFoundError("No Transaction Found");
      }
      return transaction;
    } catch (error) {
      throw error;
    }
  }

  async validateTransaction(txnId: string) {
    const currentTransaction = await this.viewTransactionDetails(txnId);
    if (currentTransaction) {
      if (currentTransaction.status.toLowerCase() !== "failed") {
        return { status: true, currentTransaction };
      }
    }
    return { status: false, currentTransaction };
  }
}

export const txnService = new TransactionService()