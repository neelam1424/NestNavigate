# Can You Afford This House?

## Game Concept

You are sitting at Maya's kitchen table, helping her figure out whether she can afford to buy a home. Maya earns $90,000 a year -- $7,500 gross per month, $5,650 in her bank account after withholdings.

The core idea is the debt-to-income ratio (DTI): the share of your gross monthly income that goes to debt payments, including the new housing payment. Most lenders want DTI at or below 43%. Below 36% is comfortable; 36-43% is a stretch; above 43%, most lenders will decline.

The game is four steps, in order: read the paystub to pick the income figure the lender uses, sort Maya's bills into "counted on the application" and "not counted", choose a home from three listings, then handle a surprise phone call about a new car loan. A live gauge reacts to every choice. A wrong choice plays out in the numbers -- the lender's note explains what went wrong without giving away the answer, and the player can revise and try again.

This is not a quiz. There are no "Check my answer" buttons. The lender's decline is the feedback.

**Scoring:** each of the four steps is worth 25 points. Each revision on a step costs 10 points, with a floor of 5. Max score: 100.

**Endings:** Denied (the player walked away from a declined application), House-poor (approved but under $1,000 per month left), or Comfortable (approved with $1,000 or more per month left).

> Simplified for education: real lenders also count property taxes, insurance, and other factors. Not financial advice.

## How to Run Locally

```bash
npm install
npm run dev
```

Open `http://localhost:5173` in a browser.
Deployed URL `https://nestnavigate-production.up.railway.app/` 

```bash
npm test        # run the test suite
npm run build   # production build
```

## Tech Choices

- **React 19 + Vite 8** -- standard fast-feedback dev setup, no framework overhead for a single-page game.
- **TypeScript** -- all game logic is typed; the reducer, rules, and DTI calculations are in `src/game` with no React dependency, which makes them easy to test and reason about.
- **Tailwind v4 with the `@tailwindcss/vite` plugin** -- the plugin processes the CSS at build time; `@import "tailwindcss"` in `index.css` injects base, components, and utilities. No separate config file needed.
- **shadcn/ui (base-nova style) + Base UI** -- pre-built accessible primitives. The generated files in `src/components/ui` are left largely untouched; game components are built in `src/components`.
- **Vitest** -- zero-config test runner that shares the Vite transform pipeline. All game logic is pure functions, so tests run in under 300ms.
- No Redux, no backend, no localStorage for personal data. All state lives in a single `useReducer` in `App.tsx`; the reducer lives in `src/game/gameReducer.ts`.

## What I'd Do With More Time

- **Dynamic tax brackets** :- the withholdings are fixed fictional numbers. A real paystub step would show how tax bracket affects take-home and DTI.
- **Property tax and insurance in the housing payment** :- real lenders add PITI (principal, interest, taxes, insurance). The current calculation uses the payment alone, which is simpler to teach but understates real costs.
- **User can add income dynamically** :- `src/data/maya.ts` is designed for copy-paste: a second buyer with different income and debts would cover more scenarios without touching the game engine.
- **Proper animation instead of guage** -- the gauge has `role="meter"` with ARIA value attributes and the feedback panel has `role="status"`. A complete screen-reader and keyboard-navigation review is still needed.
- **Phaser 3 for drag-and-drop bills** -- the bills step would feel more tactile with real drag-and-drop. The plan: React owns all state, Phaser only renders the pile and fires `onBillDropped` events, the canvas is created in an effect and destroyed in cleanup for StrictMode safety. Skipped because the click-to-sort version was cleaner to ship on time.

## Known Issues

- `npm audit` reports 7 high-severity findings, all in the `shadcn` CLI package and its build-time dependencies (`braces`, `micromatch`, `fast-glob`, `ts-morph`). These are not bundled into the production app. The suggested fix (`npm audit fix --force`) would downgrade `shadcn` to 1.0.0 which is a breaking change to the component generator; it does not affect the running game.
- The life event step (step 4) assumes a house was chosen in step 3. If the game state is somehow reached without a house selection, the event component is not rendered and the step remains unanswered.
