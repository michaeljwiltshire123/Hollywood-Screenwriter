/**
 * Page dimensions, title page layout, and font configuration for printing
 */
export const PRINT_PAGE_CSS = `
@page {
  size: letter portrait;
  margin: 1in;
}

@page :left {
  margin-left: 1.5in;
  margin-right: 1in;
}

@page :right {
  margin-left: 1.5in;
  margin-right: 1in;
}

* {
  box-sizing: border-box;
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
}

html, body {
  margin: 0;
  padding: 0;
  background: #ffffff !important;
  color: #000000 !important;
  font-family: 'Courier Prime', 'Courier New', Courier, monospace !important;
  font-size: 12pt;
  line-height: 1.25;
}

.title-page-container {
  height: 9in;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  page-break-after: always;
  break-after: page;
  padding-top: 2in;
  text-align: center;
}

.title-page-center {
  margin: auto 0;
}

.title-main {
  font-size: 16pt;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 24pt;
}

.title-credit {
  font-size: 12pt;
  margin-bottom: 12pt;
}

.title-author {
  font-size: 13pt;
  font-weight: bold;
  margin-bottom: 18pt;
}

.title-source {
  font-size: 11pt;
  font-style: italic;
}

.title-page-bottom {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  text-align: left;
  font-size: 10pt;
  padding-bottom: 0.5in;
}

.title-contact {
  max-width: 50%;
  white-space: pre-line;
}

.title-meta-right {
  text-align: right;
}

.script-body {
  padding-top: 0.25in;
}
`;
