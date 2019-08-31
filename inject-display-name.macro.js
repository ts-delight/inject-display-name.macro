const { createMacro, MacroError } = require('babel-plugin-macros');
const { codeFrameColumns } = require('@babel/code-frame');
const template = require('@babel/template').default;
const traverse = require('@babel/traverse').default;
const debug = require('debug')('inject-display-name.macro');
const path = require('path');

const pkgName = 'inject-display-name.macro';

const InjectDisplayName = ({ references, state, babel }) => {
  debug('state:', state.file.ast);

  const t = babel.types;
  const refKeys = Object.keys(references);
  const { code } = state.file;

  // Print well formatted errors
  const failWith = (errCode, node, message) => {
    if (node.loc) console.log(codeFrameColumns(code, node.loc, { message }));
    const error = new MacroError(`ERR${errCode}: ${message}`);
    error.code = `ERR${errCode}`;
    throw error;
  };

  const failWithUnsupportedUsage = (node) => {
    failWith(5, node, `${pkgName} was used in unsupported context`);
  }

  // We expect only a default import
  const invalidRefKeys = refKeys.filter(k => k !== 'default');

  // Find immediate parent
  const findParent = nodePath => nodePath.findParent(() => true);

  if (invalidRefKeys.length > 0) {
    // Something else was imported from this package
    throw new MacroError(
      `Invalid import(s) from ${pkgName}: ${invalidRefKeys.join(', ')}`
    );
  }

  if (
    // No default import:
    !references.default ||
    // Nothing done with the default import:
    references.default.length === 0
  ) {
    throw new MacroError(
      `${pkgName} was imported but never used. You can remove the import to fix this error`
    );
  }

  const stmtTmpl = (id) =>
    // The assignment can fail when the object is not extensible
    //
    // Fail gracefully in such situations
    template(`
    try {
      %%id%%.displayName = %%displayName%%;
    } catch (e) {
      console.error(e);
      console.error("injectDN failed to assign displayName:", %%displayName%%);
    }`)({
    id,
    displayName: t.stringLiteral(id.name)
  });

  for (const nodePath of references.default) {
    let parentPath = findParent(nodePath);
    if (!t.isCallExpression(parentPath.node)) {
      failWith(1, parentPath.node, 'Expected to be invoked as a function');
    }
    if (parentPath.node.arguments.length !== 1) {
      failWith(2, parentPath.node, 'Expected to be invoked with a single argument');
    }
    parentPath.replaceWith(parentPath.node.arguments[0]);
    parentPath = findParent(parentPath);
    if (!parentPath) failWithUnsupportedUsage(nodePath.node);
    if (t.isVariableDeclarator(parentPath.node)) {
      // Handle macro usage in variable declaration:

      const {id} = parentPath.node;
      parentPath = findParent(parentPath);
      if (!parentPath || !t.isVariableDeclaration(parentPath.node)) {
        failWith(3, nodePath.node, 'Expected to be used in variable declaration statement');
      }
      let bodyParentPath = findParent(parentPath);
      let childPath = parentPath;
      if (t.isExportNamedDeclaration(bodyParentPath.node)) {
        // Go up one more level
        childPath = bodyParentPath;
        bodyParentPath = findParent(bodyParentPath);
      }
      if (!bodyParentPath || !bodyParentPath.node || !bodyParentPath.node.body) {
        failWith(4, nodePath.node, 'Failed to find a parent body to inject subsequent statement');
      }
      const idx = bodyParentPath.node.body.indexOf(childPath.node) + 1;
      bodyParentPath.node.body.splice(idx, 0, stmtTmpl(id));
    } else if (t.isExportDefaultDeclaration(parentPath.node)) {
      // Handle macro usage in export default

      const bodyParentPath = findParent(parentPath);
      if (!bodyParentPath || !bodyParentPath.node || !bodyParentPath.node.body) {
        failWith(4, nodePath.node, 'Failed to find a parent body to inject subsequent statement');
      }

      const idx = bodyParentPath.node.body.indexOf(parentPath.node);

      // Derive id from filename (if available)
      const idBase = state.filename ? path.basename(state.filename, path.extname(state.filename)) : 'DefaultExport';
      const id = bodyParentPath.scope.generateUidIdentifier(idBase);

      // Move the exported entity to a const declaration at same level
      // and rewrite the default export to explort this constant
      bodyParentPath.node.body.splice(idx, 0, template(`const %%id%% = %%declaration%%`)({
        id,
        declaration: parentPath.node.declaration
      }), stmtTmpl(id));
      parentPath.node.declaration = id;

      // If we don't register the declaration then typescript-plugin will complain
      bodyParentPath.traverse({
        VariableDeclaration(path) {
          if (path.node.declarations[0].id.name === id.name) {
            bodyParentPath.scope.registerDeclaration(path);
          }
        }
      });

    } else failWithUnsupportedUsage(nodePath.node);
  }
};

module.exports = createMacro(InjectDisplayName);
