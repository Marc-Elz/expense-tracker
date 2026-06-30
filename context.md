# Expense Tracker — Context

## Goal
Single-page app to log, categorize, filter, sort, and summarize personal expenses. Data persists in localStorage; no backend.

## Types
- `Expense`: id (uuid), description (str ≤100), amount (float >0 ≤999999.99), category, date (YYYY-MM-DD), createdAt (timestamp)
- `Category` (string union): `'Food' | 'Transport' | 'Entertainment' | 'Other'`
- `SortField`: `'date' | 'amount'` — `SortOrder`: `'asc' | 'desc'`
- `Filters`: `{ category: Category[], sortField, sortOrder }` — lege array betekent "All"

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
        ├── utils/
        │   └── formatCurrency.ts — Intl.NumberFormat (nl-NL, EUR)
        ├── components/
        │   ├── SummaryDashboard.vue  — props: total, categoryTotals
        │   ├── FilterBar.vue         — props: filters — emits: update:filters
        │   ├── ExpenseList.vue       — props: expenses, hasAnyExpenses — emits: edit, delete
        │   ├── ExpenseItem.vue       — props: expense — emits: edit, delete
        │   ├── ExpenseForm.vue       — props: expense? — emits: submit, cancel
        │   ├── Modal.vue             — generieke overlay-wrapper — props: open — emits: cancel — slot voor content
        │   └── ConfirmModal.vue      — props: open, message — emits: confirm, cancel — gebruikt Modal.vue intern
        ├── ExpenseTracker.vue    ← orchestrator: gebruikt composables, geeft props door
        └── App.vue               — importeert alleen ExpenseTracker.vue
```

## Regels

### Architectuur
- Alleen `ExpenseTracker.vue` gebruikt composables — overige components zijn dumb (props in, emits uit).
- Composables mogen andere composables aanroepen. `useFilters` roept `useExpenses()` aan om de singleton-expenses te lezen zonder die via `ExpenseTracker` door te geven.
- `src/types/index.ts` bevat **uitsluitend domaintypes** (`Expense`, `Category`, `Filters`, `SortField`, `SortOrder`). UI-types horen hier niet thuis.
- UI-types die gedeeld worden tussen een composable en de bijbehorende component (bijv. `FormErrors`, `FormField`, `OnBlurFn`) worden geëxporteerd vanuit het composable, niet vanuit `src/types/index.ts` en niet inline in de component. De component importeert alleen de types, niet de composable-functie zelf.
- `Modal.vue` is een generieke, dumb overlay-wrapper (slot-based: backdrop + gecentreerde box, props `open`, emit `cancel` bij click buiten de modal). `ConfirmModal.vue` gebruikt `Modal.vue` intern voor de overlay en voegt alleen het message + Cancel/Confirm-gedrag toe. De create/edit form-modal in `ExpenseTracker.vue` wrapt `ExpenseForm` ook in `Modal.vue`, zonder een apart `FormModal.vue` component.

### Tests
- Testbestanden staan in een `__tests__/` map naast het bestand dat ze testen (bijv. `composables/__tests__/useExpenses.spec.ts`), niet als `*.test.ts` naast de bron.
- jsdom's localStorage werkt niet betrouwbaar — elke testfile die localStorage raakt zet een eigen `vi.stubGlobal('localStorage', mock)` op met een plain-object store.
- Tests die de `useExpenses`-singleton raken (direct of via `useFilters`) gebruiken `vi.resetModules()` in `beforeEach` en importeren composables dynamisch via `await import(...)`. Samenhangende composables worden in één `getComposables()`-functie geïmporteerd zodat ze dezelfde singleton-instantie delen.

## Edge Cases
- **Geen expenses**: toon lege staat met call-to-action, geen tabel/dashboard
- **localStorage fout / corrupt**: try/catch bij lezen én schrijven; toon toast, val terug op lege array
- **QuotaExceededError**: vang op bij schrijven; toon foutmelding, wijziging niet doorgevoerd
- **Negatief/nul bedrag**: geblokkeerd door validatie vóór opslaan
- **Gelijktijdig editen**: niet mogelijk — de full-screen backdrop van `Modal.vue` blokkeert klikken op de onderliggende lijst zolang de form-modal open is, dus een tweede Edit-aanvraag kan niet ontstaan via de UI

## Create & Edit Modal

Create en Edit gebruiken een modal-overlay in plaats van losse routes of een permanent inline form op de lijstpagina — geen `vue-router`. Een "Toevoegen"-knop opent de modal in create mode (leeg form); de Edit-knop op een `ExpenseItem` opent dezelfde modal in edit mode (vooraf ingevuld via `populateForm`). `ExpenseForm` blijft een ongewijzigde dumb component en wordt binnen `Modal.vue` gerenderd. Submit (succesvol) of cancel (knop of klik buiten de modal) sluit de modal en reset het form.

## UX Rules
- **Save-knop** disabled zolang form invalid of ongewijzigd (edit mode)
- **Delete** vraagt om bevestiging via ConfirmModal (Cancel + Confirm)
- **Foutmeldingen** verschijnen inline onder elk veld na blur of submit-poging
- **Bedrag** getoond als `€ 1.234,56` (nl-NL locale)
- **Datum** gesorteerd descending by default (nieuwste eerst)
- **Categorie-filter** standaard leeg (= alle categorieën); meerdere categorieën tegelijk selecteerbaar via chips in `FilterBar`
- **Formulier category** staat standaard op `'Food'` (eerste waarde in de union)
