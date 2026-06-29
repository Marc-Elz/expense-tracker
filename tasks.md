# Expense Tracker — Tasks

## Fase 1: Project Setup

- [x] **1.1** Scaffold project in submap `app/` via `npm create vite@latest app --template vue-ts`, daarna `cd app && npm install`
- [x] **1.2** Configureer ESLint + Prettier in `app/`, voeg `.editorconfig` toe
- [x] **1.3** Maak mapstructuur aan: `app/src/types`, `app/src/composables`, `app/src/components`
- [x] **1.4** Verwijder Vite boilerplate in `app/src/`, maak lege `App.vue` die straks alleen `ExpenseTracker.vue` rendert
- [x] **1.5** Installeer Vitest + `@vue/test-utils` + `jsdom` in `app/`, maak `vitest.config.ts`, voeg `test`-script toe aan `app/package.json`

- [x] **1.6** Voeg `.gitkeep` toe aan lege mappen (`src/types`, `src/composables`, `src/components`), controleer `.gitignore` (node_modules, dist uitgesloten), commit alle Fase 1 wijzigingen en push naar GitHub

> Testbaar: `npm run dev` start zonder errors vanuit `app/`, `npm run test` draait zonder fouten, linting geeft geen fouten, lege mappen zichtbaar op GitHub

---

## Fase 2: Types & Data Layer

- [x] **2.1** Definieer `Expense`, `Category`, `SortField`, `SortOrder`, `Filters` in `src/types/index.ts`
- [x] **2.2** Implementeer `useExpenses.ts`: `expenses` ref, `addExpense`, `updateExpense`, `deleteExpense`
- [x] **2.3** Voeg localStorage lezen toe aan `useExpenses` (init + try/catch voor corrupt data)
- [x] **2.4** Voeg localStorage schrijven toe aan `useExpenses` (watch + try/catch voor QuotaExceededError)
- [x] **2.5** Implementeer `useFilters.ts`: `filters` ref, `filteredExpenses` computed (filter + sort)
- [x] **2.6** Implementeer `useExpenseForm.ts`: form state, `resetForm`, `populateForm(expense)`
- [x] **2.7** Test `useExpenses`: `addExpense`, `updateExpense`, `deleteExpense`, localStorage persistentie, corrupt data → lege array, `QuotaExceededError` gooit geen crash
- [x] **2.8** Test `useFilters`: filter op elke categorie + "All", sort datum asc/desc, sort bedrag asc/desc

> Testbaar: composables importeerbaar in `ExpenseTracker.vue`, CRUD muteert de array correct, localStorage bevat data na reload, `npm run test` slaagt voor 2.7 en 2.8

---

## Fase 3: Dumb Components

- [ ] **3.1** Bouw `ExpenseForm.vue`: props: `expense?` — emits: `submit(expense)`, `cancel`
- [ ] **3.2** Bouw `ExpenseList.vue`: props: `expenses` — emits: `edit(expense)`, `delete(id)` — toont lege staat als array leeg is
- [ ] **3.3** Bouw `ExpenseItem.vue`: props: `expense` — emits: `edit`, `delete`
- [ ] **3.4** Bouw `SummaryDashboard.vue`: props: `total`, `categoryTotals` — geen eigen berekeningen
- [ ] **3.5** Bouw `FilterBar.vue`: props: `filters` — emits: `update:filters`
- [ ] **3.6** Bouw `ConfirmModal.vue`: props: `open`, `message` — emits: `confirm`, `cancel`

> Testbaar: componenten renderen correct met hardcoded props, geen composable-imports in components map

---

## Fase 4: Orchestrator

- [ ] **4.1** Maak `src/ExpenseTracker.vue`, importeer alle drie composables, render alle components met berekende props
- [ ] **4.2** Koppel `submit`-emit van `ExpenseForm` aan `addExpense`, reset form daarna via `resetForm`
- [ ] **4.3** Koppel `edit`-emit aan `populateForm`, submit in edit mode roept `updateExpense` aan
- [ ] **4.4** Zorg dat slechts één edit tegelijk actief is (open edit sluit vorige)
- [ ] **4.5** Koppel `delete`-emit aan `ConfirmModal`, `confirm`-emit roept `deleteExpense` aan
- [ ] **4.6** Koppel `update:filters`-emit van `FilterBar` aan `useFilters`, geef `filteredExpenses` door aan `ExpenseList`
- [ ] **4.7** Bereken `total` en `categoryTotals` in `ExpenseTracker`, geef door aan `SummaryDashboard`

> Testbaar: volledige CRUD-cyclus werkt, filter + sort werken, dashboard klopt na elke wijziging

---

## Fase 5: Validatie & Edge Cases

- [ ] **5.1** Voeg inline validatie toe aan `useExpenseForm`: errors per veld, valideer op blur + submit
- [ ] **5.2** Toon foutmeldingen onder elk veld in `ExpenseForm.vue` via `errors` prop
- [ ] **5.3** Disable Save-knop als form invalid of (in edit mode) ongewijzigd — via `disabled` prop
- [ ] **5.4** Toon toast-foutmelding bij localStorage schrijffout (gewone fout én `QuotaExceededError`)
- [ ] **5.5** Toon lege staat in `ExpenseList` met call-to-action als `expenses` prop leeg is
- [ ] **5.6** Test `useExpenseForm`: validatieregels per veld (leeg, te lang, bedrag ≤ 0, toekomstige datum), `resetForm`, `populateForm`

> Testbaar: submit met leeg form toont errors, Save correct disabled, toast verschijnt bij geforceerde storage-fout, `npm run test` slaagt voor 5.6

---

## Fase 6: Opmaak & Polish

- [ ] **6.1** Maak `src/utils/formatCurrency.ts` met `Intl.NumberFormat` (nl-NL, EUR)
- [ ] **6.2** Test `formatCurrency`: `1234.56` → `€ 1.234,56`, `0` → `€ 0,00`, negatief getal correct geformatteerd
- [ ] **6.3** Pas `formatCurrency` toe in `ExpenseItem` en `SummaryDashboard` via prop of filter
- [ ] **6.4** Stel standaard filter in op `All` en standaard sort op datum descending (in `useFilters`)
- [ ] **6.5** Voeg basis CSS toe (layout, form styling, tabel, modal overlay)

> Testbaar: bedragen correct geformatteerd, standaardwaarden correct bij eerste load, UI bruikbaar op 1280px breedte
