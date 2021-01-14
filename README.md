# BusChecker

A simple application for locating bus stop location and bus arrival time in Singapore.

Live Demo: https://sgbuschecker.herokuapp.com/
Telegram Bot: @buschecker_bot
Link to Telegram: https://t.me/buschecker_bot
Telegram Bot Repo: https://github.com/Darkripper214/BusCheckerTelegramBot

**Features:**

- Connect to Third Part API (By LTA)

- User authentication using JWT & Passport

- Activation Email when user register

- User Data stored in MySQL Cloud

- User profile photo upload to Amazon S3

- Bus Stop data stored in MongoDB Atlas (Data obtained from LTA API, subsequent query are to own MongoDB)

- Bus Arrival data request on demand and cached in Express Server

- SPA using Angular and deployed as Same-Origin using Express

- Live Update of Bus Arrival on Client using web socket

- Live Search Bar for Bus Stop Name

- Loader Spinner using HTTP Interceptor

  

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 11.0.2.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
