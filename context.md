# Expense Tracker — Context

## Goal
Single-page app to log, categorize, filter, sort, and summarize personal expenses. Data persists in localStorage; no backend.

## Types
- `Expense`: id (uuid), description (str ≤100), amount (float >0 ≤999999.99), category, date (YYYY-MM-DD), createdAt (timestamp)
- `Category` (string union): `'Food' | 'Transport' | 'Entertainment' | 'Other'`
- `SortField`: `'date' | 'amount'` — `SortOrder`: `'asc' | 'desc'`
- `Filters`: `{ category: Category | 'All', sortField, sortOrder }`

## Validation Rules
| Field       | Rule                                                 |
|-------------|------------------------------------------------------|
| description | Verplicht, 1–100 tekens                              |
| amount      | Verplicht, getal > 0, max 999 999.99                 |
| category    | Verplicht, moet geldige Category-waarde zijn         |
| date        | Verplicht, geldig YYYY-MM-DD, niet in de toekomst    |

## State Management

`useExpenses` gebruikt een **module-level singleton**: de `expenses` ref staat buiten de functie, zodat alle aanroepers dezelfde instantie delen. Dit voorkomt dataconflicten — er is altijd één globaal toegangspunt voor de expense-lijst.

## Component Architecture

**Folder structuur**
```
expense-tracker/
├── context.md
├── tasks.md
└── app/                      ← Vite project root (npm commando's hier uitvoeren)
    ├── index.html
    ├── package.json
    ├── vite.config.ts
    ├── tsconfig*.json
    └── src/
        ├── types/index.ts
        ├── composables/
        │   ├── useExpenses.ts    — CRUD + localStorage sync (source of truth)
        │   ├── useFilters.ts     — filter/sort state + gefilterde computed
        │   └── useExpenseForm.ts — form state, validatie, submit handler
        ├── components/
        │   ├── SummaryDashboard.vue  — props: total, categoryTotals
        │   ├── FilterBar.vue         — props: filters — emits: update:filters
        │   ├── ExpenseList.vue       — props: expenses — emits: edit, delete
        │   ├── ExpenseItem.vue       — props: expense — emits: edit, delete
        │   ├── ExpenseForm.vue       — props: expense? — emits: submit, cancel
        │   └── ConfirmModal.vue      — props: open, message — emits: confirm, cancel
        ├── ExpenseTracker.vue    ← orchestrator: gebruikt composables, geeft props door
        └── App.vue               — importeert alleen ExpenseTracker.vue
```

## Regels

### Architectuur
- Alleen `ExpenseTracker.vue` gebruikt composables — overige components zijn dumb (props in, emits uit).
- Composables mogen andere composables aanroepen. `useFilters` roept `useExpenses()` aan om de singleton-expenses te lezen zonder die via `ExpenseTracker` door te geven.
- `src/types/index.ts` bevat alleen domein­types — UI-staat (form state, interne composable-state) blijft lokaal in het composable dat het gebruikt.

### Tests
- Testbestanden staan in een `__tests__/` map naast het bestand dat ze testen (bijv. `composables/__tests__/useExpenses.spec.ts`), niet als `*.test.ts` naast de bron.
- jsdom's localStorage werkt niet betrouwbaar — elke testfile die localStorage raakt zet een eigen `vi.stubGlobal('localStorage', mock)` op met een plain-object store.
- Tests die de `useExpenses`-singleton raken (direct of via `useFilters`) gebruiken `vi.resetModules()` in `beforeEach` en importeren composables dynamisch via `await import(...)`. Samenhangende composables worden in één `getComposables()`-functie geïmporteerd zodat ze dezelfde singleton-instantie delen.

## Edge Cases
- **Geen expenses**: toon lege staat met call-to-action, geen tabel/dashboard
- **localStorage fout / corrupt**: try/catch bij lezen én schrijven; toon toast, val terug op lege array
- **QuotaExceededError**: vang op bij schrijven; toon foutmelding, wijziging niet doorgevoerd
- **Negatief/nul bedrag**: geblokkeerd door validatie vóór opslaan
- **Gelijktijdig editen**: slechts één form actief tegelijk; open edit sluit vorige

## Routing

Vue Router met drie routes: `/` (lijst), `/create` (aanmaken), `/edit/:id` (bewerken). Create en Edit krijgen elk een eigen pagina zodat het form niet inline op de lijstpagina staat. `ExpenseForm` wordt als component hergebruikt op beide pagina's. `App.vue` rendert alleen `<RouterView>`.

## UX Rules
- **Save-knop** disabled zolang form invalid of ongewijzigd (edit mode)
- **Delete** vraagt om bevestiging via ConfirmModal (Cancel + Confirm)
- **Foutmeldingen** verschijnen inline onder elk veld na blur of submit-poging
- **Bedrag** getoond als `€ 1.234,56` (nl-NL locale)
- **Datum** gesorteerd descending by default (nieuwste eerst)
- **Filter "All"** is de standaard categorie-filter
- **Formulier category** staat standaard op `'Food'` (eerste waarde in de union)
