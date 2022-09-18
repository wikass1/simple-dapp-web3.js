const bnbBalance = document.querySelector(".bnb-balance");
const shortAddress = document.querySelector(".short-address");
const sign_in_btn = document.querySelector("#sign-in-btn");
const sign_up_btn = document.querySelector("#sign-up-btn");
const container = document.querySelector(".container");
const inputbnb = document.querySelector("#bnb");
const infoBlock = document.querySelector(".infoBlock");
var form = document.getElementById("buyTokens");
var form1 = document.getElementById("claimtoken");
const btnConnect = document.querySelector(".btnConnect");
document.querySelector("#btn_close").addEventListener("click", openModal);
document.querySelector("#btn_metamask").addEventListener("click", metamask);
document.querySelector("#btn_trust").addEventListener("click", trustWallet);
document
  .querySelector("#btn_walletConnect")
  .addEventListener("click", walletConnect);

function handleForm(event) {
  event.preventDefault();
}

form.addEventListener("submit", handleForm);
form1.addEventListener("submit", handleForm);

let web3, selectedAccount, balance, provider, web3Modal;
let Web3Modal = window.Web3Modal.default;
const WalletConnectProvider = window.WalletConnectProvider.default;

let providerOptions = {
  walletconnect: {
    package: WalletConnectProvider,
    options: {
      rpc: {
        56: "https://bsc-dataseed.binance.org/",
      },
      network: "binance",
      chainId: 97,
      infuraId: "27e484dcd9e3efcfd25a83a78777cdf1",
      pollingInterval: "10000",
    },
  },
};

const contractAddress = "0x17Bb386b40de4E66cC8a98360899AE57CeB03FBA";
const AbiOfContract = [
  {
    inputs: [{ internalType: "address", name: "_tokenAddr", type: "address" }],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "beneficiary",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "BnbDeposited",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "beneficiary",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "TokenDeposited",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "beneficiary",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "TokenTransfer",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "fromAddress",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "contractAddress",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "toAddress",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "amountTransfered",
    type: "event",
  },
  {
    inputs: [],
    name: "ExchangeBNBforTokenMannual",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    name: "_owner",
    outputs: [{ internalType: "address payable", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "", type: "address" }],
    name: "balances",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address[]", name: "_recipients", type: "address[]" },
    ],
    name: "blacklistAddress",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "bnbBalance",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "bnbDecimal",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "claim",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "claimIn",
    outputs: [{ internalType: "bool", name: "success", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "claimToken",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "depositCrypto",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "_amount", type: "uint256" }],
    name: "depositTokens",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address[]", name: "_recipients", type: "address[]" },
      { internalType: "uint256[]", name: "_amount", type: "uint256[]" },
    ],
    name: "dropTokens",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "hardCap",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "maxContribution",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "minContribution",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "tokenAddr",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "tokenBalance",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "tokenDecimal",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "", type: "address" }],
    name: "tokenExchanged",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "tokenPriceBnb",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalHardCap",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalTransaction",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256[]", name: "amounts", type: "uint256[]" },
      {
        internalType: "address payable[]",
        name: "receivers",
        type: "address[]",
      },
    ],
    name: "transferCrypto",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address payable", name: "newOwner", type: "address" },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "turnWhitelist",
    outputs: [{ internalType: "bool", name: "success", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "newHardcapValue", type: "uint256" },
    ],
    name: "updateHardCap",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "newTokenAddr", type: "address" },
    ],
    name: "updateTokenAddress",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "min", type: "uint256" },
      { internalType: "uint256", name: "max", type: "uint256" },
    ],
    name: "updateTokenContribution",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "newDecimal", type: "uint256" }],
    name: "updateTokenDecimal",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "newTokenValue", type: "uint256" },
    ],
    name: "updateTokenPrice",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "whitelist",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address[]", name: "_recipients", type: "address[]" },
    ],
    name: "whitelistAddress",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "", type: "address" }],
    name: "whitelisted",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address payable", name: "beneficiary", type: "address" },
    ],
    name: "withdrawCrypto",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "beneficiary", type: "address" }],
    name: "withdrawTokens",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  { stateMutability: "payable", type: "receive" },
];

inputbnb.addEventListener("input", calculateToken);

function openModal() {
  if (document.querySelector(".modal").style.display === "block") {
    document.querySelector(".modal").style.display = "none";
  } else {
    document.querySelector(".modal").style.display = "block";
  }
}

async function metamask() {
  if (window.ethereum && window.ethereum.isMetaMask) {
    await window.ethereum.request({ method: "eth_requestAccounts" });
    provider = window.ethereum;
  } else {
    swal("Error", "Metamask wallet is not found.", "error");
    return;
  }
  fetchAccountData();
  provider.on("accountsChanged", (accounts) => {
    console.log("account", accounts);
    fetchAccountData();
  });

  provider.on("chainChanged", (chainId) => {
    console.log("chainId", chainId);
    fetchAccountData();
  });
}

async function trustWallet() {
  if (window.ethereum && window.ethereum.isTrust) {
    await window.ethereum.request({ method: "eth_requestAccounts" });
    provider = window.ethereum;
  } else {
    swal("Error", "Trust wallet is not found.", "error");
    return;
  }

  fetchAccountData();
  provider.on("accountsChanged", (accounts) => {
    fetchAccountData();
  });

  provider.on("chainChanged", (chainId) => {
    fetchAccountData();
  });
}
async function walletConnect() {
  web3Modal = new Web3Modal({
    providerOptions,
    cacheProvider: false,
    disableInjectedProvider: true,
    theme: "dark",
  });
  provider = await web3Modal.connect();

  fetchAccountData();
  provider.on("accountsChanged", (accounts) => {
    console.log("account", accounts);
    fetchAccountData();
  });

  provider.on("chainChanged", (chainId) => {
    console.log("chainId", chainId);
    fetchAccountData();
  });
}
async function fetchAccountData() {
  web3 = new Web3(provider);
  window.ethereum = provider;
  const chainID = await web3.eth.getChainId();
  const BnbChainId = 56; // BNB Mainnet
  console.log(chainID);
  if (chainID != BnbChainId) {
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: web3.utils.toHex(BnbChainId) }],
      });
    } catch (err) {
      // This error code indicates that the chain has not been added to MetaMask
      if (err.code === 4902) {
        await window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              chainName: "BNB Smart Chain",
              chainId: web3.utils.toHex(chainID),
              nativeCurrency: { name: "BNB", decimals: 8, symbol: "BNB" },
              rpcUrls: ["https://bsc-dataseed.binance.org/"],
            },
          ],
        });
      }
    }
    return;
  }

  document.querySelector(".modal").style.display = "none";
  const accounts = await web3.eth.getAccounts();
  if (accounts.length) {
    balance = await web3.eth.getBalance(accounts[0]);
    selectedAccount = accounts[0];
    afterLogin(selectedAccount);
    form.innerText = "BUY";
    inputbnb.readOnly = false;
    swal("Success!", "You are connected to Smart Aliens Dapp", "success");
  } else {
    form.innerText = "CONNECT TO BUY";
  }
}

function calculateToken() {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  var contractInstance = new ethers.Contract(
    contractAddress,
    AbiOfContract,
    provider
  );
  (async () => {
    // Modern dapp browsers...
    var contractPrice = parseInt(await contractInstance.tokenPriceBnb());
    console.log("PRICE :");
    console.log(await contractInstance.tokenPriceBnb());
    var priceBnb = contractPrice / 1000000000000000000;
    console.log(priceBnb);
    var x = document.getElementById("bnb").value;
    var amount = parseFloat(x / priceBnb);
    console.log(amount);
    document.getElementById("priceToken").value = amount;

    var bnbcollected = parseInt(await contractInstance.bnbBalance());
    console.log(bnbcollected);
    var remainingPercent = parseFloat(
      (parseFloat(bnbcollected / 1e18) / 1000) * 100
    ).toFixed(1);
    console.log(remainingPercent);
    document.getElementById("filled").innerHTML = remainingPercent + "%";
    document.getElementById("filled").style.width = remainingPercent + "%";
  })();
}

async function buyToken() {
  if (!selectedAccount) {
    openModal();
    return;
  }
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  var contractInstance = new ethers.Contract(
    contractAddress,
    AbiOfContract,
    provider.getSigner()
  );

  const finalAmount = parseInt(
    parseFloat(document.getElementById("bnb").value) * 1e18
  );
  console.log(await contractInstance.balances(selectedAccount));
  const amountContributed =
    finalAmount + parseInt(await contractInstance.balances(selectedAccount));
  const whitelistActivation = await contractInstance.whitelist();
  console.log(balance, amountContributed);
  if (amountContributed >= 1e15 && amountContributed <= 10e18) {
  } else {
    swal(
      "Error",
      "Minimum contribution is 0.5 BNB and maximum is 5 BNB.",
      "error"
    );
    return false;
  }
  if (Number(balance) < Number(amountContributed)) {
    swal("Error", "Insufficient balance!", "error");
    return false;
  }
  if (whitelistActivation) {
    const checkUser = await contractInstance.whitelisted(selectedAccount);
    if (!checkUser) {
      swal("Error", "You Are Not Whitelisted to Buy.", "error");
      return false;
    }
  }

  const hash = await contractInstance.ExchangeBNBforTokenMannual({
    value: finalAmount.toString(),
  });
  await provider.waitForTransaction(hash.hash, 1);
  swal("Success", "Token Purchased Sucessfully!", "success");
}

async function claim() {
  if (!selectedAccount) {
    openModal();
    return;
  }
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  var contractInstance = new ethers.Contract(
    contractAddress,
    AbiOfContract,
    provider.getSigner()
  );
  const amountContributed = parseInt(
    await contractInstance.tokenExchanged(selectedAccount)
  );
  const claimActivation = await contractInstance.claim();
  console.log(document.getElementById("tokenstoclaim").value);
  if (document.getElementById("tokenstoclaim").value == "") {
    document.getElementById("tokenstoclaim").value = amountContributed / 1e18;
    document.getElementById("claimtoken").value = "Claim Token";
    return false;
  }

  if (amountContributed > 0) {
  } else {
    swal("Error", "You Dont Have Anything to Claim", "error");
    return false;
  }

  if (!claimActivation) {
    swal("Error", "You Cannot Claim Now, Come Again Later", "error");
    return false;
  }

  const hash = await contractInstance.claimToken();
  await provider.waitForTransaction(hash.hash, 1);
  swal("Success", "Token Claimed Sucessfully!", "success");
}

const copy = document.querySelector("#copy");
const copyText = document.querySelector("#copy-text");

copy.addEventListener("click", () => {
  navigator.clipboard.writeText("0x17Bb386b40de4E66cC8a98360899AE57CeB03FBA");
  copyText.textContent = "Copied!";
  setTimeout(() => {
    copyText.textContent = "Copy";
  }, 1500);
});

const afterLogin = (account) => {
  console.log(account);
  const string =
    account.slice(0, 3) + "..." + account.slice(-5, account.length);
  infoBlock.innerHTML = string;
};
