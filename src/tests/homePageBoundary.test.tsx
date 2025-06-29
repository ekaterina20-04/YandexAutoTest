/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { render, screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { HomePage } from '@pages/Home/HomePage';

const mockAnalyzeCsv = vi.fn();

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

vi.mock('@hooks/use-csv-analysis', () => ({
    useCsvAnalysis: () => ({
        analyzeCsv: (...args: any[]) => mockAnalyzeCsv(...args),
    }),
}));

vi.mock('@store/analysisStore', () => ({
    useAnalysisStore: () => storeValues,
}));

describe('HomePage — граничные кейсы для кнопки и HighlightsSection', () => {
    beforeEach(() => {
        vi.clearAllMocks();
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
        const btn = screen.getByText(/загрузить файл/i);
        expect(btn.tagName).toBe('BUTTON');

        await userEvent.click(btn);
        expect(mockAnalyzeCsv).not.toHaveBeenCalled();
    });

    it('если status = "processing": кнопка исчезает (loader вместо неё)', () => {
        storeValues.file = new File(['a,b'], 'test.csv', { type: 'text/csv' });
        storeValues.status = 'processing';

        render(<HomePage />);
        const btn = screen.queryByText(/загрузить файл/i);
        expect(btn).toBeNull();

        expect(screen.getByText(/идёт парсинг файла/i)).toBeInTheDocument();
    });

    it('когда highlights = [] показывается заглушка «Здесь появятся хайлайты»', () => {
        render(<HomePage />);
        const placeholders = screen.getAllByText(/здесь появятся хайлайты/i);
        expect(placeholders).toHaveLength(1);
        expect(placeholders[0]).toBeVisible();
    });
});
