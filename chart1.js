let dynamicChart;
const ctx = document.getElementById('dynamicChart').getContext('2d');

function initChart() {
    dynamicChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Initial', 'Data'],
            datasets: [{
                label: 'Sample Dataset',
                data: [0, 1],
                fill: false,
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

function updateChart(newLabels, newData) {
    if (dynamicChart) {
        dynamicChart.data.labels = newLabels;
        dynamicChart.data.datasets[0].data = newData; // Assuming single dataset for simplicity
        dynamicChart.update();
    }
}

// Initialize the chart
initChart();

// Simulate CoursePlayerV2 with an event hook for content changes
// Replace this with your actual CoursePlayerV2 integration
if (typeof (CoursePlayerV2) !== 'undefined') {
    CoursePlayerV2.on('hooks:contentDidChange', function (data) {
        const courseId = data.course.id;
        const courseName = data.course.name;
        const lessonId = data.lesson.id;
        const userId = data.user.id;
        const userFirstName = data.user.firstName;
        console.log("Course data loaded:", courseId, courseName, lessonId, userId, userFirstName);
        
        // Example: Fetch new chart data based on the lessonId or courseId
        // This is a placeholder for fetching or generating chart data
        const newLabels = ['Updated', 'Labels'];
        const newData = [10, 20]; // Example new data
        
        // Update the chart with new data
        updateChart(newLabels, newData);

        // Optionally, replace the above placeholder with your actual data fetching logic
    });
}

// Placeholder for sendExamActionRequest function
function sendExamActionRequest(action) {
    // Implement your logic to check exam progress based on action
    console.log("Action requested:", action);
}
