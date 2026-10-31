import '@testing-library/jest-dom/vitest';

// jsdom n'implémente pas le défilement.
window.scrollTo = () => {};
if (!Element.prototype.scrollIntoView) Element.prototype.scrollIntoView = () => {};
