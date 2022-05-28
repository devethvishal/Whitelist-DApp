import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import Web3Modal from 'web3modal'
import {providers,Contract} from 'ethers'
import {useEffect, useRef, useState} from 'react'



export default function Home() {
  
  const [walletConnectionStatus, setWalletConnectionStatus] = useState(false);
  const [loading, setLoading] = useState(true);
  const [subsbribeWhitelist,setSubsbcribeWhitelist] = useState(false);
  const web3ModalRef = useRef();
  
  
  const connectWallet = async () => {
    await getProviderOrSigner();
    setWalletConnectionStatus(true); 
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
  
 
}
