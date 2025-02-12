<template>
    <div class="style-guide">
        <div class="styleguide-header-wrap">
            <div class="heading-jumbo">Styleguide</div>
            <div class="paragraph-bigger cc-bigger-light">Source of truth of this template.</div>
        </div>
        <div class="container">
            <div class="styleguide-content-wrap">
                <div class="styleguide-block">
                    <div class="label cc-styleguide-label">Headings</div>
                    <div class="heading-jumbo">Heading Jumbo</div>
                    <div class="heading-jumbo-small">Heading Jumbo</div>
                    <div class="heading-jumbo-tiny">Heading Jumbo</div>
                    <h1>Heading 1</h1>
                    <h2>Heading 2</h2>
                    <h3>Heading 3</h3>
                    <h4>Heading 4</h4>
                    <h5>Heading 5</h5>
                    <h6>Heading 6</h6>
                </div>
                <div class="divider"></div>
                <div class="styleguide-block">
                    <div class="label cc-styleguide-label">Paragraphs &amp; Links</div>
                    <p class="paragraph-bigger">Paragraph-bigger</p>
                    <p>Paragraph</p>
                    <p class="paragraph-light">Paragraph-de-emphasized</p>
                    <p class="paragraph-small">Paragraph-smaller</p>
                    <p class="paragraph-tiny">Paragraph-tiny</p>
                    <div class="label">Label</div>
                    <a href="#">A text link</a>
                </div>
                <div class="divider"></div>
                <div class="styleguide-block">
                    <div class="label cc-styleguide-label">Buttons &amp; Form Elements</div>
                    <div class="styleguide-button-wrap">
                        <a href="#" class="button w-inline-block">
                            <div>Explore</div>
                        </a>
                    </div>
                    <div class="styleguide-button-wrap">
                        <a href="#" class="button cc-jumbo-button w-inline-block">
                            <div>Explore</div>
                        </a>
                    </div>
                </div>
                <div class="divider"></div>
                <div class="styleguide-block">
                    <div class="label cc-styleguide-label">Rich Text Element</div>
                    <div class="rich-text w-richtext">
                        <h2>What’s a Rich Text element?</h2>
                        <p>The rich text element allows you to create and format headings, paragraphs,
                            blockquotes, images, and video all in one place instead of having to add and format
                            them individually. Just double-click and easily create content. </p>
                        <blockquote>The rich text element allows you to create and format headings, paragraphs,
                            blockquotes, images, and video all in one place instead of having to add and format
                            them individually. Just double-click and easily create content.</blockquote>
                        <h4>Static and dynamic content editing</h4>
                        <p>A rich text element can be used with static or dynamic content. For static content,
                            just drop it into any page and begin editing. For dynamic content, add a rich text
                            field to any collection and then connect a rich text element to that field in the
                            settings panel. Voila!</p>
                        <figure style="max-width:1306px"
                            class="w-richtext-align-fullwidth w-richtext-figure-type-image">
                            <div><img src="../assets/image/placehoder-1.svg" alt=""></div>
                            <figcaption>Image caption</figcaption>
                        </figure>
                        <h4>How to customize formatting for each rich text</h4>
                        <p>Headings, paragraphs, blockquotes, figures, images, and figure captions can all be
                            styled after a class is added to the rich text element using the &quot;When inside
                            of&quot; nested selector system.</p>
                        <ul role="list">
                            <li>The rich text element allows you to create and format headings</li>
                            <li>Headings, paragraphs, blockquotes, figures, images, and figure captions</li>
                            <li>A rich text element can be used with static or dynamic content.</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default{
    name:'StyleGuide',
    
}
</script>

<style>
.style-guide{
    margin: 0 30px;
}
</style>