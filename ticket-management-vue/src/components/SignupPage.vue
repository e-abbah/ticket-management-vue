<template>
  <div class="flex justify-center items-center min-h-screen bg-gray-100">
    <div
      class="flex flex-col justify-center items-center w-2/3 max-w-md h-auto rounded-lg bg-white bg-opacity-20 p-10 shadow-lg"
    >
      <h1 class="text-2xl font-bold mb-6">Create Account</h1>

      <form @submit.prevent="handleSignup" class="flex flex-col w-full space-y-4">
        <!-- Full Name -->
        <div>
          <label for="fullName" class="text-sm font-medium text-gray-700">
            Full Name
          </label>
          <input
            v-model="fullName"
            type="text"
            id="fullName"
            placeholder="John Doe"
            class="p-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-400 w-full"
          />
          <p v-if="errors.fullName" class="text-red-600 text-sm mt-1">
            {{ errors.fullName }}
          </p>
        </div>

        <!-- Email -->
        <div>
          <label for="email" class="text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            v-model="email"
            type="email"
            id="email"
            placeholder="example@gmail.com"
            class="p-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-400 w-full"
          />
          <p v-if="errors.email" class="text-red-600 text-sm mt-1">
            {{ errors.email }}
          </p>
        </div>

        <!-- Password -->
        <div>
          <label for="password" class="text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            v-model="password"
            type="password"
            id="password"
            placeholder="Password"
            class="p-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-400 w-full"
          />
          <p v-if="errors.password" class="text-red-600 text-sm mt-1">
            {{ errors.password }}
          </p>
        </div>

        <button
          type="submit"
          class="w-full bg-blue-600 text-white font-semibold py-2 rounded hover:bg-blue-800 transition"
        >
          Signup
        </button>
      </form>

      <p class="mt-4 text-sm">
        Already have an account?
        <button @click="goToLogin" class="text-red-600 hover:underline">
          Login
        </button>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";

interface Errors {
  fullName?: string;
  email?: string;
  password?: string;
}

interface User {
  fullName: string;
  email: string;
  password: string;
}

const router = useRouter();

const fullName = ref("");
const email = ref("");
const password = ref("");
const errors = ref<Errors>({});

const validateForm = (): boolean => {
  const newErrors: Errors = {};

  if (!fullName.value.trim()) newErrors.fullName = "Full Name is required";
  if (!email.value.trim()) newErrors.email = "Email is required";
  else if (!/^\S+@\S+\.\S+$/.test(email.value))
    newErrors.email = "Email is invalid";

  if (!password.value.trim()) newErrors.password = "Password is required";
  else if (password.value.length < 6)
    newErrors.password = "Password must be at least 6 characters";

  errors.value = newErrors;
  return Object.keys(newErrors).length === 0;
};

const handleSignup = () => {
  if (!validateForm()) return;

  const existingUsers: User[] = JSON.parse(localStorage.getItem("users") || "[]");

  if (existingUsers.find((user) => user.email === email.value)) {
    alert("Email already registered");
    return;
  }

  const newUser = {
    fullName: fullName.value,
    email: email.value,
    password: password.value,
  };

  existingUsers.push(newUser);
  localStorage.setItem("users", JSON.stringify(existingUsers));

  alert("Signup successful!");
  router.push("/login");
};

const goToLogin = () => {
  router.push("/login");
};
</script>
