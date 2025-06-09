// src/components/common/NotionRichTextRenderer.vue
<script setup>
import { computed } from 'vue';
import katex from 'katex'; // Import KaTeX for inline equations
// Ensure katex.min.css is imported somewhere globally (e.g., main.js or NotionEquation.vue)

const props = defineProps({
  richText: {
    type: Array,
    required: true,
    default: () => []
  }
});

// Helper to format dates (customize as needed)
const formatDate = (dateInfo) => {
    if (!dateInfo?.start) return '';
    const options = { year: 'numeric', month: 'short', day: 'numeric' }; // Example format
    const startDate = new Date(dateInfo.start).toLocaleDateString(undefined, options);
    if (dateInfo.end) {
        const endDate = new Date(dateInfo.end).toLocaleDateString(undefined, options);
        return `${startDate} → ${endDate}`;
    }
    return startDate;
};

// Helper to render inline KaTeX
const renderInlineKatex = (expression) => {
    if (!expression) return '';
    try {
        // Use katex.renderToString for inline rendering
        return katex.renderToString(expression, {
            throwOnError: false, // Don't break page on error
            displayMode: false, // IMPORTANT: false for inline
            output: 'html', // Ensure HTML output
        });
    } catch (e) {
        console.error("Inline KaTeX Error:", e);
        // Return styled error span
        return `<span class="katex-error-inline" title="${e.message}">${expression}</span>`;
    }
};

// Use a computed property to map rich text segments to structured data for rendering
const renderedSegments = computed(() => {
  return props.richText.map((segment, index) => {
    const { plain_text, annotations, href, type } = segment;
    let tag = 'span'; // Default tag
    const classes = [];
    const attrs = {};
    let rawHtml = null; // For KaTeX output
    let textContent = plain_text; // Default text content

    // Apply annotations as classes or determine tag
    if (annotations.bold) classes.push('font-bold');
    if (annotations.italic) classes.push('italic');
    if (annotations.strikethrough) tag = 'del';
    if (annotations.underline) classes.push('underline');
    if (annotations.code) {
        tag = 'code';
        classes.push('inline-code');
    }
    if (annotations.color && annotations.color !== 'default') {
      classes.push(`notion-color-${annotations.color}`);
      // Handle background colors if needed
      if (annotations.color.endsWith('_background')) {
          classes.push(`notion-bg-${annotations.color}`);
      }
    }

    // Handle links
    if (href) {
      tag = 'a';
      attrs.href = href;
      attrs.target = '_blank';
      attrs.rel = 'noopener noreferrer';
    }

    // --- Handle Specific Rich Text Types ---
    if (type === 'equation') { // Handle inline equations FIRST
        rawHtml = renderInlineKatex(segment.equation.expression);
        textContent = ''; // Don't render plain text
        tag = 'span'; // Render KaTeX within a span
        classes.push('notion-inline-equation'); // Add specific class
    } else if (type === 'mention') { // THEN Handle mentions
        const mention = segment.mention;
        tag = 'span'; // Mentions are usually inline spans
        classes.push('notion-mention');
        attrs['data-mention-type'] = mention.type;

        switch (mention.type) {
            case 'date':
                textContent = formatDate(mention.date);
                break;
            case 'user':
                textContent = `@${mention.user?.name || 'User'}`; // Prefix with @
                break;
            // case 'equation': // This case is handled above by type === 'equation'
            //     break;
            case 'page':
            case 'database':
                 // TODO: Potentially link to internal pages if slugs/IDs are available and mapped
                 textContent = `[@${mention.type}:${plain_text}]`; // Simple placeholder
                 break;
            case 'link_preview': // Usually block type, but mention might exist
                 textContent = `[Link: ${plain_text}]`;
                 if (mention.link_preview?.url) {
                     tag = 'a'; // Make it a link if URL is available
                     attrs.href = mention.link_preview.url;
                     attrs.target = '_blank';
                     attrs.rel = 'noopener noreferrer';
                 }
                 break;
            default:
                 textContent = `[@${mention.type}:${plain_text}]`;
        }
    }
    // If it's neither equation nor mention, it's handled by annotations/link logic above

    // Return structured data for the template loop.
    return {
        tag,
        text: textContent,
        class: classes.join(' '),
        attrs,
        rawHtml, // Include rawHtml for KaTeX
        key: `${index}-${type}-${plain_text.slice(0, 10)}` // More unique key
    };
  });
});
</script>

<template>
  <!-- Render the segments dynamically -->
  <component
    v-for="segment in renderedSegments"
    :key="segment.key"
    :is="segment.tag"
    :class="segment.class"
    v-bind="segment.attrs"
  >
    <!-- If rawHtml exists (KaTeX), render it inside -->
    <span v-if="segment.rawHtml" v-html="segment.rawHtml"></span>
    <!-- Otherwise, render the plain text -->
    <template v-else>{{ segment.text }}</template>
  </component>
</template>

<style scoped lang="scss">


/* Add styles for annotation classes if not covered globally */
.font-bold { font-weight: var(--font-weight-bold); }
.italic { font-style: italic; }
.underline { text-decoration: underline; }
/* .inline-code { ... } // Style inline code if needed beyond global 'code' tag */

/* Add styles for Notion colors */
/* These should match the classes generated in the script */
.notion-color-gray { color: gray; }
.notion-color-brown { color: brown; }
.notion-color-orange { color: orange; }
.notion-color-yellow { color: #c29507; } // Adjusted yellow example
.notion-color-green { color: green; }
.notion-color-blue { color: blue; }
.notion-color-purple { color: purple; }
.notion-color-pink { color: pink; }
.notion-color-red { color: red; }
/* Add background color styles if needed */
.notion-bg-gray_background { background-color: rgba(120, 120, 128, 0.1); padding: 0.1em 0.3em; border-radius: var(--radius-sm);}
/* Add other background colors... */

.notion-mention { // Style for mentions
    background-color: rgba(var(--light-accent-primary), 0.1);
    padding: 0.1em 0.3em;
    border-radius: var(--radius-sm);
    font-size: 0.9em; // Slightly smaller
    white-space: nowrap; // Prevent mentions from wrapping awkwardly
}

.notion-inline-equation {
    // Add specific styling for inline equations if needed
    // e.g., slight padding or background to differentiate
    // padding: 0 0.2em;
}

/* Ensure links within rendered text inherit color correctly or use accent */
a {
    /* color: inherit; // Inherit surrounding text color */
    color: var(--accent-primary); // Or always use accent color
    text-decoration: underline; // Maybe add underline for clarity within text blocks
    &:hover {
        opacity: 0.8;
    }
}

// Style for inline KaTeX errors
:deep(.katex-error-inline) { // Use :deep() if needed to target v-html content
    color: var(--color-error);
    background-color: rgba(var(--light-accent-primary), 0.05); // Use a subtle error bg
    padding: 0.1em 0.3em;
    border-radius: var(--radius-sm);
    font-family: var(--font-family-mono); // Use mono font for raw expression
}
</style>