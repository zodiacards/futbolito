import { pinJSONToIPFS } from "./pinata.js";
require("dotenv").config();
const alchemyKey = process.env.REACT_APP_ALCHEMY_KEY;
const contractABI = require("../contract-abi.json");
const contractAddress = "0x4C4a07F737Bf57F6632B6CAB089B78f62385aCaE";
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
          status: "👆🏽 Write a message in the text-field above.",
        };
      } else {
        return {
          address: "",
          status: "🦊 Connect to Metamask using the top right button.",
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
  var serial_num = [Math.floor(Math.random() * 20000)];
  var str_serial_num = serial_num.toString();
  var part1_str_serial_num = "Zodiac Cards #"

  //-----------------
  //Algorithm to draw for JSON Server:
  // var base_string = 'https://zodiaccards-json-server.herokuapp.com/cards/'
  var base_string = 'https://final-json.herokuapp.com/cards/'
var card_no  = Math.floor(Math.random() * 3600);
console.log(card_no);
var final_url_img = base_string.concat(card_no);
console.log(final_url_img);
    
async function fetchData(){
 let response = await fetch(final_url_img);
 let data = await response.json();
 data = JSON.stringify(data);
 data = JSON.parse(data);
 return data;
}

let json_ofCardtobeMinted = await fetchData(); // here the data will be return.
console.log(json_ofCardtobeMinted); // you are using async await then no need of .then().

let url_ofImg_ofCardtobeMinted = json_ofCardtobeMinted["Image IPFS"];
console.log(url_ofImg_ofCardtobeMinted); 
//------------------------

  metadata.name = part1_str_serial_num.concat(str_serial_num);;
  //metadata.image = image_array[Math.floor(Math.random() * 3)][Math.floor(Math.random() * 6)];
  metadata.image = url_ofImg_ofCardtobeMinted;
  metadata.description = "20,000 Zodiac Cards are generated from 28 Million Combinations with Gold, Silver, and Bronze Rarities. Series 1 is the OG Zodiac Series.";

  console.log(metadata);

  const pinataResponse = await pinJSONToIPFS(metadata);
  if (!pinataResponse.success) {
    return {
      success: false,
      status: "😢 Something went wrong while uploading your tokenURI.",
    };
  }
  const tokenURI = pinataResponse.pinataUrl;

  window.contract = await new web3.eth.Contract(contractABI, contractAddress);

  const transactionParameters = {
    to: contractAddress, // Required except during contract publications.
    from: window.ethereum.selectedAddress, // must match user's active address.
    data: window.contract.methods
      .mintNFT(window.ethereum.selectedAddress, tokenURI)
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
