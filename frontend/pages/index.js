import Head from 'next/head'
//import Image from 'next/image'
import styles from '../styles/Home.module.css'
import Web3Modal from 'web3modal'
import {providers,Contract} from 'ethers'
import {useEffect, useRef, useState} from 'react'
import {contractAddress,contractABI} from '../contractData/index.js'




export default function Home() {
  
  const [walletConnectionStatus, setWalletConnectionStatus] = useState(false);
  const [loading, setLoading] = useState(true);
  const [subsbribedWhitelist,setSubsbcribedWhitelist] = useState(false);
  const [numberOfWhitelistedAddr, setNumberOfWhitelistedAddr] = useState(0);
  const web3ModalRef = useRef();
  

  const getProviderOrSigner = async (needSigner = false) =>{
    const provider = await web3ModalRef.current.connect();
    const web3Provider = new providers.Web3Provider(provider);
    const {chainId} = await web3Provider.getNetwork();
    if(chainId!==4){
      window.alert("Please change your network to rinkeby testnet.");
      throw new Error("Please change your network to rinkeby testnet.");
    }
    if(needSigner){
      const signer = await web3Provider.getSigner();
      return signer;
    }
    return web3Provider;
  }
  
  const checkIfWhitelisted = async () =>{
    try{
      const signer = await getProviderOrSigner(true);
      const whitelistContract = new Contract(
        contractAddress,
        contractABI,
        signer
      );
      const address = await signer.getAddress();
      const isWhitelisted = await whitelistContract.whitelistedAddresses(address);
      setSubsbcribedWhitelist(isWhitelisted);
    }catch(err){
      console.log(err);
    }
  }
  
  const addAddressToWhitelist = async()=>{
    try{
      const signer = await getProviderOrSigner(true);
      const whitelistContract = new Contract(
        contractAddress,
        contractABI,
        signer
      );
      const tx = await whitelistContract.addToWhitelist();
      setLoading(true);
      await tx.wait();
      setLoading(false);
      setSubsbcribedWhitelist(true);
      getNumberOfWhitelisted();

    }catch(err){
      console.log(err);
    }
  }
  
  const getNumberOfWhitelisted = async () =>{
    try{
      const signer = await getProviderOrSigner();
      const whitelistContract = new Contract(
        contractAddress,
        contractABI,
        signer
      );
      console.log('called');
      const _numberOfWhitelisted = await whitelistContract.numberOfWhitelistedAddress();
      setNumberOfWhitelistedAddr(_numberOfWhitelisted);
    }catch(err){
      console.log(err);
    }
  }

  const connectWallet = async () => {
    await getProviderOrSigner();
    await getNumberOfWhitelisted();
    setWalletConnectionStatus(true); 
    await checkIfWhitelisted();    
    setLoading(false);
  }
  
  
  useEffect(()=>{
    if(!walletConnectionStatus){
      web3ModalRef.current = new Web3Modal({
        network:"rinkeby",
        providerOptions : {},
        disableInjectedProvider:false
      });
    }
    connectWallet();
  },[walletConnectionStatus]); 
  
  const renderButton = () =>{
    if(walletConnectionStatus){
      if(subsbribedWhitelist){
        return(
          <div className={styles.description}>
            Thanks for joining the Whitelist!
          </div>
        );
      } else if(loading){
        return <button className={styles.button}>Loading...</button>;
      } else {
        console.log("Button rendering");
        return <button onClick={addAddressToWhitelist} className={styles.button}>
            Join the Whitelist
          </button>
      }
    } else {
      return <button onClick={connectWallet} className={styles.button}>
            Connect Wallet
          </button>
    }

  }
  
  
  return( <div>
    <Head>
      <title>Whitelist Dapp</title>
      <meta name="description" content="Whitelist-Dapp" />
      <link rel="icon" href="/favicon.ico" />
    </Head>
    <div className={styles.main}>
      <div>
        <h1 className={styles.title}>Welcome to Crypto Devs!</h1>
        <div className={styles.description}>
          Its an NFT collection for developers in Crypto.
        </div>
        <div className={styles.description}>
          {numberOfWhitelistedAddr} have already joined the Whitelist
        </div>
        {renderButton()}
      </div>
      <div>
        <img className={styles.image} src="./crypto-devs.svg" />
      </div>
    </div>

    <footer className={styles.footer}>
      Made with &#10084; by Crypto Devs
    </footer>
  </div>
);
 
}
