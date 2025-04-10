// Utility function to get URL parameters
function getUrlParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

// Show loading spinner
function showLoading() {
    const spinner = document.createElement('div');
    spinner.className = 'loading-spinner';
    document.body.appendChild(spinner);
}

// Hide loading spinner
function hideLoading() {
    const spinner = document.querySelector('.loading-spinner');
    if (spinner) {
        spinner.remove();
    }
}

// DOM Elements
const bookingForm = document.getElementById('bookingForm');
const doctorCards = document.querySelectorAll('.doctor-card');
const navLinks = document.querySelectorAll('.nav-link');

// Form Validation
const validateForm = (formElement) => {
    const inputs = formElement.querySelectorAll('input, select, textarea');
    let isValid = true;

    inputs.forEach(input => {
        if (input.hasAttribute('required') && !input.value.trim()) {
            showError(input, 'This field is required');
            isValid = false;
        } else if (input.type === 'email' && input.value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(input.value)) {
                showError(input, 'Please enter a valid email address');
                isValid = false;
            }
        } else if (input.type === 'tel' && input.value) {
            const phoneRegex = /^\+?[\d\s-]{10,}$/;
            if (!phoneRegex.test(input.value)) {
                showError(input, 'Please enter a valid phone number');
                isValid = false;
            }
        }
    });

    return isValid;
};

// Error Display
const showError = (input, message) => {
    const formGroup = input.closest('.form-group');
    const existingError = formGroup.querySelector('.error-message');
    
    if (!existingError) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        formGroup.appendChild(errorDiv);
    }

    input.classList.add('error');
    
    input.addEventListener('input', () => {
        const error = formGroup.querySelector('.error-message');
        if (error) {
            error.remove();
        }
        input.classList.remove('error');
    }, { once: true });
};

// Loading State
const setLoading = (element, isLoading) => {
    if (isLoading) {
        element.classList.add('loading');
        element.disabled = true;
    } else {
        element.classList.remove('loading');
        element.disabled = false;
    }
};

// Form Submission Handler
if (bookingForm) {
    bookingForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        if (!validateForm(bookingForm)) {
            return;
        }

        const submitButton = bookingForm.querySelector('button[type="submit"]');
        setLoading(submitButton, true);

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Store form data in sessionStorage for confirmation page
            const formData = new FormData(bookingForm);
            const bookingData = Object.fromEntries(formData.entries());
            sessionStorage.setItem('bookingData', JSON.stringify(bookingData));
            
            // Redirect to confirmation page
            window.location.href = 'confirmation.html';
        } catch (error) {
            console.error('Submission error:', error);
            alert('An error occurred. Please try again.');
        } finally {
            setLoading(submitButton, false);
        }
    });
}

// Doctor Selection Handler
if (doctorCards) {
    doctorCards.forEach(card => {
        card.addEventListener('click', () => {
            const doctorName = card.querySelector('.doctor-name').textContent;
            const specialty = card.querySelector('.doctor-specialty').textContent;
            
            // Store selected doctor info
            sessionStorage.setItem('selectedDoctor', JSON.stringify({
                name: doctorName,
                specialty: specialty
            }));
            
            window.location.href = 'booking.html';
        });
    });
}

// Booking Form Pre-fill
const prefillBookingForm = () => {
    if (bookingForm) {
        const selectedDoctor = JSON.parse(sessionStorage.getItem('selectedDoctor') || '{}');
        const doctorNameInput = document.getElementById('doctorName');
        const specialtyInput = document.getElementById('specialty');

        if (selectedDoctor.name && doctorNameInput) {
            doctorNameInput.value = selectedDoctor.name;
        }
        if (selectedDoctor.specialty && specialtyInput) {
            specialtyInput.value = selectedDoctor.specialty;
        }
    }
};

// Confirmation Page Data Display
const displayConfirmationDetails = () => {
    const confirmationDetails = document.getElementById('confirmationDetails');
    if (confirmationDetails) {
        const bookingData = JSON.parse(sessionStorage.getItem('bookingData') || '{}');
        
        if (Object.keys(bookingData).length) {
            const details = `
                <div class="confirmation-item">
                    <i class="fas fa-user-md"></i>
                    <p><strong>Doctor:</strong> ${bookingData.doctorName}</p>
                </div>
                <div class="confirmation-item">
                    <i class="fas fa-user"></i>
                    <p><strong>Patient:</strong> ${bookingData.patientName}</p>
                </div>
                <div class="confirmation-item">
                    <i class="fas fa-calendar"></i>
                    <p><strong>Date:</strong> ${new Date(bookingData.appointmentDate).toLocaleDateString()}</p>
                </div>
                <div class="confirmation-item">
                    <i class="fas fa-clock"></i>
                    <p><strong>Time:</strong> ${bookingData.appointmentTime}</p>
                </div>
            `;
            confirmationDetails.innerHTML = details;
        }
    }
};

// Date Input Restrictions
const setDateRestrictions = () => {
    const dateInput = document.getElementById('appointmentDate');
    if (dateInput) {
        const today = new Date();
        const maxDate = new Date();
        maxDate.setMonth(maxDate.getMonth() + 3);
        
        dateInput.min = today.toISOString().split('T')[0];
        dateInput.max = maxDate.toISOString().split('T')[0];
    }
};

// Active Navigation Link
const setActiveNavLink = () => {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        }
    });
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    setActiveNavLink();
    prefillBookingForm();
    displayConfirmationDetails();
    setDateRestrictions();
    
    // Add smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
});

// Add CSS class for active nav link
document.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section[id]');
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            document.querySelector(`.nav-link[href="#${sectionId}"]`)?.classList.add('active');
        } else {
            document.querySelector(`.nav-link[href="#${sectionId}"]`)?.classList.remove('active');
        }
    });
}); 