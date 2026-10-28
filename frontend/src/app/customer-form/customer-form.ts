import { Component, OnInit, signal } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CustomerService } from '../services/customer.service';

@Component({
  imports: [FormsModule, RouterLink],
  selector: 'app-customer-form',
  styleUrl: './customer-form.css',
  templateUrl: './customer-form.html',
})
export class CustomerForm implements OnInit {
  customerId: number | null = null;

  customerNumber = signal<number | null>(null);
  name = signal('');
  dateOfBirth = signal('');
  gender = signal('');

  errorMessage = signal('');
  successMessage = signal('');

  constructor(
    private readonly customerService: CustomerService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
  ) {}

  ngOnInit() {
    const idInUrl = this.route.snapshot.paramMap.get('id');
    if (idInUrl) {
      this.customerId = Number(idInUrl);
      this.loadCustomer(this.customerId);
    }
  }

  // Fill the form with the current details. The API has no "get one customer"
  // route, so we get the list and pick the customer with this id.
  loadCustomer(id: number) {
    this.customerService.getAll().subscribe({
      next: (list) => {
        const customer = list.find((c) => c.id === id);
        if (!customer) {
          this.errorMessage.set('Customer not found.');
          return;
        }
        this.customerNumber.set(customer.customerNumber);
        this.name.set(customer.name);
        this.dateOfBirth.set(customer.dateOfBirth);
        this.gender.set(customer.gender);
      },
      error: () => this.errorMessage.set('Could not load the customer.'),
    });
  }

  onSave(form: NgForm) {
    this.errorMessage.set('');

    if (form.invalid) {
      form.control.markAllAsTouched();
      return;
    }

    const data = { name: this.name(), dateOfBirth: this.dateOfBirth(), gender: this.gender() };

    const request = this.customerId
      ? this.customerService.update(this.customerId, data)
      : this.customerService.create(data);

    request.subscribe({
      next: () => {
        this.successMessage.set('Customer saved!');
        setTimeout(() => this.router.navigate(['/customers']), 1000);
      },
      error: (error) => {
        // The backend sends its reason in error.error.message (text or a list of texts).
        const message = error.error?.message;
        this.errorMessage.set(Array.isArray(message) ? message.join(', ') : message || 'Could not save.');
      },
    });
  }
}
