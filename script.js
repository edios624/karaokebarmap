// ... (keep all the functions from the previous script.js, like toggleKJSection, addTimeSlot, etc.) ...

document.getElementById('karaokeForm').addEventListener('submit', function(event) {
    event.preventDefault();

    function getCheckedValues(name) {
        return Array.from(document.querySelectorAll(`input[name="${name}"]:checked`))
                    .map(checkbox => checkbox.value);
    }

    function getRadioValue(name) {
        const radio = document.querySelector(`input[name="${name}"]:checked`);
        return radio ? radio.value : 'Not specified';
    }

    const karaokeTimes = [];
    document.querySelectorAll('.day-time-group').forEach(group => {
        const day = group.querySelector('select[name="day"]').value;
        const startTime = group.querySelector('input[name="startTime"]').value;
        const endTime = group.querySelector('input[name="endTime"]').value;
        if (day && startTime && endTime) {
            karaokeTimes.push({ day, startTime, endTime });
        }
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
    // ... (rest of the confirmation message code remains the same) ...

    const userConfirmation = confirm(confirmationMessage);

    if (userConfirmation) {
        // ---- THIS IS THE NEW CODE ----
        const scriptURL = https://script.google.com/macros/s/AKfycbwmV6yznDONGX-z0hmLiU_heK177NJQsqaFvqc__Fr5oTexOEiivtL2iqINqz74ZmTDiA/exec; // <-- PASTE YOUR URL HERE

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
            this.reset();
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred. Please try again later.');
        });
        // ---- END OF NEW CODE ----
    } else {
        console.log('Submission canceled by user.');
    }
});