# Basis Theory 3DS Web Tester

This repository is a simple Next.js project meant to test the Basis Theory 3DS Feature.

## Getting Started

1. Set up the `.env.local` - replace the `PVT_API_KEY` and `NEXT_PUBLIC_PUB_API_KEY` with your own values.
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

All [Test Cards](https://developers.basistheory.com/docs/api/3ds/sessions#test-cards) are available in the `src/data/test-cards.json` file.
The dropdown by default is populated with the `luhnValid` cards.

## More Information
- [Basis Theory 3DS Setup Guide](https://developers.basistheory.com/docs/guides/threeds/overview)
- [Basis Theory 3DS Web SDK Documentation](https://developers.basistheory.com/docs/sdks/web/3ds)
- [Basis Theory 3DS API Reference](https://developers.basistheory.com/docs/api/3ds/sessions)