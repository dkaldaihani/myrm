import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/user.entity.js';
import { Customer } from './customers/customer.entity.js';
import { CustomersModule } from './customers/customers.module.js';
import { UsersModule } from './users/users.module.js';
import { AuthModule } from './auth/auth.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    TypeOrmModule.forRoot({
      type: 'better-sqlite3',
      database: 'myrm.sqlite',
      entities: [User, Customer],
      synchronize: true, // create/update tables automatically from the entities
    }),

    UsersModule,
    AuthModule,
    CustomersModule,
  ],
})
export class AppModule {}
