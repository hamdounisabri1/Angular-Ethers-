import { Injectable } from '@angular/core';
import { ethers } from 'ethers';

@Injectable({
  providedIn: 'root',
})
export class ContractService {
  walletAddress: string = '';
  walletBalance: string = '';
  errorMessage: string = '';
  balanceuser: string = '';

  private provider: ethers.BrowserProvider | null = null;
  private signer: ethers.Signer | null = null;
  private contract: ethers.Contract | null = null;

  private contractAddress = '0xf6666047c97BBD27318F4D869c94A0C305EA1187'; // Replace with actual contract address
private contractABI = [
  "function getBalance(address userMetamaskAdd) view returns (uint256)",
  "function addVirtualCoins(address userMetamaskAdd, uint256 amount)",
  "function addUser(address userMetamaskAdd)"
];

  async connectWallet() {
    if (typeof window.ethereum === 'undefined') {
      this.errorMessage = 'MetaMask is not installed. Please install MetaMask.';
      console.error(this.errorMessage);
      return;
    }

    try {
      await (window as any).ethereum.request({ method: 'eth_requestAccounts' });
      this.provider = new ethers.BrowserProvider((window as any).ethereum);
      this.signer = await this.provider.getSigner();
      this.walletAddress = await this.signer.getAddress();
      this.walletBalance = ethers.formatEther(await this.provider.getBalance(this.walletAddress));
      console.log('Wallet connected:', this.walletAddress, 'Balance:', this.walletBalance);

      this.initializeContract();
    } catch (error) {
      console.error('Error connecting wallet:', error);
      this.errorMessage = 'Failed to connect wallet.';
    }
  }

  private initializeContract() {
    try {
      if (!this.provider || !this.signer) throw new Error('Provider or signer not initialized');
      this.contract = new ethers.Contract(this.contractAddress, this.contractABI, this.signer);


      console.log('Contract initialized:', this.contract);
      console.log('Contract addrese:', this.contract.getAddress());

    } catch (error) {
      console.error('Error initializing contract:', error);
      this.errorMessage = 'Failed to initialize contract.';
    }
  }

  async addCoins(addrese:string,amount:number) {
    try {
      if (!this.contract || !this.signer) throw new Error('Contract or signer not initialized');
      const tx = await this.contract['addVirtualCoins'](addrese, amount);
      console.log('Transaction sent:', tx.hash);

      await tx.wait();
      console.log('Transaction mined:', tx.hash);

    } catch (error: any) {
      console.error('Error setting value:', error.message || error);
      this.errorMessage = error.message || 'Failed to set value.';
      console.log(this.errorMessage);

    }
  }
  

  async addUser(addrese:string): Promise<string> {
    this.errorMessage = 'Contract or signer not initialized';
    try {
      // Check if the contract and signer are initialized
      if (!this.contract || !this.signer) throw new Error('Contract or signer not initialized');
  
      // Send the transaction to add the user
      const tx = await this.contract['addUser'](addrese);
      console.log('Transaction sent:', tx.hash);
  
      // Wait for the transaction to be mined
      await tx.wait();
      console.log('Transaction mined:', tx.hash);
  
      return 'User added successfully';
    } catch (error: any) {
      // Check if the error is due to an already existing user
      if (error.reason?.includes('User already exists')) {
        console.log('Error: User already exists');
        this.errorMessage = 'User already exists.';
      } else if  (error.message?.includes('Contract or signer not initialized')) {
        console.log('Error: Contract or signer not initialized');
        this.errorMessage = 'Contract or signer not initialized.';
      } else{

        console.log('error:', error.message || error);

      }
      return this.errorMessage;
    }
  }

  async getBalance(addrese:string) {
    try {
      if (!this.contract) throw new Error('Contract not initialized');
      const value = await this.contract['getBalance'](addrese);
      this.balanceuser = value.toString();
      console.log('balance:', this.balanceuser);
    } catch (error: any) {
      console.error('Error fetching stored value:', error.message || error);
      this.errorMessage = error.message || 'Failed to fetch value.';
    }
  }
}