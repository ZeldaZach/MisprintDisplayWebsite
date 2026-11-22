import { renderHook, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { SortProvider, useSort } from '../SortContext';
import { ReactNode } from 'react';

describe('SortContext', () => {
  const wrapper = ({ children }: { children: ReactNode }) => (
    <SortProvider>{children}</SortProvider>
  );

  describe('SortProvider', () => {
    it('should provide default sort state', () => {
      const { result } = renderHook(() => useSort(), { wrapper });

      expect(result.current.sortState).toEqual({
        key: 'ArrivalDate',
        direction: 'DESC',
        maxImageWidth: 'large',
      });
    });

    it('should update sort state', () => {
      const { result } = renderHook(() => useSort(), { wrapper });

      act(() => {
        result.current.setSortState({
          key: 'PrimaryCardName',
          direction: 'ASC',
          maxImageWidth: '300px',
        });
      });

      expect(result.current.sortState).toEqual({
        key: 'PrimaryCardName',
        direction: 'ASC',
        maxImageWidth: '300px',
      });
    });

    it('should update sort state using function updater', () => {
      const { result } = renderHook(() => useSort(), { wrapper });

      act(() => {
        result.current.setSortState((prev) => ({
          ...prev,
          direction: 'ASC',
        }));
      });

      expect(result.current.sortState.direction).toBe('ASC');
      expect(result.current.sortState.key).toBe('ArrivalDate');
      expect(result.current.sortState.maxImageWidth).toBe('large');
    });

    it('should update multiple fields independently', () => {
      const { result } = renderHook(() => useSort(), { wrapper });

      act(() => {
        result.current.setSortState((prev) => ({
          ...prev,
          maxImageWidth: '750px',
        }));
      });

      expect(result.current.sortState.maxImageWidth).toBe('750px');

      act(() => {
        result.current.setSortState((prev) => ({
          ...prev,
          key: 'SetCode',
        }));
      });

      expect(result.current.sortState.key).toBe('SetCode');
      expect(result.current.sortState.maxImageWidth).toBe('750px');
    });

    it('should update filterString field', () => {
      const { result } = renderHook(() => useSort(), { wrapper });

      act(() => {
        result.current.setSortState((prev) => ({
          ...prev,
          filterString: 'test search',
        }));
      });

      expect(result.current.sortState.filterString).toBe('test search');
    });
  });

  describe('useSort hook', () => {
    it('should throw error when used outside provider', () => {
      // Suppress console.error for this test
      const originalError = console.error;
      console.error = () => {};

      expect(() => {
        renderHook(() => useSort());
      }).toThrow('useSort must be used within SortProvider');

      console.error = originalError;
    });

    it('should return context value with sortState and setSortState', () => {
      const { result } = renderHook(() => useSort(), { wrapper });

      expect(result.current).toHaveProperty('sortState');
      expect(result.current).toHaveProperty('setSortState');
      expect(typeof result.current.setSortState).toBe('function');
    });

    it('should maintain referential equality when state does not change', () => {
      const { result, rerender } = renderHook(() => useSort(), { wrapper });

      const firstRender = result.current;
      rerender();
      const secondRender = result.current;

      // setSortState should be the same reference
      expect(firstRender.setSortState).toBe(secondRender.setSortState);
    });

    it('should create new value object when state changes', () => {
      const { result } = renderHook(() => useSort(), { wrapper });

      const firstValue = result.current;

      act(() => {
        result.current.setSortState((prev) => ({
          ...prev,
          direction: 'ASC',
        }));
      });

      const secondValue = result.current;

      // Value object should be new
      expect(firstValue).not.toBe(secondValue);
      // But setSortState should be same
      expect(firstValue.setSortState).toBe(secondValue.setSortState);
    });
  });

  describe('SortProvider integration', () => {
    it('should allow multiple updates in sequence', () => {
      const { result } = renderHook(() => useSort(), { wrapper });

      act(() => {
        result.current.setSortState({ key: 'PrimaryCardName', direction: 'ASC', maxImageWidth: '300px' });
      });

      act(() => {
        result.current.setSortState((prev) => ({ ...prev, direction: 'DESC' }));
      });

      act(() => {
        result.current.setSortState((prev) => ({ ...prev, filterString: 'test' }));
      });

      expect(result.current.sortState).toEqual({
        key: 'PrimaryCardName',
        direction: 'DESC',
        maxImageWidth: '300px',
        filterString: 'test',
      });
    });
  });
});
