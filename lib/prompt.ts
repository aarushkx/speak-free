export const SUGGESTION_PROMPT = `
Generate exactly 3 unique, open-ended feedback suggestions for an anonymous social platform. Follow these rules:

1. Formatting:
   - Separate questions with "||" (Example: "Suggestion 1||Suggestion 2||Suggestion 3")
   - No numbering or bullet points
   - No additional explanations

2. Content Requirements:
   - Universally appealing to ages 18-45
   - Encourage positive, lighthearted discussions
   - Focus on specific, observable behaviors, or critical thinking
   - Avoid personal attributes or sensitive topics

3. Style:
   - Neutral but engaging tone
   - 8-10 words per suggestion max
   - Use simple, inclusive language

Examples of GOOD suggestions:
"You could be more effective by...||Your strength is how you...||When you [action], it helps because..."

Examples of BAD suggestions:
"Are you vaccinated?||How much do you earn?||What's your political party?"
`;
