/**
 * CSCAN (Circular SCAN) Disk Scheduling Algorithm Module
 */

/**
 * Implements the CSCAN algorithm which services requests in one direction, 
 * jumps to the other end when reaching the end of disk, and continues in the same direction
 * @param {number[]} requests - Array of track requests 
 * @param {number} head - Initial head position
 * @param {string} direction - Direction of head movement ('left' or 'right')
 * @param {number} maxTrack - Maximum track number
 * @returns {number[]} - Array of track requests in CSCAN order
 */
function cscan(requests, head, direction, maxTrack) {
  let tr = [...requests];
  let requestOrder = [];
  
  // Handle empty array case
  if (tr.length === 0) {
    return [];
  }
  
  // Sort requests in ascending order
  tr.sort((a, b) => a - b);
  
  // Remove head position from requests if present
  if (tr.indexOf(head) !== -1) {
    tr.splice(tr.indexOf(head), 1);
  }

  // Handle case where all requests are removed (only head was in the array)
  if (tr.length === 0) {
    return [];
  }

  if (direction === "right") {
    // Find starting index (first request greater than head)
    let startIndex = 0;
    for (let i = 0; i < tr.length; i++) {
      if (tr[i] > head) {
        startIndex = i;
        break;
      }
    }
    
    // If no requests greater than head, all requests are to the left
    // In CSCAN, we'll process them all since we wrap around
    if (startIndex === 0 && tr[0] <= head) {
      return [...tr];
    }
    
    // Process requests to the right
    for (let i = startIndex; i < tr.length; i++) {
      requestOrder.push(tr[i]);
    }
    
    // Then process requests from the beginning
    for (let i = 0; i < startIndex; i++) {
      requestOrder.push(tr[i]);
    }
  } else if (direction === "left") {
    // Find starting index (last request smaller than head)
    let startIndex = tr.length - 1;
    for (let i = 0; i < tr.length; i++) {
      if (tr[i] > head) {
        startIndex = i - 1;
        break;
      }
    }
    
    // If no requests smaller than head, all requests are to the right
    // In CSCAN, we'll process them all in reverse order since we wrap around
    if (startIndex === -1) {
      for (let i = tr.length - 1; i >= 0; i--) {
        requestOrder.push(tr[i]);
      }
      return requestOrder;
    }
    
    // Process requests to the left
    for (let i = startIndex; i >= 0; i--) {
      requestOrder.push(tr[i]);
    }
    
    // Then process requests from the end
    for (let i = tr.length - 1; i > startIndex; i--) {
      requestOrder.push(tr[i]);
    }
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
  cscan,
  seekOperations,
  seekOperationsCalculations
};