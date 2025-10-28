<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Toast notifications will appear here -->
    <div v-if="toast.show" 
         class="fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg"
         :class="toast.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'">
      {{ toast.message }}
    </div>

    <!-- Centered max-width container -->
    <div class="mx-auto w-full max-w-[1440px] px-6 py-8">
      <!-- Hero -->
      <header class="relative overflow-hidden rounded-2xl bg-gradient-to from-white to-gray-50 p-8 mb-8">
        <!-- Decorative circles -->
        <div aria-hidden class="pointer-events-none absolute -left-10 -top-10 h-40 w-40 rounded-full bg-red-100 opacity-40 blur-xl"></div>
        <div aria-hidden class="pointer-events-none absolute -right-16 top-8 h-28 w-28 rounded-full bg-blue-100 opacity-40 blur-xl"></div>

        <div class="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">
              Ticket Management
            </h1>
            <p class="mt-2 text-gray-600 max-w-xl">
              Create, track and manage tickets. Use this screen to add tickets, edit status, and remove resolved issues.
            </p>
          </div>

          <div class="flex items-center gap-3">
            <button
              class="inline-flex items-center px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-semibold transition"
              @click="showCreateModal = true">
              + New Ticket
            </button>

            <button
              class="inline-flex items-center px-4 py-2 rounded-md border border-gray-200 bg-white hover:bg-gray-50 text-gray-800"
              @click="handleLogout">
              Logout
            </button>
          </div>
        </div>

        <!-- Wave SVG at bottom -->
        <div class="mt-6">
          <svg viewBox="0 0 1440 120" class="w-full h-20" preserveAspectRatio="none" aria-hidden>
            <path d="M0,40 C360,120 1080,0 1440,60 L1440 120 L0 120 Z" fill="#ffffff"></path>
          </svg>
        </div>
      </header>

      <!-- Stats -->
      <section class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div class="p-6 bg-white rounded-2xl shadow-sm">
          <h3 class="text-sm font-medium text-gray-500">Total Tickets</h3>
          <p class="mt-2 text-2xl font-bold text-gray-900">{{ stats.total }}</p>
        </div>
        <div class="p-6 bg-white rounded-2xl shadow-sm">
          <h3 class="text-sm font-medium text-gray-500">Open Tickets</h3>
          <p class="mt-2 text-2xl font-bold text-yellow-600">{{ stats.open }}</p>
        </div>
        <div class="p-6 bg-white rounded-2xl shadow-sm">
          <h3 class="text-sm font-medium text-gray-500">Resolved Tickets</h3>
          <p class="mt-2 text-2xl font-bold text-green-600">{{ stats.resolved }}</p>
        </div>
      </section>

      <!-- Ticket list -->
      <section>
        <h2 class="text-lg font-semibold text-gray-900 mb-4">Tickets</h2>

        <div v-if="tickets.length === 0" class="p-8 bg-white rounded-lg shadow-sm text-center text-gray-600">
          No tickets yet — click "New Ticket" to create one.
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <article v-for="ticket in tickets" :key="ticket.id" class="p-4 bg-white rounded-xl shadow-sm flex flex-col">
            <div class="flex justify-between items-start gap-2">
              <div>
                <h3 class="text-lg font-semibold text-gray-900">{{ ticket.title }}</h3>
                <p class="text-sm text-gray-500 mt-1">
                  Created: {{ formatDate(ticket.createdAt) }}
                </p>
              </div>

              <div class="flex flex-col items-end gap-2">
                <span :class="['inline-flex items-center gap-2 px-3 py-1 text-sm rounded-full', statusColor(ticket.status)]">
                  {{ ticket.status.replace("_", " ") }}
                </span>
                <div class="flex gap-2">
                  <button
                    :aria-label="`Edit ticket ${ticket.title}`"
                    @click="openEdit(ticket)"
                    class="px-3 py-1 rounded-md border border-gray-200 bg-white text-sm hover:bg-gray-50">
                    Edit
                  </button>
                  <button
                    :aria-label="`Delete ticket ${ticket.title}`"
                    @click="confirmDelete(ticket)"
                    class="px-3 py-1 rounded-md border border-red-200 text-red-600 bg-white hover:bg-red-50 text-sm">
                    Delete
                  </button>
                </div>
              </div>
            </div>

            <p v-if="ticket.description" class="mt-3 text-gray-700">{{ ticket.description }}</p>

            <div class="mt-4 flex items-center justify-between text-sm text-gray-500">
              <div>Priority: {{ ticket.priority || 'medium' }}</div>
              <div>Updated: {{ ticket.updatedAt ? formatDate(ticket.updatedAt) : '-' }}</div>
            </div>
          </article>
        </div>
      </section>
    </div>

    <!-- Create Modal -->
    <Teleport to="body">
      <div v-if="showCreateModal" 
           class="fixed inset-0 z-40 flex items-center justify-center p-4 bg-black/40" 
           role="dialog" 
           aria-modal="true">
        <div class="w-full max-w-lg bg-white rounded-2xl p-6 shadow-lg">
          <h3 class="text-xl font-semibold">Create Ticket</h3>

          <div class="mt-4 grid grid-cols-1 gap-4">
            <label class="text-sm">
              <span class="font-medium">Title</span>
              <input
                aria-label="Title"
                class="mt-1 block w-full p-3 border rounded"
                v-model="form.title"
                @input="validateField('title')" />
              <p v-if="errors.title" class="text-red-600 text-sm mt-1">{{ errors.title }}</p>
            </label>

            <label class="text-sm">
              <span class="font-medium">Status</span>
              <select
                aria-label="Status"
                class="mt-1 block w-full p-3 border rounded"
                v-model="form.status"
                @change="validateField('status')">
                <option value="open">open</option>
                <option value="in_progress">in_progress</option>
                <option value="closed">closed</option>
              </select>
              <p v-if="errors.status" class="text-red-600 text-sm mt-1">{{ errors.status }}</p>
            </label>

            <label class="text-sm">
              <span class="font-medium">Priority</span>
              <select
                aria-label="Priority"
                class="mt-1 block w-full p-3 border rounded"
                v-model="form.priority"
                @change="validateField('priority')">
                <option value="low">low</option>
                <option value="medium">medium</option>
                <option value="high">high</option>
              </select>
              <p v-if="errors.priority" class="text-red-600 text-sm mt-1">{{ errors.priority }}</p>
            </label>

            <label class="text-sm">
              <span class="font-medium">Description (optional)</span>
              <textarea
                aria-label="Description"
                rows="4"
                class="mt-1 block w-full p-3 border rounded"
                v-model="form.description"
                @input="validateField('description')">
              </textarea>
              <p v-if="errors.description" class="text-red-600 text-sm mt-1">{{ errors.description }}</p>
            </label>

            <div class="flex justify-end gap-3 mt-2">
              <button
                class="px-4 py-2 rounded-md border bg-white"
                @click="closeCreateModal">
                Cancel
              </button>
              <button 
                class="px-4 py-2 rounded-md bg-blue-600 text-white" 
                @click="handleCreate">
                Create
              </button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Edit Modal -->
    <Teleport to="body">
      <div v-if="editingTicket" 
           class="fixed inset-0 z-40 flex items-center justify-center p-4 bg-black/40" 
           role="dialog" 
           aria-modal="true">
        <div class="w-full max-w-lg bg-white rounded-2xl p-6 shadow-lg">
          <h3 class="text-xl font-semibold">Edit Ticket</h3>

          <div class="mt-4 grid grid-cols-1 gap-4">
            <label class="text-sm">
              <span class="font-medium">Title</span>
              <input
                aria-label="Title"
                class="mt-1 block w-full p-3 border rounded"
                v-model="form.title"
                @input="validateField('title')" />
              <p v-if="errors.title" class="text-red-600 text-sm mt-1">{{ errors.title }}</p>
            </label>

            <label class="text-sm">
              <span class="font-medium">Status</span>
              <select
                aria-label="Status"
                class="mt-1 block w-full p-3 border rounded"
                v-model="form.status"
                @change="validateField('status')">
                <option value="open">open</option>
                <option value="in_progress">in_progress</option>
                <option value="closed">closed</option>
              </select>
              <p v-if="errors.status" class="text-red-600 text-sm mt-1">{{ errors.status }}</p>
            </label>

            <label class="text-sm">
              <span class="font-medium">Priority</span>
              <select
                aria-label="Priority"
                class="mt-1 block w-full p-3 border rounded"
                v-model="form.priority"
                @change="validateField('priority')">
                <option value="low">low</option>
                <option value="medium">medium</option>
                <option value="high">high</option>
              </select>
              <p v-if="errors.priority" class="text-red-600 text-sm mt-1">{{ errors.priority }}</p>
            </label>

            <label class="text-sm">
              <span class="font-medium">Description (optional)</span>
              <textarea
                aria-label="Description"
                rows="4"
                class="mt-1 block w-full p-3 border rounded"
                v-model="form.description"
                @input="validateField('description')">
              </textarea>
              <p v-if="errors.description" class="text-red-600 text-sm mt-1">{{ errors.description }}</p>
            </label>

            <div class="flex justify-end gap-3 mt-2">
              <button
                class="px-4 py-2 rounded-md border bg-white"
                @click="closeEditModal">
                Cancel
              </button>
              <button 
                class="px-4 py-2 rounded-md bg-blue-600 text-white" 
                @click="handleUpdate">
                Save changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Delete confirmation -->
    <Teleport to="body">
      <div v-if="deleteCandidate" 
           class="fixed inset-0 z-40 flex items-center justify-center p-4 bg-black/50" 
           role="dialog" 
           aria-modal="true">
        <div class="w-full max-w-md bg-white rounded-2xl p-6 shadow-lg">
          <h3 class="text-lg font-semibold">Delete ticket</h3>
          <p class="mt-2 text-gray-600">
            Are you sure you want to delete "{{ deleteCandidate.title }}"? This action cannot be undone.
          </p>

          <div class="mt-4 flex justify-end gap-3">
            <button 
              class="px-4 py-2 rounded-md border bg-white" 
              @click="deleteCandidate = null">
              Cancel
            </button>
            <button 
              class="px-4 py-2 rounded-md bg-red-600 text-white" 
              @click="handleDelete">
              Delete
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';

// Types
type TicketStatus = 'open' | 'in_progress' | 'closed';
type Priority = 'low' | 'medium' | 'high';

interface Ticket {
  id: string;
  title: string;
  description: string;
  status: TicketStatus;
  priority: Priority;
  createdAt: string;
  createdBy: string;
  updatedAt?: string;
}

// Constants
const ALLOWED_STATUSES: TicketStatus[] = ['open', 'in_progress', 'closed'];
const STORAGE_KEY = 'ticketapp_tickets';

// Router
const router = useRouter();

// State
const tickets = ref<Ticket[]>([]);
const showCreateModal = ref(false);
const editingTicket = ref<Ticket | null>(null);
const deleteCandidate = ref<Ticket | null>(null);

const initialForm = {
  title: '',
  description: '',
  status: 'open' as TicketStatus,
  priority: 'medium' as Priority
};

const form = ref({ ...initialForm });
const errors = ref<Record<string, string>>({});

// Toast notification
const toast = ref({
  show: false,
  message: '',
  type: 'success' as 'success' | 'error'
});

// Computed
const stats = computed(() => {
  const total = tickets.value.length;
  const open = tickets.value.filter(t => t.status === 'open').length;
  const resolved = tickets.value.filter(t => t.status === 'closed').length;
  return { total, open, resolved };
});

// Utilities
function nowISO() {
  return new Date().toISOString();
}

function generateId() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

function statusColor(status: TicketStatus) {
  switch (status) {
    case 'open':
      return 'bg-green-50 text-green-700';
    case 'in_progress':
      return 'bg-amber-50 text-amber-700';
    case 'closed':
      return 'bg-gray-100 text-gray-700';
    default:
      return 'bg-gray-100 text-gray-700';
  }
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleString();
}

function showToast(message: string, type: 'success' | 'error' = 'success') {
  toast.value = { show: true, message, type };
  setTimeout(() => {
    toast.value.show = false;
  }, 3000);
}

// Validation
function validate(values: Partial<typeof form.value>) {
  const e: Record<string, string> = {};
  
  if (values.title !== undefined) {
    if (!values.title.trim()) e.title = 'Title is required.';
    else if (values.title.trim().length < 3) e.title = 'Title must be at least 3 characters.';
    else if (values.title.trim().length > 120) e.title = 'Title must be at most 120 characters.';
  }

  if (values.status !== undefined) {
    if (!ALLOWED_STATUSES.includes(values.status as TicketStatus)) {
      e.status = `Status must be one of: ${ALLOWED_STATUSES.join(', ')}`;
    }
  }

  if (values.description !== undefined) {
    if (values.description && values.description.length > 2000) {
      e.description = 'Description is too long (max 2000 chars).';
    }
  }

  if (values.priority !== undefined) {
    const allowed = ['low', 'medium', 'high'];
    if (!allowed.includes(values.priority)) e.priority = 'Invalid priority value.';
  }

  return e;
}

function validateField(field: keyof typeof form.value) {
  const validation = validate({ [field]: form.value[field] });
  if (validation[field]) {
    errors.value[field] = validation[field];
  } else {
    delete errors.value[field];
  }
}

// CRUD operations
function persist(next: Ticket[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    tickets.value = next;
  } catch (error) {
    console.error('Persist error:', error);
    showToast('Failed to save tickets. Please try again.', 'error');
  }
}

function handleCreate() {
  const validation = validate(form.value);
  if (Object.keys(validation).length) {
    errors.value = validation;
    showToast('Please fix the highlighted errors.', 'error');
    return;
  }

  const session = JSON.parse(localStorage.getItem('ticketapp_session') || 'null');
  const newTicket: Ticket = {
    id: generateId(),
    title: form.value.title.trim(),
    description: form.value.description?.trim() || '',
    status: form.value.status,
    priority: form.value.priority,
    createdAt: nowISO(),
    createdBy: session?.email ?? 'unknown',
  };

  const next = [newTicket, ...tickets.value];
  persist(next);
  showToast('Ticket created.');
  closeCreateModal();
}

function openEdit(ticket: Ticket) {
  editingTicket.value = ticket;
  form.value = {
    title: ticket.title,
    description: ticket.description || '',
    status: ticket.status,
    priority: ticket.priority ?? 'medium'
  };
  errors.value = {};
}

function handleUpdate() {
  if (!editingTicket.value) return;
  
  const validation = validate(form.value);
  if (Object.keys(validation).length) {
    errors.value = validation;
    showToast('Please fix the highlighted errors.', 'error');
    return;
  }

  const updated: Ticket = {
    ...editingTicket.value,
    title: form.value.title.trim(),
    description: form.value.description?.trim() || '',
    status: form.value.status,
    priority: form.value.priority,
    updatedAt: nowISO(),
  };

  const next = tickets.value.map(t => (t.id === updated.id ? updated : t));
  persist(next);
  showToast('Ticket updated.');
  closeEditModal();
}

function confirmDelete(ticket: Ticket) {
  deleteCandidate.value = ticket;
}

function handleDelete() {
  if (!deleteCandidate.value) return;
  
  const next = tickets.value.filter(t => t.id !== deleteCandidate.value!.id);
  persist(next);
  showToast('Ticket deleted.');
  deleteCandidate.value = null;
}

function closeCreateModal() {
  showCreateModal.value = false;
  form.value = { ...initialForm };
  errors.value = {};
}

function closeEditModal() {
  editingTicket.value = null;
  form.value = { ...initialForm };
  errors.value = {};
}

function handleLogout() {
  localStorage.removeItem('ticketapp_session');
  router.push('/');
  showToast('Logged out.');
}

// Lifecycle
onMounted(() => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY) || '[]';
    const parsed: Ticket[] = JSON.parse(raw);
    tickets.value = parsed;
  } catch (error) {
    console.error('Load tickets error:', error);
    showToast('Failed to load tickets. Please retry.', 'error');
    tickets.value = [];
  }
});
</script>