const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');
const { expect } = require('chai');
const {
  WEATHER_ALERTS_API_URL,
  fetchWeatherData,
  displayWeather,
  displayError,
  handleWeatherSubmit
} = require('../weather-alerts.js');

describe('weather alerts', () => {
  let dom;

  beforeEach(() => {
    dom = new JSDOM(
      '<form id="weather-form"><input id="state-input"><button type="submit">Get alerts</button></form>' +
      '<p id="weather-status"></p><section id="weather-alerts"></section>'
    );
    global.document = dom.window.document;
  });

  afterEach(() => {
    delete global.document;
    dom.window.close();
  });

  it('fetches active alerts for the normalized state', async () => {
    const data = { features: [] };
    let requestUrl;

    const result = await fetchWeatherData(' ca ', async (url, options) => {
      requestUrl = url;
      expect(options.headers.Accept).to.equal('application/geo+json');
      return { ok: true, json: async () => data };
    });

    expect(requestUrl).to.equal(`${WEATHER_ALERTS_API_URL}?area=CA`);
    expect(result).to.equal(data);
  });

  it('rejects invalid state input before making a request', async () => {
    let wasRequested = false;
    const error = await fetchWeatherData('XX', async () => {
      wasRequested = true;
    }).then(() => null, (reason) => reason);

    expect(wasRequested).to.equal(false);
    expect(error.message).to.equal('Enter a valid two-letter U.S. state or territory abbreviation.');
  });

  it('rejects failed requests and malformed API data', async () => {
    const requestError = await fetchWeatherData('NY', async () => ({
      ok: false,
      status: 503
    })).then(() => null, (error) => error);
    expect(requestError.message).to.equal('Weather alerts request failed with status 503.');

    const dataError = await fetchWeatherData('NY', async () => ({
      ok: true,
      json: async () => ({ features: null })
    })).then(() => null, (error) => error);
    expect(dataError.message).to.equal('Weather alerts response did not contain a valid alert list.');
  });

  it('renders headlines and alert details as text', () => {
    displayWeather({
      features: [{
        properties: {
          headline: '<strong>High Wind Warning</strong>',
          areaDesc: 'Coastal California',
          severity: 'Severe'
        }
      }]
    });

    const card = document.querySelector('#weather-alerts article');
    expect(card.querySelector('h2').textContent).to.equal('<strong>High Wind Warning</strong>');
    expect(card.querySelector('strong')).to.equal(null);
    expect(card.querySelector('p').textContent).to.equal('Coastal California - Severe');
  });

  it('renders a message when there are no active alerts', () => {
    displayWeather({ features: [] });
    expect(document.querySelector('#weather-alerts').textContent)
      .to.equal('There are no active weather alerts for this state.');
  });

  it('displays validation and request errors to the user', async () => {
    const input = document.querySelector('#state-input');
    const event = { preventDefault() {} };
    input.value = '';
    await handleWeatherSubmit(event, async () => {
      throw new Error('Should not request invalid input');
    });
    expect(document.querySelector('#weather-status').textContent)
      .to.equal('Enter a two-letter U.S. state abbreviation.');

    const originalError = console.error;
    console.error = () => {};
    try {
      input.value = 'CA';
      await handleWeatherSubmit(event, async () => ({ ok: false, status: 500 }));
      expect(document.querySelector('#weather-status').textContent)
        .to.equal('Weather alerts request failed with status 500.');
      expect(document.querySelector('#weather-status').dataset.state).to.equal('error');
    } finally {
      console.error = originalError;
    }
  });

  it('connects the browser form submit to the weather request', async () => {
    const page = new JSDOM(
      '<form id="weather-form"><input id="state-input" value="WA"></form>' +
      '<p id="weather-status"></p><section id="weather-alerts"></section>',
      { runScripts: 'outside-only' }
    );
    page.window.fetch = async () => ({
      ok: true,
      json: async () => ({ features: [{ properties: { headline: 'Snow Advisory' } }] })
    });
    page.window.eval(
      fs.readFileSync(path.resolve(__dirname, '..', 'weather-alerts.js'), 'utf8')
    );

    const event = new page.window.Event('submit', { bubbles: true, cancelable: true });
    page.window.document.querySelector('#weather-form').dispatchEvent(event);
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(page.window.document.querySelector('#weather-alerts h2').textContent)
      .to.equal('Snow Advisory');
    expect(page.window.document.querySelector('#weather-status').dataset.state).to.equal('success');
    page.window.close();
  });
});
