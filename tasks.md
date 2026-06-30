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
- [x] **2.9** Wijzig `Filters.category` naar `Category[]` (lege array = "All"), update filterlogica in `useFilters` en de minimale aanpassing in `FilterBar` om type-correct te blijven
- [x] **2.10** Test `useFilters` multi-categorie: `[]` toont alles, `['Food']` filtert correct, `['Food', 'Transport']` toont beide en filtert overige categorieën weg

> Testbaar: composables importeerbaar in `ExpenseTracker.vue`, CRUD muteert de array correct, localStorage bevat data na reload, `npm run test` slaagt voor 2.7 t/m 2.10

---

## Fase 3: Dumb Components

- [x] **3.1** Bouw `ExpenseForm.vue`: props: `expense?` — emits: `submit(expense)`, `cancel`
- [x] **3.2** Bouw `ExpenseList.vue`: props: `expenses` — emits: `edit(expense)`, `delete(id)` — toont lege staat als array leeg is
- [x] **3.3** Bouw `ExpenseItem.vue`: props: `expense` — emits: `edit`, `delete`
- [x] **3.4** Bouw `SummaryDashboard.vue`: props: `total`, `categoryTotals` — geen eigen berekeningen
- [x] **3.5** Bouw `FilterBar.vue`: props: `filters` — emits: `update:filters`
- [x] **3.6** Bouw `ConfirmModal.vue`: props: `open`, `message` — emits: `confirm`, `cancel`

> Testbaar: componenten renderen correct met hardcoded props, geen composable-imports in components map

---

## Fase 4: Orchestrator

- [x] **4.1** Scaffold `ExpenseTracker.vue`: importeer alle drie composables, render `ExpenseList` (`:expenses` uit `useExpenses`) en `SummaryDashboard` (`:total`, `:categoryTotals` berekend in orchestrator)
- [x] **4.2** Voeg `ExpenseForm` toe: koppel `submit`-emit aan `addExpense` + `resetForm`, koppel `cancel`-emit aan `resetForm`
- [x] **4.3** Koppel `edit`-emit van `ExpenseList` aan `populateForm`; in edit mode roept `submit` `updateExpense` aan en sluit daarna de form — slechts één edit tegelijk actief
- [x] **4.4** Voeg `ConfirmModal` toe: koppel `delete`-emit van `ExpenseList` aan modal, `confirm`-emit roept `deleteExpense` aan, `cancel`-emit sluit modal
- [x] **4.5** Voeg `FilterBar` toe: koppel `update:filters`-emit aan `useFilters`, geef `filteredExpenses` door aan `ExpenseList`
- [x] **4.6** Bereken `total` en `categoryTotals` op basis van `filteredExpenses` in `ExpenseTracker`, geef door aan `SummaryDashboard`
- [x] **4.7** Vervang de categorie-`<select>` in `FilterBar` door een `<select multiple>` zodat meerdere categorieën tegelijk selecteerbaar zijn — emits `Category[]`, lege selectie = alle categorieën

> Testbaar na 4.1: lijst en totalen tonen · na 4.2: expense toevoegen · na 4.3: expense bewerken · na 4.4: expense verwijderen · na 4.5: filter + sort · na 4.6: dashboard klopt na elke wijziging · na 4.7: meerdere categorieën tegelijk selecteerbaar

---

## Fase 5: Validatie & Edge Cases

- [x] **5.1** Voeg inline validatie toe aan `useExpenseForm`: errors per veld, valideer op blur + submit
- [x] **5.2** Toon foutmeldingen onder elk veld in `ExpenseForm.vue` via `errors` prop
- [x] **5.2b** Koppel `useExpenseForm` aan `ExpenseForm` in `ExpenseTracker`: geef `errors` door als prop, `handleBlur(field, value)` als `onBlur`-callback (synct `form.value[field]` en roept `validateField` aan)
- [x] **5.3** Disable Save-knop als form invalid of (in edit mode) ongewijzigd — via `disabled` prop
- [x] **5.4** Toon toast-foutmelding bij localStorage schrijffout (gewone fout én `QuotaExceededError`)
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
- [x] **6.6** Vervang de `<select multiple>` in `FilterBar` door de chip-UI: een dropdown om een categorie toe te voegen, actieve categorieën getoond als chips met ×-knop
- [ ] **6.7** Stijl de categorie-chips in `FilterBar.vue`: chip als pill (afgeronde achtergrond, subtiele kleur), ×-knop als klein, subtiel icoontje dat oplicht bij hover — geen externe libraries

> Testbaar: bedragen correct geformatteerd, standaardwaarden correct bij eerste load, UI bruikbaar op 1280px breedte, meerdere categorieën selecteerbaar en verwijderbaar via chips

---

## Fase 7: Routing — Create & Edit op eigen pagina

- [ ] **7.1** Installeer `vue-router` in `app/`, maak `src/router/index.ts` aan met drie routes: `/` (lijstpagina), `/create` (aanmaken) en `/edit/:id` (bewerken)
- [ ] **7.2** Vervang de inhoud van `App.vue` door `<RouterView>`, maak `src/pages/HomePage.vue` (lijst + filter + dashboard + "Toevoegen"-knop die naar `/create` navigeert) en verwijder het inline form uit deze pagina
- [ ] **7.3** Maak `src/pages/CreatePage.vue`: rendert `ExpenseForm` zonder vooraf gevulde waarden, roept `addExpense` aan bij submit en navigeert daarna naar `/`, annuleren navigeert terug naar `/`
- [ ] **7.4** Maak `src/pages/EditPage.vue`: laadt expense op basis van `:id` uit de route via `useExpenses`, vult `ExpenseForm` via `populateForm`, roept `updateExpense` aan bij submit en navigeert naar `/`; onbekend id redirect naar `/`
- [ ] **7.5** Verwijder `editingId`, `editingExpense`, `handleEdit` en de inline `ExpenseForm` uit de voormalige `ExpenseTracker.vue`/`HomePage.vue`, en verwijder de `edit`-emit koppeling van `ExpenseList`

> Testbaar: `/` toont lijst zonder form, "Toevoegen" navigeert naar `/create`, opslaan keert terug met nieuwe expense, Edit-knop navigeert naar `/edit/:id` met gevuld form, opslaan keert terug met bijgewerkte expense, annuleren keert altijd terug zonder wijziging, directe URL naar onbekend id redirect naar `/`
