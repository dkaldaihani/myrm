# MyRM Pseudocode

MyRM is a web app for bank relationship managers (RMs).
The RM logs in, sees the customers, adds customers and edits them.

- Frontend: Angular
- Backend: NestJS
- Database: SQLite

## Tables

```
User
    id
    username      (unique)
    passwordHash  (bcrypt hash, not the real password)

Customer
    id
    customerNumber  (unique, 9 digits, made by the system)
    name            (max 255 characters)
    dateOfBirth     (YYYY-MM-DD)
    gender          (M or F)
```

## Backend

### Default account

```
when the backend starts:
    if user "dana" does not exist:
        save user "dana" with the hash of "dana123"
```

### Login

```
POST /auth/login (username, password)
    find the user by username
    if no user or the password does not match the hash:
        return 401 "Invalid username or password"
    make a JWT token (expires in 1 hour)
    return the token
```

### Checking the token

```
before every /customers request:
    if there is no token, or it is wrong or expired:
        return 401
    otherwise continue
```

### Customers

```
GET /customers
    return all customers sorted by customer number

POST /customers (name, dateOfBirth, gender)
    check the data (see rules below)
    if it is wrong, return 400
    customerNumber = highest number + 1 (or 100000001 if there are no customers)
    save the customer and return it

PUT /customers/:id (name, dateOfBirth, gender)
    find the customer
    if not found, return 404 "Customer not found"
    check the data
    if it is wrong, return 400
    update name, dateOfBirth and gender (the customer number stays the same)
    save and return it
```

Rules:
- name is required, can't be only spaces, max 255 characters
- dateOfBirth must be a real date in YYYY-MM-DD format
- gender must be M or F

## Frontend

### Services

```
AuthService
    login: send username and password, save the token
    logout: delete the token, go to the login page
    isLoggedIn: true if there is a token

CustomerService
    getAll  -> GET /customers
    create  -> POST /customers
    update  -> PUT /customers/:id
```

### Interceptor and guard

```
on every request:
    add the token to the header if we have one
    if the backend returns 401, log out

before opening a customer page:
    if not logged in, go to the login page
```

### Pages

```
Login page
    username and password
    on submit:
        success -> go to the customer list
        wrong login       -> show "Invalid username or password"
        backend not found -> show "Could not reach the server"

Customer list page
    show all customers in a table
    Add customer -> empty form
    Edit         -> form filled with the customer's details
    Log out      -> back to login

Customer form page (add and edit)
    name, date of birth, gender
    when editing, show the customer number (can't be changed)
    on save:
        if something is missing, show the error under the field
        add or update the customer
        success -> show "Customer saved!" and go back to the list
        error   -> show the error message from the backend
```

## How to run

```
terminal 1:  cd backend   then  npm run start:dev   (http://localhost:3000)
terminal 2:  cd frontend  then  ng serve            (http://localhost:4200)
```

Log in with dana / dana123.
