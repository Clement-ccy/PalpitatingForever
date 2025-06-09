<script setup>
defineProps({
  skills: {
    type: Array,
    required: true
  }
})
</script>

<template>
  <div class="home-top-icons-card">
    <div class="home-top-icons-content">
      <div class="tags-group-all">
        <div class="tags-group-wrapper">
          <div 
            v-for="(skill, index) in skills" 
            :key="index"
            class="tags-group-icon"
            :style="{ backgroundColor: skill.color + '20' }"
            :title="skill.title"
          >
            <span class="skill-icon">{{ skill.icon }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.home-top-icons-card {
  margin-bottom: var(--space-xxl);

  .home-top-icons-content {
    display: flex;
    gap: var(--space-xxl);
    align-items: center;
    
    @media (max-width: 992px) {
      flex-direction: column;
      gap: var(--space-xl);
    }
  }
}

.tags-group-all {
  flex: 1;
  
  .tags-group-wrapper {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(60px, 1fr));
    gap: var(--space-md);
    max-width: 600px;
  }
}

.tags-group-icon {
  width: 60px;
  height: 60px;
  border-radius: var(--radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: var(--global-transition);
  cursor: pointer;
  backdrop-filter: var(--backdrop-blur);

  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-lg);
  }

  .skill-icon {
    font-size: 24px;
  }
}
</style>