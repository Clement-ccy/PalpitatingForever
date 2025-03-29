<template>
    <div class="search-filter">
      <!-- 搜索输入框 -->
      <div class="search-input">
        <input
          type="text"
          v-model="searchQuery"
          placeholder="搜索文章..."
          @input="handleSearch"
          class="search-field"
        />
        <svg class="search-icon" viewBox="0 0 24 24">
          <path d="M23.707 22.293l-5.969-5.969a10.016 10.016 0 1 0-1.414 1.414l5.969 5.969a1 1 0 0 0 1.414-1.414zM10 18a8 8 0 1 1 0-16 8 8 0 0 1 0 16z"/>
        </svg>
      </div>
  
      <!-- 标签筛选下拉框 -->
      <div class="filter-select">
        <select v-model="selectedFilter" @change="handleFilter" class="filter-dropdown">
          <option value="all">全部分类</option>
          <option v-for="tag in tags" :key="tag" :value="tag">{{ tag }}</option>
        </select>
        <div class="select-arrow"></div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, watch } from 'vue'
  
  const props = defineProps({
    tags: {
      type: Array,
      default: () => []
    }
  })
  
  const emit = defineEmits(['search', 'filter'])
  
  const searchQuery = ref('')
  const selectedFilter = ref('all')
  
  // 防抖处理搜索输入
  let searchTimeout = null
  const handleSearch = () => {
    clearTimeout(searchTimeout)
    searchTimeout = setTimeout(() => {
      emit('search', searchQuery.value)
    }, 300)
  }
  
  // 立即触发筛选
  const handleFilter = () => {
    emit('filter', selectedFilter.value)
  }
  
  // 监听外部tags变化时重置筛选
  watch(() => props.tags, () => {
    selectedFilter.value = 'all'
  })
  </script>
  
  <style scoped>
  .search-filter {
    display: flex;
    gap: 1.5rem;
    max-width: 800px;
    margin: 0 auto 3rem;
  }
  
  .search-input {
    position: relative;
    flex: 1;
  }
  
  .search-field {
    width: 100%;
    padding: 0.8rem 2.5rem 0.8rem 1.2rem;
    border: 2px solid #e0e0e0;
    border-radius: 8px;
    font-size: 1rem;
    transition: border-color 0.3s ease;
  }
  
  .search-field:focus {
    outline: none;
    border-color: #00b4d8;
  }
  
  .search-icon {
    position: absolute;
    right: 1rem;
    top: 50%;
    transform: translateY(-50%);
    width: 1.2rem;
    height: 1.2rem;
    fill: #888;
  }
  
  .filter-select {
    position: relative;
    min-width: 180px;
  }
  
  .filter-dropdown {
    width: 100%;
    padding: 0.8rem 2rem 0.8rem 1.2rem;
    border: 2px solid #e0e0e0;
    border-radius: 8px;
    appearance: none;
    background-color: white;
    font-size: 1rem;
    cursor: pointer;
    transition: border-color 0.3s ease;
  }
  
  .filter-dropdown:focus {
    outline: none;
    border-color: #00b4d8;
  }
  
  .select-arrow {
    position: absolute;
    right: 1rem;
    top: 50%;
    transform: translateY(-50%);
    width: 0;
    height: 0;
    border-left: 5px solid transparent;
    border-right: 5px solid transparent;
    border-top: 6px solid #666;
    pointer-events: none;
  }
  
  @media (max-width: 768px) {
    .search-filter {
      flex-direction: column;
    }
    
    .filter-select {
      min-width: auto;
    }
  }
  </style>