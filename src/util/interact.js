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
const contractAddress = "0x164474f796D7388c5E36576c0a673e1375EB2e45";
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
  var base_string = "ipfs://QmWjXiyCnfrfyA8QC9dF9k8FKV24SXjJQGgbe7vFEZe7Wy/"
var card_no  = Math.floor(Math.random() * 2022) + 1;
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
  var _tokenURI = "https://palfutbolito.mypinata.cloud/ipfs/QmU76dzCkoGuLkzYbbo2HEcNxyJyfRSyMvtvRBpd6YRTvrhttps://palfutbolito.mypinata.cloud/ipfs/QmYhXzWQMcy5LRV7kiSY3eViEY237uC42zu7bWW8So1hQz/";
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
  };

  const transactionParametersWETH = {
    to: contractWETH, // Required except during contract publications.
    from: window.ethereum.selectedAddress, // must match user's active address.
    data: window.contractWETH.methods
      .approve("0x164474f796D7388c5E36576c0a673e1375EB2e45", "10000000000000")
      .encodeABI(),
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
        "✅ Check out your transaction on the MATIC explorer: https://polygonscan.com/address/" +
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

  //SHOULD be edited later to pull from JSONs like below (only if we want it in the name...)
  //1
  const metadata1 = new Object();
  // metadata.name = "Zodiac Cards #12828";
  var serial_num1 = [Math.floor(Math.random() * 20000)];
  var str_serial_num1 = serial_num1.toString();
  var part1_str_serial_num1 = "Zodiac Cards #"
  //2
  const metadata2 = new Object();
  // metadata.name = "Zodiac Cards #12828";
  var serial_num2 = [Math.floor(Math.random() * 20000)];
  var str_serial_num2 = serial_num2.toString();
  var part1_str_serial_num2 = "Zodiac Cards #"
  //3
  const metadata3 = new Object();
  // metadata.name = "Zodiac Cards #12828";
  var serial_num3 = [Math.floor(Math.random() * 20000)];
  var str_serial_num3 = serial_num3.toString();
  var part1_str_serial_num3 = "Zodiac Cards #"


  //-----------------
  //Algorithm to draw for JSON Server:
  // var base_string = 'https://zodiaccards-json-server.herokuapp.com/cards/'
  var base_string = 'https://final-json.herokuapp.com/cards/'

//1
var card_no1  = Math.floor(Math.random() * 3600);
console.log(card_no1);
var final_url_img1 = base_string.concat(card_no1);
console.log(final_url_img1);
    
async function fetchData1(){
 let response = await fetch(final_url_img1);
 let data = await response.json();
 data = JSON.stringify(data);
 data = JSON.parse(data);
 return data;
}

let json_ofCardtobeMinted1 = await fetchData1(); // here the data will be return.
console.log(json_ofCardtobeMinted1); // you are using async await then no need of .then().

let url_ofImg_ofCardtobeMinted1 = json_ofCardtobeMinted1["Image IPFS"];
console.log(url_ofImg_ofCardtobeMinted1); 

//2
var card_no2  = Math.floor(Math.random() * 3600);
console.log(card_no2);
var final_url_img2 = base_string.concat(card_no2);
console.log(final_url_img2);
    
async function fetchData2(){
 let response = await fetch(final_url_img2);
 let data = await response.json();
 data = JSON.stringify(data);
 data = JSON.parse(data);
 return data;
}

let json_ofCardtobeMinted2 = await fetchData2(); // here the data will be return.
console.log(json_ofCardtobeMinted2); // you are using async await then no need of .then().

let url_ofImg_ofCardtobeMinted2 = json_ofCardtobeMinted2["Image IPFS"];
console.log(url_ofImg_ofCardtobeMinted2); 

//3
var card_no3  = Math.floor(Math.random() * 3600);
console.log(card_no3);
var final_url_img3 = base_string.concat(card_no3);
console.log(final_url_img3);
    
async function fetchData3(){
 let response = await fetch(final_url_img3);
 let data = await response.json();
 data = JSON.stringify(data);
 data = JSON.parse(data);
 return data;
}

let json_ofCardtobeMinted3 = await fetchData3(); // here the data will be return.
console.log(json_ofCardtobeMinted3); // you are using async await then no need of .then().

let url_ofImg_ofCardtobeMinted3 = json_ofCardtobeMinted3["Image IPFS"];
console.log(url_ofImg_ofCardtobeMinted3); 



//------------------------

//1
  metadata1.name = part1_str_serial_num1.concat(str_serial_num1);
  //metadata.image = image_array[Math.floor(Math.random() * 3)][Math.floor(Math.random() * 6)];
  metadata1.image = url_ofImg_ofCardtobeMinted1;
  metadata1.description = "20,000 Zodiac Cards are generated from 28 Million Combinations with Gold, Silver, and Bronze Rarities. Series 1 is the OG Zodiac Series.";

  console.log(metadata1);

  const pinataResponse1 = await pinJSONToIPFS(metadata1);
  if (!pinataResponse1.success) {
    return {
      success: false,
      status: "😢 Something went wrong while uploading your tokenURI.",
    };
  }
  const tokenURI1 = pinataResponse1.pinataUrl;

  //2
  metadata2.name = part1_str_serial_num2.concat(str_serial_num2);
  //metadata.image = image_array[Math.floor(Math.random() * 3)][Math.floor(Math.random() * 6)];
  metadata2.image = url_ofImg_ofCardtobeMinted2;
  metadata2.description = "20,000 Zodiac Cards are generated from 28 Million Combinations with Gold, Silver, and Bronze Rarities. Series 1 is the OG Zodiac Series.";

  console.log(metadata2);

  const pinataResponse2 = await pinJSONToIPFS(metadata2);
  if (!pinataResponse2.success) {
    return {
      success: false,
      status: "😢 Something went wrong while uploading your tokenURI.",
    };
  }
  const tokenURI2 = pinataResponse2.pinataUrl;

  //3
  metadata3.name = part1_str_serial_num3.concat(str_serial_num3);
  //metadata.image = image_array[Math.floor(Math.random() * 3)][Math.floor(Math.random() * 6)];
  metadata3.image = url_ofImg_ofCardtobeMinted3;
  metadata3.description = "20,000 Zodiac Cards are generated from 28 Million Combinations with Gold, Silver, and Bronze Rarities. Series 1 is the OG Zodiac Series.";

  console.log(metadata3);

  const pinataResponse3 = await pinJSONToIPFS(metadata3);
  if (!pinataResponse3.success) {
    return {
      success: false,
      status: "😢 Something went wrong while uploading your tokenURI.",
    };
  }
  const tokenURI3 = pinataResponse3.pinataUrl;


  //--------------

  window.contract = await new web3.eth.Contract(contractABI, contractAddress);

  const transactionParameters = {
    to: contractAddress, // Required except during contract publications.
    from: window.ethereum.selectedAddress, // must match user's active address.
    data: window.contract.methods
      .mintNFT_3pack(window.ethereum.selectedAddress, tokenURI1, tokenURI2, tokenURI3)
      .encodeABI(),
  };

  try {
    const txHash = await window.ethereum.request({
      method: "eth_sendTransaction",
      params: [transactionParameters],
    });
    return {
      success: true,
      status:
        "✅ Check out your transaction on Etherscan: https://ropsten.etherscan.io/tx/" +
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

  //SHOULD be edited later to pull from JSONs like below (only if we want it in the name...)
  //1
  const metadata1 = new Object();
  // metadata.name = "Zodiac Cards #12828";
  var serial_num1 = [Math.floor(Math.random() * 20000)];
  var str_serial_num1 = serial_num1.toString();
  var part1_str_serial_num1 = "Zodiac Cards #"
  //2
  const metadata2 = new Object();
  // metadata.name = "Zodiac Cards #12828";
  var serial_num2 = [Math.floor(Math.random() * 20000)];
  var str_serial_num2 = serial_num2.toString();
  var part1_str_serial_num2 = "Zodiac Cards #"
  //3
  const metadata3 = new Object();
  // metadata.name = "Zodiac Cards #12828";
  var serial_num3 = [Math.floor(Math.random() * 20000)];
  var str_serial_num3 = serial_num3.toString();
  var part1_str_serial_num3 = "Zodiac Cards #"  

  //4
  const metadata4 = new Object();
  // metadata.name = "Zodiac Cards #12828";
  var serial_num4 = [Math.floor(Math.random() * 20000)];
  var str_serial_num4 = serial_num4.toString();
  var part1_str_serial_num4 = "Zodiac Cards #"
  //5
  const metadata5 = new Object();
  // metadata.name = "Zodiac Cards #12828";
  var serial_num5 = [Math.floor(Math.random() * 20000)];
  var str_serial_num5 = serial_num5.toString();
  var part1_str_serial_num5 = "Zodiac Cards #"


  //-----------------
  //Algorithm to draw for JSON Server:
  // var base_string = 'https://zodiaccards-json-server.herokuapp.com/cards/'
  var base_string = 'https://final-json.herokuapp.com/cards/'

//1
var card_no1  = Math.floor(Math.random() * 3600);
console.log(card_no1);
var final_url_img1 = base_string.concat(card_no1);
console.log(final_url_img1);
    
async function fetchData1(){
 let response = await fetch(final_url_img1);
 let data = await response.json();
 data = JSON.stringify(data);
 data = JSON.parse(data);
 return data;
}

let json_ofCardtobeMinted1 = await fetchData1(); // here the data will be return.
console.log(json_ofCardtobeMinted1); // you are using async await then no need of .then().

let url_ofImg_ofCardtobeMinted1 = json_ofCardtobeMinted1["Image IPFS"];
console.log(url_ofImg_ofCardtobeMinted1); 

//2
var card_no2  = Math.floor(Math.random() * 3600);
console.log(card_no2);
var final_url_img2 = base_string.concat(card_no2);
console.log(final_url_img2);
    
async function fetchData2(){
 let response = await fetch(final_url_img2);
 let data = await response.json();
 data = JSON.stringify(data);
 data = JSON.parse(data);
 return data;
}

let json_ofCardtobeMinted2 = await fetchData2(); // here the data will be return.
console.log(json_ofCardtobeMinted2); // you are using async await then no need of .then().

let url_ofImg_ofCardtobeMinted2 = json_ofCardtobeMinted2["Image IPFS"];
console.log(url_ofImg_ofCardtobeMinted2); 

//3
var card_no3  = Math.floor(Math.random() * 3600);
console.log(card_no3);
var final_url_img3 = base_string.concat(card_no3);
console.log(final_url_img3);
    
async function fetchData3(){
 let response = await fetch(final_url_img3);
 let data = await response.json();
 data = JSON.stringify(data);
 data = JSON.parse(data);
 return data;
}

let json_ofCardtobeMinted3 = await fetchData3(); // here the data will be return.
console.log(json_ofCardtobeMinted3); // you are using async await then no need of .then().

let url_ofImg_ofCardtobeMinted3 = json_ofCardtobeMinted3["Image IPFS"];
console.log(url_ofImg_ofCardtobeMinted3); 



//4
var card_no4  = Math.floor(Math.random() * 3600);
console.log(card_no4);
var final_url_img4 = base_string.concat(card_no4);
console.log(final_url_img4);
    
async function fetchData4(){
 let response = await fetch(final_url_img4);
 let data = await response.json();
 data = JSON.stringify(data);
 data = JSON.parse(data);
 return data;
}

let json_ofCardtobeMinted4 = await fetchData4(); // here the data will be return.
console.log(json_ofCardtobeMinted4); // you are using async await then no need of .then().

let url_ofImg_ofCardtobeMinted4 = json_ofCardtobeMinted4["Image IPFS"];
console.log(url_ofImg_ofCardtobeMinted4); 

//5
var card_no5  = Math.floor(Math.random() * 3600);
console.log(card_no5);
var final_url_img5 = base_string.concat(card_no5);
console.log(final_url_img5);
    
async function fetchData5(){
 let response = await fetch(final_url_img5);
 let data = await response.json();
 data = JSON.stringify(data);
 data = JSON.parse(data);
 return data;
}

let json_ofCardtobeMinted5 = await fetchData5(); // here the data will be return.
console.log(json_ofCardtobeMinted5); // you are using async await then no need of .then().

let url_ofImg_ofCardtobeMinted5 = json_ofCardtobeMinted5["Image IPFS"];
console.log(url_ofImg_ofCardtobeMinted5); 


//------------------------

//1
  metadata1.name = part1_str_serial_num1.concat(str_serial_num1);
  //metadata.image = image_array[Math.floor(Math.random() * 3)][Math.floor(Math.random() * 6)];
  metadata1.image = url_ofImg_ofCardtobeMinted1;
  metadata1.description = "20,000 Zodiac Cards are generated from 28 Million Combinations with Gold, Silver, and Bronze Rarities. Series 1 is the OG Zodiac Series.";

  console.log(metadata1);

  const pinataResponse1 = await pinJSONToIPFS(metadata1);
  if (!pinataResponse1.success) {
    return {
      success: false,
      status: "😢 Something went wrong while uploading your tokenURI.",
    };
  }
  const tokenURI1 = pinataResponse1.pinataUrl;

  //2
  metadata2.name = part1_str_serial_num2.concat(str_serial_num2);
  //metadata.image = image_array[Math.floor(Math.random() * 3)][Math.floor(Math.random() * 6)];
  metadata2.image = url_ofImg_ofCardtobeMinted2;
  metadata2.description = "20,000 Zodiac Cards are generated from 28 Million Combinations with Gold, Silver, and Bronze Rarities. Series 1 is the OG Zodiac Series.";

  console.log(metadata2);

  const pinataResponse2 = await pinJSONToIPFS(metadata2);
  if (!pinataResponse2.success) {
    return {
      success: false,
      status: "😢 Something went wrong while uploading your tokenURI.",
    };
  }
  const tokenURI2 = pinataResponse2.pinataUrl;

  //3
  metadata3.name = part1_str_serial_num3.concat(str_serial_num3);
  //metadata.image = image_array[Math.floor(Math.random() * 3)][Math.floor(Math.random() * 6)];
  metadata3.image = url_ofImg_ofCardtobeMinted3;
  metadata3.description = "20,000 Zodiac Cards are generated from 28 Million Combinations with Gold, Silver, and Bronze Rarities. Series 1 is the OG Zodiac Series.";

  console.log(metadata3);

  const pinataResponse3 = await pinJSONToIPFS(metadata3);
  if (!pinataResponse3.success) {
    return {
      success: false,
      status: "😢 Something went wrong while uploading your tokenURI.",
    };
  }
  const tokenURI3 = pinataResponse3.pinataUrl;


    //4
    metadata4.name = part1_str_serial_num4.concat(str_serial_num4);
    //metadata.image = image_array[Math.floor(Math.random() * 3)][Math.floor(Math.random() * 6)];
    metadata4.image = url_ofImg_ofCardtobeMinted4;
    metadata4.description = "20,000 Zodiac Cards are generated from 28 Million Combinations with Gold, Silver, and Bronze Rarities. Series 1 is the OG Zodiac Series.";
  
    console.log(metadata4);
  
    const pinataResponse4 = await pinJSONToIPFS(metadata4);
    if (!pinataResponse4.success) {
      return {
        success: false,
        status: "😢 Something went wrong while uploading your tokenURI.",
      };
    }
    const tokenURI4 = pinataResponse4.pinataUrl;
  
    //5
    metadata5.name = part1_str_serial_num5.concat(str_serial_num3=5);
    //metadata.image = image_array[Math.floor(Math.random() * 3)][Math.floor(Math.random() * 6)];
    metadata5.image = url_ofImg_ofCardtobeMinted5;
    metadata5.description = "20,000 Zodiac Cards are generated from 28 Million Combinations with Gold, Silver, and Bronze Rarities. Series 1 is the OG Zodiac Series.";
  
    console.log(metadata5);
  
    const pinataResponse5 = await pinJSONToIPFS(metadata5);
    if (!pinataResponse5.success) {
      return {
        success: false,
        status: "😢 Something went wrong while uploading your tokenURI.",
      };
    }
    const tokenURI5 = pinataResponse5.pinataUrl;
  
  

  //--------------

  window.contract = await new web3.eth.Contract(contractABI, contractAddress);

  const transactionParameters = {
    to: contractAddress, // Required except during contract publications.
    from: window.ethereum.selectedAddress, // must match user's active address.
    data: window.contract.methods
      .mintNFT_5pack(window.ethereum.selectedAddress, tokenURI1, tokenURI2, tokenURI3, tokenURI4, tokenURI5)
      .encodeABI(),
  };

  try {
    const txHash = await window.ethereum.request({
      method: "eth_sendTransaction",
      params: [transactionParameters],
    });
    return {
      success: true,
      status:
        "✅ Check out your transaction on Etherscan: https://ropsten.etherscan.io/tx/" +
        txHash,
    };
  } catch (error) {
    return {
      success: false,
      status: "😥 Something went wrong: " + error.message,
    };
  }
};
