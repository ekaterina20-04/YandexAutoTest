/**
 * @vitest-environment jsdom
 */
import '@testing-library/jest-dom/vitest';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import type { HistoryItemType } from '@app-types/history';

const initialHistory: HistoryItemType[] = [
    { id: 'id-1', timestamp: 1650000000000, fileName: 'first.csv' },
    { id: 'id-2', timestamp: 1660000000000, fileName: 'second.csv' },
];

vi.mock('@utils/storage', () => ({
    getHistory: vi.fn(() => initialHistory),
    removeFromHistory: vi.fn(),
}));

import { getHistory, removeFromHistory } from '@utils/storage';
import { HistoryPage } from '@pages/History'; // ← здесь ваш index.ts

describe('HistoryPage UI-тесты', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        (getHistory as any).mockReturnValue(initialHistory);
    });

    it('рендерит список файлов и даты', () => {
        render(<HistoryPage />);
        expect(screen.getByText('first.csv')).toBeInTheDocument();
        expect(screen.getByText('second.csv')).toBeInTheDocument();

        const d1 = new Date(initialHistory[0].timestamp).toLocaleString();
        const d2 = new Date(initialHistory[1].timestamp).toLocaleString();
        expect(screen.getByText(d1)).toBeInTheDocument();
        expect(screen.getByText(d2)).toBeInTheDocument();
    });

    it('при удалении первая запись пропадает и removeFromHistory вызывается', async () => {
        (getHistory as any).mockReturnValueOnce(initialHistory).mockReturnValueOnce([initialHistory[1]]);

        render(<HistoryPage />);

        const del = screen.getByRole('button', { name: /удалить запись first\.csv/i });
        await userEvent.click(del);

        expect(removeFromHistory).toHaveBeenCalledWith('id-1');

        await waitFor(() => {
            expect(screen.queryByText('first.csv')).toBeNull();
            expect(screen.getByText('second.csv')).toBeInTheDocument();
        });
    });
});
