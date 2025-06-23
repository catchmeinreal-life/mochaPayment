

//payment api
class User {

  constructor(users) {
    this.users = users;
  }
    makePayment(senderAccount, receiverAccount, amount) {
        const sender = this.users.find(user => user.accountNumber === senderAccount);
        const receiver = this.users.find(user => user.accountNumber === receiverAccount);
    
        if (!sender || !receiver) {
        return { error: "Invalid account number(s)" };
        }
    
        if (sender.balance < amount) {
        return { error: "Insufficient balance" };
        }
    
        sender.balance -= amount;
        receiver.balance += amount;
    
        return { message: "Payment successful", sender, receiver };
    }
    getUserBalance(accountNumber) {
        const user = this.users.find(user => user.accountNumber === accountNumber);
        if (!user) {
            return { error: "User not found" };
        }
        return { balance: user.balance };
    }
    getAllUsers() {
        return this.users;
    }
}

const usersDb = new User(demoUsers);

const demoUsers = [
    { name: "Matutu", accountNumber: "123456789", balance: 500},
    { name: "Cheche", accountNumber: "987654321", balance: 800}
]


exports.default = demoUsers;