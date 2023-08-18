# Northcoders News API

## Hosted Version

The hosted version of this repository can be found at: https://news-ynvj.onrender.com/

## Project Summary

This project is an API for the purpose of accessing application data programmatically.

It mimics the building of a real world backend service.

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

The dependencies needed for this project are dotenv, express and pg.

The devDependencies needed for this project are husky, jest, jest-extended, jest-sorted, pg-format and supertest.

These dependencies and devDependencies can all be installed using the following command in the CLI:

```
npm i
```

### Creating the .env files

In order to connect to the databases used in this repository (nc_news and nc_news_test), set up 2 files:
.env.development
.env.test

These files should assign PGDATABASE to the correct database (for an example look in .env-example), database_name_here should be nc_news for .env.development and nc_news_test for .env.test

### Seeding the local database

After setting up the .env files seed the local database using the following command in the CLI:

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

## Node and Postgres versions

The minimum required node version to run this project is 6.9.0.

The minimum required postgres version to run this project is 8.0.
