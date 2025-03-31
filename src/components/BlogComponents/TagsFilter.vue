<template>
  <div class="tags-filter-container">
    <transition-group name="tag-fade" tag="div" class="tags-list">
      <button 
        v-for="tag in availableTags" 
        :key="tag"
        class="tag-item"
        :class="{ 'active': selectedTags.includes(tag) }"
        @click="toggleTag(tag)"
      >
        {{ tag }}
      </button>
    </transition-group>
  </div>
</template>

<script setup>
import { ref, defineEmits, watchEffect } from 'vue'

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

const emit = defineEmits(['update:modelValue'])
const selectedTags = ref([...props.modelValue])

const toggleTag = (tag) => {
  const index = selectedTags.value.indexOf(tag)
  if (index > -1) {
    selectedTags.value.splice(index, 1)
  } else {
    selectedTags.value.push(tag)
  }
  emit('update:modelValue', selectedTags.value)
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
  padding: 0.5rem 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 2rem;
  background: white;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.3s ease;
}

.tag-item:hover {
  background: #f3f4f6;
  transform: translateY(-1px);
}

.tag-item.active {
  background: #3b82f6;
  color: white;
  border-color: #3b82f6;
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
