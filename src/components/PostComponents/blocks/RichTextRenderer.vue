<template>
  <span :class="getTextClasses(textItem.annotations)">
    <!-- Text -->
    <template v-if="textItem.type === 'text'">
      <a v-if="textItem.text.link" :href="textItem.text.link.url" target="_blank" rel="noopener noreferrer" class="link">
        {{ textItem.plain_text }}
      </a>
      <template v-else>
        {{ textItem.plain_text }}
      </template>
    </template>

    <!-- Mention (User) -->
    <template v-else-if="textItem.type === 'mention' &amp;&amp; textItem.mention.type === 'user'">
      <span class="mention user-mention">@{{ textItem.mention.user.name || textItem.plain_text }}</span>
    </template>

    <!-- Mention (Date) -->
    <template v-else-if="textItem.type === 'mention' &amp;&amp; textItem.mention.type === 'date'">
      <span class="mention date-mention">{{ formatDate(textItem.mention.date) }}</span>
    </template>

    <!-- Mention (Page/Database/Link Preview - Basic) -->
     <template v-else-if="textItem.type === 'mention'">
       <span class="mention other-mention">[{{ textItem.plain_text }}]</span>
    </template>

    <!-- Equation (Rendered with KaTeX) -->
    <template v-else-if="textItem.type === 'equation'">
      <span ref="katexContainer" class="equation"></span> <!-- Target for KaTeX -->
    </template>

    <!-- Fallback for unknown types -->
    <template v-else>
      {{ textItem.plain_text }}
    </template>
  </span>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import katex from 'katex';
import 'katex/dist/katex.min.css'; // Import KaTeX CSS

const props = defineProps({
  textItem: {
    type: Object,
    required: true
  }
});

const katexContainer = ref(null);

const renderKatex = () => {
  if (props.textItem.type === 'equation' && katexContainer.value) {
    try {
      katex.render(props.textItem.equation.expression, katexContainer.value, {
        throwOnError: false, // Don't throw errors, display fallback
        displayMode: false // Render inline
      });
    } catch (error) {
      console.error('KaTeX rendering error:', error);
      // Display raw expression as fallback on error
      katexContainer.value.textContent = props.textItem.equation.expression;
    }
  }
};

onMounted(() => {
  renderKatex();
});

// Re-render if the expression changes (might be needed in dynamic scenarios)
watch(() => props.textItem.equation?.expression, () => {
  renderKatex();
});


const getTextClasses = (annotations) => {
  if (!annotations) return '';
  let classes = [];
  if (annotations.bold) classes.push('font-bold');
  if (annotations.italic) classes.push('italic');
  if (annotations.strikethrough) classes.push('line-through');
  if (annotations.underline) classes.push('underline');
  if (annotations.code) classes.push('font-mono bg-gray-200 dark:bg-gray-700 px-1 rounded text-sm');
  if (annotations.color && annotations.color !== 'default') {
    classes.push(`notion-color-${annotations.color}`);
  }
  return classes.join(' ');
};

const formatDate = (date) => {
  if (!date || !date.start) return '';
  let formatted = new Date(date.start).toLocaleDateString();
  if (date.end) {
    formatted += ` → ${new Date(date.end).toLocaleDateString()}`;
  }
  return formatted;
};
</script>

<style scoped>
/* Styles from previous version... */
.link {
  color: #007bff;
  text-decoration: underline;
}
.mention {
  background-color: rgba(55, 53, 47, 0.1);
  border-radius: 3px;
  padding: 0.1em 0.3em;
  font-size: 0.9em;
}
.equation {
  /* KaTeX styles are imported, but you can add overrides */
  padding: 0 0.2em; /* Add slight padding around inline equations */
}

/* Color classes */
.notion-color-gray { color: gray; }
.notion-color-brown { color: brown; }
.notion-color-orange { color: orange; }
.notion-color-yellow { color: #e0c04c; }
.notion-color-green { color: green; }
.notion-color-blue { color: blue; }
.notion-color-purple { color: purple; }
.notion-color-pink { color: pink; }
.notion-color-red { color: red; }
.notion-color-gray_background { background-color: #f1f1f1; }
/* ... add all other background colors */
</style>
