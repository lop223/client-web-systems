import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, beforeEach } from 'vitest';
import useLocalStorage from '../hooks/useLocalStorage';

describe('useLocalStorage', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('reads the initial value and persists updates', () => {
    const { result } = renderHook(() => useLocalStorage('settings', { theme: 'light' }));

    expect(result.current[0]).toEqual({ theme: 'light' });
    act(() => result.current[1]({ theme: 'dark' }));

    expect(JSON.parse(window.localStorage.getItem('settings') ?? '{}')).toEqual({
      theme: 'dark',
    });
  });
});
