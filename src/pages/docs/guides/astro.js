import { DocumentationLayout } from '@/layouts/DocumentationLayout'
import { FrameworkGuideLayout } from '@/layouts/FrameworkGuideLayout'
import { Steps } from '@/components/Steps'

let steps = [
  {
    title: 'Create your project',
    body: () => (
      <p>
        Start by creating a new Astro project if you don't have one set up already. The most
        common approach is outlined in the{' '}
        <a href="https://docs.astro.build/en/getting-started/">
          Getting Started with Astro
        </a>{' '}
        introduction.
      </p>
    ),
    code: {
      name: 'Terminal',
      lang: 'terminal',
      code: 'npm create astro@latest my-app',
    },
  },
    {
    title: 'Install TailwindCSS',
    body: () => (
      <p>
        Run the <code>astro add</code> command to install <code>tailwindcss</code> and its peer dependencies. The command will also generate a minimal <code>tailwind.config.cjs</code> file.
      </p>
    ),
    code: {
      name: 'Terminal',
      lang: 'terminal',
      code: 'npx astro add tailwind',
    },
  },
  {
    title: 'Add the Tailwind directives to your CSS',
    body: () => (
      <p>
        Create a <code>./src/app.css</code> file and add the <code>@tailwind</code> directives for
        each of Tailwind’s layers.
      </p>
    ),
    code: {
      name: 'app.css',
      lang: 'css',
      code: `@tailwind base;
@tailwind components;
@tailwind utilities;`,
    },
  },
  {
    title: 'Start your build process',
    body: () => (
      <p>
        Run your build process with <code>npm run dev</code>.
      </p>
    ),
    code: {
      name: 'Terminal',
      lang: 'terminal',
      code: 'npm run dev',
    },
  },
  {
    title: 'Start using Tailwind in your project',
    body: () => (
      <p>
        Start using Tailwind's utility classes to style your content.
      </p>
    ),
    code: {
      name: 'index.astro',
      lang: 'html',
      code: `> <h1 class="text-3xl font-bold underline">
    Hello world!
  </h1>`,
    },
  },
]

export default function UsingAstro({ code }) {
  return (
    <FrameworkGuideLayout
      title="Install Tailwind CSS with Astro"
      description="Setting up Tailwind CSS in an Astro project."
    >
      <Steps steps={steps} code={code} />
    </FrameworkGuideLayout>
  )
}

export function getStaticProps() {
  let { highlightedCodeSnippets } = require('@/components/Guides/Snippets.js')

  return {
    props: {
      code: highlightedCodeSnippets(steps),
    },
  }
}

UsingAstro.layoutProps = {
  meta: {
    title: 'Install Tailwind CSS with Astro',
    description: 'Setting up Tailwind CSS in an Astro project.',
    section: 'Getting Started',
  },
  Layout: DocumentationLayout,
  allowOverflow: false,
}