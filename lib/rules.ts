/**
 * Fill a rule's {braces} from a context object. Any {key} present in the
 * context is substituted; unknown tokens are left visible so a missing value
 * is obvious rather than silently blank.
 *
 *   fillTemplate("downsize to {max_text_width}", { max_text_width: '4"' })
 *     => 'downsize to 4"'
 */
export function fillTemplate(
  text: string,
  context: Record<string, string | undefined>,
): string {
  return text.replace(/\{([a-z0-9_]+)\}/gi, (whole, key: string) => {
    const val = context[key];
    return val === undefined || val === "" ? whole : val;
  });
}
