<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

// Define types
interface User {
  email: string
  password: string
  [key: string]: any
}

interface Errors {
  email?: string
  password?: string
}

const router = useRouter()

// ✅ Step 1: Form state
const email = ref('')
const password = ref('')
const errors = ref<Errors>({})

// ✅ Step 2: Validation
const validateForm = () => {
  const newErrors: Errors = {}

  if (!email.value.trim()) newErrors.email = 'Email is required'
  else if (!/^\S+@\S+\.\S+$/.test(email.value))
    newErrors.email = 'Email is invalid'

  if (!password.value.trim()) newErrors.password = 'Password is required'
  else if (password.value.length < 6)
    newErrors.password = 'Password must be at least 6 characters'

  errors.value = newErrors
  return Object.keys(newErrors).length === 0
}

// ✅ Step 3: Handle login
const handleLogin = () => {
  if (!validateForm()) return

  const users: User[] = JSON.parse(localStorage.getItem('users') || '[]')
  const user = users.find(
    (u) => u.email === email.value && u.password === password.value
  )

  if (!user) {
    alert('Invalid email or password')
    return
  }

  localStorage.setItem('ticketapp_session', JSON.stringify(user))
  alert('Login successful!')
  router.push('/dashboard')
}
</script>

<template>
  <div class="flex justify-center items-center min-h-screen bg-gray-100">
    <div
      class="flex flex-col box-border justify-center px-4 items-center w-2/3 max-w-md h-auto rounded-lg bg-white bg-opacity-20 p-10 shadow-lg"
    >
      <h1 class="text-2xl font-bold mb-6">Welcome Back</h1>

      <form class="flex flex-col w-full space-y-4" @submit.prevent="handleLogin">
        <label for="email" class="text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          id="email"
          required
          placeholder="example@gmail.com"
          v-model="email"
          class="p-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-400"
        />
        <p v-if="errors.email" class="text-red-500 text-sm">{{ errors.email }}</p>

        <label for="password" class="text-sm font-medium text-gray-700">Password</label>
        <input
          type="password"
          id="password"
          required
          placeholder="Password"
          v-model="password"
          class="p-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-400"
        />
        <p v-if="errors.password" class="text-red-500 text-sm">
          {{ errors.password }}
        </p>

        <button
          type="submit"
          class="w-full bg-red-600 text-white font-semibold py-2 rounded hover:bg-blue-700 transition"
        >
          Login
        </button>
      </form>

      <p class="mt-4 text-sm">
        Don’t have an account?
        <button @click="router.push('/signup')" class="text-red-600 hover:underline">
          Sign Up
        </button>
      </p>
    </div>
  </div>
</template>
