import { Transaction } from "../models";

export class TransactionRepository {
  async createTransaction(data: any) {
    try {
      const transaction = await new Transaction(data).save();
      return transaction;
    } catch (error) {
      throw error;
    }
  }

  async findTransactionById(transactionId: string) {
    try {
      const transaction = await Transaction.findOne({ _id: transactionId });
      return transaction;
    } catch (error) {
      throw error;
    }
  }

  async allTransactions(query: any) {
    try {
      const transactions = await Transaction.find(query).sort({
        createdAt: -1,
      });
      return transactions;
    } catch (error) {
      throw error;
    }
  }
}
