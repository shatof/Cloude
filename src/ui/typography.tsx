import { Fragment, type ReactNode } from 'react';

/**
 * Typographie française et texte enrichi minimal.
 *
 * - apostrophes droites → typographiques, espaces insécables avant « ; : ! ? » et dans les guillemets ;
 * - **gras**, *italique* (rendu en couleur), `code` ;
 * - « → » est dessinée en pixel art (les polices pixel n'ont pas ce glyphe) ;
 * - paragraphes séparés par une ligne vide, listes « - » ou « 1. ».
 */

const NNBSP = ' ';
const NBSP = ' ';

export function frenchTypo(text: string): string {
  return text
    .replace(/'/g, '’')
    .replace(/ ([;!?])/g, `${NNBSP}$1`)
    .replace(/ :(\s|$)/g, `${NBSP}:$1`)
    .replace(/« /g, `«${NBSP}`)
    .replace(/ »/g, `${NBSP}»`)
    .replace(/(\d) (\d{3})\b/g, `$1${NNBSP}$2`)
    .replace(/n° /g, `n°${NBSP}`)
    .replace(/(\d) (h|%|XP|tokens?)\b/g, `$1${NBSP}$2`);
}

function Arrow() {
  return (
    <svg className="inline-arrow" width="0.9em" height="0.6em" viewBox="0 0 9 6" shapeRendering="crispEdges" aria-label="vers">
      <path d="M0 2h6V0h1v1h1v1h1v2H8v1H7v1H6V4H0z" fill="currentColor" />
    </svg>
  );
}

function withArrows(text: string, keyPrefix: string): ReactNode[] {
  const parts = text.split('→');
  const out: ReactNode[] = [];
  parts.forEach((part, i) => {
    if (i > 0) out.push(<Arrow key={`${keyPrefix}-a${i}`} />);
    if (part) out.push(<Fragment key={`${keyPrefix}-t${i}`}>{part}</Fragment>);
  });
  return out;
}

/** Rend une ligne : gras, italique, code, flèches. */
export function inline(text: string, keyPrefix = 'i'): ReactNode[] {
  const nodes: ReactNode[] = [];
  const pattern = /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g;
  let last = 0;
  let match: RegExpExecArray | null;
  let n = 0;
  while ((match = pattern.exec(text)) !== null) {
    if (match.index > last) nodes.push(...withArrows(frenchTypo(text.slice(last, match.index)), `${keyPrefix}-${n++}`));
    const token = match[0];
    if (token.startsWith('**')) {
      nodes.push(<strong key={`${keyPrefix}-${n++}`}>{withArrows(frenchTypo(token.slice(2, -2)), `${keyPrefix}-b${n}`)}</strong>);
    } else if (token.startsWith('`')) {
      nodes.push(<code key={`${keyPrefix}-${n++}`}>{token.slice(1, -1)}</code>);
    } else {
      nodes.push(<em key={`${keyPrefix}-${n++}`}>{withArrows(frenchTypo(token.slice(1, -1)), `${keyPrefix}-e${n}`)}</em>);
    }
    last = match.index + token.length;
  }
  if (last < text.length) nodes.push(...withArrows(frenchTypo(text.slice(last)), `${keyPrefix}-${n++}`));
  return nodes;
}

/** Texte court sur une ligne (titres, libellés). */
export function T({ children }: { children: string }) {
  return <>{inline(children)}</>;
}

/** Bloc de texte enrichi : paragraphes et listes. */
export function RichText({ text, className }: { text: string; className?: string }) {
  const blocks = text.split(/\n\s*\n/);
  return (
    <div className={['rich', className ?? ''].join(' ').trim()}>
      {blocks.map((block, b) => {
        const lines = block.split('\n').filter((l) => l.trim().length > 0);
        if (lines.length > 0 && lines.every((l) => /^\s*- /.test(l))) {
          return (
            <ul key={b}>
              {lines.map((l, i) => (
                <li key={i}>{inline(l.replace(/^\s*- /, ''), `${b}-${i}`)}</li>
              ))}
            </ul>
          );
        }
        if (lines.length > 0 && lines.every((l) => /^\s*\d+\. /.test(l))) {
          return (
            <ol key={b}>
              {lines.map((l, i) => (
                <li key={i}>{inline(l.replace(/^\s*\d+\. /, ''), `${b}-${i}`)}</li>
              ))}
            </ol>
          );
        }
        return <p key={b}>{inline(lines.join(' '), `${b}`)}</p>;
      })}
    </div>
  );
}
