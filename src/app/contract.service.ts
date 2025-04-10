import { Injectable } from '@angular/core';
import { ethers } from 'ethers';

@Injectable({
  providedIn: 'root',
})
export class ContractService {
  walletAddress: string = '';
  walletBalance: string = '';
  errorMessage: string = '';
  messageFromContract: string = '';

  private provider: ethers.BrowserProvider | null = null;
  private signer: ethers.Signer | null = null;
  private contract: ethers.Contract | null = null;

  private contractAddress = '0xfDAfA6A17EDEd14D2E7a6052CE2874C65aa15292'; // Replace with actual contract address
  private contractABI = [
    "function getStoredValue() public view returns (uint256)",
    "function setStoredValue(uint256 newValue) public",
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
      console.log('Contract initialized:', this.contract.getAddress());

    } catch (error) {
      console.error('Error initializing contract:', error);
      this.errorMessage = 'Failed to initialize contract.';
    }
  }

  async getStoredValue() {
    try {
      if (!this.contract) throw new Error('Contract not initialized');
      const value = await this.contract['getStoredValue']();
      this.messageFromContract = value.toString();
      console.log('Stored value:', this.messageFromContract);
    } catch (error: any) {
      console.error('Error fetching stored value:', error.message || error);
      this.errorMessage = error.message || 'Failed to fetch value.';
    }
  }

  async setStoredValue(newValue: number) {
    try {
      if (!this.contract || !this.signer) throw new Error('Contract or signer not initialized');
      const tx = await this.contract['setStoredValue'](newValue);
      console.log('Transaction sent:', tx.hash);

      // Wait for the transaction to be mined
      await tx.wait();
      console.log('Transaction mined:', tx.hash);

    } catch (error: any) {
      console.error('Error setting value:', error.message || error);
      this.errorMessage = error.message || 'Failed to set value.';
      console.log(this.errorMessage);

    }
  }
}