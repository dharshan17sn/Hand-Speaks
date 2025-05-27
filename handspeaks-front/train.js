// Function to send CSV data to Flask backend for training
async function trainModel() {
    if (sensorDataBuffer.length === 0) {
        showOperationStatus('No data to train on. Please record and save gestures first.', true);
        return;
    }

    showOperationStatus('Training model...', false, true);

    try {
        const response = await fetch('http://localhost:5000/train_model', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                csv_data: sensorDataBuffer.map(row => row.join(','))
            })
        });

        const result = await response.json();

        if (response.ok) {
            showOperationStatus(`Training complete: Accuracy - ${result.accuracy}, Loss - ${result.loss}`);
        } else {
            showOperationStatus(result.error || 'Training failed', true);
        }
    } catch (err) {
        showOperationStatus(`Error: ${err.message}`, true);
    }
}
