import { Component, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Customer, CustomerService } from '../services/customer.service';

@Component({
  imports: [RouterLink],
  selector: 'app-customer-list',
  styleUrl: './customer-list.css',
  templateUrl: './customer-list.html',
})
export class CustomerList implements OnInit {
  customers = signal<Customer[]>([]);
  errorMessage = signal('');

  constructor(
    private readonly customerService: CustomerService,
    private readonly authService: AuthService,
  ) {}

  ngOnInit() {
    this.customerService.getAll().subscribe({
      next: (list) => this.customers.set(list),
      error: () => this.errorMessage.set('Could not load customers.'),
    });
  }

  logout() {
    this.authService.logout();
  }
}
