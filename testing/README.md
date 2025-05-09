# PlayWright & Axe-Core Testing

## Prerequisities

1. App is running on localhost:3000
2. Node and npm is installed

## Installation

Install deps and playwright browsers:

```bash
make setup
```

## Running

Run the tests after setting up:

```bash
make test
```

Reports will be generated in `/reports/{timestamp of run}/a11y-report-{page}-{timestamp}.html` anf `/reports/{timestamp of run}/a11y-report-{page}-{timestamp}.json`.

You are able to open up the HTML to view an easy-read report of the problems.

## Cleaning

After tests have finished, remove the /reports folder by using:

```bash
make clean
```