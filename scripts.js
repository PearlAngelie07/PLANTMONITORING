const spreadsheetId = '1nZM9HXqfLPM897tqChxdVPGa0f4f3sjYW_isphqAoDI';
const sheetName = 'Data1';
const apiKey = 'AIzaSyBLH7LKKBkGzBhQhzo4hiFZ765HDJMDj8E';
const apiUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${sheetName}?key=${apiKey}`;

// Initialize charts storage
const chartInstances = {};

function loadSheetData() {
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            if (data.values && data.values.length > 1) {
                const latestRow = data.values[data.values.length - 1];
                updatePlantInfo(latestRow);
                updateCharts(data.values.slice(1));
            }
        })
        .catch(error => console.error('Error:', error));
}

function updatePlantInfo(row) {
    const [date, time, pH, ambientTemp, waterTemp, humidity, lightA, lightB, pressure] = row;
    
    updateElement('date', date);
    updateElement('time', time);
    updateElement('pH', pH);
    updateElement('ambient-temp', `${ambientTemp}°C`);
    updateElement('water-temp', `${waterTemp}°C`);
    updateElement('humidity', `${humidity}%`);
    updateElement('pressure', pressure);
    updateElement('light-a', lightA);
    updateElement('light-b', lightB);
}

function updateElement(id, value) {
    const element = document.getElementById(id);
    if (element) {
        element.innerText = value || 'N/A';
    }
}

// Rest of the code remains the same, just replace all instances of window.charts with chartInstances
function createChart(canvasId, data) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) {
        console.error(`Canvas ${canvasId} not found`);
        return;
    }

    const ctx = canvas.getContext('2d');
    
    if (chartInstances[canvasId]) {
        chartInstances[canvasId].destroy();
    }

    chartInstances[canvasId] = new Chart(ctx, {
        type: 'line',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top'
                }
            },
            scales: {
                y: {
                    beginAtZero: false
                }
            }
        }
    });
}
function updateCharts(rows) {
    const timeLabels = rows.slice(-20).map(row => row[1]);
    
    // pH Chart
    createChart('pH-graph', {
        labels: timeLabels,
        datasets: [{
            label: 'pH Level',
            data: rows.slice(-20).map(row => row[2]),
            borderColor: 'rgb(153, 102, 255)',
            tension: 0.4
        }]
    });

    // Temperature Chart
    createChart('temperature-graph', {
        labels: timeLabels,
        datasets: [
            {
                label: 'Ambient Temperature',
                data: rows.slice(-20).map(row => row[3]),
                borderColor: 'rgb(255, 99, 132)',
                tension: 0.4
            },
            {
                label: 'Water Temperature',
                data: rows.slice(-20).map(row => row[4]),
                borderColor: 'rgb(54, 162, 235)',
                tension: 0.4
            }
        ]
    });

    // Humidity Chart
    createChart('humidity-graph', {
        labels: timeLabels,
        datasets: [{
            label: 'Humidity',
            data: rows.slice(-20).map(row => row[5]),
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.4
        }]
    });

    // Light Chart
    createChart('light-graph', {
        labels: timeLabels,
        datasets: [
            {
                label: 'Light Level A',
                data: rows.slice(-20).map(row => row[6]),
                borderColor: 'rgb(255, 206, 86)',
                tension: 0.4
            },
            {
                label: 'Light Level B',
                data: rows.slice(-20).map(row => row[7]),
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.4
            }
        ]
    });

    // Pressure Chart
    createChart('pressure-graph', {
        labels: timeLabels,
        datasets: [{
            label: 'Pressure',
            data: rows.slice(-20).map(row => row[8]),
            borderColor: 'rgb(255, 159, 64)',
            tension: 0.4
        }]
    });
}

// function fetchHistoricalData() {
//     const selectedDate = document.getElementById('date-picker').value;
//     if (!selectedDate) return;
//     console.log(selectedDate);
//     fetch(apiUrl)
//         .then(response => response.json())
//         .then(data => {
//             console.log(data);
//             const rows = data.values.filter(row => row[0] === selectedDate);
//             document.getElementById('historical-info').innerHTML = rows.map(row => `
//                 <p>Time: ${row[1]}</p>
//                 <p>pH: ${row[2]}</p>
//                 <p>Ambient Temp: ${row[3]}°C</p>
//                 <p>Water Temp: ${row[4]}°C</p>
//                 <p>Humidity: ${row[5]}%</p>
//                 <p>Pressure: ${row[8]}</p>
//                 <p>Light Level A: ${row[6]}</p>
//                 <p>Light Level B: ${row[7]}</p>
//                 <hr>
//             `).join('') || 'No data found for selected date';
//         })
//         .catch(error => console.error('Error:', error));
// }

function fetchHistoricalData() {
    const selectedDate = document.getElementById('date-picker').value;
    if (!selectedDate) return;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            // Convert selected date to match spreadsheet date format
            const formattedDate = new Date(selectedDate).toLocaleDateString();
            
            // Filter rows that match the exact date
            const rows = data.values.filter(row => {
                const rowDate = new Date(row[0]).toLocaleDateString();
                return rowDate === formattedDate;
            });
      console.log(rows);
            const dataDisplay = document.getElementById('historical-info');
           
            dataDisplay.innerHTML = 
                rows.map(row => `
                    <p>Time: ${row[1]}</p>
                    <p>pH: ${row[2]}</p>
                    <p>Ambient Temp: ${row[3]}°C</p>
                    <p>Water Temp: ${row[4]}°C</p>
                    <p>Humidity: ${row[5]}%</p>
                    <p>Pressure: ${row[8]}</p>
                    <p>Light Level A: ${row[6]}</p>
                    <p>Light Level B: ${row[7]}</p>
                    <hr>
                `).join('') || 'No data found for selected date';
        })
        .catch(error => console.error('Error:', error));
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadSheetData();
    setInterval(loadSheetData, 300000); // Refresh every 5 minutes
});
