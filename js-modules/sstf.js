/**
 * SSTF (Shortest Seek Time First) Disk Scheduling Algorithm Module
 */

/**
 * Implements the SSTF algorithm which chooses the pending request closest to current head position
 * @param {number[]} requests - Array of track requests 
 * @param {number} head - Initial head position
 * @returns {number[]} - Array of track requests in SSTF order
 */
function sstf(requests, head) {
  // Handle empty array
  if (!requests || requests.length === 0) {
    return [];
  }
  
  let tr = [...requests];
  let requestOrder = [];
  let currentHead = head;
  
  // Process requests until none left
  while (tr.length > 0) {
    // Calculate distance from current head to each remaining request
    let distances = [];
    for (let i = 0; i < tr.length; i++) {
      distances[i] = Math.abs(tr[i] - currentHead);
    }
    
    // Find the minimum distance
    let min = Math.min(...distances);
    let index = distances.indexOf(min);
    
    // Update current head position
    currentHead = tr[index];
    
    // Add the chosen track to the result
    requestOrder.push(tr[index]);
    
    // Remove the processed track from the list
    tr.splice(index, 1);
  }
  
  return requestOrder;
}

/**
 * Calculates the total seek operations for given request order and head position
 * @param {number[]} requestOrder - Array of track requests in order of processing
 * @param {number} headPos - Initial head position
 * @returns {number} - Total seek time (number of tracks moved)
 */
function seekOperations(requestOrder, headPos) {
  // Handle empty array
  if (!requestOrder || requestOrder.length === 0) {
    return 0;
  }
  
  let seekTime = 0;
  seekTime += Math.abs(headPos - requestOrder[0]);
  for (let i = 0; i < requestOrder.length - 1; i++) {
    seekTime += Math.abs(requestOrder[i + 1] - requestOrder[i]);
  }
  return seekTime;
}

/**
 * Generates calculations string showing how seek time was calculated
 * @param {number[]} requestOrder - Array of track requests in order of processing
 * @param {number} headPos - Initial head position
 * @returns {string} - String representation of calculations
 */
function seekOperationsCalculations(requestOrder, headPos) {
  // Handle empty array
  if (!requestOrder || requestOrder.length === 0) {
    return '';
  }
  
  let calc = '';
  for (let i = 0; i < requestOrder.length; i++) {
    if (i === 0) {
      calc += '|' + headPos + '-' + requestOrder[i] + '|';
    } else {
      calc += ' + ' + '|' + requestOrder[i - 1] + '-' + requestOrder[i] + '|';
    }
  }
  return calc;
}

module.exports = {
  sstf,
  seekOperations,
  seekOperationsCalculations
};