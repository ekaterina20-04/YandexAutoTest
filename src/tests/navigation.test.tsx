/**
 * @vitest-environment jsdom
 */

import { describe, it, expect } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Navigation } from '@components/Header/Navigation';

describe('Navigation', () => {
    it('рендерит три пункта меню с правильными href и заголовками', () => {
        render(
            <MemoryRouter>
                <Navigation />
            </MemoryRouter>
        );

        const links = screen.getAllByRole('link');
        expect(links).toHaveLength(3);

        const homeLink = screen.getByRole('link', { name: 'CSV Аналитик' });
        expect(homeLink).toBeInTheDocument();
        expect(homeLink).toHaveAttribute('href', '/');

        const genLink = screen.getByRole('link', { name: 'CSV Генератор' });
        expect(genLink).toBeInTheDocument();
        expect(genLink).toHaveAttribute('href', '/generate');

        const historyLink = screen.getByRole('link', { name: 'История' });
        expect(historyLink).toBeInTheDocument();
        expect(historyLink).toHaveAttribute('href', '/history');
    });
});
