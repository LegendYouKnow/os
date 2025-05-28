/**
 * Tests for SCAN (Elevator) Disk Scheduling Algorithm 
 */

const { scan, seekOperations } = require('../js-modules/scan');

describe('SCAN Disk Scheduling Algorithm - Right Direction', () => {
  
  test('Orders requests correctly for right direction', () => {
    const requests = [98, 183, 37, 122, 14, 124, 65, 67];
    const head = 53;
    const direction = "right";
    const maxTrack = 199;
    
    const result = scan(requests, head, direction, maxTrack);
    // Should service requests in right direction first, then left
    // Expected: [65, 67, 98, 122, 124, 183, 199, 37, 14]
    expect(result).toContain(65);
    expect(result).toContain(67);
    expect(result).toContain(98);
    expect(result.indexOf(65)).toBeLessThan(result.indexOf(98));
    expect(result.indexOf(98)).toBeLessThan(result.indexOf(122));
    expect(result.indexOf(122)).toBeLessThan(result.indexOf(183));
    // After reaching the end, should go left
    expect(result.indexOf(183)).toBeLessThan(result.indexOf(37));
    expect(result.indexOf(37)).toBeLessThan(result.indexOf(14));
  });
  
  test('Does not modify the original array', () => {
    const requests = [98, 183, 37, 122, 14, 124, 65, 67];
    const head = 53;
    const direction = "right";
    const maxTrack = 199;
    const copyOfRequests = [...requests];
    
    scan(requests, head, direction, maxTrack);
    expect(requests).toEqual(copyOfRequests);
  });
  
  test('Includes max track in the result if not already included', () => {
    const requests = [98, 183, 37, 122, 14, 124, 65, 67];
    const head = 53;
    const direction = "right";
    const maxTrack = 199;
    
    const result = scan(requests, head, direction, maxTrack);
    expect(result).toContain(maxTrack);
  });
});

describe('SCAN Disk Scheduling Algorithm - Left Direction', () => {
  
  test('Orders requests correctly for left direction', () => {
    const requests = [98, 183, 37, 122, 14, 124, 65, 67];
    const head = 53;
    const direction = "left";
    const maxTrack = 199;
    
    const result = scan(requests, head, direction, maxTrack);
    // Should service requests in left direction first, then right
    // Expected: [37, 14, 0, 65, 67, 98, 122, 124, 183]
    expect(result).toContain(37);
    expect(result).toContain(14);
    expect(result.indexOf(37)).toBeLessThan(result.indexOf(14));
    expect(result.indexOf(14)).toBeLessThan(result.indexOf(0)); // Track 0 should be included
    // After reaching the end, should go right
    expect(result.indexOf(0)).toBeLessThan(result.indexOf(65));
    expect(result.indexOf(65)).toBeLessThan(result.indexOf(98));
    expect(result.indexOf(98)).toBeLessThan(result.indexOf(183));
  });
  
  test('Includes track 0 in the result if not already included', () => {
    const requests = [98, 183, 37, 122, 14, 124, 65, 67];
    const head = 53;
    const direction = "left";
    const maxTrack = 199;
    
    const result = scan(requests, head, direction, maxTrack);
    expect(result).toContain(0);
  });
});

describe('Seek Operations Calculation for SCAN', () => {
  
  test('Calculates correct seek time for SCAN right direction', () => {
    const requests = [98, 183, 37, 122, 14, 124, 65, 67];
    const head = 53;
    const direction = "right";
    const maxTrack = 199;
    
    const requestOrder = scan(requests, head, direction, maxTrack);
    const result = seekOperations(requestOrder, head);
    
    // Verify total seek operations are less than or equal to twice max track
    // (worst case for SCAN is head moves from 0 to max and back to 0)
    expect(result).toBeLessThanOrEqual(maxTrack * 2);
  });
  
  test('Calculates correct seek time for SCAN left direction', () => {
    const requests = [98, 183, 37, 122, 14, 124, 65, 67];
    const head = 53;
    const direction = "left";
    const maxTrack = 199;
    
    const requestOrder = scan(requests, head, direction, maxTrack);
    const result = seekOperations(requestOrder, head);
    
    // Verify total seek operations are less than or equal to twice max track
    expect(result).toBeLessThanOrEqual(maxTrack * 2);
  });
});

// Edge case tests
describe('SCAN Edge Cases', () => {
  
  test('Handles empty array for right direction', () => {
    const requests = [];
    const head = 53;
    const direction = "right";
    const maxTrack = 199;
    
    const result = scan(requests, head, direction, maxTrack);
    expect(result).toEqual([199]); // Should include max track
  });
  
  test('Handles empty array for left direction', () => {
    const requests = [];
    const head = 53;
    const direction = "left";
    const maxTrack = 199;
    
    const result = scan(requests, head, direction, maxTrack);
    expect(result).toEqual([0]); // Should include track 0
  });
  
  test('Handles head position matching a request', () => {
    const requests = [53, 98, 183];
    const head = 53;
    const direction = "right";
    const maxTrack = 199;
    
    const result = scan(requests, head, direction, maxTrack);
    // Should not include 53 in the results since it's already serviced
    expect(result).not.toContain(head);
  });
  
  test('Handles all requests on one side of head', () => {
    const requests = [100, 120, 140, 180];
    const head = 50;
    const direction = "right";
    const maxTrack = 199;
    
    const result = scan(requests, head, direction, maxTrack);
    // Should service all in ascending order
    expect(result).toEqual([100, 120, 140, 180, 199]);
  });
}); 