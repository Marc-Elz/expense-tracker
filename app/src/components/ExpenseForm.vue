<template>
  <form class="expense-form" @submit.prevent="handleSubmit">
    <div class="field">
      <label for="description">Description</label>
      <input
        id="description"
        v-model="form.description"
        type="text"
        maxlength="100"
        :class="{ invalid: errors.description }"
        @blur="onBlur('description', form.description)"
      />
      <span v-if="errors.description" class="error">{{ errors.description }}</span>
    </div>

    <div class="field">
      <label for="amount">Amount</label>
      <input
        id="amount"
        v-model.number="form.amount"
        type="number"
        step="0.01"
        min="0.01"
        :class="{ invalid: errors.amount }"
        @blur="onBlur('amount', form.amount)"
      />
      <span v-if="errors.amount" class="error">{{ errors.amount }}</span>
    </div>

    <div class="field">
      <label for="category">Category</label>
      <select
        id="category"
        v-model="form.category"
        :class="{ invalid: errors.category }"
        @change="onBlur('category', form.category)"
        @blur="onBlur('category', form.category)"
      >
        <option v-for="cat in CATEGORIES" :key="cat" :value="cat">{{ cat }}</option>
      </select>
      <span v-if="errors.category" class="error">{{ errors.category }}</span>
    </div>

    <div class="field">
      <label for="date">Date</label>
      <input
        id="date"
        v-model="form.date"
        type="date"
        :class="{ invalid: errors.date }"
        @change="onBlur('date', form.date)"
        @blur="onBlur('date', form.date)"
      />
      <span v-if="errors.date" class="error">{{ errors.date }}</span>
    </div>

    <div class="actions">
      <button type="submit" class="btn-primary" :disabled="disabled">Save</button>
      <button type="button" class="btn-secondary" @click="emit('cancel')">Cancel</button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue'
import type { Category, Expense } from '../types'
import { CATEGORIES } from '../types'
import type { FormErrors, OnBlurFn } from '../composables/useExpenseForm'

const props = defineProps<{
  expense?: Expense
  defaultCategory?: Category
  errors: FormErrors
  onBlur: OnBlurFn
  disabled: boolean
}>()

const emit = defineEmits<{
  submit: [expense: Omit<Expense, 'id' | 'createdAt'>]
  cancel: []
}>()

const form = reactive({
  description: props.expense?.description ?? '',
  amount: (props.expense?.amount ?? null) as number | null,
  category: (props.expense?.category ?? props.defaultCategory ?? 'Food') as Category,
  date: props.expense?.date ?? '',
})

watch(
  () => props.expense,
  (newExpense) => {
    form.description = newExpense?.description ?? ''
    form.amount = newExpense?.amount ?? null
    form.category = newExpense?.category ?? props.defaultCategory ?? 'Food'
    form.date = newExpense?.date ?? ''
  },
)

function handleSubmit() {
  emit('submit', {
    description: form.description,
    amount: form.amount as number,
    category: form.category,
    date: form.date,
  })
}
</script>

<style scoped>
.expense-form {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  padding: var(--spacing-3);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2);
}

.field {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-1);
}

label {
  font-size: 0.875rem;
  font-weight: 600;
}

input,
select {
  font-family: inherit;
  font-size: 1rem;
  padding: var(--spacing-2);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  background: var(--color-surface);
  color: var(--color-text);
}

input.invalid,
select.invalid {
  border-color: var(--color-danger);
}

.error {
  color: var(--color-danger);
  font-size: 0.8rem;
}

.actions {
  display: flex;
  gap: var(--spacing-2);
  margin-top: var(--spacing-1);
}

.btn-primary {
  background: var(--color-primary);
  color: #fff;
  border: none;
  border-radius: var(--radius);
  padding: var(--spacing-2) var(--spacing-3);
  font-size: 1rem;
}

.btn-primary:hover:not(:disabled) {
  background: var(--color-primary-hover);
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-secondary {
  background: transparent;
  color: var(--color-text);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  padding: var(--spacing-2) var(--spacing-3);
  font-size: 1rem;
}

.btn-secondary:hover {
  background: var(--color-bg);
}
</style>
