/**
 * Tests for FCFS (First-Come-First-Serve) Disk Scheduling Algorithm 
 */

const { fcfs, seekOperations } = require('../js-modules/fcfs');

describe('FCFS Disk Scheduling Algorithm', () => {
  
  test('Returns the array in the same order as requested', () => {
    const requests = [98, 183, 37, 122, 14, 124, 65, 67];
    const head = 53;
    
    const result = fcfs(requests, head);
    expect(result).toEqual([98, 183, 37, 122, 14, 124, 65, 67]);
  });
  
  test('Does not modify the original array', () => {
    const requests = [98, 183, 37, 122, 14, 124, 65, 67];
    const head = 53;
    const copyOfRequests = [...requests];
    
    fcfs(requests, head);
    expect(requests).toEqual(copyOfRequests);
  });
});

describe('Seek Operations Calculation', () => {
  
  test('Calculates correct seek time for FCFS with normal case', () => {
    const requestOrder = [98, 183, 37, 122, 14, 124, 65, 67];
    const head = 53;
    
    const result = seekOperations(requestOrder, head);
    // Expected: |53-98| + |98-183| + |183-37| + |37-122| + |122-14| + |14-124| + |124-65| + |65-67|
    // = 45 + 85 + 146 + 85 + 108 + 110 + 59 + 2 = 640
    expect(result).toBe(640);
  });
  
  test('Calculates correct seek time with head position same as first request', () => {
    const requestOrder = [53, 183, 37, 122, 14, 124, 65, 67];
    const head = 53;
    
    const result = seekOperations(requestOrder, head);
    // Expected: |53-53| + |53-183| + |183-37| + |37-122| + |122-14| + |14-124| + |124-65| + |65-67|
    // = 0 + 130 + 146 + 85 + 108 + 110 + 59 + 2 = 640
    expect(result).toBe(640);
  });
  
  test('Returns 0 for empty request array', () => {
    const requestOrder = [];
    const head = 53;
    
    const result = seekOperations(requestOrder, head);
    expect(result).toBe(0);
  });
  
  test('Returns 0 for single request at head position', () => {
    const requestOrder = [53];
    const head = 53;
    
    const result = seekOperations(requestOrder, head);
    expect(result).toBe(0);
  });
});

// Edge case tests
describe('FCFS Edge Cases', () => {
  
  test('Handles empty array', () => {
    const requests = [];
    const head = 53;
    
    const result = fcfs(requests, head);
    expect(result).toEqual([]);
  });
  
  test('Handles array with single request', () => {
    const requests = [100];
    const head = 53;
    
    const result = fcfs(requests, head);
    expect(result).toEqual([100]);
    
    const seekTime = seekOperations(result, head);
    expect(seekTime).toBe(47); // |53-100| = 47
  });
  
  test('Handles array with duplicate requests', () => {
    const requests = [100, 100, 50, 50];
    const head = 50;
    
    const result = fcfs(requests, head);
    expect(result).toEqual([100, 100, 50, 50]);
    
    const seekTime = seekOperations(result, head);
    expect(seekTime).toBe(100); // |50-100| + |100-100| + |100-50| + |50-50| = 50 + 0 + 50 + 0 = 100
  });
}); 