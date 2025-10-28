<template>
  <div class="min-h-screen flex justify-center items-center bg-gray-50">
    <div class="w-full max-w-[1440px] p-8">
      <!-- Header -->
      <div class="flex justify-between items-center mb-10">
        <h1 class="text-3xl font-bold text-gray-800">
          Welcome, <span class="text-red-600">{{ userName }}</span>
        </h1>
        <button
          @click="handleLogout"
          class="bg-red-600 hover:bg-red-700 text-white font-semibold px-5 py-2 rounded-md shadow-sm transition"
        >
          Logout
        </button>
      </div>

      <!-- Ticket Summary Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div class="p-6 bg-white rounded-2xl shadow-md hover:shadow-lg transition text-center">
          <h2 class="text-lg font-semibold text-gray-700">Total Tickets</h2>
          <p class="text-3xl font-bold text-gray-900 mt-2">{{ stats.total }}</p>
        </div>

        <div class="p-6 bg-white rounded-2xl shadow-md hover:shadow-lg transition text-center">
          <h2 class="text-lg font-semibold text-gray-700">Open Tickets</h2>
          <p class="text-3xl font-bold text-yellow-500 mt-2">{{ stats.open }}</p>
        </div>

        <div class="p-6 bg-white rounded-2xl shadow-md hover:shadow-lg transition text-center">
          <h2 class="text-lg font-semibold text-gray-700">Resolved Tickets</h2>
          <p class="text-3xl font-bold text-green-600 mt-2">{{ stats.resolved }}</p>
        </div>
      </div>

      <!-- Navigation to Ticket Management -->
      <div class="mt-12 flex justify-center">
        <button
          @click="goToTickets"
          class="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-md shadow-md transition"
        >
          Go to Ticket Management
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, onMounted } from "vue";
import { useRouter } from "vue-router";

interface TicketStats {
  total: number;
  open: number;
  resolved: number;
}

export default defineComponent({
  name: "Dashboard",
  setup() {
    const router = useRouter();

    // ✅ Use ref for a single string value
    const userName = ref("User");

    const stats = reactive<TicketStats>({
      total: 0,
      open: 0,
      resolved: 0,
    });

    onMounted(() => {
      const storedUser = localStorage.getItem("ticketapp_session");
      if (!storedUser) {
        router.push("/login");
        return;
      }

      const user = JSON.parse(storedUser);
      userName.value = user.fullName || "User";

      // Simulated ticket stats
      const fakeTickets = [
        { id: 1, status: "open" },
        { id: 2, status: "resolved" },
        { id: 3, status: "open" },
        { id: 4, status: "resolved" },
      ];

      stats.total = fakeTickets.length;
      stats.open = fakeTickets.filter((t) => t.status === "open").length;
      stats.resolved = fakeTickets.filter((t) => t.status === "resolved").length;
    });

    const handleLogout = () => {
      localStorage.removeItem("ticketapp_session");
      router.push("/");
    };

    const goToTickets = () => {
      router.push("/tickets");
    };

    return {
      userName,
      stats,
      handleLogout,
      goToTickets,
    };
  },
});
</script>

<style scoped>
/* Optional: additional styling if needed */
</style>
