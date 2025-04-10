import { Component } from '@angular/core';
import { ContractService } from '../contract.service';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})
export class TestComponent {
  message: string = '';

  constructor(private contractService: ContractService) {}

  ngOnInit(): void {
  }

  // Get the message from the contract
  async getMessage() {
    await this.contractService.getStoredValue();
  }
  async setMessage(newValue: number) {
    await this.contractService.setStoredValue(newValue);
  }
  async meta() {
    await this.contractService.connectWallet()
  }
}
