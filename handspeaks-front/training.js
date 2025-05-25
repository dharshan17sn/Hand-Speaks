import * as THREE from 'three';
import { GLTFLoader } from 'GLTFLoader';

const watch = new TouchSDK.Watch();
let isRecording = false;
let startTime = null;
let sensorDataBuffer = [];
let csvContent = [];
let recordedDataCount = 0;

// Configuration
const CONFIG = {
    modelPath: '../3dmodel/arm.glb',
    recordingDuration: 3000, // 3 seconds in milliseconds
    colors: {
        primary: '#007AFF',
        secondary: '#34C759',
        accent: '#FF3B30',
        background: '#F2F2F7',
        text: '#1C1C1E'
    }
};

// Application State
const appState = {
    sensorData: {
        acceleration: [0, 0, 0],
        gravity: [0, 0, 0],
        angularVelocity: [0, 0, 0],
        orientation: [0, 0, 0]
    },
    handModel: null,
    scene: null,
    camera: null,
    renderer: null,
    isConnected: false  // Add connection state
};

// Initialize the application
function initializeApp() {
    setupUI();
    setupThreeJS();
    setupEventListeners();
}

// Set up UI elements and event listeners
function setupUI() {
    const recordButton = document.getElementById('record-button');
    const recordingStatus = document.getElementById('recording-status');
    const gestureIdInput = document.getElementById('gesture-id');

    // Add connect button to header
    const connectButton = watch.createConnectButton();
    connectButton.style.backgroundColor = CONFIG.colors.primary;
    connectButton.style.color = 'white';
    connectButton.style.border = 'none';
    connectButton.style.borderRadius = '8px';
    connectButton.style.padding = '8px 16px';
    connectButton.style.fontSize = '14px';
    connectButton.style.fontWeight = '500';
    connectButton.style.cursor = 'pointer';
    connectButton.style.transition = 'background-color 0.3s ease';
    connectButton.style.marginLeft = 'auto';
    connectButton.style.marginRight = '20px';

    // Insert connect button into header
    const header = document.querySelector('header');
    if (header) {
        header.insertBefore(connectButton, header.querySelector('.search-container'));
    }

    // Add button event listeners
    connectButton.addEventListener('mouseover', () => {
        connectButton.style.backgroundColor = '#0066CC';
    });

    connectButton.addEventListener('mouseout', () => {
        connectButton.style.backgroundColor = CONFIG.colors.primary;
    });

    watch.addEventListener('connected', () => {
        connectButton.textContent = 'Connected';
        connectButton.style.backgroundColor = CONFIG.colors.secondary;
        connectButton.addEventListener('mouseover', () => {
            connectButton.style.backgroundColor = '#0066CC';
        });
    });

    watch.addEventListener('disconnected', () => {
        connectButton.textContent = 'Connect';
        connectButton.style.backgroundColor = CONFIG.colors.primary;
        connectButton.addEventListener('mouseover', () => {
            connectButton.style.backgroundColor = '#0066CC';
        });
    });

    watch.addEventListener('scanning', () => {
        connectButton.textContent = 'Scanning...';
        connectButton.style.backgroundColor = CONFIG.colors.primary;
        connectButton.addEventListener('mouseover', () => {
            connectButton.style.backgroundColor = '#0066CC';
        });
    });

    // Add class label input if container exists
    const idInputContainer = document.querySelector('.id-input');
    if (idInputContainer) {
        const classLabelInput = document.createElement('input');
        classLabelInput.type = 'text';
        classLabelInput.id = 'class-label';
        classLabelInput.placeholder = 'Enter class label';
        classLabelInput.style.marginLeft = '10px';
        classLabelInput.style.padding = '8px';
        classLabelInput.style.borderRadius = '4px';
        classLabelInput.style.border = '1px solid #ccc';
        idInputContainer.appendChild(classLabelInput);
    }

    // Optimize click handler if record button exists
    if (recordButton) {
        recordButton.addEventListener('click', () => {
            if (!isRecording) {
                startRecording();
            } else {
                stopRecording();
            }
        });
    }
}

// Set up Three.js scene
function setupThreeJS() {
    const container = document.getElementById('viewer-container');
    
    appState.scene = new THREE.Scene();
    appState.scene.background = new THREE.Color(CONFIG.colors.background);
    appState.camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    appState.camera.position.set(0, 30, 50);
    appState.camera.lookAt(0, 0, 0);

    appState.renderer = new THREE.WebGLRenderer({ antialias: true });
    appState.renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(appState.renderer.domElement);

    // Lighting
    appState.scene.add(new THREE.AmbientLight(0x404040, 2));
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5).normalize();
    appState.scene.add(directionalLight);

    // Load Hand Model
    const loader = new GLTFLoader();
    loader.load(CONFIG.modelPath, (gltf) => {
        appState.handModel = gltf.scene;
        appState.scene.add(appState.handModel);
        animate();
    });

    // Handle window resize
    window.addEventListener('resize', () => {
        appState.camera.aspect = container.clientWidth / container.clientHeight;
        appState.camera.updateProjectionMatrix();
        appState.renderer.setSize(container.clientWidth, container.clientHeight);
    });
}

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    if (appState.handModel && isSensorDataValid()) {
        updateHandModel(appState.handModel);
    }
    appState.renderer.render(appState.scene, appState.camera);
}

// Check if sensor data is valid
function isSensorDataValid() {
    const allValues = [
        ...appState.sensorData.acceleration,
        ...appState.sensorData.gravity,
        ...appState.sensorData.angularVelocity,
        ...appState.sensorData.orientation
    ];
    return allValues.every(v => v !== 0);
}

// Update hand model rotation based on sensor data
function updateHandModel(model) {
    const [x, y, z, w] = appState.sensorData.orientation;
    const quaternion = new THREE.Quaternion(y, -z, x, -w);
    model.rotation.setFromQuaternion(quaternion);
}

// Set up event listeners for sensor data
function setupEventListeners() {
    watch.addEventListener('accelerationchanged', (e) => {
        appState.sensorData.acceleration = [e.detail.x, e.detail.y, e.detail.z];
        updateSensorDisplay();
        
        if (isRecording) {
            const elapsedTime = Date.now() - startTime;
            if (elapsedTime <= CONFIG.recordingDuration) {
                recordSensorData(elapsedTime);
            } else {
                stopRecording();
            }
        }
    });

    watch.addEventListener('angularvelocitychanged', (e) => {
        appState.sensorData.angularVelocity = [e.detail.x, e.detail.y, e.detail.z];
        updateSensorDisplay();
    });

    watch.addEventListener('gravityvectorchanged', (e) => {
        appState.sensorData.gravity = [e.detail.x, e.detail.y, e.detail.z];
        updateSensorDisplay();
    });

    watch.addEventListener('orientationchanged', (e) => {
        appState.sensorData.orientation = [e.detail.x, e.detail.y, e.detail.z, e.detail.w];
        updateSensorDisplay();
    });
}

// Update sensor data display
function updateSensorDisplay() {
    document.getElementById('acceleration-values').textContent = 
        appState.sensorData.acceleration.map(x => x.toFixed(2)).join(', ');
    document.getElementById('gravity-values').textContent = 
        appState.sensorData.gravity.map(x => x.toFixed(2)).join(', ');
    document.getElementById('angular-values').textContent = 
        appState.sensorData.angularVelocity.map(x => x.toFixed(2)).join(', ');
    document.getElementById('orientation-values').textContent = 
        appState.sensorData.orientation.map(x => x.toFixed(2)).join(', ');
}

// Start recording
function startRecording() {
    isRecording = true;
    startTime = Date.now();
    sensorDataBuffer = [];
    recordedDataCount = 0;
    document.getElementById('record-button').textContent = 'Stop Recording';
    document.getElementById('recording-status').textContent = 'Recording...';
    document.getElementById('recording-status').style.color = CONFIG.colors.accent;
    updateRowCount();
}

// Stop recording
function stopRecording() {
    isRecording = false;
    document.getElementById('record-button').textContent = 'Start Recording';
    document.getElementById('recording-status').textContent = 'Recording Complete';
    document.getElementById('recording-status').style.color = CONFIG.colors.secondary;
}

// Record sensor data
function recordSensorData(elapsedTime) {
    const gestureId = document.getElementById('gesture-id').value;
    const classLabel = document.getElementById('class-label').value || 'No gesture';
    const data = [
        gestureId,
        elapsedTime / 1000, // Convert to seconds
        ...appState.sensorData.acceleration, // Acceleration x, y, z
        ...appState.sensorData.gravity, // Gravity x, y, z
        ...appState.sensorData.angularVelocity, // Angular Velocity x, y, z
        appState.sensorData.orientation[0], // Orientation x
        appState.sensorData.orientation[1], // Orientation y
        appState.sensorData.orientation[2], // Orientation z
        classLabel // Use the entered class label
    ];
    sensorDataBuffer.push(data);
    recordedDataCount++;
    updateCSVDisplay();
    updateRowCount();
}

// Update CSV display
function updateCSVDisplay() {
    const csvContent = document.getElementById('csv-content');
    const headers = ['ID', 'Elapsed Time (s)', 
                    'Acceleration_x', 'Acceleration_y', 'Acceleration_z',
                    'Gravity_x', 'Gravity_y', 'Gravity_z',
                    'Angular Velocity_x', 'Angular Velocity_y', 'Angular Velocity_z',
                    'Orientation_x', 'Orientation_y', 'Orientation_z',
                    'Character'];
    
    let html = '<table><thead><tr>';
    headers.forEach(header => {
        html += `<th>${header}</th>`;
    });
    html += '</tr></thead><tbody>';
    
    // Reverse the array to show latest data first
    const reversedBuffer = [...sensorDataBuffer].reverse();
    
    reversedBuffer.forEach(row => {
        html += '<tr>';
        row.forEach(cell => {
            // Format numbers to 3 decimal places if they are numbers
            const formattedCell = typeof cell === 'number' ? cell.toFixed(3) : cell;
            html += `<td>${formattedCell}</td>`;
        });
        html += '</tr>';
    });
    
    html += '</tbody></table>';
    csvContent.innerHTML = html;
}

// Function to update row count
function updateRowCount() {
    document.getElementById('row-count').textContent = recordedDataCount;
}

// Function to show operation status
function showOperationStatus(message, isError = false, isLoading = false) {
    const statusElement = document.getElementById('operation-status');
    const saveButton = document.getElementById('save-button');
    const deleteByIdButton = document.getElementById('delete-by-id');
    const deleteByLabelButton = document.getElementById('delete-by-label');

    if (!statusElement) return;

    if (isLoading) {
        statusElement.className = 'operation-status loading';
        statusElement.innerHTML = `
            <div class="loading-spinner"></div>
            <span>${message}</span>
        `;
        // Safely disable buttons if they exist
        if (saveButton) saveButton.disabled = true;
        if (deleteByIdButton) deleteByIdButton.disabled = true;
        if (deleteByLabelButton) deleteByLabelButton.disabled = true;
    } else {
        statusElement.className = 'operation-status ' + (isError ? 'error' : 'success');
        statusElement.textContent = message;
        // Safely enable buttons if they exist
        if (saveButton) saveButton.disabled = false;
        if (deleteByIdButton) deleteByIdButton.disabled = false;
        if (deleteByLabelButton) deleteByLabelButton.disabled = false;

        // Hide the status after 3 seconds
        setTimeout(() => {
            if (statusElement) {
                statusElement.style.display = 'none';
            }
        }, 3000);
    }
    statusElement.style.display = 'block';
}

// Function to save recorded data
async function saveRecordedData() {
    if (sensorDataBuffer.length === 0) {
        showOperationStatus('No data to save', true);
        return;
    }

    showOperationStatus('Saving data...', false, true);

    try {
        const response = await fetch('http://localhost:5000/save_csv', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                csv_data: sensorDataBuffer.map(row => row.join(','))
            })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            showOperationStatus(`Successfully saved ${sensorDataBuffer.length} records`);
            // Only clear the buffer after successful save
            sensorDataBuffer = [];
            recordedDataCount = 0;
            updateCSVDisplay();
            updateRowCount();
        } else {
            showOperationStatus(data.error || 'Failed to save data', true);
        }
    } catch (error) {
        showOperationStatus('Error saving data: ' + error.message, true);
        console.error('Error saving data:', error);
    }
}

// Function to delete rows by ID or label
async function deleteRows(type, value) {
    if (!value) {
        showOperationStatus(`Please enter a ${type} to delete`, true);
        return;
    }

    showOperationStatus('Deleting rows...', false, true);

    try {
        const response = await fetch('http://localhost:5000/delete_rows', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                type: type,
                value: value 
            })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            showOperationStatus(`Successfully deleted rows with ${type}: ${value}`);
            // Clear the delete inputs
            document.getElementById('delete-id').value = '';
            document.getElementById('delete-label').value = '';
        } else {
            showOperationStatus(data.error || 'Failed to delete rows', true);
        }
    } catch (error) {
        showOperationStatus('Error deleting rows: ' + error.message, true);
    }
}

// Add event listeners for the buttons
document.addEventListener('DOMContentLoaded', () => {
    // Initialize the application
    initializeApp();

    // Style the controls container
    const trainingControls = document.querySelector('.training-controls');
    if (trainingControls) {
        trainingControls.style.display = 'flex';
        trainingControls.style.flexDirection = 'column';
        trainingControls.style.gap = '20px';
        trainingControls.style.padding = '20px';
        trainingControls.style.backgroundColor = '#f8f8f8';
        trainingControls.style.borderRadius = '12px';
        trainingControls.style.margin = '20px 0';
    }

    // Style sections
    const sections = document.querySelectorAll('.control-section');
    sections.forEach(section => {
        section.style.display = 'flex';
        section.style.gap = '15px';
        section.style.alignItems = 'center';
    });

    // Style the delete section specifically
    const deleteSection = document.querySelector('.delete-section');
    deleteSection.style.flexDirection = 'column';
    deleteSection.style.background = '#fff';
    deleteSection.style.padding = '15px';
    deleteSection.style.borderRadius = '8px';
    deleteSection.style.border = '1px solid #e1e1e1';

    // Style the delete controls grid
    const deleteGrid = document.querySelector('.delete-controls-grid');
    deleteGrid.style.display = 'grid';
    deleteGrid.style.gridTemplateColumns = '1fr 1fr';
    deleteGrid.style.gap = '15px';
    deleteGrid.style.width = '100%';

    // Style all input groups
    const inputGroups = document.querySelectorAll('.input-group, .delete-input-group');
    inputGroups.forEach(group => {
        group.style.display = 'flex';
        group.style.flexDirection = group.classList.contains('delete-input-group') ? 'row' : 'column';
        group.style.gap = '8px';
        group.style.flex = '1';
    });

    // Style all inputs
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => {
        input.style.padding = '8px';
        input.style.borderRadius = '6px';
        input.style.border = '1px solid #ccc';
        input.style.width = '100%';
    });

    // Style all labels
    const labels = document.querySelectorAll('label');
    labels.forEach(label => {
        label.style.fontWeight = '500';
        label.style.marginBottom = '4px';
    });

    // Style all buttons
    const buttons = document.querySelectorAll('.control-button');
    buttons.forEach(button => {
        button.style.padding = '8px 16px';
        button.style.borderRadius = '8px';
        button.style.border = 'none';
        button.style.cursor = 'pointer';
        button.style.fontWeight = '500';
        button.style.transition = 'background-color 0.3s ease';
    });

    // Style primary buttons (Save)
    const primaryButtons = document.querySelectorAll('.control-button.primary');
    primaryButtons.forEach(button => {
        button.style.backgroundColor = '#007AFF';
        button.style.color = 'white';
        button.style.flex = '1';
        button.addEventListener('mouseover', () => {
            button.style.backgroundColor = '#0066CC';
        });
        button.addEventListener('mouseout', () => {
            button.style.backgroundColor = '#007AFF';
        });
    });

    // Style warning buttons (Clear)
    const warningButtons = document.querySelectorAll('.control-button.warning');
    warningButtons.forEach(button => {
        button.style.backgroundColor = '#FF9500';
        button.style.color = 'white';
        button.style.flex = '1';
        button.addEventListener('mouseover', () => {
            button.style.backgroundColor = '#E68500';
        });
        button.addEventListener('mouseout', () => {
            button.style.backgroundColor = '#FF9500';
        });
    });

    // Style delete buttons
    const deleteButtons = document.querySelectorAll('.control-button.delete');
    deleteButtons.forEach(button => {
        button.style.backgroundColor = '#FF3B30';
        button.style.color = 'white';
        button.style.minWidth = '80px';
        button.addEventListener('mouseover', () => {
            button.style.backgroundColor = '#E63329';
        });
        button.addEventListener('mouseout', () => {
            button.style.backgroundColor = '#FF3B30';
        });
    });

    // Add event listeners
    document.getElementById('save-button').addEventListener('click', saveRecordedData);
    document.getElementById('clear-button').onclick = () => {
        if (sensorDataBuffer.length > 0) {
            if (confirm('Are you sure you want to clear all recorded data? This cannot be undone.')) {
                sensorDataBuffer = [];
                recordedDataCount = 0;
                updateCSVDisplay();
                updateRowCount();
                showOperationStatus('Data cleared');
            }
        } else {
            showOperationStatus('No data to clear', true);
        }
    };

    document.getElementById('delete-by-id').addEventListener('click', () => {
        const id = document.getElementById('delete-id').value;
        deleteRows('id', id);
    });

    document.getElementById('delete-by-label').addEventListener('click', () => {
        const label = document.getElementById('delete-label').value;
        deleteRows('label', label);
    });
}); 