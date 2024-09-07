import { db, type Transaction } from '.';

export function withTransaction<T>(
	operation: (tx: Transaction) => Promise<T>,
	providedTx?: Transaction
): Promise<T> {
	return providedTx ? operation(providedTx) : db.transaction(operation);
}
