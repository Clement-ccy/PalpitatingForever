<template>
  <div class="theme-controller neum-panel--inset">
    <h4 @click="toggleExpand" class="controller-title">
      <span v-if="isExpanded">Theme Controller</span>
      <span class="toggle-icon" :class="{ expanded: isExpanded }">▼</span>
    </h4>
    <transition-group
      tag="div"
      name="control-items"
      class="controls-items"
      v-if="isExpanded"
    >
      <div class="control-group" key="baseColor">
        <label for="baseColor">Base Color:</label>
        <input type="color" id="baseColorPicker" v-model="baseColor" />
        <input type="text" id="baseColorHex" v-model="baseColor" size="7" />
      </div>
      <div class="control-group" key="angle">
        <label for="angle">Angle:</label>
        <input type="range" id="angle" min="0" max="360" v-model.number="angle" />
        <span>{{ angle }}°</span>
      </div>
      <div class="control-group" key="size">
        <label for="size">Size:</label>
        <input type="range" id="size" min="10" max="410" v-model.number="size" />
        <span>{{ size }}px</span>
      </div>
      <div class="control-group" key="radius">
        <label for="radius">Radius:</label>
        <input
          type="range"
          id="radius"
          min="0"
          :max="maxRadius"
          v-model.number="radius"
        />
        <span>{{ radius }}px</span>
      </div>
      <div class="control-group" key="distance">
        <label for="distance">Distance:</label>
        <input
          type="range"
          id="distance"
          min="5"
          max="50"
          v-model.number="distance"
        />
        <span>{{ distance }}px</span>
      </div>
      <div class="control-group" key="blur">
        <label for="blur">Blur:</label>
        <input type="range" id="blur" min="0" max="100" v-model.number="blur" />
        <span>{{ blur }}px</span>
      </div>
      <div class="control-group" key="colorDifference">
        <label for="colorDifference">Color Diff:</label>
        <input
          type="range"
          id="colorDifference"
          min="0.01"
          max="0.5"
          step="0.01"
          v-model.number="colorDifference"
        />
        <span>{{ colorDifference.toFixed(2) }}</span>
      </div>
      <div class="control-group" key="gradient">
        <label for="gradient">Gradient:</label>
        <input type="checkbox" id="gradient" v-model="gradient" />
      </div>
      <div
        class="control-group"
        key="shape"
        style="flex-direction: column; align-items: flex-start"
      >
        <label for="shape" style="flex-basis: 0">Shape: {{ shape }}</label>
        <div class="shape-buttons">
          <button @click="setShape('flat')" :class="{ active: shape === 'flat' }">
            Flat
          </button>
          <button
            @click="setShape('concave')"
            :class="{ active: shape === 'concave' }"
          >
            Concave
          </button>
          <button
            @click="setShape('convex')"
            :class="{ active: shape === 'convex' }"
          >
            Convex
          </button>
          <button
            @click="setShape('pressed')"
            :class="{ active: shape === 'pressed' }"
          >
            Pressed
          </button>
        </div>
      </div>
      <!-- Add more controls for other variables if needed -->
    </transition-group>
  </div>
</template>

<script setup>
import { ref, watchEffect, watch, computed } from "vue";

// --- Reactive State ---
// Initialize with default values from _variables.css (or reasonable defaults)
const size = ref(100); // Default size for the neumorphic effect reference
const radius = ref(30); // Default border radius for the neumorphic effect
const distance = ref(10); // This is the distance of the shadow from the element
const colorDifference = ref(0.15); // Factor for light/dark shadow color difference
const blur = ref(20); // This is the blur radius of the shadow

const shape = ref("flat"); // Default shape for the neumorphic effect (flat, concave, convex, pressed)
// const baseColor = ref("#EAE7E0"); // Default base color
const baseColor = ref("#4d4b47"); 
const angle = ref(45); // Default light source angle in degrees
const gradient = ref(true); // Enable/disable gradient effect

// --- Expand/Collapse State ---
const isExpanded = ref(false); // Default to collapsed

// --- Helper Functions ---
function colorLuminance(hex, lum) {
  // validate hex string
  hex = String(hex).replace(/[^0-9a-f]/gi, "");
  if (hex.length < 6) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
  }
  lum = lum || 0;

  // convert to decimal and change luminosity
  let rgb = "#",
    c,
    i;
  for (i = 0; i < 3; i++) {
    c = parseInt(hex.substr(i * 2, 2), 16);
    c = Math.round(Math.min(Math.max(0, c + c * lum), 255)).toString(16);
    rgb += ("00" + c).substr(c.length);
  }

  return rgb;
}

function getContrast(hex) {
  // Ensure hex starts with #
  if (hex.indexOf("#") === 0) {
    hex = hex.slice(1);
  }
  // Convert 3-digit hex to 6-digits.
  if (hex.length === 3) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
  }
  if (hex.length !== 6) {
    console.error("Invalid HEX color format for getContrast:", hex);
    return "#001f3f"; // Default to dark text on error
  }
  try {
    const r = parseInt(hex.substr(0, 2), 16),
      g = parseInt(hex.substr(2, 2), 16),
      b = parseInt(hex.substr(4, 2), 16),
      yiq = (r * 299 + g * 587 + b * 114) / 1000;
    // Return dark text for light backgrounds, light text for dark backgrounds
    return yiq >= 128 ? "#333333" : "#F0F0F3"; // Using darker/lighter grays
  } catch (e) {
    console.error("Error parsing HEX in getContrast:", hex, e);
    return "#001f3f"; // Default to dark text on error
  }
}

// --- Computed Properties ---
// Calculate max radius based on size
const maxRadius = computed(() => Math.floor(size.value / 2));

// --- Methods ---
const setShape = (newShape) => {
  shape.value = newShape;
  // Optionally, update a CSS variable or class on the body/root if needed
  // document.documentElement.setAttribute('data-shape', newShape);
};

const toggleExpand = () => {
  isExpanded.value = !isExpanded.value;
};

// --- Watchers for reactive adjustments ---
watch(size, (newSize) => {
  // Adjust distance based on size
  distance.value = Math.round(newSize / 10);
  // Adjust blur based on size
  blur.value = Math.round(newSize / 5);
  // Clamp radius if it exceeds the new max
  if (radius.value > maxRadius.value) {
    radius.value = maxRadius.value;
  }
});

watch(distance, (newDistance) => {
  // Adjust blur based on distance
  blur.value = Math.round(newDistance * 2);
});

// --- Watch for changes and update CSS Variables ---
watchEffect(() => {
  try {
    const rootStyle = document.documentElement.style;
    const currentBaseColor = baseColor.value || "#EAE7E0"; // Fallback

    // --- Update Base Color ---
    rootStyle.setProperty("--baseColor", currentBaseColor);

    // --- Calculate and Update Shadow Colors ---
    const lightColor = colorLuminance(currentBaseColor, colorDifference.value);
    const darkColor = colorLuminance(currentBaseColor, -colorDifference.value);
    rootStyle.setProperty("--lightColor", lightColor);
    rootStyle.setProperty("--darkColor", darkColor);

    // --- Calculate and Update Gradient Colors ---
    // Map shape names to numbers used in the original logic example
    // flat: 1, concave: 2, convex: 3, pressed: 4 (assuming)
    let shapeNum = 1; // default to flat
    if (shape.value === "concave") shapeNum = 2;
    else if (shape.value === "convex") shapeNum = 3;
    else if (shape.value === "pressed") shapeNum = 4; // Or handle pressed differently if needed

    const firstGradientColor =
      gradient.value && shapeNum !== 1
        ? colorLuminance(currentBaseColor, shapeNum === 3 ? 0.07 : -0.1)
        : currentBaseColor;
    const secondGradientColor =
      gradient.value && shapeNum !== 1
        ? colorLuminance(currentBaseColor, shapeNum === 2 ? 0.07 : -0.1)
        : currentBaseColor;
    rootStyle.setProperty("--firstGradientColor", firstGradientColor);
    rootStyle.setProperty("--secondGradientColor", secondGradientColor);

    // --- Calculate and Update Text Colors ---
    const baseContrastColor = getContrast(currentBaseColor);
    const isDarkText = baseContrastColor === "#333333"; // Check if contrast suggests dark text

    // Adjust luminance slightly for variations based on the contrast direction
    const emphasisLum = isDarkText ? -0.1 : 0.1; // Darker emphasis for light bg, lighter for dark bg
    const normalLum = 0; // No change for normal text
    const subduedLum = isDarkText ? 0.1 : -0.1; // Lighter subdued for light bg, darker for dark bg
    const oppositeLum = isDarkText ? 0.9 : -0.7; // Significantly lighter/darker for opposite

    const textEmphasis = colorLuminance(baseContrastColor, emphasisLum);
    const textNormal = colorLuminance(baseContrastColor, normalLum); // Or just use baseContrastColor
    const textSubdued = colorLuminance(baseContrastColor, subduedLum);
    // For opposite, maybe just use the *other* contrast color or adjust significantly
    const textOpposite = colorLuminance(currentBaseColor, oppositeLum); // Adjust base color significantly

    rootStyle.setProperty("--textEmphasis", textEmphasis);
    rootStyle.setProperty("--textNormal", textNormal);
    rootStyle.setProperty("--textSubdued", textSubdued);
    rootStyle.setProperty("--textOpposite", textOpposite); // Note: Renamed from --textOppsite

    // --- Update Angle, Distance, Position, Blur, Radius (Existing Logic) ---
    // Update angle (useful for potential CSS usage, though calculation is now in JS)
    rootStyle.setProperty("--angle", `${angle.value}deg`);

    // Update distance
    rootStyle.setProperty("--distance", `${distance.value}px`);

    // Calculate positions based on angle and distance
    const angleRad = angle.value * (Math.PI / 180);
    const posX = distance.value * Math.cos(angleRad);
    const posY = distance.value * Math.sin(angleRad);

    // Set calculated position variables
    rootStyle.setProperty("--positionX", `${posX.toFixed(2)}px`);
    rootStyle.setProperty("--positionY", `${posY.toFixed(2)}px`);
    rootStyle.setProperty("--positionXOpposite", `${(-posX).toFixed(2)}px`);
    rootStyle.setProperty("--positionYOpposite", `${(-posY).toFixed(2)}px`);

    // Update blur
    rootStyle.setProperty("--blur", `${blur.value}px`);

    // Update radius
    rootStyle.setProperty("--radius", `${radius.value}px`);

    console.log(
      `Updated CSS Vars: base=${currentBaseColor}, light=${lightColor}, dark=${darkColor}, grad1=${firstGradientColor}, grad2=${secondGradientColor}, textN=${textNormal}, angle=${angle.value}, dist=${distance.value}, blur=${blur.value}, radius=${radius.value}` // Log updated colors + text
    );
  } catch (error) {
    console.error("Error in watchEffect:", error);
  }
});
</script>

<style scoped>
.theme-controller {
  position: fixed;
  bottom: 20px;
  right: 20px;
  padding: 15px 20px;
  z-index: 1001; /* Ensure it's above most content */
  /* min-width: 320px; */
  background: var(--baseColor); /* Use theme background */
  border-radius: var(--radius); /* Use theme radius */
  transition: all 0.3s ease-in-out; /* Add transition for smooth size change */
}

.theme-controller h4.controller-title {
  margin-top: 0;
  color: var(--textEmphasis);
  text-align: center;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  user-select: none; /* Prevent text selection on click */
}

.controller-title .toggle-icon {
  display: inline-block;
  transition: transform 0.3s ease-in-out;
  font-size: 0.8em;
}

.controller-title .toggle-icon.expanded {
  transform: rotate(180deg);
}

.controls-items {
  overflow: hidden; /* Needed for smooth height transition */
  /* max-height calculation will be handled by transition classes */
}

.control-group {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  gap: 10px;
}

.control-group label {
  flex-basis: 80px; /* Adjusted width for labels */
  flex-shrink: 0;
  font-size: 0.9em;
  color: var(--textSubdued);
}

.control-group input[type="range"] {
  flex-grow: 1;
  cursor: pointer;
  /* Basic styling for range inputs */
  -webkit-appearance: none;
  appearance: none;
  height: 8px;
  background: var(--darkColor); /* Use theme shadow color */
  border-radius: 5px;
  outline: none;
  opacity: 0.7;
  transition: opacity 0.2s;
}
.control-group input[type="range"]:hover {
  opacity: 1;
}
/* Style the thumb */
.control-group input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 18px;
  height: 18px;
  background: var(--lightColor); /* Use theme light shadow */
  border: 1px solid var(--darkColor);
  border-radius: 50%;
  cursor: pointer;
}
.control-group input[type="range"]::-moz-range-thumb {
  width: 18px;
  height: 18px;
  background: var(--lightColor);
  border: 1px solid var(--darkColor);
  border-radius: 50%;
  cursor: pointer;
}

.control-group .shape-buttons {
  display: flex;
  gap: 5px;
  flex-grow: 1;
}

.control-group .shape-buttons button {
  padding: 4px 8px;
  font-size: 0.8em;
  cursor: pointer;
  border: 1px solid var(--darkColor);
  background-color: var(--baseColor);
  color: var(--textNormal);
  border-radius: 4px;
  transition: background-color 0.2s, color 0.2s;
}

.control-group .shape-buttons button:hover {
  background-color: var(--lightColor);
}

.control-group .shape-buttons button.active {
  background-color: var(
    --primaryColor,
    var(--lightColor)
  ); /* Use primary if defined */
  color: var(--baseColor);
  font-weight: bold;
}

.control-group span {
  font-size: 0.8em;
  color: var(--textNormal);
  min-width: 45px; /* Ensure space for value */
  text-align: right;
}

/* Transition for control items */
.control-items-enter-active,
.control-items-leave-active {
  transition: all 0.5s ease-out; /* Overall transition duration */
}

.control-items-enter-active .control-group,
.control-items-leave-active .control-group {
  transition: opacity 0.3s ease-out, transform 0.4s ease-out;
}

.control-items-enter-from .control-group,
.control-items-leave-to .control-group {
  opacity: 0;
  transform: translateY(-10px); /* Start from slightly above */
}

/* Staggered delay for entering items */
.control-items-enter-active .control-group:nth-child(1) { transition-delay: 0.05s; }
.control-items-enter-active .control-group:nth-child(2) { transition-delay: 0.1s; }
.control-items-enter-active .control-group:nth-child(3) { transition-delay: 0.15s; }
.control-items-enter-active .control-group:nth-child(4) { transition-delay: 0.2s; }
.control-items-enter-active .control-group:nth-child(5) { transition-delay: 0.25s; }
.control-items-enter-active .control-group:nth-child(6) { transition-delay: 0.3s; }
.control-items-enter-active .control-group:nth-child(7) { transition-delay: 0.35s; }
.control-items-enter-active .control-group:nth-child(8) { transition-delay: 0.4s; }
.control-items-enter-active .control-group:nth-child(9) { transition-delay: 0.45s; }
/* Add more if needed */

/* Staggered delay for leaving items (reverse order might feel more natural) */
.control-items-leave-active .control-group:nth-child(1) { transition-delay: 0.45s; }
.control-items-leave-active .control-group:nth-child(2) { transition-delay: 0.4s; }
.control-items-leave-active .control-group:nth-child(3) { transition-delay: 0.35s; }
.control-items-leave-active .control-group:nth-child(4) { transition-delay: 0.3s; }
.control-items-leave-active .control-group:nth-child(5) { transition-delay: 0.25s; }
.control-items-leave-active .control-group:nth-child(6) { transition-delay: 0.2s; }
.control-items-leave-active .control-group:nth-child(7) { transition-delay: 0.15s; }
.control-items-leave-active .control-group:nth-child(8) { transition-delay: 0.1s; }
.control-items-leave-active .control-group:nth-child(9) { transition-delay: 0.05s; }
/* Add more if needed */

</style>
