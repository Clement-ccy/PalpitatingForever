<template>
  <div class="neumorphism-container" ref="containerRef">
    <div
      class="light-source"
      ref="lightSourceRef"
      :style="{ left: lightX + 'px', top: lightY + 'px' }"
      @mousedown="startDrag"
    ></div>
    <div class="card" :style="cardStyle">
      <button class="neumorphic-button">Click Me</button>
      <p>Neumorphic Card</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';

const containerRef = ref(null);
const lightSourceRef = ref(null);
const lightX = ref(100);
const lightY = ref(100);
const isDragging = ref(false);
const offsetX = ref(0);
const offsetY = ref(0);

const cardStyle = computed(() => {
  if (!containerRef.value) return {};

  const cardRect = containerRef.value.querySelector('.card')?.getBoundingClientRect();
  if (!cardRect) return {};

  // Calculate center of the card relative to the container
  const cardCenterX = cardRect.left + cardRect.width / 2 - containerRef.value.getBoundingClientRect().left;
  const cardCenterY = cardRect.top + cardRect.height / 2 - containerRef.value.getBoundingClientRect().top;

  // Calculate vector from light source to card center
  const deltaX = cardCenterX - lightX.value;
  const deltaY = cardCenterY - lightY.value;

  // Normalize the vector (optional, but helps control shadow intensity)
  const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
  const normalizedX = distance > 0 ? deltaX / distance : 0;
  const normalizedY = distance > 0 ? deltaY / distance : 0;

  // Define shadow properties based on the vector
  const shadowOffset = 10; // Adjust for shadow distance
  const blurRadius = 20;   // Adjust for shadow blur
  const lightShadowColor = 'rgba(255, 255, 255, 0.7)';
  const darkShadowColor = 'rgba(163, 177, 198, 0.6)'; // Adjust base color shadow

  // Shadow points away from the light source
  const shadowX = normalizedX * shadowOffset;
  const shadowY = normalizedY * shadowOffset;
  // Highlight points towards the light source (opposite direction)
  const highlightX = -normalizedX * shadowOffset;
  const highlightY = -normalizedY * shadowOffset;

  return {
    boxShadow: `${highlightX}px ${highlightY}px ${blurRadius}px ${lightShadowColor}, ${shadowX}px ${shadowY}px ${blurRadius}px ${darkShadowColor}`
  };
});

const startDrag = (event) => {
  if (!lightSourceRef.value || !containerRef.value) return;
  isDragging.value = true;
  const lightRect = lightSourceRef.value.getBoundingClientRect();
  // Calculate offset from the top-left corner of the light source element
  offsetX.value = event.clientX - lightRect.left;
  offsetY.value = event.clientY - lightRect.top;
  // Add listeners to the window to track mouse movement everywhere
  window.addEventListener('mousemove', handleDrag);
  window.addEventListener('mouseup', stopDrag);
  // Prevent default text selection behavior during drag
  event.preventDefault();
};

const handleDrag = (event) => {
  if (!isDragging.value || !containerRef.value) return;
  const containerRect = containerRef.value.getBoundingClientRect();

  // Calculate new position relative to the container, considering the initial click offset
  let newX = event.clientX - containerRect.left - offsetX.value;
  let newY = event.clientY - containerRect.top - offsetY.value;

  // Constrain the light source within the container boundaries
  const lightWidth = lightSourceRef.value?.offsetWidth || 20;
  const lightHeight = lightSourceRef.value?.offsetHeight || 20;
  newX = Math.max(0, Math.min(newX, containerRect.width - lightWidth));
  newY = Math.max(0, Math.min(newY, containerRect.height - lightHeight));


  lightX.value = newX;
  lightY.value = newY;
};

const stopDrag = () => {
  if (isDragging.value) {
    isDragging.value = false;
    // Remove listeners from the window
    window.removeEventListener('mousemove', handleDrag);
    window.removeEventListener('mouseup', stopDrag);
  }
};

// Clean up listeners when the component is unmounted
onUnmounted(() => {
  window.removeEventListener('mousemove', handleDrag);
  window.removeEventListener('mouseup', stopDrag);
});

// Set initial light position after mount
onMounted(() => {
    if (containerRef.value) {
        const containerRect = containerRef.value.getBoundingClientRect();
        lightX.value = containerRect.width * 0.2; // Example initial position
        lightY.value = containerRect.height * 0.2;
    }
});

</script>

<style scoped>
.neumorphism-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh; /* Use viewport height */
  width: 100%; /* Use full width */
  background-color: #e0e5ec; /* Light background for neumorphism */
  position: relative; /* Needed for absolute positioning of light source */
  overflow: hidden; /* Prevent light source from going outside */
  box-sizing: border-box; /* Include padding and border in element's total width and height */
  padding: 20px; /* Add some padding */
}

.light-source {
  position: absolute;
  width: 20px;
  height: 20px;
  background-color: yellow;
  border-radius: 50%;
  cursor: grab;
  z-index: 10;
  border: 1px solid #ccc;
  box-shadow: 0 0 10px 2px yellow;
}

.light-source:active {
  cursor: grabbing;
}

.card {
  width: 250px;
  height: 150px;
  background-color: #e0e5ec;
  border-radius: 20px;
  display: flex;
  flex-direction: column; /* Stack items vertically */
  justify-content: center;
  align-items: center;
  color: #555;
  font-family: sans-serif;
  transition: box-shadow 0.1s linear; /* Smooth transition for shadow changes */
  padding: 20px;
  box-sizing: border-box;
}

.neumorphic-button {
  padding: 12px 24px;
  border: none;
  border-radius: 10px;
  background-color: #e0e5ec;
  color: #6d7a8a;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  box-shadow: 5px 5px 10px #a3b1c6, -5px -5px 10px #ffffff; /* Static neumorphic shadow for button */
  transition: all 0.2s ease-out;
  margin-bottom: 15px; /* Add space below button */
}

.neumorphic-button:active {
  box-shadow: 0px 0px 10px #a3b1c6, 0px 0px 10px #ffffff; /* Static neumorphic shadow for button */
  /* box-shadow: inset 3px 3px 7px #a3b1c6, inset -3px -3px 7px #ffffff; */
  color: #555;
}

.neumorphic-button:focus {
  outline: none;
}
</style>