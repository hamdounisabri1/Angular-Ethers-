import { Component } from '@angular/core';
import { ContractService } from '../contract.service';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css'],
})
export class TestComponent {
  message: string = '';
  balance: string = '';
  useradd: string = ''; // Define user address property
  amount: number = 0; // Define amount property

  constructor(private contractService: ContractService) {}

  async addcoins() {
    // Use the useradd and amount properties from the input
    await this.contractService.addCoins(this.useradd, this.amount);
  }

  async adduser() {
    // Use the useradd property from the input
    this.message = await this.contractService.addUser(this.useradd);
  }

  async connectwallets() {
    await this.contractService.connectWallet();
  }

  async getbalance() {
    // Use the useradd property from the input
    await this.contractService.getBalance(this.useradd);
    this.balance = this.contractService.balanceuser;
  }
}