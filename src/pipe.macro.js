const path = require('path')
const { createMacro, MacroError } = require('babel-plugin-macros')

const name = path.basename(__filename)

module.exports = createMacro(({ references, babel: { types: t } }) => {
  const usedReferences = Object.keys(references)

  if (usedReferences.length > 1 || usedReferences[0] !== 'default') {
    throw new MacroError(
      `${name} must be used as default import, instead you have used it as: ${usedReferences.join(
        ', ',
      )}.`,
    )
  }

  references.default.forEach(({ parentPath: pipeCall }) => {
    if (!pipeCall.isCallExpression()) {
      throw new MacroError(
        `${name} must be used as function call, instead you have used it as: ${
          pipeCall.node.type
        }.`,
      )
    }

    pipeCall.replaceWith(
      pipeCall.node.arguments.reduce((folded, cb) =>
        t.callExpression(cb, [folded]),
      ),
    )
  })
})
