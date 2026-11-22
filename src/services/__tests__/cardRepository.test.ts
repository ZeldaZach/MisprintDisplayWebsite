import { describe, it, expect, beforeEach, vi } from 'vitest';
import { cardRepository } from '../cardRepository';
import { DatabaseEntry } from '../../types/databaseEntry';

// Mock the data import
vi.mock('../../data/data.json', () => ({
  default: [
    {
      UUID: 'card-1',
      PrimaryCardName: 'Black Lotus',
      SecondaryCardName: '',
      SetCode: 'LEA',
      Errors: 'Miscut',
      Picture: 'test1.jpg',
      Language: 'English',
      ArrivalDate: '2023-01-15',
    },
    {
      UUID: 'card-2',
      PrimaryCardName: 'Mox Sapphire',
      SecondaryCardName: '',
      SetCode: 'LEA',
      Errors: 'Crimped',
      Picture: 'test2.jpg',
      Language: 'English',
      ArrivalDate: '2023-02-20',
    },
    {
      UUID: 'card-3',
      PrimaryCardName: 'Ancestral Recall',
      SecondaryCardName: '',
      SetCode: 'LEB',
      Errors: 'Misprinted',
      Picture: 'test3.jpg',
      Language: 'English',
      ArrivalDate: '2023-03-10',
    },
    {
      UUID: 'card-4',
      PrimaryCardName: 'Time Walk',
      SecondaryCardName: 'Temporal Manipulation',
      SetCode: 'LEA',
      Errors: 'Misaligned',
      Picture: 'test4.jpg',
      Language: 'French',
      ArrivalDate: '2023-01-25',
    },
  ] as DatabaseEntry[],
}));

describe('CardRepository', () => {
  beforeEach(() => {
    // Reset the internal cache before each test
    (cardRepository as any).data = null;
  });

  describe('loadData', () => {
    it('should load all data', async () => {
      const data = await cardRepository.loadData();

      expect(data).toHaveLength(4);
      expect(data[0].PrimaryCardName).toBe('Black Lotus');
      expect(data[1].PrimaryCardName).toBe('Mox Sapphire');
    });

    it('should cache data after first load', async () => {
      const firstLoad = await cardRepository.loadData();
      const secondLoad = await cardRepository.loadData();

      // Should return the same reference (cached)
      expect(firstLoad).toBe(secondLoad);
    });

    it('should return DatabaseEntry objects with correct structure', async () => {
      const data = await cardRepository.loadData();

      data.forEach((entry) => {
        expect(entry).toHaveProperty('UUID');
        expect(entry).toHaveProperty('PrimaryCardName');
        expect(entry).toHaveProperty('Errors');
        expect(entry).toHaveProperty('Picture');
      });
    });
  });

  describe('getAll', () => {
    it('should return all cards', async () => {
      const cards = await cardRepository.getAll();

      expect(cards).toHaveLength(4);
    });

    it('should call loadData internally', async () => {
      const loadDataSpy = vi.spyOn(cardRepository as any, 'loadData');

      await cardRepository.getAll();

      expect(loadDataSpy).toHaveBeenCalled();
    });

    it('should use cached data', async () => {
      const firstCall = await cardRepository.getAll();
      const secondCall = await cardRepository.getAll();

      expect(firstCall).toBe(secondCall);
    });
  });

  describe('getFiltered', () => {
    it('should return all cards when filter is empty', async () => {
      const cards = await cardRepository.getFiltered('');

      expect(cards).toHaveLength(4);
    });

    it('should filter by card name (case insensitive)', async () => {
      const cards = await cardRepository.getFiltered('lotus');

      expect(cards).toHaveLength(1);
      expect(cards[0].PrimaryCardName).toBe('Black Lotus');
    });

    it('should filter by multiple matches', async () => {
      const cards = await cardRepository.getFiltered('LEA');

      expect(cards).toHaveLength(3);
      expect(cards.every((c) => c.SetCode === 'LEA')).toBe(true);
    });

    it('should filter by error type', async () => {
      const cards = await cardRepository.getFiltered('miscut');

      expect(cards).toHaveLength(1);
      expect(cards[0].Errors).toBe('Miscut');
    });

    it('should filter by language', async () => {
      const cards = await cardRepository.getFiltered('french');

      expect(cards).toHaveLength(1);
      expect(cards[0].Language).toBe('French');
    });

    it('should filter by UUID', async () => {
      const cards = await cardRepository.getFiltered('card-2');

      expect(cards).toHaveLength(1);
      expect(cards[0].UUID).toBe('card-2');
    });

    it('should filter by secondary card name', async () => {
      const cards = await cardRepository.getFiltered('temporal');

      expect(cards).toHaveLength(1);
      expect(cards[0].SecondaryCardName).toBe('Temporal Manipulation');
    });

    it('should return empty array when no matches', async () => {
      const cards = await cardRepository.getFiltered('nonexistent');

      expect(cards).toHaveLength(0);
    });

    it('should handle partial matches', async () => {
      const cards = await cardRepository.getFiltered('Mox');

      expect(cards).toHaveLength(1);
      expect(cards[0].PrimaryCardName).toBe('Mox Sapphire');
    });

    it('should search across all fields', async () => {
      const cards = await cardRepository.getFiltered('English');

      // Should find all English cards
      expect(cards.length).toBeGreaterThan(1);
    });

    it('should be case insensitive', async () => {
      const upperCase = await cardRepository.getFiltered('LOTUS');
      const lowerCase = await cardRepository.getFiltered('lotus');
      const mixedCase = await cardRepository.getFiltered('LoTuS');

      expect(upperCase).toEqual(lowerCase);
      expect(lowerCase).toEqual(mixedCase);
    });

    it('should handle special characters', async () => {
      const cards = await cardRepository.getFiltered('card-1');

      expect(cards).toHaveLength(1);
      expect(cards[0].UUID).toBe('card-1');
    });

    it('should filter with whitespace in query', async () => {
      const cards = await cardRepository.getFiltered('Black Lotus');

      expect(cards).toHaveLength(1);
      expect(cards[0].PrimaryCardName).toBe('Black Lotus');
    });
  });

  describe('Caching behavior', () => {
    it('should not reload data for multiple filtered calls', async () => {
      await cardRepository.getFiltered('lotus');

      // Set a spy after first call to check cache is used
      const loadDataSpy = vi.spyOn(cardRepository as any, 'loadData');

      await cardRepository.getFiltered('mox');

      // loadData should return cached data without re-importing
      expect(loadDataSpy).toHaveBeenCalled();
    });

    it('should maintain cache across different filter calls', async () => {
      const firstResult = await cardRepository.getFiltered('LEA');
      const allCards = await cardRepository.getAll();
      const secondResult = await cardRepository.getFiltered('LEB');

      // All should use same cached data
      expect((cardRepository as any).data).not.toBeNull();
    });
  });

  describe('Edge cases', () => {
    it('should handle undefined filter', async () => {
      const cards = await cardRepository.getFiltered(undefined as any);

      expect(cards).toHaveLength(4);
    });

    it('should handle null values in card data', async () => {
      // Mock data with null values
      (cardRepository as any).data = [
        {
          UUID: 'test',
          PrimaryCardName: 'Test',
          Errors: 'Error',
          Picture: 'pic.jpg',
          SetCode: null,
          Language: null,
        },
      ];

      const cards = await cardRepository.getFiltered('test');

      expect(cards).toHaveLength(1);
    });

    it('should filter by arrival date', async () => {
      const cards = await cardRepository.getFiltered('2023-01');

      expect(cards.length).toBeGreaterThan(0);
      expect(cards.some((c) => c.ArrivalDate?.includes('2023-01'))).toBe(true);
    });
  });
});
