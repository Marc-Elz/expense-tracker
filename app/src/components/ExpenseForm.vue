<template>
  <form @submit.prevent="handleSubmit">
    <div>
      <label for="description">Description</label>
      <input
        id="description"
        v-model="form.description"
        type="text"
        maxlength="100"
        @blur="onBlur('description', form.description)"
      />
      <span v-if="errors.description">{{ errors.description }}</span>
    </div>

    <div>
      <label for="amount">Amount</label>
      <input
        id="amount"
        v-model.number="form.amount"
        type="number"
        step="0.01"
        min="0.01"
        @blur="onBlur('amount', form.amount)"
      />
      <span v-if="errors.amount">{{ errors.amount }}</span>
    </div>

    <div>
      <label for="category">Category</label>
      <select id="category" v-model="form.category" @blur="onBlur('category', form.category)">
        <option v-for="cat in CATEGORIES" :key="cat" :value="cat">{{ cat }}</option>
      </select>
      <span v-if="errors.category">{{ errors.category }}</span>
    </div>

    <div>
      <label for="date">Date</label>
      <input id="date" v-model="form.date" type="date" @blur="onBlur('date', form.date)" />
      <span v-if="errors.date">{{ errors.date }}</span>
    </div>

    <button type="submit">Save</button>
    <button type="button" @click="emit('cancel')">Cancel</button>
  </form>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue'
import type { Category, Expense } from '../types'
import { CATEGORIES } from '../types'
import type { FormErrors, OnBlurFn } from '../composables/useExpenseForm'

const props = defineProps<{
  expense?: Expense
  errors: FormErrors
  onBlur: OnBlurFn
}>()

const emit = defineEmits<{
  submit: [expense: Omit<Expense, 'id' | 'createdAt'>]
  cancel: []
}>()

const form = reactive({
  description: props.expense?.description ?? '',
  amount: (props.expense?.amount ?? null) as number | null,
  category: (props.expense?.category ?? 'Food') as Category,
  date: props.expense?.date ?? '',
})

watch(
  () => props.expense,
  (newExpense) => {
    form.description = newExpense?.description ?? ''
    form.amount = newExpense?.amount ?? null
    form.category = newExpense?.category ?? 'Food'
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
