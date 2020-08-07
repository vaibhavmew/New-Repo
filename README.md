# Banking System made using Express, Mongoose, NodeJS And EJS

1. User And Admin Login based on Passport Authentication.
2. Create a New Account using Admin.
3. Send Beneficiary Requests.
4. Transfer Funds.
5. Get Account Summary.
6. Account Details.
7. Last Login Information.

![dashboard](https://user-images.githubusercontent.com/68279946/88624757-2a989980-d0c5-11ea-889f-94129dc04ef0.jpg)

![Transfer](https://user-images.githubusercontent.com/68279946/88624763-2d938a00-d0c5-11ea-84e9-3689ed5a1b3e.jpg)

![summary](https://user-images.githubusercontent.com/68279946/88624778-34220180-d0c5-11ea-8c42-f3739bcd0055.jpg)

### Version: 2.0.0

### Important
1. Open the admins collection.
2. Insert a new document with an email and password of your choice(Generate password at www.bcrypt-generator.com).
3. Access the admin page using these credentials at http://localhost:5000/admin/login
4. Create a new user once you have logged in.
5. Account No needs to be unique and added manually.
5. User Login at http://localhost:5000/users/login
6. Explore the functionality.

### Usage

```sh
$ npm install
```

```sh
$ npm start
# Or run with Nodemon
$ npm run dev

# Visit http://localhost:5000
```

### MongoDB

Open "config/keys.js" and add your MongoDB URI, local or Atlas
