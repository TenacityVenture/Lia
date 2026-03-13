// Unicode bold/italic formatting maps for LinkedIn posts
// (LinkedIn doesn't support markdown, so we use Unicode lookalike characters)

const BOLD_MAP: Record<string, string> = {
  a: "𝗮", b: "𝗯", c: "𝗰", d: "𝗱", e: "𝗲", f: "𝗳", g: "𝗴", h: "𝗵",
  i: "𝗶", j: "𝗷", k: "𝗸", l: "𝗹", m: "𝗺", n: "𝗻", o: "𝗼", p: "𝗽",
  q: "𝗾", r: "𝗿", s: "𝘀", t: "𝘁", u: "𝘂", v: "𝘃", w: "𝘄", x: "𝘅",
  y: "𝘆", z: "𝘇", A: "𝗔", B: "𝗕", C: "𝗖", D: "𝗗", E: "𝗘", F: "𝗙",
  G: "𝗚", H: "𝗛", I: "𝗜", J: "𝗝", K: "𝗞", L: "𝗟", M: "𝗠", N: "𝗡",
  O: "𝗢", P: "𝗣", Q: "𝗤", R: "𝗥", S: "𝗦", T: "𝗧", U: "𝗨", V: "𝗩",
  W: "𝗪", X: "𝗫", Y: "𝗬", Z: "𝗭",
  "0": "𝟬", "1": "𝟭", "2": "𝟮", "3": "𝟯", "4": "𝟰",
  "5": "𝟱", "6": "𝟲", "7": "𝟳", "8": "𝟴", "9": "𝟵",
};

const ITALIC_MAP: Record<string, string> = {
  a: "𝘢", b: "𝘣", c: "𝘤", d: "𝘥", e: "𝘦", f: "𝘧", g: "𝘨", h: "𝘩",
  i: "𝘪", j: "𝘫", k: "𝘬", l: "𝘭", m: "𝘮", n: "𝘯", o: "𝘰", p: "𝘱",
  q: "𝘲", r: "𝘳", s: "𝘴", t: "𝘵", u: "𝘶", v: "𝘷", w: "𝘸", x: "𝘹",
  y: "𝘺", z: "𝘻", A: "𝘈", B: "𝘉", C: "𝘊", D: "𝘋", E: "𝘌", F: "𝘍",
  G: "𝘎", H: "𝘏", I: "𝘐", J: "𝘑", K: "𝘒", L: "𝘓", M: "𝘔", N: "𝘕",
  O: "𝘖", P: "𝘗", Q: "𝘘", R: "𝘙", S: "𝘚", T: "𝘛", U: "𝘜", V: "𝘝",
  W: "𝘞", X: "𝘟", Y: "𝘠", Z: "𝘡",
};

const BOLD_REVERSE_MAP: Record<string, string> = Object.fromEntries(
  Object.entries(BOLD_MAP).map(([k, v]) => [v, k])
);

const ITALIC_REVERSE_MAP: Record<string, string> = Object.fromEntries(
  Object.entries(ITALIC_MAP).map(([k, v]) => [v, k])
);

export type UnicodeStyle = "bold" | "italic";

/** Convert normal text to Unicode bold or italic */
export function toUnicodeStyle(text: string, style: UnicodeStyle = "bold"): string {
  const map = style === "italic" ? ITALIC_MAP : BOLD_MAP;
  return [...text].map((char) => map[char] ?? char).join("");
}

/** Convert Unicode bold/italic text back to normal ASCII */
export function fromUnicodeToNormal(text: string, style: UnicodeStyle = "bold"): string {
  const map = style === "italic" ? ITALIC_REVERSE_MAP : BOLD_REVERSE_MAP;
  return [...text].map((char) => map[char] ?? char).join("");
}

/** Returns true if the string contains any non-ASCII characters */
export function isUnicode(text: string): boolean {
  return /[^\u0000-\u007F]/.test(text);
}

/** Returns true if all characters in the string are bold Unicode */
export function isBoldUnicode(text: string): boolean {
  return [...text].every((char) => {
    const code = char.codePointAt(0)!;
    return (
      (code >= 0x1d400 && code <= 0x1d419) || // bold A-Z
      (code >= 0x1d41a && code <= 0x1d433) || // bold a-z
      (code >= 0x1d7ce && code <= 0x1d7d7)    // bold 0-9
    );
  });
}

/** Returns true if all characters in the string are italic Unicode */
export function isItalicUnicode(text: string): boolean {
  return [...text].every((char) => {
    const code = char.codePointAt(0)!;
    return (
      (code >= 0x1d434 && code <= 0x1d44d) || // italic A-Z
      (code >= 0x1d44e && code <= 0x1d467) || // italic a-z
      char === "ℎ"                              // special italic h
    );
  });
}
