/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { render, screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { HomePage } from '@pages/Home/HomePage';

// spy для analyzeCsv
const mockAnalyzeCsv = vi.fn();

// store-мока
const mockSetError = vi.fn();
const mockSetFile = vi.fn();
const mockSetStatus = vi.fn();
const mockSetHighlights = vi.fn();
const mockReset = vi.fn();

let storeValues = {
    file: null as File | null,
    status: 'idle',
    highlights: [] as any[],
    error: null as string | null,
    setError: mockSetError,
    setFile: mockSetFile,
    setStatus: mockSetStatus,
    setHighlights: mockSetHighlights,
    reset: mockReset,
};

// мокаем хук анализа
vi.mock('@hooks/use-csv-analysis', () => ({
    useCsvAnalysis: () => ({
        analyzeCsv: (...args: any[]) => mockAnalyzeCsv(...args),
    }),
}));

// мокаем стор
vi.mock('@store/analysisStore', () => ({
    useAnalysisStore: () => storeValues,
}));

describe('HomePage — граничные кейсы для кнопки и HighlightsSection', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        // сброс стора
        storeValues = {
            ...storeValues,
            file: null,
            status: 'idle',
            highlights: [],
            error: null,
        };
    });

    afterEach(() => {
        cleanup();
        vi.clearAllMocks();
    });

    it('без выбранного файла: кнопка видна, но при клике analyzeCsv не вызывается', async () => {
        render(<HomePage />);
        // найдём кнопку по тексту
        const btn = screen.getByText(/загрузить файл/i);
        // действительно <button>
        expect(btn.tagName).toBe('BUTTON');

        // клик не приводит к вызову analyzeCsv
        await userEvent.click(btn);
        expect(mockAnalyzeCsv).not.toHaveBeenCalled();
    });

    it('если status = "processing": кнопка исчезает (loader вместо неё)', () => {
        // подменяем стор до рендера
        storeValues.file = new File(['a,b'], 'test.csv', { type: 'text/csv' });
        storeValues.status = 'processing';

        render(<HomePage />);
        // кнопки "Загрузить файл" больше нет
        const btn = screen.queryByText(/загрузить файл/i);
        expect(btn).toBeNull();

        // вместо неё показывается индикатор обработки
        expect(screen.getByText(/идёт парсинг файла/i)).toBeInTheDocument();
    });

    it('когда highlights = [] показывается заглушка «Здесь появятся хайлайты»', () => {
        // уже по умолчанию highlights = []
        render(<HomePage />);
        const placeholders = screen.getAllByText(/здесь появятся хайлайты/i);
        expect(placeholders).toHaveLength(1);
        expect(placeholders[0]).toBeVisible();
    });
});
