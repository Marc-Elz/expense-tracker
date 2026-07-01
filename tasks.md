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
- [x] **5.5** Toon lege staat in `ExpenseList` met call-to-action als `expenses` prop leeg is
- [x] **5.6** Test `useExpenseForm`: validatieregels per veld (leeg, te lang, bedrag ≤ 0, toekomstige datum), `resetForm`, `populateForm`

> Testbaar: submit met leeg form toont errors, Save correct disabled, toast verschijnt bij geforceerde storage-fout, `npm run test` slaagt voor 5.6

---

## Fase 6: Opmaak & Polish

- [x] **6.1** Maak `src/utils/formatCurrency.ts` met `Intl.NumberFormat` (nl-NL, EUR)
- [x] **6.2** Test `formatCurrency`: `1234.56` → `€ 1.234,56`, `0` → `€ 0,00`, negatief getal correct geformatteerd
- [x] **6.3** Pas `formatCurrency` toe in `ExpenseItem` en `SummaryDashboard` via prop of filter
- [x] **6.4** Stel standaard filter in op `All` en standaard sort op datum descending (in `useFilters`)
- [x] **6.5** Voeg basis CSS toe (layout, form styling, tabel, modal overlay)
- [x] **6.6** Vervang de `<select multiple>` in `FilterBar` door de chip-UI: een dropdown om een categorie toe te voegen, actieve categorieën getoond als chips met ×-knop
- [x] **6.7** Stijl de categorie-chips in `FilterBar.vue`: chip als pill (afgeronde achtergrond, subtiele kleur), ×-knop als klein, subtiel icoontje dat oplicht bij hover — geen externe libraries

> Testbaar: bedragen correct geformatteerd, standaardwaarden correct bij eerste load, UI bruikbaar op 1280px breedte, meerdere categorieën selecteerbaar en verwijderbaar via chips

---

## Fase 7: Create & Edit in Modal

- [x] **7.1** Extraheer generieke `Modal.vue` uit `ConfirmModal.vue`: backdrop + gecentreerde box als slot-wrapper — props: `open` — emit: `cancel` bij click buiten de modal
- [x] **7.2** Refactor `ConfirmModal.vue` om `Modal.vue` te gebruiken voor de overlay; gedrag (message, Cancel/Confirm-knoppen, emits) blijft ongewijzigd
- [x] **7.3** Voeg "Toevoegen"-knop toe aan `ExpenseTracker.vue` en een `isFormOpen` ref; de knop opent de form-modal in create mode (leeg form, geen `editingExpense`)
- [x] **7.4** Verplaats de inline `ExpenseForm` in `ExpenseTracker.vue` naar binnen `Modal.vue` (`:open="isFormOpen"`); `handleEdit` zet `isFormOpen` naar `true` naast de bestaande `populateForm`-aanroep
- [x] **7.5** Zorg dat succesvolle submit én cancel `isFormOpen` op `false` zetten (naast het bestaande `resetForm`/`formKey`-gedrag)

> Testbaar: lijstpagina toont geen permanent zichtbaar form meer · "Toevoegen" opent een lege form-modal · Edit-knop opent de modal met vooraf ingevuld form · submit en cancel sluiten de modal

---

## Verbeteringen

- [x] **V.1** Laat `resetForm` een optionele default-categorie accepteren; `ExpenseTracker.vue` geeft bij `handleAddNew` de actieve filtercategorie door als er precies één geselecteerd is (anders `'Food'`); test dat `resetForm` de juiste default zet in elk van de drie gevallen (0, 1, 2+ actieve filters)
- [x] **V.2** Voeg een categoriekleur-accent toe aan de expense-lijst en het dashboard, consistent met de bestaande chips in `FilterBar`
  - Bugfix: in `SummaryDashboard.vue` overschreef de specifiekere `.breakdown li`-selector de `.accent-*`-kleur, waardoor de rand onzichtbaar bleef; opgelost door de accent-selectors te nesten (`.breakdown li.accent-food` enz.)
- [x] **V.3** Vervang de "+ Categorie toevoegen"-select in `FilterBar.vue` door een filter-icoonknop die een dropdown met platte tekstopties opent
  - Bugfix: outside-click detectie sloot de dropdown direct na het kiezen van een categorie, omdat de aangeklikte optie al uit de DOM verwijderd was vóór het click-event `document` bereikte; opgelost door `event.composedPath()` te gebruiken in plaats van `.contains()`
- [x] **V.4** Bugfix: `maxlength="100"` op het input-veld blokkeerde de `val.length > 100` validatie in `useExpenseForm`
