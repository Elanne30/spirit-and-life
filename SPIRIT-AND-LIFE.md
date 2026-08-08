# Spirit & Life

## Project Identity

Spirit & Life is a Scripture-centered Christian reading, reflection, and study platform.

It is not a generic Christian blog, church website, or collection of unrelated pages.

The website is one connected platform built around thoughtful Christian writing, personal journals, digital books, Scripture exploration, and structured Bible study.

The four primary content worlds are:

1. Reflections
2. Journals
3. Books
4. Study Center

Supporting sections are:

- Home
- About
- Contact
- Scripture
- Search
- Privacy
- Terms

The entire application must feel like one coherent Spirit & Life environment.

---

# Core Product Principle

Spirit & Life should help a visitor:

ARRIVE
→ DISCOVER
→ READ
→ REFLECT
→ EXPLORE SCRIPTURE
→ FIND RELATED CONTENT
→ STUDY
→ CONTINUE READING

Content must be connected rather than isolated.

A visitor should be able to move naturally between:

Reflection → Scripture → Journal → Book → Study Plan → Reflection

without feeling that they have left the Spirit & Life platform.

---

# Primary Navigation

The main navigation is:

- Home
- Reflections
- Journals
- Books
- Study Center
- About
- Contact

Use the name "Reflections", never "Articles".

---

# Site Architecture

## Home

The homepage is the front door to the platform.

It should contain:

- A concise Spirit & Life introduction
- Featured Reflection
- Recent Reflections
- Recent Journals
- Books
- Study Center
- A simple closing invitation to explore

Do not turn the homepage into a crowded marketing landing page.

---

## Reflections

Reflections are the primary long-form writing section.

Routes:

/reflections
/reflections/[slug]

Archive should support:

- Featured Reflection
- Reflection listings
- Topics/categories
- Tags
- Pagination or progressive loading when needed

Reflection detail should support:

- Title
- Subtitle/introduction where applicable
- Reading metadata
- Scripture references
- Main content
- Tags
- Related content

The reading experience must prioritize comfortable typography and width.

---

## Journals

Journals are shorter-form entries.

Routes:

/journals
/journals/[slug]

Journal entries should support:

- Title
- Date
- Content
- Scripture references
- Tags
- Related content

Journals should feel more immediate and personal than long-form Reflections while remaining visually connected to the same system.

---

## Books

Books are the digital library of Spirit & Life.

Route:

/books
/books/[slug]

Book records should support:

- Cover
- Title
- Author
- Description
- Publication information where applicable
- Chapters
- Start Reading
- Continue Reading
- Reading progress

The reading interface should be optimized for long-form reading.

It should support:

- Chapter navigation
- Previous chapter
- Next chapter
- Reading progress
- Return to book
- Comfortable reading width

---

# Study Center

Route:

/study-center

The Study Center is the learning hub of Spirit & Life.

Initial areas:

- Bible Study Plans
- Reading Plans
- Learning Resources
- Future Bible Study Assistant

Study plans should eventually support:

- Title
- Description
- Duration
- Number of sessions
- Progress
- Scripture references
- Study content
- Completion state

The AI Bible Study Assistant is a future feature.

Do NOT pretend it exists or create a fake working assistant.

---

# Scripture System

Scripture is a core part of the content architecture.

Route:

/scripture

Individual Scripture reference route:

/scripture/[reference]

The Scripture system should eventually allow visitors to browse:

- Bible book
- Chapter
- Passage

A Scripture page should be able to show Spirit & Life content connected to that passage.

For example:

Romans 9

could show:

- Related Reflections
- Related Journals
- Related Books
- Related Study Plans

Scripture references should have dedicated visual treatment.

Do not visually confuse Scripture quotations with the author's own writing.

---

# Search

Route:

/search

Global search should eventually cover:

- Reflections
- Journals
- Books
- Study Plans
- Scripture references

Search results must clearly identify the content type.

The architecture must allow additional content types to be added later.

---

# Content Relationships

Content must be designed as an interconnected system.

Possible relationships:

Reflection
→ Scripture
→ Journals
→ Books
→ Study Plans

Journal
→ Scripture
→ Reflections
→ Books

Book
→ Scripture
→ Reflections
→ Journals
→ Study Plans

Study Plan
→ Scripture
→ Reflections
→ Books

Related content should be meaningful.

Use explicit relationships and/or shared tags.

Do not display arbitrary unrelated content merely to fill a section.

---

# Tags

Content must support tags.

Initial examples may include:

- Faith
- God
- Scripture
- Salvation
- Human Nature
- Justice
- Free Will
- Interpretation
- Prayer
- Spiritual Growth

The taxonomy must remain editable.

Do not create a huge unnecessary category system.

---

# Design Direction

Spirit & Life should feel:

- Calm
- Thoughtful
- Refined
- Serious without being cold
- Warm without being sentimental
- Scholarly without becoming academic
- Spiritual without visual clutter
- Modern without following passing design trends

The interface should support reading rather than compete with it.

Avoid:

- Excessive animation
- Loud gradients
- Excessive cards
- Social-media-style feeds
- Generic AI-generated Christian imagery
- Corporate SaaS styling
- Excessive popups
- Aggressive calls to action
- Visual noise

---

# Design System

The entire application must share one design system.

Shared elements include:

- Typography
- Colors
- Buttons
- Cards
- Navigation
- Footer
- Scripture styling
- Tags
- Reading metadata
- Content spacing
- Responsive behavior

Do not create a different visual identity for every section.

Reflections, Journals, Books, and Study Center must clearly belong to the same platform.

---

# Theme

Dark mode is the primary visual environment.

A carefully designed light theme must also exist.

Do not simply invert colors automatically.

Both themes must provide good readability and contrast.

The user's theme preference should persist.

---

# Responsive Design

The application must work properly on:

- Mobile phones
- Tablets
- Laptops
- Desktop monitors

Mobile is not an afterthought.

Navigation, reading width, cards, images, forms, typography, and controls must adapt naturally.

---

# Accessibility

Use good accessibility practices:

- Semantic HTML
- Proper heading hierarchy
- Keyboard navigation
- Visible focus states
- Appropriate contrast
- Alt text
- Accessible form labels
- ARIA only where appropriate
- Touch-friendly controls
- Reduced-motion support

---

# Reusable Components

Build reusable components rather than duplicating page code.

Expected component categories include:

- Header
- MobileNavigation
- Footer
- Logo
- Button
- ContentCard
- ReflectionCard
- JournalCard
- BookCard
- StudyPlanCard
- ScriptureReference
- ScriptureList
- Tag
- ReadingMetadata
- RelatedContent
- SectionHeading
- Pagination
- SearchBar
- SearchResults
- Breadcrumbs
- ChapterNavigation
- ReadingProgress
- ThemeToggle
- EmptyState
- ErrorState
- LoadingState

Components should be reusable and consistent.

---

# Content Architecture

Do not hard-code published content directly into visual components.

Separate content from presentation.

The content architecture should support fields such as:

- id
- type
- title
- slug
- excerpt
- content
- featuredImage
- publishedDate
- updatedDate
- tags
- scriptureReferences
- relatedContent
- featured

The system must make it possible to add a new Reflection without manually creating a new page design.

---

# Contact

Route:

/contact

The Contact page should contain:

- Introduction
- Contact form
- Success state
- Error state

The success state should feel calm and intentional.

Do not use intrusive browser alerts where an in-page state is appropriate.

Do not create a fake backend or pretend messages are being delivered unless a real service has been connected.

---

# About

Route:

/about

The About page should explain:

- What Spirit & Life is
- Its purpose
- Its vision
- Its approach to Scripture and writing
- The work behind Spirit & Life

Do not put the entire About content on the homepage.

---

# SEO

Every public content page should support:

- Unique title
- Meta description
- Canonical URL
- Open Graph metadata
- Social sharing metadata
- Proper heading structure
- Descriptive URLs
- Image alt text
- Internal linking
- Sitemap
- Robots configuration

Use readable URLs such as:

/reflections/gods-character-and-mans-responsibility

rather than query-based URLs.

---

# Performance

Prioritize:

- Fast loading
- Optimized images
- Responsive images
- Appropriate lazy loading
- Minimal unnecessary JavaScript
- Efficient fonts
- Clean component architecture

Do not add dependencies without a reason.

---

# Animation

Animation must be subtle and purposeful.

Good uses include:

- Menu transitions
- Hover states
- Small interaction feedback
- Gentle page transitions

Avoid constant movement, excessive parallax, or animations that distract from reading.

---

# Technical Principles

This project should be a normal portable web application.

It must not become permanently dependent on a proprietary AI website builder.

The project should remain deployable through standard web hosting infrastructure.

The code should remain understandable and maintainable by another developer or AI coding agent.

Do not introduce unnecessary complexity.

Do not rewrite the architecture without a clear reason.

---

# Future Expansion

The architecture should leave room for future features including:

- Bible Dictionary
- Hebrew study resources
- Greek study resources
- Additional Scripture tools
- More reading plans
- More study resources
- AI Bible Study Assistant
- Expanded digital library
- Additional content types

Do not build these features now unless specifically instructed.

Prepare the architecture for them without pretending they already exist.

---

# Development Rules

1. Preserve the Spirit & Life architecture.
2. Never rename Reflections to Articles.
3. Keep the four primary content worlds connected.
4. Do not create separate visual systems for each section.
5. Do not hard-code content into reusable UI components.
6. Do not invent unfinished features.
7. Do not use fake functionality.
8. Do not create fake published content that could be mistaken for real Spirit & Life writing.
9. Prioritize reading comfort.
10. Keep the interface calm and uncluttered.
11. Avoid unnecessary dependencies.
12. Keep the project responsive.
13. Maintain accessibility.
14. Maintain SEO fundamentals.
15. Keep Scripture relationships central to the content architecture.
16. Use meaningful related content.
17. Preserve portability of the codebase.
18. Do not make major architectural decisions without first consulting this document.
19. Before implementing unfamiliar or potentially changed framework APIs, consult the current local framework documentation available in the project.
20. Build incrementally and verify each major change before proceeding.

---

# Build Philosophy

Do not attempt to build every feature at once.

Build in stages:

## Phase 1
Foundation, design system, navigation, theme, responsive layout, homepage.

## Phase 2
Reflections, Journals, Books.

## Phase 3
Study Center.

## Phase 4
Scripture system.

## Phase 5
Search, tags, related content.

## Phase 6
Contact refinement, detail-page consistency, accessibility, SEO, performance.

## Phase 7
Future study tools and AI Bible Study Assistant.

Every phase should leave the application in a working state.

---

# Final Product Principle

Spirit & Life should ultimately feel like one connected Christian reading and study environment.

The website is not successful merely because it looks attractive.

It is successful when:

- The writing is easy to read.
- Content is easy to discover.
- Scripture is meaningfully connected to the content.
- Related material is genuinely useful.
- The four content worlds feel unified.
- The Study Center can grow over time.
- The platform remains technically maintainable.
- The owner can continue developing the site without being trapped inside a proprietary website builder.