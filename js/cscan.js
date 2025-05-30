
var popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
var popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
    return new bootstrap.Popover(popoverTriggerEl)
});

var alertList = document.querySelectorAll('.alert')
alertList.forEach(function (alert) {
    new bootstrap.Alert(alert)
});


// GETTING ALL VARIABLES AND INPUTS

document.getElementById("chart-image").classList.toggle("show-element");
var ctx = document.getElementById("chart").getContext("2d");
var requests = document.getElementById("requests");
var maxTrack = document.getElementById("max-track");
var headPosition = document.getElementById("head");
var tracks = document.getElementById("tracks");
var run = document.getElementById("run");
run.classList.toggle("disabled");
var dir = document.getElementById("direction");
var yrange = 0, head = 0, xrange = 0;
var xlabel = [], ylabel=[];
var fisrtTime = true;
var algoChart = new Chart(ctx, {});
var trackRequests;

//FUNCITON THAT RETURNS THE SCAN ARRAY

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

// FUCNTION TO CALCULATE SEEK OPERATIONS

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

function execute() {

    document.getElementById("alert-wrapper").innerHTML = ``;
    document.getElementById("chart-image").style.display = "flex";
    document.getElementById("chart-container").style.display = "none";

    let allOk = true;
    var str = '';
    if(requests.value === ''){
        str = 'Number of requests cannot be left blank!';
        document.getElementById("alert-wrapper").innerHTML = `
        <div class="alert alert-danger alert-dismissible fade show" role="alert" style="margin: 15px;">
            <strong>Warning!</strong> ${str}
                    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>`;
        allOk = false;
    }
    if(Number(requests.value) <= 0 && allOk){
        str = 'The number of request should be greater than 0!';
        document.getElementById("alert-wrapper").innerHTML = `
        <div class="alert alert-danger alert-dismissible fade show" role="alert" style="margin: 15px;">
            <strong>Warning!</strong> ${str}
                    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>`;
        allOk = false;
    }
    if(maxTrack.value === '' && allOk){
        str = 'Maximum number of tracks cannot be left blank!';
        document.getElementById("alert-wrapper").innerHTML = `
        <div class="alert alert-danger alert-dismissible fade show" role="alert" style="margin: 15px;">
            <strong>Warning!</strong> ${str}
                    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>`;
        allOk = false;
    }
    if(Number(maxTrack.value) <= 0 && allOk){
        str = 'Maximum number of tracks should be greater than 0!';
        document.getElementById("alert-wrapper").innerHTML = `
        <div class="alert alert-danger alert-dismissible fade show" role="alert" style="margin: 15px;">
            <strong>Warning!</strong> ${str}
                    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>`;
        allOk = false;
    }
    if(headPosition.value === '' && allOk){
        str = 'The starting head position needs to be mentioned! It cannot be left blank.'
        document.getElementById("alert-wrapper").innerHTML = `
        <div class="alert alert-danger alert-dismissible fade show" role="alert" style="margin: 15px;">
            <strong>Warning!</strong> ${str}
                    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>`;
        allOk = false;
    }
    if((Number(headPosition.value) < 0 || Number(headPosition.value) > Number(maxTrack.value)) && allOk){
        str = 'The starting head position of must lie between 0 and maximum track number.';
        document.getElementById("alert-wrapper").innerHTML = `
        <div class="alert alert-danger alert-dismissible fade show" role="alert" style="margin: 15px;">
            <strong>Warning!</strong> ${str}
                    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>`;
        allOk = false;
    }

    trackRequests = [];
    if ((tracks.value.split('')).indexOf(',') === -1) {
        trackRequests = (tracks.value.split(' ')).map(Number);
    }
    else {
        trackRequests = (tracks.value.split(',')).map(Number);
    }

    trackRequests.forEach( (x) => {
        if(x< 0 || x> Number(maxTrack.value) && allOk){
            str = 'All the track requests must lie between 0 and maximum track number.';
            document.getElementById("alert-wrapper").innerHTML = `
            <div class="alert alert-danger alert-dismissible fade show" role="alert" style="margin: 15px;">
                <strong>Warning!</strong> ${str}
                        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>`;
            allOk = false;
        }
    });

    if(trackRequests.length != Number(requests.value)){
        str = 'Please make sure that the number of track requests in the array match the total number of requests.';
        document.getElementById("alert-wrapper").innerHTML = `
        <div class="alert alert-danger alert-dismissible fade show" role="alert" style="margin: 15px;">
            <strong>Warning!</strong> ${str}
                    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>`;
        allOk = false;
    }

    if (allOk) {
        run.classList.toggle("disabled");
        
        head = Number(headPosition.value);
        xrange = Number(maxTrack.value);

        // CALLING THE REQUIRED FUNCTION FOR GETTING THE FINAL ARRAY
        trackRequests.push(0); trackRequests.push(xrange);
        trackRequests = [...new Set(trackRequests)];
        yrange = Number(trackRequests.length);
        trackRequests = cscan(trackRequests, head, String(dir.value), xrange);
        yrange = Number(trackRequests.length);

        for (var i = 0; i <= xrange; i++) {
            xlabel[i] = i;
        }
        for (i = 0; i <= yrange; i++) {
            ylabel[i] = i;
        }

        // FOR HIDING THE IMAGE AND DISPLAYING THE IMAGE
        document.getElementById("chart-image").style.display = "none";
        document.getElementById("chart-container").style.display = "block";

        // FOR PROGRESS BAR
        document.getElementById('seek').style.width = '100%'; 
        var progressWrapper = document.getElementById("seek");
        progressWrapper.innerHTML = 
            `<div id="progressBarContainer" class="progress animate__animated animate__backInUp">
                <div id="progressBar" class="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" style="width: 0%" aria-valuenow="50" aria-valuemin="0" aria-valuemax="100"></div>
            </div>`;
        
        document.getElementById("dImageIcon").innerHTML = `<a id="url"></a>`;
        document.getElementById("dPDFIcon").innerHTML = `<a id="genPDF"></a>`; 
        document.getElementById("download-buttons").style.display = 'none';

        var progressBar = document.getElementById("progressBar");
        var progressBarContainer = document.getElementById("progressBarContainer");

        // FOR DOWNLOAD BUTTON
        function done() {
            let dbut = document.getElementById("download-buttons");
            dbut.style.display = 'flex';
            dbut.style.flexDirection = 'row';
            dbut.style.width = 'fit-content';
            var ImageURL;
            var url = algoChart.toBase64Image();
            document.getElementById("url").href = url;

            // CONVERTING BASE64 URL TO DATAURL FOR PDF
            var imgw, imgh;
            var imgurl = new Image();
            imgurl.onload = function(){
                imgw = imgurl.width;
                imgh = imgurl.height;
                var canvas = document.createElement("canvas");
                canvas.width = imgw;
                canvas.height = imgh;

                var ctx2 = canvas.getContext("2d");
                ctx2.fillStyle="#FFFFFF";
                ctx2.fillRect(0, 0, canvas.width, canvas.height);
                ctx2.drawImage(this, 0, 0, imgw, imgh);
                ImageURL = canvas.toDataURL("image/png", 1);
            }
            imgurl.src = url;

            // NEW CODE TO BE ADDED IN OTHER JS FILES 
            var genPDF = document.getElementById("genPDF");
            genPDF.addEventListener('click', () => {
                var doc = new jsPDF('p', 'mm', 'a4');
                doc.setFontSize(25);
                doc.setFont('times', 'bold', '100');


                doc.text("CSCAN Algorithm", (doc.internal.pageSize.width/2), 18, 'center');
                doc.line(0,30,doc.internal.pageSize.width,30,'S');

                // GIVEN INFORMATION
                doc.setFontSize(14);
                doc.text('Given Information', 10, 40);
                doc.setFontSize(12);
                doc.setFont('times', 'normal', 'normal');
                doc.text('Number of track requests: '+ requests.value, 20, 50);
                doc.text('Total number of tracks: '+ maxTrack.value, 20, 58);
                doc.text('Initial head position: '+ headPosition.value, 20, 66);
                var tReq;
                if ((tracks.value.split('')).indexOf(',') === -1) {
                    tReq = (tracks.value.split(' ')).map(Number);
                }
                else {
                    tReq = (tracks.value.split(',')).map(Number);
                }

                doc.text('Track requests: '+ tReq.join(', '), 20, 74);
                tReq='';
                for(let i=0; i<trackRequests.length; i++){
                    if(i===0){
                        tReq += String(trackRequests[i]);
                    }
                    else{
                        tReq += ', '+String(trackRequests[i]);
                    }
                }
                doc.setFont('Times', 'bold');
                doc.text('Order in which tracks are serviced: '+ tReq, 20, 82);

                // SEEK OPERATIONS
                doc.setFontSize(14);
                doc.text('Calculation of seek operations', 10, 97);
                doc.setFontSize(12);
                doc.setFont("Times", "Roman");
                var seekCalc = 'Total Seek Operations = '+seekOperationsCalculations(trackRequests, head);
                var calc = doc.splitTextToSize(seekCalc, 180);
                doc.text(calc,20,107);
                doc.setFont("Times","bold");
                doc.text('Thus, total seek time = ' + String(seekOperations(trackRequests, head))+'ms (Considering successive track seek time as 1ms)', 20, 121);
                var seekTime = 'Average Seek Time = '+String(Math.round((xrange/3)*100)/100)+'ms (Time taken by the header to move across one third of total tracks)';
                seekTime = doc.splitTextToSize(seekTime, 180);
                doc.text(seekTime, 20, 131);

                var note = 'If your disk takes "x" amount of time (in milliseconds) to seek across successive tracks, then multiply the above results by "x" to get the correct results';
                note = doc.splitTextToSize(note, 180);
                doc.text(note, 20, 144);

                // TRACK SERVICING CHART
                let factorw = imgw / doc.internal.pageSize.width;
                let factorh = imgh / ((doc.internal.pageSize.height / 2) - 15);

                let xshift;
                if (factorw > factorh && factorw > 1) {
                    xshift = (doc.internal.pageSize.width - ((imgw / factorw) - 10)) / 2;
                    doc.addImage(ImageURL, 'PNG', xshift, 158, (imgw / factorw) - 10, (imgh / factorw));
                }
                else if (factorh > factorw && factorh > 1) {
                    xshift = (doc.internal.pageSize.width - ((imgw / factorh) - 10)) / 2;
                    doc.addImage(ImageURL, 'PNG', xshift, 158, (imgw / factorh) - 10, (imgh / factorh));
                }
                else {
                    doc.addImage(ImageURL, 'PNG', 7, 158, (imgw) - 10, (imgh));
                }
                
                // FINALLY SAVING THE PDF 
                doc.save('CSCAN.pdf');
            });
        }

        // THE CHART ITSELF
        algoChart.destroy();
        algoChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: xlabel,
                datasets: [
                    {
                        label: "Showing",
                        yAxisID: "first",
                        xAxisID: "scale",
                        fill: false,
                        borderColor: 'black',
                        pointBackgroundColor: 'rgba(168, 255, 120,1)',
                        pointBorderWidth: 2,
                        pointRadius: 4,
                        pointHoverRadius: 4,
                        lineTension: 0.2,
                        data: []
                    },

                    {
                        label: "Showing",
                        yAxisID: "first",
                        xAxisID: "scale",
                        fill: false,
                        borderColor: 'black',
                        borderDash: [10,15],
                        pointBackgroundColor: 'rgba(168, 255, 120,1)',
                        pointBorderWidth: 2,
                        pointRadius: 4,
                        pointHoverRadius: 4,
                        lineTension: 0.2,
                        data: []
                    },

                    {
                        label: "Showing",
                        yAxisID: "first",
                        xAxisID: "scale",
                        fill: false,
                        borderColor: 'black',
                        pointBackgroundColor: 'rgba(168, 255, 120,1)',
                        pointBorderWidth: 2,
                        pointRadius: 4,
                        pointHoverRadius: 4,
                        lineTension: 0.2,
                        data: []
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                title: {
                    display: true,
                    fontFamily: 'Roboto Slab',
                    fontSize: 30,
                    fontColor: 'black',
                    text: 'C-SCAN Graph'
                },
                hover:{
                    mode: 'index',
                    axis: 'x',
                },
                legend: {
                    display: false,
                },
                tooltips: {
                    filter: function (tooltipItem) {
                        return tooltipItem.datasetIndex === 0 || tooltipItem.datasetIndex === 2;
                    }, 
                    mode: 'nearest',
                    axis: 'x',
                    callbacks: {

                        title: function(tooltipItem, data){
                            return 'C-SCAN';
                        },
                        label: function(tooltipItem, data) {
                            return 'Properties';
                        }, 
                        afterLabel: function(tooltipItem, data) {
                            let rnumber = 'Request: ' + data.datasets[tooltipItem.datasetIndex].data[Number(tooltipItem.index)].y;
                            console.log(tooltipItem.yLabel);
                            let tnumber = 'Track: ' + data.datasets[tooltipItem.datasetIndex].data[Number(tooltipItem.index)].x;
                            return (
                                [
                                    rnumber,
                                    tnumber
                                ]
                            );
                        }
                    }
                },
                animation: {
                    easing: 'easeInQuad',
                },
                scales: {
                    yAxes: [
                        {
                            scaleLabel: {
                                display: true,
                                fontFamily: 'Roboto Slab',
                                fontSize: 12,
                                fontStyle: 'bold',
                                fontColor: 'black',
                                labelString: 'REQUEST NUMBER'
                            },
                            id: 'first',
                            position: 'top',
                            ticks: {
                                reverse: true,
                                max: yrange+1,
                                min: 0,
                                stepSize: 1,
                            },
                        }
                    ],
                    xAxes: [
                        {
                            scaleLabel: {
                                display: true,
                                fontFamily: 'Roboto Slab',
                                fontSize: 12,
                                fontStyle: 'bold',
                                fontColor: 'black',
                                labelString: 'TRACK NUMBER'
                            },
                            id: 'scale',
                            ticks: {
                                max: xrange,
                                min: 0,
                                stepSize: 1,
                            },
                            display: true,
                            position: 'top',
                        }
                    ]
                }

            }
        });
        
        function displaySeekOp(){
            let temp = document.getElementById('temp');
            let temp1 = document.getElementById('temp1');
            temp.remove(); temp1.remove();

            let url = document.getElementById("url");
            url.remove();

            let genPDF = document.getElementById("genPDF");
            genPDF.remove();

            document.getElementById('seek').style.width = 'fit-content'; // to be added to other js files
            // document.getElementById('seek').style.flexDirection = 'column';
            var seekOp1 = document.createElement('h4');
            seekOp1.id = 'temp';
            seekOp1.style.fontWeight = "700"; seekOp1.style.margin = "5px";
            str = 'Total Seek Time: ' + seekOperations(trackRequests, head) + ' ms';
            seekOp1.append(document.createTextNode(str));
            seekOp1.classList.add("animate__animated"); seekOp1.classList.add("animate__backInUp");
            document.getElementById('seek').append(seekOp1);

            var seekOp2 = document.createElement('h4');
            seekOp2.id = 'temp1';
            seekOp2.style.fontWeight = "700"; seekOp2.style.margin = "5px";
            str = 'Average Seek Time: ' + Math.round((xrange/3)*100)/100 + ' ms';
            seekOp2.append(document.createTextNode(str));
            seekOp2.classList.add("animate__animated"); seekOp2.classList.add("animate__backInUp");
            document.getElementById('seek').append(seekOp2);

            var dIcon = document.createElement("a");
            dIcon.id = 'url'; dIcon.download = "CSCAN.jpeg";
            var dButton = document.createElement("button");
            dButton.type = 'button'; dButton.className = 'dButton btn btn-outline-dark animate__animated animate__backInUp';
            dButton.style.padding = '0';
            dButton.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="black" class="bi bi-download" viewBox="0 0 16 16" style="margin: 6px;">
                    <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/>
                    <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z"/>
                </svg>`;

            dIcon.append(dButton);
            document.getElementById('dImageIcon').append(dIcon);
            
            // NEW CODE TO BE ADDED IN OTHER JS FILES 
            var pdfButton = document.createElement("button");
            pdfButton.type = 'button'; pdfButton.className = 'pdfButton btn btn-outline-dark animate__animated animate__backInUp';
            pdfButton.style.padding = '0'; pdfButton.id="genPDF"
            pdfButton.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="black" class="bi bi-file-earmark-arrow-down" viewBox="0 0 16 16" style="margin: 6px;">
                <path d="M8.5 6.5a.5.5 0 0 0-1 0v3.793L6.354 9.146a.5.5 0 1 0-.708.708l2 2a.5.5 0 0 0 .708 0l2-2a.5.5 0 0 0-.708-.708L8.5 10.293V6.5z"/>
                <path d="M14 14V4.5L9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2zM9.5 3A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.5v2z"/>
                </svg>`;
            document.getElementById('dPDFIcon').append(pdfButton);            
            setTimeout(() => {
                window.scrollTo(0,document.body.scrollHeight);
            }, 700);
        }

        // UPDATING THE CHART
        var start = {
            x: head,
            y: 0,
        };
        algoChart.data.datasets[0].data.push(start);
        algoChart.update();

        var a = 0;
        var firstover = false;
        var incrementValue = 100/yrange, counter=0;
        var updatingData = setInterval(pushData, 700);

        function pushData(direction){

            if(a<yrange){

                var obj = {
                    x: trackRequests[a],
                    y: a + 1
                };

                if(firstover===false){
                    if(obj.x===xrange || obj.x===0){
                        algoChart.data.datasets[0].data.push(obj);
                        algoChart.update();

                        algoChart.data.datasets[1].data.push(obj);
                        a+=1;

                        counter+=incrementValue;
                        progressBar.style.width = counter+"%";

                        var obj_temp = {
                            x: trackRequests[a],
                            y: a + 1
                        };
                        algoChart.data.datasets[1].data.push(obj_temp);
                        algoChart.update();

                        algoChart.data.datasets[2].data.push(obj_temp);
                        a+=1;

                        firstover = true;
                        algoChart.update();

                        counter+=incrementValue;
                        progressBar.style.width = counter+"%";
                    }
                    else{
                        algoChart.data.datasets[0].data.push(obj);
                        algoChart.update();
                        a = a+1;

                        counter+=incrementValue;
                        progressBar.style.width = counter+"%";
                    }
                }
                else{
                    algoChart.data.datasets[2].data.push(obj);
                    algoChart.update();
                    a = a+1;

                    counter+=incrementValue;
                    progressBar.style.width = counter+"%";
                }
            }
            else{
                clearInterval(updatingData);
                progressBarContainer.classList.toggle("animate__backOutDown");
                setTimeout(function () {
                    progressBarContainer.style.display = "none";
                    progressWrapper.innerHTML = `<h4 id="temp"> </h4> <h4 id="temp1"> </h4>`;
                    run.classList.toggle("disabled");
                    displaySeekOp();
                    done();
                }, 1000
                );
            }
        }
    }
}
run.addEventListener("click", execute);

// window.addEventListener('wheel', (e) => {
//     if(e.deltaY>0){
//         if(window.pageYOffset>=50 && window.pageYOffset<652.6666870117188){
//             window.scrollBy(0, 652.6666870117188 - window.pageYOffset);
//         }
//         if(window.pageYOffset>=778.6666870117188 && window.pageYOffset< 1256.6666259765625){
//             window.scrollBy(0, 1256.6666259765625 - window.pageYOffset);
//         }
//     }
// });


window.addEventListener('wheel', (e) => {
    if (e.deltaY > 0) {
        document.getElementsByClassName('navbar')[0].classList.add('animate__slideOutUp');
        setTimeout(() => {
            document.getElementsByClassName('navbar')[0].style.display = 'none';

            document.getElementsByClassName('navbar')[0].classList.remove('animate__slideOutUp');
        }, 100);
    }
    else {
        if (document.getElementsByClassName('navbar')[0].style.display === 'none') {
            document.getElementsByClassName('navbar')[0].classList.add('animate__slideInDown');
            setTimeout(() => {
                document.getElementsByClassName('navbar')[0].style.display = 'block';
            }, 50);
            setTimeout(() => {
                document.getElementsByClassName('navbar')[0].classList.remove('animate__slideInDown');
            }, 500);
        }

    }
});
