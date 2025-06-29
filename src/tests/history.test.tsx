import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import * as historyUtil from '@utils/storage';
import type { HistoryItemType } from '@app-types/history';
import { STORAGE_KEY } from '@utils/consts';

describe('history util', () => {
    beforeEach(() => {
        const store: Record<string, string> = {};

        vi.stubGlobal('localStorage', {
            getItem: (key: string) => store[key] ?? null,
            setItem: (key: string, value: string) => {
                store[key] = value;
            },
            removeItem: (key: string) => {
                delete store[key];
            },
            clear: () => {
                Object.keys(store).forEach((k) => delete store[k]);
            },
        });

        vi.stubGlobal('crypto', { randomUUID: () => 'uuid-1234' });
        vi.spyOn(Date, 'now').mockReturnValue(1_650_000_000_000);
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('getHistory возвращает пустой массив, если в хранилище ничего нет', () => {
        expect(historyUtil.getHistory()).toEqual([]);
    });

    it('getHistory правильно парсит существующую строку JSON', () => {
        const arr: HistoryItemType[] = [{ id: 'x', timestamp: 1, foo: 'bar' } as any];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(arr));
        expect(historyUtil.getHistory()).toEqual(arr);
    });

    it('getHistory обрабатывает некорректный JSON и возвращает []', () => {
        localStorage.setItem(STORAGE_KEY, 'not-json');
        expect(historyUtil.getHistory()).toEqual([]);
    });

    it('addToHistory добавляет новый элемент в начало стораж и возвращает его', () => {
        const payload: Omit<HistoryItemType, 'id' | 'timestamp'> = {
            fileName: 'test.txt',
        };
        const newItem = historyUtil.addToHistory(payload);

        expect(newItem).toEqual({
            ...payload,
            id: 'uuid-1234',
            timestamp: 1_650_000_000_000,
        });

        const stored = JSON.parse(localStorage.getItem(STORAGE_KEY)!);
        expect(stored).toEqual([newItem]);
    });

    it('addToHistory дописывает к уже существующей истории, ставя новый элемент вперед', () => {
        const existing: HistoryItemType = {
            id: 'old',
            timestamp: 1,
            fileName: 'old.csv',
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify([existing]));

        const newItem = historyUtil.addToHistory({ foo: 'new' } as any);
        const stored = JSON.parse(localStorage.getItem(STORAGE_KEY)!);

        expect(stored).toEqual([newItem, existing]);
    });

    it('removeFromHistory убирает элемент с указанным id', () => {
        const a: HistoryItemType = {
            id: 'a',
            timestamp: 1,
            fileName: 'a.csv',
        };
        const b: HistoryItemType = {
            id: 'b',
            timestamp: 2,
            fileName: 'b.csv',
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify([a, b]));

        historyUtil.removeFromHistory('a');
        const stored = JSON.parse(localStorage.getItem(STORAGE_KEY)!);
        expect(stored).toEqual([b]);
    });

    it('clearHistory удаляет ключ из localStorage', () => {
        localStorage.setItem(STORAGE_KEY, 'anything');
        historyUtil.clearHistory();
        expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
    });
});
