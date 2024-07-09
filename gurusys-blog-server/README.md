# HireUs Logistics API

## Version 1.0.0

HireUs Logistics is a platform designed to reduce the stress and difficulties associated with accessing reliable intra-national and intra-state courier services by bringing together trusted courier companies, vendors, and customers, all within Nigeria.

Hi,
If you are already here, this is simply a brief description and guide into the application's API.

## Getting Started

These instructions will guide you through setting up and running this project on your local machine for development and testing purposes.

### Prerequisites

To run this project locally, first clone the repository into your computer from your terminal using the command :

```text
git clone git@github.com:HireUs-NG/HireusServicesapi.git
```

Next, install all the dependencies listed in the [`package.json`](package.json) file using the following command :

Using `npm` :

```text
npm install
```

or `yarn` :

```text
yarn install
```

After installation of dependencies, go ahead and provide your own `environment` variables as suggested in the [`.env.example`](.env.example) file found in the root of this project.

_Run the project in **production** environment using the command :_

```text
yarn start
```

or

```text
npm run start
```

_And in **development** environment using :_

```text
yarn dev
```

or

```text
npm run dev
```

## Core Development Stack

- [Expressjs](https://www.expressjs.com) - Nodejs framework

- [Typescript](https://www.typescriptlang.org) - Javascript extension for static typing

- [MongoDB](https://www.mongodb.com) - For database management

- [Joi](https://www.joi.dev) - For `request` `body` validations
