# Basis Theory 3DS Web Tester

This repository is a simple Next.js project meant to test the Basis Theory 3DS Feature.

## Getting Started

1. Set up the `.env.local`
    ```bash
    cp .env.example .env.local
    ```
2. Install dependencies
    ```bash
    npm install
    # or
    yarn install
    ```
3. Run the development server:
    ```bash
    npm run dev
    # or
    yarn dev
    ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Usage
Select one of the test cards from the dropdown, or input your own card details. Click the `Checkout` button to start the 3DS process.
To reset, just select a new card and click `Checkout` again.

## Test Cards

All [Ravelin Test Cards](https://developer.ravelin.com/guides/3d-secure/test-cards/#3ds-2-test-cards) are available via the dropdown.
If you wish to add more, edit the `src/data/test-cards.json` file. 
