import Markdoc, { type Node } from '@markdoc/markdoc';
import React from 'react';

/** Renders Markdown text from the content files (course descriptions, articles, About story). */
export function RichText({ node }: { node?: { node: Node } | null }) {
  if (!node?.node) return null;
  const errors = Markdoc.validate(node.node);
  if (errors.length) console.error(errors);
  const tree = Markdoc.transform(node.node);
  return <div className="prose-sns">{Markdoc.renderers.react(tree, React)}</div>;
}

/** True if a markdoc field has real content (used to fall back from Hindi to English). */
export function hasContent(node?: { node: Node } | null) {
  return !!node?.node?.children?.length;
}
