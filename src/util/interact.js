import { pinJSONToIPFS } from "./pinata.js";
require("dotenv").config();
const alchemyKey = process.env.REACT_APP_ALCHEMY_KEY;
const contractABI = require("../contract-abi.json");
const contractABI_WETH = require("../WETH-abi.json");

//for V2:
//const contractAddress = "0x5606a59fd38C4AC228c515a91CDFE28441875141";
//for V3:
//const contractAddress = "0x0112261fd5D6F92323CA5c7e24F490D87A4Ac136";
//for V4:
// const contractAddress = "0x905214292564484c46D0B341161a005C73e65C73";
//for V6:
const contractAddress = "0x4D4617BAeB7D047f1e58B622de444d3a7a4508a2";
const contractWETH = "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619";


const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const web3 = createAlchemyWeb3(alchemyKey);

//--------------
var nodeFetch = require("node-fetch");
const fetch = require('node-fetch');
//--------------


export const connectWallet = async () => {
  if (window.ethereum) {
    try {
      const addressArray = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const obj = {
        status: "👆🏽 Write a message in the text-field above.",
        address: addressArray[0],
      };
      return obj;
    } catch (err) {
      return {
        address: "",
        status: "😥 " + err.message,
      };
    }
  } else {
    return {
      address: "",
      status: (
        <span>
          <p>
            {" "}
            🦊{" "}
            <a target="_blank" href={`https://metamask.io/download.html`}>
              You must install Metamask, a virtual Ethereum wallet, in your
              browser.
            </a>
          </p>
        </span>
      ),
    };
  }
};

export const getCurrentWalletConnected = async () => {
  if (window.ethereum) {
    try {
      const addressArray = await window.ethereum.request({
        method: "eth_accounts",
      });
      if (addressArray.length > 0) {
        return {
          address: addressArray[0],
          status: "Mint a Pal'Futbolito NFT above!",
        };
      } else {
        return {
          address: "",
          status: "Connect to Metamask using the top right button.",
        };
      }
    } catch (err) {
      return {
        address: "",
        status: "😥 " + err.message,
      };
    }
  } else {
    return {
      address: "",
      status: (
        <span>
          <p>
            {" "}
            🦊{" "}
            <a target="_blank" href={`https://metamask.io/download.html`}>
              You must install Metamask, a virtual Ethereum wallet, in your
              browser.
            </a>
          </p>
        </span>
      ),
    };
  }
};

async function loadContract() {
  return new web3.eth.Contract(contractABI, contractAddress);
}

async function loadWETHContract() {
  return new web3.eth.Contract(contractABI_WETH, contractWETH);
}

export const mintNFT = async (url, name, description) => {
  //if (url.trim() == "" || name.trim() == "" || description.trim() == "") {
  if (false) {
    return {
      success: false,
      status: "❗Please make sure all fields are completed before minting.",
    };
  }

  //make metadata
  // const metadata = new Object();
  // metadata.name = name;
  // metadata.image = url;
  // metadata.description = description;

 // const image_array = ["https://gateway.pinata.cloud/ipfs/QmZsrtNMqJGeQKKWr4tk7SmYSUP51TfEA6w8uEtGy8UDeT/1-10/sheet%205/gold/3@4x-8.png", "https://gateway.pinata.cloud/ipfs/QmZsrtNMqJGeQKKWr4tk7SmYSUP51TfEA6w8uEtGy8UDeT/1-10/sheet%205/silver/3@4x-8.png", "https://gateway.pinata.cloud/ipfs/QmZsrtNMqJGeQKKWr4tk7SmYSUP51TfEA6w8uEtGy8UDeT/1-10/sheet%205/silver/3@4x-8.png","https://gateway.pinata.cloud/ipfs/QmZsrtNMqJGeQKKWr4tk7SmYSUP51TfEA6w8uEtGy8UDeT/1-10/sheet%205/bronze/3@4x-8.png","https://gateway.pinata.cloud/ipfs/QmZsrtNMqJGeQKKWr4tk7SmYSUP51TfEA6w8uEtGy8UDeT/1-10/sheet%205/bronze/3@4x-8.png","https://gateway.pinata.cloud/ipfs/QmZsrtNMqJGeQKKWr4tk7SmYSUP51TfEA6w8uEtGy8UDeT/1-10/sheet%205/bronze/3@4x-8.png"];
  const image_array = [["https://gateway.pinata.cloud/ipfs/QmZitU94CUn4JyqVjx6AfnBMp5qrecLqH1kvei9sNvMxcz/7@4x.png", "https://gateway.pinata.cloud/ipfs/QmVjKq7kWoSfR9eKwqQdCCX8L64rC2EzhKdicvRX2gD7Tc/SIlver/4x/7@4x.png", "https://gateway.pinata.cloud/ipfs/QmVjKq7kWoSfR9eKwqQdCCX8L64rC2EzhKdicvRX2gD7Tc/SIlver/4x/7@4x.png","https://gateway.pinata.cloud/ipfs/QmVjKq7kWoSfR9eKwqQdCCX8L64rC2EzhKdicvRX2gD7Tc/Bronze/4x/7@4x.png","https://gateway.pinata.cloud/ipfs/QmVjKq7kWoSfR9eKwqQdCCX8L64rC2EzhKdicvRX2gD7Tc/Bronze/4x/7@4x.png","https://gateway.pinata.cloud/ipfs/QmVjKq7kWoSfR9eKwqQdCCX8L64rC2EzhKdicvRX2gD7Tc/Bronze/4x/7@4x.png"], ["https://gateway.pinata.cloud/ipfs/QmZitU94CUn4JyqVjx6AfnBMp5qrecLqH1kvei9sNvMxcz/9@4x.png", "https://gateway.pinata.cloud/ipfs/QmVjKq7kWoSfR9eKwqQdCCX8L64rC2EzhKdicvRX2gD7Tc/SIlver/4x/9@4x.png", "https://gateway.pinata.cloud/ipfs/QmVjKq7kWoSfR9eKwqQdCCX8L64rC2EzhKdicvRX2gD7Tc/SIlver/4x/9@4x.png","https://gateway.pinata.cloud/ipfs/QmVjKq7kWoSfR9eKwqQdCCX8L64rC2EzhKdicvRX2gD7Tc/Bronze/4x/9@4x.png","https://gateway.pinata.cloud/ipfs/QmVjKq7kWoSfR9eKwqQdCCX8L64rC2EzhKdicvRX2gD7Tc/Bronze/4x/9@4x.png","https://gateway.pinata.cloud/ipfs/QmVjKq7kWoSfR9eKwqQdCCX8L64rC2EzhKdicvRX2gD7Tc/Bronze/4x/9@4x.png"], ["https://gateway.pinata.cloud/ipfs/QmZitU94CUn4JyqVjx6AfnBMp5qrecLqH1kvei9sNvMxcz/11@4x.png", "https://gateway.pinata.cloud/ipfs/QmVjKq7kWoSfR9eKwqQdCCX8L64rC2EzhKdicvRX2gD7Tc/SIlver/4x/11@4x.png", "https://gateway.pinata.cloud/ipfs/QmVjKq7kWoSfR9eKwqQdCCX8L64rC2EzhKdicvRX2gD7Tc/SIlver/4x/11@4x.png","https://gateway.pinata.cloud/ipfs/QmVjKq7kWoSfR9eKwqQdCCX8L64rC2EzhKdicvRX2gD7Tc/Bronze/4x/11@4x.png","https://gateway.pinata.cloud/ipfs/QmVjKq7kWoSfR9eKwqQdCCX8L64rC2EzhKdicvRX2gD7Tc/Bronze/4x/11@4x.png","https://gateway.pinata.cloud/ipfs/QmVjKq7kWoSfR9eKwqQdCCX8L64rC2EzhKdicvRX2gD7Tc/Bronze/4x/11@4x.png"], ];

  const name_array = ["Saab", "Volvo", "BMW"];


  const metadata = new Object();
  // metadata.name = "Zodiac Cards #12828";
  var serial_num = [Math.floor(Math.random() * 2022)];
  var str_serial_num = serial_num.toString();
  var part1_str_serial_num = "Pal'Futbolito #"

  //-----------------
  //Algorithm to draw for JSON Server:
  // var base_string = 'https://zodiaccards-json-server.herokuapp.com/cards/'
  var base_string = "ipfs://QmaDEmXqawRsMSM2SMnEdgiXnTPdeN3uhdRF4wmkFW8htQ/"
var card_no  = Math.floor(Math.random() * 2022) + 1;
// var card_no  = 1753;
console.log(card_no);
var final_url_img = base_string.concat(card_no);
console.log(final_url_img);
    
// async function fetchData(){
//  let response = await fetch(final_url_img);
//  let data = await response.json();
//  data = JSON.stringify(data);
//  data = JSON.parse(data);
//  return data;
// }

// let json_ofCardtobeMinted = await fetchData(); // here the data will be return.
// console.log(json_ofCardtobeMinted); // you are using async await then no need of .then().

// let url_ofImg_ofCardtobeMinted = json_ofCardtobeMinted["Image IPFS"];
// console.log(url_ofImg_ofCardtobeMinted); 
//------------------------

  // metadata.name = part1_str_serial_num.concat(str_serial_num);;
  // //metadata.image = image_array[Math.floor(Math.random() * 3)][Math.floor(Math.random() * 6)];
  // metadata.image = url_ofImg_ofCardtobeMinted;
  // metadata.description = "20,000 Zodiac Cards are generated from 28 Million Combinations with Gold, Silver, and Bronze Rarities. Series 1 is the OG Zodiac Series.";

  // console.log(metadata);

  // const pinataResponse = await pinJSONToIPFS(metadata);
  // if (!pinataResponse.success) {
  //   return {
  //     success: false,
  //     status: "😢 Something went wrong while uploading your tokenURI.",
  //   };
  // }
  var _tokenURI = "https://palfutbolito.mypinata.cloud/ipfs/QmYhXzWQMcy5LRV7kiSY3eViEY237uC42zu7bWW8So1hQz/";
  const tokenURI = _tokenURI.concat(card_no).concat(".json");
  // const tokenURI = pinataResponse.pinataUrl;
  // console.log(tokenURI);


  window.contract = await new web3.eth.Contract(contractABI, contractAddress);
  window.contractWETH = await new web3.eth.Contract(contractABI_WETH, contractWETH);

  const transactionParameters = {
    to: contractAddress, // Required except during contract publications.
    from: window.ethereum.selectedAddress, // must match user's active address.
    data: window.contract.methods
      .mintNFT(window.ethereum.selectedAddress, tokenURI, card_no)
      .encodeABI(),
      gasPrice: '0xB7E416600',
      gas: '0x18DE020',

  };

  const transactionParametersWETH = {
    to: contractWETH, // Required except during contract publications.
    from: window.ethereum.selectedAddress, // must match user's active address.
    data: window.contractWETH.methods
      .approve("0x4D4617BAeB7D047f1e58B622de444d3a7a4508a2", "40000000000")
      .encodeABI(),
      gasPrice: '0x137D357000',
  };

  try {
    const txHash = await window.ethereum.request({
      method: "eth_sendTransaction",
      params: [transactionParametersWETH],
    })
     .then(
     
       window.ethereum.request({
         method: "eth_sendTransaction",
         params: [transactionParameters],
       })
     );
    return {
      success: true,
      status:
        "✅ Check out your transaction on the MATIC explorer: https://polygonscan.com/tx/" +
        txHash,
    };
  } catch (error) {
    return {
      success: false,
      status: "😥 Something went wrong: " + error.message,
    };
  }

  
};


export const mintNFT_3Pack = async (url, name, description) => {
  //if (url.trim() == "" || name.trim() == "" || description.trim() == "") {
  if (false) {
    return {
      success: false,
      status: "❗Please make sure all fields are completed before minting.",
    };
  }

  //make metadata
  // const metadata = new Object();
  // metadata.name = name;
  // metadata.image = url;
  // metadata.description = description;

 // const image_array = ["https://gateway.pinata.cloud/ipfs/QmZsrtNMqJGeQKKWr4tk7SmYSUP51TfEA6w8uEtGy8UDeT/1-10/sheet%205/gold/3@4x-8.png", "https://gateway.pinata.cloud/ipfs/QmZsrtNMqJGeQKKWr4tk7SmYSUP51TfEA6w8uEtGy8UDeT/1-10/sheet%205/silver/3@4x-8.png", "https://gateway.pinata.cloud/ipfs/QmZsrtNMqJGeQKKWr4tk7SmYSUP51TfEA6w8uEtGy8UDeT/1-10/sheet%205/silver/3@4x-8.png","https://gateway.pinata.cloud/ipfs/QmZsrtNMqJGeQKKWr4tk7SmYSUP51TfEA6w8uEtGy8UDeT/1-10/sheet%205/bronze/3@4x-8.png","https://gateway.pinata.cloud/ipfs/QmZsrtNMqJGeQKKWr4tk7SmYSUP51TfEA6w8uEtGy8UDeT/1-10/sheet%205/bronze/3@4x-8.png","https://gateway.pinata.cloud/ipfs/QmZsrtNMqJGeQKKWr4tk7SmYSUP51TfEA6w8uEtGy8UDeT/1-10/sheet%205/bronze/3@4x-8.png"];
  const image_array = [["https://gateway.pinata.cloud/ipfs/QmZitU94CUn4JyqVjx6AfnBMp5qrecLqH1kvei9sNvMxcz/7@4x.png", "https://gateway.pinata.cloud/ipfs/QmVjKq7kWoSfR9eKwqQdCCX8L64rC2EzhKdicvRX2gD7Tc/SIlver/4x/7@4x.png", "https://gateway.pinata.cloud/ipfs/QmVjKq7kWoSfR9eKwqQdCCX8L64rC2EzhKdicvRX2gD7Tc/SIlver/4x/7@4x.png","https://gateway.pinata.cloud/ipfs/QmVjKq7kWoSfR9eKwqQdCCX8L64rC2EzhKdicvRX2gD7Tc/Bronze/4x/7@4x.png","https://gateway.pinata.cloud/ipfs/QmVjKq7kWoSfR9eKwqQdCCX8L64rC2EzhKdicvRX2gD7Tc/Bronze/4x/7@4x.png","https://gateway.pinata.cloud/ipfs/QmVjKq7kWoSfR9eKwqQdCCX8L64rC2EzhKdicvRX2gD7Tc/Bronze/4x/7@4x.png"], ["https://gateway.pinata.cloud/ipfs/QmZitU94CUn4JyqVjx6AfnBMp5qrecLqH1kvei9sNvMxcz/9@4x.png", "https://gateway.pinata.cloud/ipfs/QmVjKq7kWoSfR9eKwqQdCCX8L64rC2EzhKdicvRX2gD7Tc/SIlver/4x/9@4x.png", "https://gateway.pinata.cloud/ipfs/QmVjKq7kWoSfR9eKwqQdCCX8L64rC2EzhKdicvRX2gD7Tc/SIlver/4x/9@4x.png","https://gateway.pinata.cloud/ipfs/QmVjKq7kWoSfR9eKwqQdCCX8L64rC2EzhKdicvRX2gD7Tc/Bronze/4x/9@4x.png","https://gateway.pinata.cloud/ipfs/QmVjKq7kWoSfR9eKwqQdCCX8L64rC2EzhKdicvRX2gD7Tc/Bronze/4x/9@4x.png","https://gateway.pinata.cloud/ipfs/QmVjKq7kWoSfR9eKwqQdCCX8L64rC2EzhKdicvRX2gD7Tc/Bronze/4x/9@4x.png"], ["https://gateway.pinata.cloud/ipfs/QmZitU94CUn4JyqVjx6AfnBMp5qrecLqH1kvei9sNvMxcz/11@4x.png", "https://gateway.pinata.cloud/ipfs/QmVjKq7kWoSfR9eKwqQdCCX8L64rC2EzhKdicvRX2gD7Tc/SIlver/4x/11@4x.png", "https://gateway.pinata.cloud/ipfs/QmVjKq7kWoSfR9eKwqQdCCX8L64rC2EzhKdicvRX2gD7Tc/SIlver/4x/11@4x.png","https://gateway.pinata.cloud/ipfs/QmVjKq7kWoSfR9eKwqQdCCX8L64rC2EzhKdicvRX2gD7Tc/Bronze/4x/11@4x.png","https://gateway.pinata.cloud/ipfs/QmVjKq7kWoSfR9eKwqQdCCX8L64rC2EzhKdicvRX2gD7Tc/Bronze/4x/11@4x.png","https://gateway.pinata.cloud/ipfs/QmVjKq7kWoSfR9eKwqQdCCX8L64rC2EzhKdicvRX2gD7Tc/Bronze/4x/11@4x.png"], ];

  const name_array = ["Saab", "Volvo", "BMW"];

var base_string = "ipfs://QmaDEmXqawRsMSM2SMnEdgiXnTPdeN3uhdRF4wmkFW8htQ/"
var card_no  = Math.floor(Math.random() * 2022) + 1;
// var card_no  = 1753;
console.log(card_no);
var final_url_img = base_string.concat(card_no);
console.log(final_url_img);

//2
var card_no2  = Math.floor(Math.random() * 2022) + 1;
console.log(card_no2);
var final_url_img2 = base_string.concat(card_no2);
console.log(final_url_img2);
    

//3
var card_no3  = Math.floor(Math.random() * 2022) + 1;
console.log(card_no3);
var final_url_img3 = base_string.concat(card_no3);
console.log(final_url_img3);

var _tokenURI = "https://palfutbolito.mypinata.cloud/ipfs/QmYhXzWQMcy5LRV7kiSY3eViEY237uC42zu7bWW8So1hQz/";
const tokenURI1 = _tokenURI.concat(card_no).concat(".json");
const tokenURI2 = _tokenURI.concat(card_no2).concat(".json");
const tokenURI3 = _tokenURI.concat(card_no3).concat(".json");

// const tokenURI = pinataResponse.pinataUrl;
// console.log(tokenURI);


window.contract = await new web3.eth.Contract(contractABI, contractAddress);
window.contractWETH = await new web3.eth.Contract(contractABI_WETH, contractWETH);


const transactionParametersWETH = {
  to: contractWETH, // Required except during contract publications.
  from: window.ethereum.selectedAddress, // must match user's active address.
  data: window.contractWETH.methods
    .approve("0x4D4617BAeB7D047f1e58B622de444d3a7a4508a2", "70000000000000000")
    .encodeABI(),
};
  const transactionParameters = {
    to: contractAddress, // Required except during contract publications.
    from: window.ethereum.selectedAddress, // must match user's active address.
    data: window.contract.methods
      .mintNFT_3pack(window.ethereum.selectedAddress, tokenURI1, tokenURI2, card_no, card_no2)
      .encodeABI(),
      gasPrice: '0xB7E416600',
      gas: '0x1B2E020',
   
  };

  try {
    const txHash = await window.ethereum.request({
      method: "eth_sendTransaction",
      params: [transactionParametersWETH],
    })
     .then(
     
       window.ethereum.request({
         method: "eth_sendTransaction",
         params: [transactionParameters],
       })
     );
    return {
      success: true,
      status:
        "✅ Check out your transaction on the MATIC explorer: https://polygonscan.com/tx/" +
        txHash,
    };
  } catch (error) {
    return {
      success: false,
      status: "😥 Something went wrong: " + error.message,
    };
  }

  
};


export const mintNFT_5Pack = async (url, name, description) => {
  const image_array = [["https://gateway.pinata.cloud/ipfs/QmZitU94CUn4JyqVjx6AfnBMp5qrecLqH1kvei9sNvMxcz/7@4x.png", "https://gateway.pinata.cloud/ipfs/QmVjKq7kWoSfR9eKwqQdCCX8L64rC2EzhKdicvRX2gD7Tc/SIlver/4x/7@4x.png", "https://gateway.pinata.cloud/ipfs/QmVjKq7kWoSfR9eKwqQdCCX8L64rC2EzhKdicvRX2gD7Tc/SIlver/4x/7@4x.png","https://gateway.pinata.cloud/ipfs/QmVjKq7kWoSfR9eKwqQdCCX8L64rC2EzhKdicvRX2gD7Tc/Bronze/4x/7@4x.png","https://gateway.pinata.cloud/ipfs/QmVjKq7kWoSfR9eKwqQdCCX8L64rC2EzhKdicvRX2gD7Tc/Bronze/4x/7@4x.png","https://gateway.pinata.cloud/ipfs/QmVjKq7kWoSfR9eKwqQdCCX8L64rC2EzhKdicvRX2gD7Tc/Bronze/4x/7@4x.png"], ["https://gateway.pinata.cloud/ipfs/QmZitU94CUn4JyqVjx6AfnBMp5qrecLqH1kvei9sNvMxcz/9@4x.png", "https://gateway.pinata.cloud/ipfs/QmVjKq7kWoSfR9eKwqQdCCX8L64rC2EzhKdicvRX2gD7Tc/SIlver/4x/9@4x.png", "https://gateway.pinata.cloud/ipfs/QmVjKq7kWoSfR9eKwqQdCCX8L64rC2EzhKdicvRX2gD7Tc/SIlver/4x/9@4x.png","https://gateway.pinata.cloud/ipfs/QmVjKq7kWoSfR9eKwqQdCCX8L64rC2EzhKdicvRX2gD7Tc/Bronze/4x/9@4x.png","https://gateway.pinata.cloud/ipfs/QmVjKq7kWoSfR9eKwqQdCCX8L64rC2EzhKdicvRX2gD7Tc/Bronze/4x/9@4x.png","https://gateway.pinata.cloud/ipfs/QmVjKq7kWoSfR9eKwqQdCCX8L64rC2EzhKdicvRX2gD7Tc/Bronze/4x/9@4x.png"], ["https://gateway.pinata.cloud/ipfs/QmZitU94CUn4JyqVjx6AfnBMp5qrecLqH1kvei9sNvMxcz/11@4x.png", "https://gateway.pinata.cloud/ipfs/QmVjKq7kWoSfR9eKwqQdCCX8L64rC2EzhKdicvRX2gD7Tc/SIlver/4x/11@4x.png", "https://gateway.pinata.cloud/ipfs/QmVjKq7kWoSfR9eKwqQdCCX8L64rC2EzhKdicvRX2gD7Tc/SIlver/4x/11@4x.png","https://gateway.pinata.cloud/ipfs/QmVjKq7kWoSfR9eKwqQdCCX8L64rC2EzhKdicvRX2gD7Tc/Bronze/4x/11@4x.png","https://gateway.pinata.cloud/ipfs/QmVjKq7kWoSfR9eKwqQdCCX8L64rC2EzhKdicvRX2gD7Tc/Bronze/4x/11@4x.png","https://gateway.pinata.cloud/ipfs/QmVjKq7kWoSfR9eKwqQdCCX8L64rC2EzhKdicvRX2gD7Tc/Bronze/4x/11@4x.png"], ];

  const name_array = ["Saab", "Volvo", "BMW"];

  var base_string = "ipfs://QmaDEmXqawRsMSM2SMnEdgiXnTPdeN3uhdRF4wmkFW8htQ/"
  var card_no  = Math.floor(Math.random() * 2022) + 1;
  // var card_no  = 1753;
  console.log(card_no);
  var final_url_img = base_string.concat(card_no);
  console.log(final_url_img);
  
  //2
  var card_no2  = Math.floor(Math.random() * 2022) + 1;
  console.log(card_no2);
  var final_url_img2 = base_string.concat(card_no2);
  console.log(final_url_img2);
      
  
  //3
  var card_no3  = Math.floor(Math.random() * 2022) + 1;
  console.log(card_no3);
  var final_url_img3 = base_string.concat(card_no3);
  console.log(final_url_img3);

    //4
    var card_no4  = Math.floor(Math.random() * 2022) + 1;
    console.log(card_no4);
    var final_url_img4 = base_string.concat(card_no4);
    console.log(final_url_img4);
  
  var _tokenURI = "https://palfutbolito.mypinata.cloud/ipfs/QmYhXzWQMcy5LRV7kiSY3eViEY237uC42zu7bWW8So1hQz/";
  const tokenURI1 = _tokenURI.concat(card_no).concat(".json");
  const tokenURI2 = _tokenURI.concat(card_no2).concat(".json");
  const tokenURI3 = _tokenURI.concat(card_no3).concat(".json");
  const tokenURI4 = _tokenURI.concat(card_no4).concat(".json");
  
  // const tokenURI = pinataResponse.pinataUrl;
  // console.log(tokenURI);
  
  
  window.contract = await new web3.eth.Contract(contractABI, contractAddress);
  window.contractWETH = await new web3.eth.Contract(contractABI_WETH, contractWETH);
  
  
  const transactionParametersWETH = {
    to: contractWETH, // Required except during contract publications.
    from: window.ethereum.selectedAddress, // must match user's active address.
    data: window.contractWETH.methods
      .approve("0x4D4617BAeB7D047f1e58B622de444d3a7a4508a2", "130000000000000000")
      .encodeABI(),
  };

  const transactionParameters = {
    to: contractAddress, // Required except during contract publications.
    from: window.ethereum.selectedAddress, // must match user's active address.
    data: window.contract.methods
      .mintNFT_5pack(window.ethereum.selectedAddress, tokenURI1, tokenURI2, tokenURI3, tokenURI4, card_no, card_no2, card_no3, card_no4)
      .encodeABI(),
      gasPrice: '0xB7E416600',
      gas: '0x1B2E020',

  };
  
  
  try {
    const txHash = await window.ethereum.request({
      method: "eth_sendTransaction",
      params: [transactionParametersWETH],
    })
     .then(
     
       window.ethereum.request({
         method: "eth_sendTransaction",
         params: [transactionParameters],
       })
     );
    return {
      success: true,
      status:
        "✅ Check out your transaction on the MATIC explorer: https://polygonscan.com/tx/" +
        txHash,
    };
  } catch (error) {
    return {
      success: false,
      status: "😥 Something went wrong: " + error.message,
    };
  }

  
};

