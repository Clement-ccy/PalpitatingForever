<template>
  <div class="tags-filter-container">
    <transition-group name="tag-fade" tag="div" class="tags-list">
      <button 
        v-for="tag in availableTags" 
        :key="tag"
        class="tag-item neum-button"
        :class="{ 'active': selectedTags.includes(tag) }"
        @click="toggleTag(tag)"
      >
        {{ tag }}
      </button>
    </transition-group>
  </div>
</template>

<script setup>
import { ref, watchEffect } from 'vue'

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => []
  },
  availableTags: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['filter']) // Changed event name
const selectedTags = ref([...props.modelValue])

const toggleTag = (tag) => {
  const index = selectedTags.value.indexOf(tag)
  if (index > -1) {
    selectedTags.value.splice(index, 1)
  } else {
    selectedTags.value.push(tag)
  }
  emit('filter', selectedTags.value) // Emit 'filter' event
}

watchEffect(() => {
  selectedTags.value = [...props.modelValue]
})
</script>

<style scoped>
.tags-filter-container {
  margin: 1.5rem 0;
}

.tags-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.8rem;
}

.tag-item {
  padding:0.5rem 1rem;
}

/* Remove hover style - handled by neum-button */
/* .tag-item:hover { ... } */

.tag-item.active {
  /* Apply inset shadow like neum-button:active */
  box-shadow:
    inset var(--positionX) var(--positionY) var(--blur) var(--darkColor),
    inset var(--positionXOpposite) var(--positionYOpposite) var(--blur) var(--lightColor);
  color: var(--textEmphasis); /* Ensure text color is still readable */
  /* Remove background/border overrides */
  background: var(--baseColor); /* Ensure background matches */
}

.tag-fade-move,
.tag-fade-enter-active,
.tag-fade-leave-active {
  transition: all 0.3s ease;
}

.tag-fade-enter-from,
.tag-fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

.tag-fade-leave-active {
  position: absolute;
}
</style>
