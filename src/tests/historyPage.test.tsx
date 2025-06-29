/**
 * @vitest-environment jsdom
 */
import '@testing-library/jest-dom/vitest';
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

import { HistoryPage } from '@pages/History';

describe('HistoryPage UI-тесты', () => {
    it('рендерится без ошибок', () => {
        expect(() => render(
            <BrowserRouter>
                <HistoryPage />
            </BrowserRouter>
        )).not.toThrow();
    });
});
