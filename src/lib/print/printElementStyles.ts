/**
 * CSS rules for screenplay element indentation and page-break rules
 */
export const PRINT_ELEMENT_CSS = `
.scene-heading {
  font-weight: bold;
  text-transform: uppercase;
  margin-top: 18pt;
  margin-bottom: 12pt;
  page-break-after: avoid;
  break-after: avoid;
}

.action {
  margin-top: 0;
  margin-bottom: 12pt;
}

.character {
  font-weight: bold;
  text-transform: uppercase;
  margin-left: 2.2in;
  margin-top: 12pt;
  margin-bottom: 0;
  page-break-after: avoid;
  break-after: avoid;
}

.parentical {
  font-style: italic;
  margin-left: 1.6in;
  margin-top: 0;
  margin-bottom: 0;
  page-break-after: avoid;
  break-after: avoid;
}

.dialogue {
  margin-left: 1.0in;
  margin-right: 1.5in;
  margin-top: 0;
  margin-bottom: 12pt;
}

.transition {
  font-weight: bold;
  text-transform: uppercase;
  text-align: right;
  margin-top: 12pt;
  margin-bottom: 12pt;
}

.shot {
  font-weight: bold;
  text-transform: uppercase;
  margin-top: 14pt;
  margin-bottom: 12pt;
}

.note {
  font-style: italic;
  color: #555555;
  margin-bottom: 12pt;
}
`;
