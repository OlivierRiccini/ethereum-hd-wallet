const ethers = require('ethers');
const mnemonic = 'upset fuel enhance depart portion hope core animal innocent will athlete snack';

// ------------------- 1 -------------------------
const restoreHDWallet = (memonic) => {
    return ethers.Wallet.fromMnemonic(memonic);
}

// console.log(restoreHDWallet(mnemonic));

// ------------------- 2 -------------------------
const generateMnemonic = () => { 
    const randomEntropyBytes = ethers.utils.randomBytes(16);
    return ethers.utils.HDNode.entropyToMnemonic(randomEntropyBytes);
}

const generateRandomHDNode = () => { 
    const mnemonic = generateMnemonic();
    return ethers.utils.HDNode.fromMnemonic(mnemonic);
}

// console.log(generateRandomHDNode());

// ------------------- 3 -------------------------
const generateRandomHDWallet = () => {
    return ethers.Wallet.createRandom();
}

// console.log(generateRandomHDWallet());

// ------------------- 4 -------------------------
const saveWalletAsJson = async (wallet, password) => {
    return wallet.encrypt(password);
}

const decryptWallet = async (json, password) => {
    return ethers.Wallet.fromEncryptedJson(json, password);
}

(async () => {
    const wallet = ethers.Wallet.createRandom();
    const password = 'p@$$word';
    const json = await saveWalletAsJson(wallet, password);

    const walletDecrypted = await decryptWallet(json, password);
    // console.log(walletDecrypted);
})();

// ------------------- 5 -------------------------
const deriveFiveWalletsFromHdNode = (mnemonic, derivationPath) => {
    const wallets = [];

    for (let i = 0; i < 5; i++) {
        const hdNode = ethers.utils.HDNode.fromMnemonic(mnemonic).derivePath(derivationPath + '/' + i);
        const wallet = new ethers.Wallet(hdNode.privateKey);
        // console.log('address ', wallet.address);
        wallets.push(wallet);
    }
    return wallets;
}

const signTransaction = (wallet, toAddress, value) => {
    const transaction = {
        nonce: 0,
        gasLimit: 21000,
        gasPrice: ethers.utils.bigNumberify('2000000000'),
        to: toAddress,
        value: ethers.utils.parseEther(value),
        data: '0x'
    }
    return wallet.sign(transaction);
}

const derivationPath = "m/44'/60'/0'/0";
// const derivationPath = "m/44'/60'/0'";
const wallets = deriveFiveWalletsFromHdNode(mnemonic, derivationPath);
const wallet = wallets[1];
const recipient = '0x933b946c4fec43372c5580096408d25b3c7936c5';
const value = '1.0';

(async () => {
    const signedTransaction = await signTransaction(wallet, recipient, value);
    console.log('Signed Transaction:\n' + signedTransaction);
})();