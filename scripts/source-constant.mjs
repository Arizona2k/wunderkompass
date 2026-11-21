// Liest eine Konstante wie `LABS` als reines Literal aus einer .ts- oder .tsx-Quelldatei.
// Nötig für Dateien, die sich in Node nicht importieren lassen (zum Beispiel wegen JSX).
// Der Pfad ist relativ zur Projektwurzel.
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import ts from 'typescript';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

export function sourceConstant(file, name) {
  const kind = file.endsWith('tsx') ? ts.ScriptKind.TSX : ts.ScriptKind.TS;
  const source = ts.createSourceFile(file, fs.readFileSync(path.join(root, file), 'utf8'), ts.ScriptTarget.Latest, true, kind);
  for (const statement of source.statements) {
    if (!ts.isVariableStatement(statement)) continue;
    for (const declaration of statement.declarationList.declarations) {
      if (declaration.name.getText() === name) return literal(declaration.initializer);
    }
  }
  throw Error('Missing ' + name);
}

function literal(node) {
  if (ts.isAsExpression(node) || ts.isSatisfiesExpression(node) || ts.isParenthesizedExpression(node)) return literal(node.expression);
  if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) return node.text;
  if (ts.isNumericLiteral(node)) return Number(node.text);
  if (node.kind === ts.SyntaxKind.TrueKeyword) return true;
  if (node.kind === ts.SyntaxKind.FalseKeyword) return false;
  if (node.kind === ts.SyntaxKind.NullKeyword) return null;
  if (ts.isPrefixUnaryExpression(node) && node.operator === ts.SyntaxKind.MinusToken) return -literal(node.operand);
  if (ts.isArrayLiteralExpression(node)) return node.elements.map(literal);
  if (ts.isObjectLiteralExpression(node)) {
    return Object.fromEntries(node.properties.map(property => {
      if (!ts.isPropertyAssignment(property)) throw Error('Nonliteral');
      return [property.name.getText().replace(/^['"]|['"]$/g, ''), literal(property.initializer)];
    }));
  }
  if (ts.isIdentifier(node)) return node.text;
  throw Error('Not a literal: ' + node.getText().slice(0, 60));
}
