# SERVER PLANNER SERVICE

# About Server Planner Service

Server Planner Service is an API that is used for calculating the number of servers required to service a group of Virtual Machines.

[Postman Documentation](https://documenter.getpostman.com/view/25299822/2s93m911SC)

[Postman Collection](https://www.postman.com/chequebase/workspace/tunga/collection/25299822-6ceb15cc-6d15-4e15-ac54-87f3c8d11fbf?action=share&creator=25299822)

# Built with love by:

|                                        [Omobolanle Aro](https://github.com/Omobolanle-Arogundade)                                        |
| :--------------------------------------------------------------------------------------------------------------------------------------: | --- |
|                 [<img src="https://i.ibb.co/hXrQx86/id.jpg" width = "200" />](https://github.com/Omobolanle-Arogundade)                  |
| [<img src="https://static.licdn.com/sc/h/al2o9zrvru7aqj8e1x2rzsrca" width="15"> ](https://www.linkedin.com/in/omobolanle-aro-00a98a172/) |     |

## Features

- **Validation**: request data validation using Joi validator

- **Testing**: unit and integration tests using [Jest](https://jestjs.io)

- **Error handling**: centralized error handling mechanism

- **API documentation**: with [DocGen](https://github.com/thedevsaddam/docgen) and [Postman API Documentation Tool](https://www.postman.com/api-documentation-tool/)

- **Dependency management**: with [Node Package Manager (npm)](https://www.npmjs.com/)

- **CORS**: Cross-Origin Resource-Sharing enabled using [cors](https://github.com/expressjs/cors)

- **Linting**: with [ESLint](https://eslint.org) and [Prettier](https://prettier.io)

- **Editor config**: consistent editor configuration using [EditorConfig](https://editorconfig.org)

## Getting Started

### Installation

Clone the repo:

```bash

git clone https://github.com/Omobolanle-Arogundade/tunga-assessment

cd tunga-assessment

```

Install the dependencies:

```bash

npm install

```

### Commands

Build for production:

```bash

npm run build

```

Run the app:

```bash

npm start

```

Build the docker image

```bash

docker build -f "Dockerfile" -t tunga-assessment:latest .

```

Run the docker image

```bash

docker run -p 3000:3000 tunga-assessment:latest

```
