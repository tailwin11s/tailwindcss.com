import { highlightCode, addImport } from './utils.mjs'
import JSON5 from 'json5'
import { parse, parseExpressionAt } from 'acorn'
import { visit } from 'unist-util-visit'

export const withSyntaxHighlighting = () => {
  return (tree) => {
    let componentName

    visit(tree, 'code', (node) => {
      if (node.lang === null) return node

      let re = /(<[^>]+)\s+dark-([a-z-]+)="([^"]+)"([^>]*>)/gi

      let lightCode = node.value.replace(
        re,
        (_match, before, _key, _value, after) => `${before}${after}`
      )
      let darkCode = node.value.replace(re, (_match, before, key, value, after) =>
        `${before}${after}`.replace(new RegExp(`(\\s${key})="[^"]+"`), `$1="${value}"`)
      )

      node.type = 'mdxJsxFlowElement'
      let code

      if (lightCode === darkCode) {
        code = [
          `<code class="language-${node.lang}">`,
          highlightCode(lightCode, node.lang),
          '</code>',
        ]
          .filter(Boolean)
          .join('')
      } else {
        code = [
          `<code class="dark:hidden language-${node.lang}">`,
          highlightCode(lightCode, node.lang),
          '</code>',
          `<code class="hidden dark:block language-${node.lang}">`,
          highlightCode(darkCode, node.lang),
          '</code>',
        ]
          .filter(Boolean)
          .join('')
      }

      if (!node.meta) {
        let value = `{__html:${JSON.stringify(code)}}`
        node.name = 'pre'
        node.attributes = [
          {
            type: 'mdxJsxAttribute',
            name: 'className',
            value: `language-${node.lang}`,
          },
          {
            type: 'mdxJsxAttribute',
            name: 'dangerouslySetInnerHTML',
            value: {
              type: 'mdxJsxAttributeValueExpression',
              value,
              data: {
                estree: {
                  type: 'Program',
                  body: [
                    {
                      type: 'ExpressionStatement',
                      expression: parseExpressionAt(value, 0, { ecmaVersion: 'latest' }),
                    },
                  ],
                },
              },
            },
          },
        ]
        return
      }

      code = `<pre class="language-${node.lang}">${code}</pre>`

      if (!componentName) {
        componentName = addImport(tree, '@/components/Editor', 'Editor')
      }
      node.name = componentName
      node.attributes = []
      let props = {}

      if (node.meta) {
        if (node.meta.startsWith('{{')) {
          node.meta = node.meta.slice(1, -1)
        } else {
          node.meta = `{ filename: '${node.meta}' }`
        }

        props = JSON5.parse(node.meta)
      }

      props.code = code

      for (let key in props) {
        node.attributes.push({
          type: 'mdxJsxAttribute',
          name: key,
          value: {
            type: 'mdxJsxAttributeValueExpression',
            value: JSON.stringify(props[key]),
            data: { estree: parse(JSON.stringify(props[key]), { ecmaVersion: 'latest' }) },
          },
        })
      }
    })
  }
}
