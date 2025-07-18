/**
 * @vitest-environment jsdom
 */
import '@testing-library/jest-dom/vitest';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { HomePage } from '@pages/Home/HomePage';

vi.mock('@utils/storage', () => ({
    addToHistory: vi.fn(),
}));

const mockSetError = vi.fn();
const mockSetFile = vi.fn();
const mockSetStatus = vi.fn();
const mockSetHighlights = vi.fn();
const mockReset = vi.fn();

vi.mock('@store/analysisStore', () => ({
    useAnalysisStore: () => ({
        file: new File([''], 'test.csv', { type: 'text/csv' }),
        status: 'idle',
        highlights: [],
        error: 'Ошибка при анализе файла',
        setError: mockSetError,
        setFile: mockSetFile,
        setStatus: mockSetStatus,
        setHighlights: mockSetHighlights,
        reset: mockReset,
    }),
}));

vi.mock('@hooks/use-csv-analysis', () => ({
    useCsvAnalysis: () => ({
        analyzeCsv: () => Promise.reject(new Error('Ошибка при анализе файла')),
    }),
}));

describe('HomePage - Обработка ошибок', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('отображает сообщение об ошибке, если оно задано в сторе', async () => {
        render(<HomePage />);

        expect(screen.getByText('Ошибка при анализе файла')).toBeInTheDocument();
    });
});
