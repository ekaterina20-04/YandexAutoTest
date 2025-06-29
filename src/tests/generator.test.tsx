/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { API_HOST } from '@utils/consts';
import GeneratePage from '@pages/Generate/GeneratePage';

describe('GeneratePage', () => {
    let clickSpy: ReturnType<typeof vi.spyOn>;
    const realFetch = global.fetch;
    const realCreate = window.URL.createObjectURL;
    const realRevoke = window.URL.revokeObjectURL;

    beforeEach(() => {
        clickSpy = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});
        global.fetch = vi.fn();
        window.URL.createObjectURL = vi.fn(() => 'blob:http://localhost/dummy');
        window.URL.revokeObjectURL = vi.fn();
    });

    afterEach(() => {
        clickSpy.mockRestore();
        global.fetch = realFetch;
        window.URL.createObjectURL = realCreate;
        window.URL.revokeObjectURL = realRevoke;
    });

    it('успешно генерирует файл, скачивает его и показывает сообщение об успехе', async () => {
        const csvBlob = new Blob(['a,b,c'], { type: 'text/csv' });
        const headers = new Headers({
            'Content-Disposition': 'attachment; filename="report.csv"',
        });
        (global.fetch as any).mockResolvedValue({
            ok: true,
            headers,
            blob: () => Promise.resolve(csvBlob),
        });

        render(<GeneratePage />);
        const [btn] = screen.getAllByRole('button', { name: /Начать генерацию/i });

        await userEvent.click(btn);

        await waitFor(() =>
            expect(global.fetch).toHaveBeenCalledWith(`${API_HOST}/report?size=0.01`, { method: 'GET' })
        );

        expect(window.URL.createObjectURL).toHaveBeenCalledWith(csvBlob);
        expect(clickSpy).toHaveBeenCalled();

        expect(await screen.findByText('Отчёт успешно сгенерирован!')).toBeInTheDocument();

        expect(btn).not.toBeDisabled();
    });

    it('показывает ошибку, если fetch упал (сервер недоступен)', async () => {
        (global.fetch as any).mockRejectedValue(new Error('Failed to fetch'));

        render(<GeneratePage />);
        const [btn] = screen.getAllByRole('button', { name: /Начать генерацию/i });

        await userEvent.click(btn);

        expect(await screen.findByText(/Failed to fetch/)).toBeInTheDocument();

        expect(btn).not.toBeDisabled();
    });
});
