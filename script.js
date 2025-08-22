// Function to show/hide the KJ information section based on establishment type
function toggleKJSection() {
    const establishmentType = document.querySelector('input[name="establishmentType"]:checked')?.value;
    const kjInfoSection = document.getElementById('kjInfoSection');
    if (establishmentType === 'Karaoke night hosted by DJ') {
        kjInfoSection.style.display = 'block';
    } else {
        kjInfoSection.style.display = 'none';
        document.getElementById('kjName').value = '';
        document.getElementById('kjSocial').value = '';
        document.getElementById('kjContact').value = '';
    }
}

// Function to populate the time dropdowns with half-hour increments
function populateTimeSelects() {
    const startTimeSelect = document.getElementById('startTimeSelect');
    const endTimeSelect = document.getElementById('endTimeSelect');
    
    // Clear existing options except the first one
    startTimeSelect.innerHTML = '<option value="" disabled selected>Start Time</option>';
    endTimeSelect.innerHTML = '<option value="" disabled selected>End Time</option>';
    
    for (let h = 0; h < 24; h++) {
        const hour = h.toString().padStart(2, '0');
        
        // Add option for the hour (e.g., 08:00)
        const fullHourTime = `${hour}:00`;
        const startOption = document.createElement('option');
        startOption.value = fullHourTime;
        startOption.textContent = fullHourTime;
        startTimeSelect.appendChild(startOption);

        const endOption = document.createElement('option');
        endOption.value = fullHourTime;
        endOption.textContent = fullHourTime;
        endTimeSelect.appendChild(endOption);

        // Add option for the half hour (e.g., 08:30)
        const halfHourTime = `${hour}:30`;
        const startHalfHourOption = document.createElement('option');
        startHalfHourOption.value = halfHourTime;
        startHalfHourOption.textContent = halfHourTime;
        startTimeSelect.appendChild(startHalfHourOption);

        const endHalfHourOption = document.createElement('option');
        endHalfHourOption.value = halfHourTime;
        endHalfHourOption.textContent = halfHourTime;
        endTimeSelect.appendChild(endHalfHourOption);
    }
}

// Function to add a completed time slot to the display list
function addTimeSlot() {
    const daySelect = document.getElementById('daySelect');
    const startTimeSelect = document.getElementById('startTimeSelect');
    const endTimeSelect = document.getElementById('endTimeSelect');

    const day = daySelect.value;
    const startTime = startTimeSelect.value;
    const endTime = endTimeSelect.value;

    if (!day || !startTime || !endTime) {
        alert('Please fill out all fields (Day, Start Time, End Time) before adding.');
        return;
    }

    const timeDisplayList = document.getElementById('timeDisplayList');
    const newEntry = document.createElement('div');
    newEntry.className = 'time-entry';
    newEntry.innerHTML = `
        <span>${day}: ${startTime} to ${endTime}</span>
        <button type="button" class="remove-btn" onclick="removeTimeSlot(this)">Remove</button>
    `;
    // Store the data on the element itself for easy retrieval on form submission
    newEntry.dataset.day = day;
    newEntry.dataset.startTime = startTime;
    newEntry.dataset.endTime = endTime;
    
    timeDisplayList.appendChild(newEntry);

    // Reset the input fields
    daySelect.value = '';
    startTimeSelect.value = '';
    endTimeSelect.value = '';
}

// Function to remove a time slot from the display list
function removeTimeSlot(btn) {
    const entryToRemove = btn.parentNode;
    entryToRemove.remove();
}

// Function to show/hide the public stage question based on room type
function togglePublicStage(radio) {
    const publicStageQuestion = document.getElementById('publicStageQuestion');
    if (radio.value === 'Public' || radio.value === 'Both') {
        publicStageQuestion.style.display = 'block';
    } else {
        publicStageQuestion.style.display = 'none';
        const radios = publicStageQuestion.querySelectorAll('input[type="radio"]');
        radios.forEach(r => r.checked = false);
    }
}

// Helper function to get values from a group of checkboxes
function getCheckedValues(name) {
    return Array.from(document.querySelectorAll(`input[name="${name}"]:checked`))
                .map(checkbox => checkbox.value);
}

document.getElementById('karaokeForm').addEventListener('submit', function(event) {
    event.preventDefault();

    function getRadioValue(name) {
        const radio = document.querySelector(`input[name="${name}"]:checked`);
        return radio ? radio.value : 'Not specified';
    }

    const karaokeTimes = [];
    document.querySelectorAll('#timeDisplayList .time-entry').forEach(entry => {
        karaokeTimes.push({
            day: entry.dataset.day,
            startTime: entry.dataset.startTime,
            endTime: entry.dataset.endTime
        });
    });

    const formData = {
        establishmentName: document.getElementById('establishmentName').value,
        establishmentType: getRadioValue('establishmentType'),
        streetAddress: document.getElementById('streetAddress').value,
        city: document.getElementById('city').value,
        state: document.getElementById('state').value,
        zipCode: document.getElementById('zipCode').value,
        email: document.getElementById('email').value,
        telephone: document.getElementById('telephone').value,
        social: document.getElementById('social').value,
        karaokeTimes: karaokeTimes,
        genres: getCheckedValues('genres').join(', ') || 'None selected',
        languages: getCheckedValues('languages').join(', ') || 'None selected',
        roomType: getRadioValue('roomType'),
        publicStageType: getRadioValue('publicStageType')
    };
    
    if (formData.establishmentType === 'Karaoke night hosted by DJ') {
        formData.kjInfo = {
            name: document.getElementById('kjName').value,
            social: document.getElementById('kjSocial').value,
            contact: document.getElementById('kjContact').value
        };
    }

    let confirmationMessage = "Please review your information before submitting:\n\n";
    confirmationMessage += `Establishment Name: ${formData.establishmentName}\n`;
    confirmationMessage += `Establishment Type: ${formData.establishmentType}\n`;

    if (formData.establishmentType === 'Karaoke night hosted by DJ' && formData.kjInfo) {
        confirmationMessage += `KJ Name: ${formData.kjInfo.name || 'Not provided'}\n`;
        confirmationMessage += `KJ Social: ${formData.kjInfo.social || 'Not provided'}\n`;
        confirmationMessage += `KJ Contact: ${formData.kjInfo.contact || 'Not provided'}\n`;
    }

    confirmationMessage += `\nStreet Address: ${formData.streetAddress}\n`;
    confirmationMessage += `City: ${formData.city}\n`;
    confirmationMessage += `State: ${formData.state}\n`;
    confirmationMessage += `Zip Code: ${formData.zipCode}\n`;
    confirmationMessage += `Email: ${formData.email}\n`;
    confirmationMessage += `Telephone: ${formData.telephone || 'Not provided'}\n`;
    confirmationMessage += `Social Media: ${formData.social || 'Not provided'}\n\n`;

    confirmationMessage += "Karaoke Times:\n";
    if (formData.karaokeTimes.length > 0) {
        formData.karaokeTimes.forEach(time => {
            confirmationMessage += `  - ${time.day}: ${time.startTime} to ${time.endTime}\n`;
        });
    } else {
        confirmationMessage += "  - None specified\n";
    }

    confirmationMessage += `\nGenres: ${formData.genres}\n`;
    confirmationMessage += `Languages: ${formData.languages}\n\n`;
    confirmationMessage += `Room Type: ${formData.roomType}\n`;

    if (formData.roomType === 'Public' || formData.roomType === 'Both') {
        confirmationMessage += `Public Stage Type: ${formData.publicStageType}\n`;
    }

    const userConfirmation = confirm(confirmationMessage);

    if (userConfirmation) {
        const scriptURL = 'https://script.google.com/macros/s/AKfycbwmV6yznDONGX-z0hmLiU_heK177NJQsqaFvqc__Fr5oTexOEiivtL2iqINqz74ZmTDiA/exec';

        fetch(scriptURL, {
            method: 'POST',
            body: JSON.stringify(formData),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('Success:', data);
            alert('Thank you! Your information has been submitted successfully.');
            document.getElementById('karaokeForm').reset();
            document.getElementById('timeDisplayList').innerHTML = '';
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred. Please try again later.');
        });
    } else {
        console.log('Submission canceled by user.');
    }
});

// Initial call to set up the form state on page load
toggleKJSection();
populateTimeSelects();