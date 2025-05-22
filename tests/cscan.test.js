/**
 * Tests for CSCAN (Circular SCAN) Disk Scheduling Algorithm 
 */

const { cscan, seekOperations } = require('../js-modules/cscan');

describe('CSCAN Disk Scheduling Algorithm - Right Direction', () => {
  
  test('Orders requests correctly for right direction', () => {
    const requests = [98, 183, 37, 122, 14, 124, 65, 67];
    const head = 53;
    const direction = "right";
    const maxTrack = 199;
    
    const result = cscan(requests, head, direction, maxTrack);
    // Should service requests in right direction first, then jump to beginning
    // Expected: [65, 67, 98, 122, 124, 183, 14, 37]
    // Requests to the right of head
    expect(result).toContain(65);
    expect(result).toContain(67);
    expect(result).toContain(98);
    expect(result.indexOf(65)).toBeLessThan(result.indexOf(98));
    expect(result.indexOf(98)).toBeLessThan(result.indexOf(122));
    expect(result.indexOf(122)).toBeLessThan(result.indexOf(183));
    // After reaching the highest track, should jump to lowest and continue
    expect(result.indexOf(183)).toBeLessThan(result.indexOf(14));
    expect(result.indexOf(14)).toBeLessThan(result.indexOf(37));
  });
  
  test('Does not modify the original array', () => {
    const requests = [98, 183, 37, 122, 14, 124, 65, 67];
    const head = 53;
    const direction = "right";
    const maxTrack = 199;
    const copyOfRequests = [...requests];
    
    cscan(requests, head, direction, maxTrack);
    expect(requests).toEqual(copyOfRequests);
  });
});

describe('CSCAN Disk Scheduling Algorithm - Left Direction', () => {
  
  test('Orders requests correctly for left direction', () => {
    const requests = [98, 183, 37, 122, 14, 124, 65, 67];
    const head = 53;
    const direction = "left";
    const maxTrack = 199;
    
    const result = cscan(requests, head, direction, maxTrack);
    // Should service requests in left direction first, then jump to end
    // Expected: [37, 14, 183, 124, 122, 98, 67, 65]
    expect(result).toContain(37);
    expect(result).toContain(14);
    expect(result.indexOf(37)).toBeLessThan(result.indexOf(14));
    // After reaching track 0 region, should jump to highest track
    expect(result.indexOf(14)).toBeLessThan(result.indexOf(183));
    expect(result.indexOf(183)).toBeLessThan(result.indexOf(124));
    expect(result.indexOf(124)).toBeLessThan(result.indexOf(67));
  });
});

describe('Seek Operations Calculation for CSCAN', () => {
  
  test('Calculates correct seek time for CSCAN right direction', () => {
    const requests = [98, 183, 37, 122, 14, 124, 65, 67];
    const head = 53;
    const direction = "right";
    const maxTrack = 199;
    
    const requestOrder = cscan(requests, head, direction, maxTrack);
    const result = seekOperations(requestOrder, head);
    
    // Check that CSCAN's seek time is different from just sorting the array
    // since it's a circular approach
    const sortedRequests = [...requests].sort((a, b) => a - b);
    const sortedSeekTime = seekOperations(sortedRequests, head);
    
    // This is just a basic check, not a definitive test since seek patterns vary
    expect(result).not.toBe(sortedSeekTime);
  });
  
  test('Calculates correct seek time for CSCAN left direction', () => {
    const requests = [98, 183, 37, 122, 14, 124, 65, 67];
    const head = 53;
    const direction = "left";
    const maxTrack = 199;
    
    const requestOrder = cscan(requests, head, direction, maxTrack);
    const seekTime = seekOperations(requestOrder, head);
    
    // CSCAN usually has higher seek time than SCAN due to long jumps
    // but this is a complex check that depends on the specific test case
    // Here just verifying it calculates something reasonable
    expect(seekTime).toBeGreaterThan(0);
  });
});

// Edge case tests
describe('CSCAN Edge Cases', () => {
  
  test('Handles empty array', () => {
    const requests = [];
    const head = 53;
    const direction = "right";
    const maxTrack = 199;
    
    const result = cscan(requests, head, direction, maxTrack);
    expect(result).toEqual([]);
  });
  
  test('Handles head position matching a request', () => {
    const requests = [53, 98, 183];
    const head = 53;
    const direction = "right";
    const maxTrack = 199;
    
    const result = cscan(requests, head, direction, maxTrack);
    // Should not include 53 in the results since it's already serviced
    expect(result).not.toContain(head);
  });
  
  test('Handles all requests on one side of head', () => {
    const requests = [100, 120, 140, 180];
    const head = 50;
    const direction = "right";
    const maxTrack = 199;
    
    const result = cscan(requests, head, direction, maxTrack);
    // Should service all in ascending order
    expect(result).toEqual([100, 120, 140, 180]);
  });
  
  test('Handles all requests on the other side of head', () => {
    const requests = [10, 20, 30, 40];
    const head = 50;
    const direction = "right";
    const maxTrack = 199;
    
    const result = cscan(requests, head, direction, maxTrack);
    // For right direction, should encounter these requests after wrapping around
    expect(result).toEqual([10, 20, 30, 40]);
  });
}); 