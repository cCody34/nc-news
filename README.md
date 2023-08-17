# Northcoders News API

## Hosted Version

The hosted version of this repository can be found at: https://news-ynvj.onrender.com/

## Repo set up

### Cloning this repo

This repo can be cloned by running the following command in the CLI:

```
git clone https://github.com/cCody34/nc-news.git
```

### npm init -y

Initialise the project by running the following command in the CLI:

```
npm init -y
```

### Installing dependencies

The dependencies dotenv, express and pg should be installed using the following commands in the CLI:

```
npm i dotenv
npm i express
npm i pg
```

husky, jest, jest-extended, jest-sorted, pg-format and supertest should all be installed as developer dependencies using the following commands in the CLI:

```
npm i -D jest
npm i -D jest-extended
npm i -D jest-sorted
npm i -D pg-format
npm i -D supertest
```

### Seeding the local database

To seed the local database use the following command in the CLI:

```
npm run seed
```

### Running tests

To run tests use the command:

```
npm t
```

Or to run app specific tests only use the command:

```
npm t app
```

## Creating the .env files

In order to connect to the databases used in this repository (nc_news and nc_news_test), set up 2 files:
.env.development
.env.test

These files should assign PGDATABASE to the correct database (for an example look in .env-example), database_name_here should be nc_news for .env.development and nc_news_test for .env.test

## Node and Postgres versions
The minimum required node version to run this project is 6.9.0/

The minimum required postgres version to run this project is 8.0.