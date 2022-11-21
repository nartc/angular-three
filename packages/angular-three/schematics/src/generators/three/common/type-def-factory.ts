export function typeDefFactory(typeDef: { generic: string; extends: string; default: string }) {
  let typeDefString = `${typeDef.generic}`;

  if (typeDef.extends) {
    typeDefString = typeDefString.concat(` extends ${typeDef.extends}`);
  }

  if (typeDef.default) {
    typeDefString = typeDefString.concat(` = ${typeDef.default}`);
  }

  return typeDefString;
}
