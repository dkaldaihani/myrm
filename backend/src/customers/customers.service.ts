import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from './customer.entity.js';
import { CustomerDto } from './customer.dto.js';

const FIRST_CUSTOMER_NUMBER = 100000001;
const MAX_CUSTOMER_NUMBER = 999999999;

@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(Customer)
    private readonly customersRepository: Repository<Customer>,
  ) {}

  findAll() {
    return this.customersRepository.find({ order: { customerNumber: 'ASC' } });
  }

  async create(dto: CustomerDto) {
    const highest = await this.customersRepository.maximum('customerNumber');
    const nextNumber = highest ? highest + 1 : FIRST_CUSTOMER_NUMBER;

    if (nextNumber > MAX_CUSTOMER_NUMBER) {
      throw new BadRequestException('No more customer numbers available');
    }

    const customer = this.customersRepository.create({
      customerNumber: nextNumber,
      name: dto.name,
      dateOfBirth: dto.dateOfBirth,
      gender: dto.gender,
    });
    return this.customersRepository.save(customer);
  }

  async update(id: number, dto: CustomerDto) {
    const customer = await this.customersRepository.findOneBy({ id });
    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    customer.name = dto.name;
    customer.dateOfBirth = dto.dateOfBirth;
    customer.gender = dto.gender;
    return this.customersRepository.save(customer);
  }
}
