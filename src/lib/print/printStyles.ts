import { PRINT_PAGE_CSS } from './printPageStyles';
import { PRINT_ELEMENT_CSS } from './printElementStyles';

/**
 * Standard CSS rules for clean screenplay printing combining page and element rules
 */
export const PRINT_SCREENPLAY_CSS = `
${PRINT_PAGE_CSS}
${PRINT_ELEMENT_CSS}
`;
