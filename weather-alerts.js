const WEATHER_ALERTS_API_URL = 'https://api.weather.gov/alerts/active';
const US_STATE_ABBREVIATIONS = new Set([
    'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
    'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
    'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
    'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
    'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY',
    'DC', 'AS', 'GU', 'MP', 'PR', 'VI'
]);

async function fetchWeatherData(state, fetchFunction = fetch) {
    if (typeof state !== 'string' || !US_STATE_ABBREVIATIONS.has(state.trim().toUpperCase())) {
        throw new Error('Enter a valid two-letter U.S. state or territory abbreviation.');
    }

    const normalizedState = state.trim().toUpperCase();
    const response = await fetchFunction(
        `${WEATHER_ALERTS_API_URL}?area=${encodeURIComponent(normalizedState)}`,
        { headers: { Accept: 'application/geo+json' } }
    );

    if (!response.ok) {
        throw new Error(`Weather alerts request failed with status ${response.status}.`);
    }

    const data = await response.json();
    if (!data || !Array.isArray(data.features)) {
        throw new TypeError('Weather alerts response did not contain a valid alert list.');
    }

    return data;
}

function displayWeather(data, alertsContainer = document.querySelector('#weather-alerts')) {
    alertsContainer.replaceChildren();
    const alerts = data.features;

    if (alerts.length === 0) {
        const emptyMessage = document.createElement('p');
        emptyMessage.textContent = 'There are no active weather alerts for this state.';
        alertsContainer.appendChild(emptyMessage);
        return;
    }

    alerts.forEach((alert) => {
        const properties = alert.properties || {};
        const alertCard = document.createElement('article');
        const headline = document.createElement('h2');
        const details = document.createElement('p');

        headline.textContent = properties.headline || properties.event || 'Weather alert';
        details.textContent = [properties.areaDesc, properties.severity]
            .filter(Boolean)
            .join(' - ');
        alertCard.append(headline, details);
        alertsContainer.appendChild(alertCard);
    });
}

function displayError(message, statusElement = document.querySelector('#weather-status')) {
    statusElement.textContent = message;
    statusElement.dataset.state = 'error';
}

async function handleWeatherSubmit(event, fetchFunction = fetch) {
    event.preventDefault();

    const stateInput = document.querySelector('#state-input');
    const status = document.querySelector('#weather-status');
    const alertsContainer = document.querySelector('#weather-alerts');
    const state = stateInput.value;
    alertsContainer.replaceChildren();

    if (!state.trim()) {
        displayError('Enter a two-letter U.S. state abbreviation.', status);
        stateInput.focus();
        return;
    }

    status.dataset.state = 'loading';
    status.textContent = 'Loading weather alerts...';    try {
        const data = await fetchWeatherData(state, fetchFunction);
        displayWeather(data, alertsContainer);
        status.dataset.state = 'success';
        status.textContent = `Weather alerts for ${state.trim().toUpperCase()}.`;
    } catch (error) {
        displayError(error.message, status);
        console.error('Failed to load weather alerts:', error);
    }
}

if (typeof document !== 'undefined' && typeof module === 'undefined') {
    document.querySelector('#weather-form').addEventListener('submit', (event) => {
        handleWeatherSubmit(event);
    });
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        WEATHER_ALERTS_API_URL,
        fetchWeatherData,
        displayWeather,
        displayError,
        handleWeatherSubmit
    };
}
