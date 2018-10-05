const SHA256 = require('crypto-js/sha256')

class Transaction{
    constructor(fromAddress, toAddress, amount){
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount;
    }
}

class Block{
    constructor(timestamp, transactions, previousHash = ''){
        this.timestamp = timestamp;
        this.transactions = transactions;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
        this.nonce = 0
    }

    calculateHash(){
        return SHA256(this.previousHash + this.timestamp + JSON.stringify(this.data) + this.nonce).toString();
    }

    mineBlock(difficulty){
        while(this.hash.substring(0,difficulty)!== Array(difficulty + 1).join("0")){
            this.nonce++;
            this.hash = this.calculateHash();
            
        }

        console.log("Block mined: " + this.hash);
    }
}

class Blockchain{
    constructor(){
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 5;
        this.pendingTransactions = [];
        this.miningReward = 300;
    }

    createGenesisBlock(){
        return new Block("01/01/2018","Genesis Block","");
    }

    getLastestBlock(){
        return this.chain[this.chain.length - 1];
    }

    minePendingTransactions(miningRewardAddress){
        let block = new Block(Date.now(), this.pendingTransactions);
        //Pick transactions

        block.mineBlock(this.difficulty);

        console.log('Block successfully mined');
        this.chain.push(block);

        this.pendingTransactions = [
            new Transaction(null, miningRewardAddress, this.miningReward)
        ];
    }

    createTransaction(transaction){
        this.pendingTransactions.push(transaction);
    }

    getBalanceOfAddress(address){
        let balance = 0;

        for(const block of this.chain){
            for(const trans of block.transactions){
                if(trans.fromAddress === address){
                    balance -= trans.amount;
                }

                if(trans.toAddress === address){
                    balance += trans.amount;
                }
            }
        }

        return balance;
    }
    
    /*addBlock(newBlock){
        newBlock.previousHash = this.getLastestBlock().hash;
        newBlock.mineBlock(this.difficulty);
        //newBlock.hash = newBlock.calculateHash();
        this.chain.push(newBlock);
    }*/

    isChainValid(){
        for(let i = 1; i < this.chain.length; i++){
           const currentBlock = this.chain[i];
           const previousBlock = this.chain[i - 1];
           
           if(currentBlock.hash !== currentBlock.calculateHash()){
               return false;
           }

           if(currentBlock.previousHash !== previousBlock.hash){
               return false;
           }
        }

        return true;
    }
}

let hicksCoin = new Blockchain();

hicksCoin.createTransaction(new Transaction('address1', 'address2', 100));
hicksCoin.createTransaction(new Transaction('address3', 'address4', 150));
hicksCoin.createTransaction(new Transaction('address4', 'address1', 30));

console.log('\n Starting the miner...');
hicksCoin.minePendingTransactions('hicks-address');

console.log('\n Balance of Hicks is ' + hicksCoin.getBalanceOfAddress('hicks-address'));

console.log('\n Starting the miner again...');
hicksCoin.minePendingTransactions('hicks-address');

console.log('\n Balance of Hicks is ' + hicksCoin.getBalanceOfAddress('hicks-address'));



/*console.log("Mining block 1 ...");
hicksCoin.addBlock(new Block(1, "02/02/2018", {amount: 1}));
console.log("Mining block 2 ...");
hicksCoin.addBlock(new Block(2, "03/03/2018", {amount: 2}));

console.log('Is blockchain valid? ' + hicksCoin.isChainValid());

hicksCoin.chain[1].data = { amount: 100 };
hicksCoin.chain[1].hash = hicksCoin.chain[1].calculateHash();

console.log('Is blockchain valid? ' + hicksCoin.isChainValid());*/