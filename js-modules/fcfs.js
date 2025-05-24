/**
 * FCFS (First-Come-First-Serve) Disk Scheduling Algorithm Module
 */

/**
 * Implements the FCFS algorithm which processes requests in the order they arrive
 * @param {number[]} requests - Array of track requests 
 * @param {number} head - Initial head position
 * @returns {number[]} - Array of track requests in FCFS order
 */
function fcfs(requests, head) {
  // FCFS simply takes requests in the order they appear
  return [...requests];
}

/**
 * Calculates the total seek operations for given request order and head position
 * @param {number[]} requestOrder - Array of track requests in order of processing
 * @param {number} headPos - Initial head position
 * @returns {number} - Total seek time (number of tracks moved)
 */
function seekOperations(requestOrder, headPos) {
  // Handle empty array case
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
  // Handle empty array case
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
  fcfs,
  seekOperations,
  seekOperationsCalculations
}; 