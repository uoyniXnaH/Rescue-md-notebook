export const dummyContents = `
# Rescue Notebook
## Test title

- bullet 1
  - bullet 1.1
- bullet 2
- bullet 3

Some checkbox

- [x] checkbox 1
- [ ] checkbox 2

Test \`code inline\`.
The following is a code block:
\`\`\`js
import ja from "./locales/ja.json";

const resources = {
    sc: {
      translation: sc
    },
    ja: {
      translation: ja
    },
    en: {
      translation: en
    }
  };

  i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    fallbackLng: "en",
    lng: "en", 
    interpolation: {
      escapeValue: false // react already safes from xss
    }
  });

  export default i18n;
\`\`\`

\`\`\`python
class Solution:
    def isPalindrome(self, x: int) -> bool:
        x_str = f"{x}"
        rts_x = x_str[::-1]
        return x_str == rts_x
\`\`\`

This is a [link](https://example.com).

This is some ~~strikethrough~~ text.

> This is a blockquote.

Table example:

| Header 1 | Header 2 |
| -------- | -------- |
| Row 1   | Cell 1  |
| Row 2   | Cell 2  |
| Row 3   | Cell 3  |
`;