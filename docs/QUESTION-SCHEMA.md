# Rich Question Schema

## Goal

Questions must not be text-only. The system must support text, mathematics, images, tables, charts, coordinate/function graphs, and mixed stimuli.

## ContentBlock V1

Supported block types:

- `text`
- `math`
- `image`
- `table`
- `chart`
- `function_graph`

Complex diagrams may be uploaded as SVG/WebP/PNG images.

Arbitrary HTML is not allowed.

## Conceptual question model

```
QUESTION
│
├── metadata
├── optional stimulus
├── content_blocks
├── options
├── answer specification
└── explanation
    ├── explanation blocks
    ├── common mistake
    └── solving tip
```

## Example

```json
[
  {
    "type": "text",
    "content": "Perhatikan grafik berikut."
  },
  {
    "type": "function_graph",
    "expressions": ["y=x^2-4x+3"]
  },
  {
    "type": "math",
    "latex": "f(x)=x^2-4x+3"
  }
]
```

Image example:

```json
{
  "type": "image",
  "assetId": "asset_123",
  "alt": "Diagram gaya pada sebuah balok",
  "caption": null
}
```

Table example:

```json
{
  "type": "table",
  "columns": ["x", "f(x)"],
  "rows": [
    ["1", "2"],
    ["2", "5"],
    ["3", "10"]
  ]
}
```

## Question types V1

Required:
- `single_choice`
- `multiple_choice`

Do not assume every question has exactly five options.

## Math rendering

Store mathematical expressions as LaTeX/text data, not screenshots.

## Charts

Prefer structured chart data for:
- bar
- line
- pie
- scatter

Prefer programmatic function graph data for coordinate/function questions.

Use uploaded images only when the visual is not reasonably represented as structured data.

## Stimuli

A stimulus can be shared by multiple questions, e.g. one reading passage or infographic used by questions 1–4.

## Explanations

Ideal structure:

```
Correct answer
→ Quick method
→ Full explanation
→ Common mistake
→ Solving tip
→ Related practice
```

All explanation content is editorial/reviewed; no AI generation.
