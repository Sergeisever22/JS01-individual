const fs = require('fs');

class TransactionAnalyzer {
    constructor(transactions) {
        this.transactions = transactions;
    }

    addTransaction(transaction) {
        this.transactions.push(transaction);
    }

    getAllTransactions() {
        return this.transactions;
    }

    getUniqueTransactionTypes() {
        const types = new Set();
        this.transactions.forEach(transaction => {
            types.add(transaction.transaction_type);
        });
        return Array.from(types);
    }

    calculateTotalAmount() {
        return this.transactions.reduce((total, transaction) => {
            return total + parseFloat(transaction.transaction_amount);
        }, 0);
    }

    calculateTotalAmountByDate(year, month, day) {
        return this.transactions.reduce((total, transaction) => {
            const transactionDate = new Date(transaction.transaction_date);
            if (
                (!year || transactionDate.getFullYear() === year) &&
                (!month || transactionDate.getMonth() + 1 === month) &&
                (!day || transactionDate.getDate() === day)
            ) {
                total += parseFloat(transaction.transaction_amount);
            }
            return total;
        }, 0);
    }

    getTransactionsByType(type) {
        return this.transactions.filter(transaction => transaction.transaction_type === type);
    }

    getTransactionsInDateRange(startDate, endDate) {
        startDate = new Date(startDate);
        endDate = new Date(endDate);
        return this.transactions.filter(transaction => {
            const transactionDate = new Date(transaction.transaction_date);
            return transactionDate >= startDate && transactionDate <= endDate;
        });
    }

    getTransactionsByMerchant(merchantName) {
        return this.transactions.filter(transaction => transaction.merchant_name === merchantName);
    }

    calculateAverageTransactionAmount() {
        const totalAmount = this.calculateTotalAmount();
        return totalAmount / this.transactions.length;
    }

    getTransactionsByAmountRange(minAmount, maxAmount) {
        return this.transactions.filter(transaction => {
            const amount = parseFloat(transaction.transaction_amount);
            return amount >= minAmount && amount <= maxAmount;
        });
    }

    calculateTotalDebitAmount() {
        return this.transactions.reduce((total, transaction) => {
            if (transaction.transaction_type === 'debit') {
                total += parseFloat(transaction.transaction_amount);
            }
            return total;
        }, 0);
    }

    findMostTransactionsMonth() {
        const months = new Array(12).fill(0);
        this.transactions.forEach(transaction => {
            const month = new Date(transaction.transaction_date).getMonth();
            months[month]++;
        });
        const maxTransactions = Math.max(...months);
        return months.indexOf(maxTransactions) + 1; 
    }

    findMostDebitTransactionMonth() {
        const debitTransactions = this.getTransactionsByType('debit');
        const months = new Array(12).fill(0);
        debitTransactions.forEach(transaction => {
            const month = new Date(transaction.transaction_date).getMonth();
            months[month]++;
        });
        const maxTransactions = Math.max(...months);
        return months.indexOf(maxTransactions) + 1;
    }

    mostTransactionTypes() {
        const debitCount = this.getTransactionsByType('debit').length;
        const creditCount = this.getTransactionsByType('credit').length;
        if (debitCount > creditCount) {
            return 'debit';
        } else if (debitCount < creditCount) {
            return 'credit';
        } else {
            return 'equal';
        }
    }

    getTransactionsBeforeDate(date) {
        date = new Date(date);
        return this.transactions.filter(transaction => {
            return new Date(transaction.transaction_date) < date;
        });
    }

    findTransactionById(id) {
        return this.transactions.find(transaction => transaction.transaction_id === id);
    }

    mapTransactionDescriptions() {
        return this.transactions.map(transaction => transaction.transaction_description);
    }
}

const rawData = fs.readFileSync('transactions.json');
const transactions = JSON.parse(rawData);

const analyzer = new TransactionAnalyzer(transactions);