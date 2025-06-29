/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { render } from '@testing-library/react';
import { HomePage } from '@pages/Home/HomePage';

// Мокаем модули
vi.mock('@utils/storage', () => ({
    addToHistory: vi.fn(),
}));

describe('HomePage', () => {
    const realFetch = global.fetch;

    beforeEach(() => {
        global.fetch = vi.fn();
    });

    afterEach(() => {
        global.fetch = realFetch;
        vi.clearAllMocks();
    });

    it('рендерится без ошибок', () => {
        expect(() => render(<HomePage />)).not.toThrow();
    });

    it('содержит базовую структуру', () => {
        const { container } = render(<HomePage />);
        
        // Проверяем, что компонент рендерится и содержит контент
        expect(container.innerHTML).toContain('Загрузить файл');
        expect(container.innerHTML).toContain('Здесь появятся хайлайты');
        expect(container.innerHTML).toContain('или перетащите сюда .csv файл');
    });
}); 