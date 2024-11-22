// // Constants for Google Sheets API
// const spreadsheetId = '1nZM9HXqfLPM897tqChxdVPGa0f4f3sjYW_isphqAoDI';
// const sheetName = 'Data1';
// const apiKey = 'AIzaSyBLH7LKKBkGzBhQhzo4hiFZ765HDJMDj8E'; // Replace with your valid API key
// const apiUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${sheetName}?key=${apiKey}`;

// // Fetch and display the latest data
// function loadSheetData() {
//     fetch(apiUrl)
//         .then(response => response.json())
//         .then(data => {
//             const rows = data.values;

            
//             if (rows.length > 1) {
//                 const latestRow = rows[rows.length - 1];
//                 updatePlantInfo(latestRow);
//                 updateCharts(rows.slice(1)); // Exclude header row
//             } else {
//                 console.error('No data available');
//             }
//         })
//         .catch(error => console.error('Error fetching data:', error));
// }

// // Update plant info display
// function updatePlantInfo(row) {
//     const [date, time, pH, ambientTemp, waterTemp, humidity, lightA, lightB, pressure] = row;
//     console.log("value");
//     document.getElementById('date').innerText = date || 'N/A';
//     document.getElementById('time').innerText = time || 'N/A';
//     document.getElementById('pH').innerText = pH || 'N/A';
//     document.getElementById('ambient-temp').innerText = ambientTemp ? `${ambientTemp}°C` : 'N/A';
//     document.getElementById('water-temp').innerText = waterTemp ? `${waterTemp}°C` : 'N/A';
//     document.getElementById('humidity').innerText = humidity ? `${humidity}%` : 'N/A';
//     document.getElementById('pressure').innerText = pressure || 'N/A';
//     document.getElementById('light-a').innerText = lightA || 'N/A';
//     document.getElementById('light-b').innerText = lightB || 'N/A';
// }

// // Update charts
// function updateCharts(rows) {
//     const filteredRows = rows.filter(row => row.length >= 9 && row.every(cell => cell !== undefined));
//     const latestRows = filteredRows.slice(-20); // Get the latest 20 rows only
    
//     // Helper function to safely parse and validate numeric data
//     const parseValidNumber = (value) => {
//         const number = parseFloat(value);
//         return isNaN(number) || value === null || value === undefined ? null : number;
//     };

//     // Extract valid data for each chart
//     const timeLabels = latestRows.map(row => row[1] || 'Unknown'); // Time column
//     const pHData = latestRows.map(row => parseValidNumber(row[2])); // pH column
//     const ambientTempData = latestRows.map(row => parseValidNumber(row[3])); // Ambient Temperature
//     const waterTempData = latestRows.map(row => parseValidNumber(row[4])); // Water Temperature
//     const humidityData = latestRows.map(row => parseValidNumber(row[5])); // Humidity column
//     const lightAData = latestRows.map(row => parseValidNumber(row[6])); // Light Level A
//     const lightBData = latestRows.map(row => parseValidNumber(row[7])); // Light Level B
//     const pressureData = latestRows.map(row => parseValidNumber(row[8])); // Pressure column

//     // Remove invalid or null data from both labels and datasets
//     const cleanData = (labels, dataset) => {
//         const validData = labels.map((label, index) => ({
//             label,
//             value: dataset[index]
//         })).filter(item => item.value !== null);
//         return {
//             labels: validData.map(item => item.label),
//             data: validData.map(item => item.value)
//         };
//     };

//     // Clean each dataset
//     const pHCleaned = cleanData(timeLabels, pHData);
//     const humidityCleaned = cleanData(timeLabels, humidityData);
//     const ambientTempCleaned = cleanData(timeLabels, ambientTempData);
//     const waterTempCleaned = cleanData(timeLabels, waterTempData);
//     const lightACleaned = cleanData(timeLabels, lightAData);
//     const lightBCleaned = cleanData(timeLabels, lightBData);
//     const pressureCleaned = cleanData(timeLabels, pressureData);

//     // Render individual charts
//     renderChart('pH-graph', 'pH Level', pHCleaned.labels, pHCleaned.data, 'rgba(153, 102, 255, 1)');
//     renderChart('humidity-graph', 'Humidity (%)', humidityCleaned.labels, humidityCleaned.data, 'rgba(75, 192, 192, 1)');
//     renderChart('temperature-graph', 'Temperature (°C)', ambientTempCleaned.labels, [
//         { label: 'Ambient Temp', data: ambientTempCleaned.data, borderColor: 'rgba(255, 99, 132, 1)' },
//         { label: 'Water Temp', data: waterTempCleaned.data, borderColor: 'rgba(54, 162, 235, 1)' }
//     ]);
//     renderChart('light-graph', 'Light Levels', lightACleaned.labels, [
//         { label: 'Light Level A', data: lightACleaned.data, borderColor: 'rgba(255, 206, 86, 1)' },
//         { label: 'Light Level B', data: lightBCleaned.data, borderColor: 'rgba(75, 192, 192, 1)' }
//     ]);
//     renderChart('pressure-graph', 'Pressure', pressureCleaned.labels, pressureCleaned.data, 'rgba(255, 159, 64, 1)');
// }

// /// Render a chart
// function renderChart(canvasId, label, labels, data, color) {
//     const ctx = document.getElementById(canvasId).getContext('2d');

//     // Define dynamic y-axis ranges
//     let suggestedMin = 0, suggestedMax = 1;
//     switch (label) {
//         case 'pH Level':
//             suggestedMin = 0;
//             suggestedMax = 15;
//             break;
//         case 'Humidity (%)':
//             suggestedMin = 0;
//             suggestedMax = 100;
//             break;
//         case 'Pressure':
//             suggestedMin = 900;
//             suggestedMax = 1100;
//             break;
//         case 'Temperature (°C)':
//             suggestedMin = Math.min(...data.flatMap(d => d.data || [d]));
//             suggestedMax = Math.max(...data.flatMap(d => d.data || [d]));
//             break;
//         case 'Light Levels':
//             suggestedMin = Math.min(...data.flatMap(d => d.data || [d]));
//             suggestedMax = Math.max(...data.flatMap(d => d.data || [d]));
//             break;
//     }

//     new Chart(ctx, {
//         type: 'line',
//         data: {
//             labels,
//             datasets: Array.isArray(data)
//                 ? data.map(d => ({ ...d, borderWidth: 2, fill: false }))
//                 : [{ label, data, borderColor: color, borderWidth: 2, fill: false }]
//         },
//         options: {
//             responsive: true,
//             scales: {
//                 x: { title: { display: true, text: 'Time' } },
//                 y: {
//                     title: { display: true, text: label },
//                     suggestedMin,
//                     suggestedMax
//                 }
//             },
//             spanGaps: true // Connect gaps in the data
//         }
//     });
// }


// // Fetch historical data
// function fetchHistoricalData() {
//     const selectedDate = document.getElementById('date-picker').value;
//     fetch(apiUrl)
//         .then(response => response.json())
//         .then(data => {
//             const rows = data.values.filter(row => row[0] === selectedDate);
//             const historicalInfo = rows.map(row => `
//                 <p>Date: ${row[0]}</p>
//                 <p>Time: ${row[1]}</p>
//                 <p>pH: ${row[2]}</p>
//                 <p>Ambient Temp: ${row[3]}°C</p>
//                 <p>Water Temp: ${row[4]}°C</p>
//                 <p>Humidity: ${row[5]}%</p>
//                 <p>Pressure: ${row[8]}</p>
//                 <p>Light Level A: ${row[6]}</p>
//                 <p>Light Level B: ${row[7]}</p>
//             `).join('');
//             document.getElementById('historical-info').innerHTML = historicalInfo || 'No data found.';
//         })
//         .catch(error => console.error('Error fetching historical data:', error));
// }

// // Initialize
// loadSheetData();


// Constants for Google Sheets API
const spreadsheetId = '1nZM9HXqfLPM897tqChxdVPGa0f4f3sjYW_isphqAoDI';
const sheetName = 'Data1';
const apiKey = 'AIzaSyBLH7LKKBkGzBhQhzo4hiFZ765HDJMDj8E';
const apiUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${sheetName}?key=${apiKey}`;

// Global chart storage
window.charts = {};

// Fetch and display the latest data
function loadSheetData() {
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            const rows = data.values;
            
            if (rows.length > 1) {
                const latestRow = rows[rows.length - 1];
                updatePlantInfo(latestRow);
                updateCharts(rows.slice(1)); // Exclude header row
            } else {
                console.error('No data available');
            }
        })
        .catch(error => console.error('Error fetching data:', error));
}

// Update plant info display
 function updatePlantInfo(row) {
    const [date, time, pH, ambientTemp, waterTemp, humidity, lightA, lightB, pressure] = row;
    console.log("value");
    document.getElementById('date').innerText = date || 'N/A';
    document.getElementById('time').innerText = time || 'N/A';
    document.getElementById('pH').innerText = pH || 'N/A';
    document.getElementById('ambient-temp').innerText = ambientTemp ? `${ambientTemp}°C` : 'N/A';
    document.getElementById('water-temp').innerText = waterTemp ? `${waterTemp}°C` : 'N/A';
    document.getElementById('humidity').innerText = humidity ? `${humidity}%` : 'N/A';
    document.getElementById('pressure').innerText = pressure || 'N/A';
    document.getElementById('light-a').innerText = lightA || 'N/A';
    document.getElementById('light-b').innerText = lightB || 'N/A';
}

// Update charts
function updateCharts(rows) {
    const filteredRows = rows.filter(row => row.length >= 9 && row.every(cell => cell !== undefined));
    const latestRows = filteredRows.slice(-20); // Get the latest 20 rows only
    
    // Helper function to safely parse and validate numeric data
    const parseValidNumber = (value) => {
        const number = parseFloat(value);
        return isNaN(number) || value === null || value === undefined ? null : number;
    };

    // Extract valid data for each chart
    const timeLabels = latestRows.map(row => row[1] || 'Unknown');
    const pHData = latestRows.map(row => parseValidNumber(row[2]));
    const ambientTempData = latestRows.map(row => parseValidNumber(row[3]));
    const waterTempData = latestRows.map(row => parseValidNumber(row[4]));
    const humidityData = latestRows.map(row => parseValidNumber(row[5]));
    const lightAData = latestRows.map(row => parseValidNumber(row[6]));
    const lightBData = latestRows.map(row => parseValidNumber(row[7]));
    const pressureData = latestRows.map(row => parseValidNumber(row[8]));

    // Clean data helper function
    const cleanData = (labels, dataset) => {
        const validData = labels.map((label, index) => ({
            label,
            value: dataset[index]
        })).filter(item => item.value !== null);
        
        return {
            labels: validData.map(item => item.label),
            data: validData.map(item => item.value)
        };
    };

    // Clean each dataset
    const pHCleaned = cleanData(timeLabels, pHData);
    const humidityCleaned = cleanData(timeLabels, humidityData);
    const ambientTempCleaned = cleanData(timeLabels, ambientTempData);
    const waterTempCleaned = cleanData(timeLabels, waterTempData);
    const lightACleaned = cleanData(timeLabels, lightAData);
    const lightBCleaned = cleanData(timeLabels, lightBData);
    const pressureCleaned = cleanData(timeLabels, pressureData);

    // Render individual charts
    renderChart('ph-graph', 'pH Level', pHCleaned.labels, pHCleaned.data, 'rgba(153, 102, 255, 1)');
    renderChart('humidity-graph', 'Humidity (%)', humidityCleaned.labels, humidityCleaned.data, 'rgba(75, 192, 192, 1)');
    renderChart('temperature-graph', 'Temperature (°C)', ambientTempCleaned.labels, [
        { 
            label: 'Ambient Temp',
            data: ambientTempCleaned.data,
            borderColor: 'rgba(255, 99, 132, 1)'
        },
        { 
            label: 'Water Temp',
            data: waterTempCleaned.data,
            borderColor: 'rgba(54, 162, 235, 1)'
        }
    ]);
    renderChart('light-graph', 'Light Levels', lightACleaned.labels, [
        { 
            label: 'Light Level A',
            data: lightACleaned.data,
            borderColor: 'rgba(255, 206, 86, 1)'
        },
        { 
            label: 'Light Level B',
            data: lightBCleaned.data,
            borderColor: 'rgba(75, 192, 192, 1)'
        }
    ]);
    renderChart('pressure-graph', 'Pressure', pressureCleaned.labels, pressureCleaned.data, 'rgba(255, 159, 64, 1)');
}

// Helper functions for chart min/max values
function getSuggestedMin(label) {
    const ranges = {
        'pH Level': 0,
        'Humidity (%)': 0,
        'Pressure': 900,
        'Temperature (°C)': 20,
        'Light Levels': 0
    };
    return ranges[label] || 0;
}

function getSuggestedMax(label) {
    const ranges = {
        'pH Level': 14,
        'Humidity (%)': 100,
        'Pressure': 1100,
        'Temperature (°C)': 40,
        'Light Levels': 3
    };
    return ranges[label] || 100;
}

// Render a chart
function renderChart(canvasId, label, labels, data, color) {
    const ctx = document.getElementById(canvasId).getContext('2d');
    
    // Configure datasets properly
    const datasets = Array.isArray(data) ? data.map(d => ({
        label: d.label,
        data: d.data,
        borderColor: d.borderColor,
        borderWidth: 2,
        fill: false,
        tension: 0.4
    })) : [{
        label: label,
        data: data,
        borderColor: color,
        borderWidth: 2,
        fill: false,
        tension: 0.4
    }];

    // Destroy existing chart if it exists
    if (window.charts[canvasId]) {
        window.charts[canvasId].destroy();
    }

    // Create new chart
    window.charts[canvasId] = new Chart(ctx, {
        type: 'line',
        data: { labels, datasets },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: true,
                    position: 'top'
                }
            },
            scales: {
                x: { 
                    display: true,
                    title: { display: true, text: 'Time' }
                },
                y: {
                    display: true,
                    title: { display: true, text: label },
                    suggestedMin: getSuggestedMin(label),
                    suggestedMax: getSuggestedMax(label)
                }
            }
        }
    });
}

// Fetch historical data
function fetchHistoricalData() {
    const selectedDate = document.getElementById('date-picker').value;
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            const rows = data.values.filter(row => row[0] === selectedDate);
            const historicalInfo = rows.map(row => `
                <p>Date: ${row[0]}</p>
                <p>Time: ${row[1]}</p>
                <p>pH: ${row[2]}</p>
                <p>Ambient Temp: ${row[3]}°C</p>
                <p>Water Temp: ${row[4]}°C</p>
                <p>Humidity: ${row[5]}%</p>
                <p>Pressure: ${row[8]}</p>
                <p>Light Level A: ${row[6]}</p>
                <p>Light Level B: ${row[7]}</p>
            `).join('');
            document.getElementById('historical-info').innerHTML = historicalInfo || 'No data found.';
        })
        .catch(error => console.error('Error fetching historical data:', error));
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadSheetData();
    // Refresh data every 5 minutes
    setInterval(loadSheetData, 5 * 60 * 1000);
});
//sheets.googleapis.com
