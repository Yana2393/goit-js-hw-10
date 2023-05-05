import './css/styles.css';
import { fetchCountries } from './fetchCountries';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';

const DEBOUNCE_DELAY = 300;

const inputSearch = document.querySelector('#search-box');
const countriesList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');


inputSearch.addEventListener('input', debounce((event) => {
    event.preventDefault();
    const inputValue = event.target.value.trim();
    if (!inputValue.length) {
        countriesList.innerHTML = "";
        countryInfo.innerHTML = "";
        return;
    }
    fetchCountries((inputValue))
        .then(resp => {
        if (resp.length > 10) {
            countriesList.innerHTML = "";
            countryInfo.innerHTML = "";
            Notiflix.Notify.info('Too many matches found. Please enter a more specific name.');
        } else if (resp.length >= 2 && resp.length <= 10) {
            countryInfo.innerHTML = "";
            createCountrysList(resp);
        } else {
            countriesList.innerHTML = "";
            createCountryInfoBlock(resp[0]); 
        }
        })
        .catch(error => {
        Notiflix.Notify.failure('Oops, there is no country with that name');
        })
}, DEBOUNCE_DELAY));

function createCountrysList(countryData) {
    const countryOptions = countryData
        .map(({ flags, name }) => 
        `
         <li class="country-link">
        <img class="country-img" src="${flags.svg}" alt="${name.official}">
        <p class="country-txt">${name.official}</p>
      </li>
        `) 
        .join('');
    countriesList.innerHTML = countryOptions;
}


function createCountryInfoBlock(countryData) {
    const { flags, name, capital, population, languages } = countryData;
    const language = Object.values(languages);
    const countrySelect = `
         <div class="country-info-header">
          <img class="country-img" src="${flags.svg}" alt="${name.official}">
          <p class="country-info-title">${name.official}</p>
        </div>
        <p class="country-info-name"><span class="bold-txt">Capital:</span> ${capital}</p>
        <p class="country-info-name"><span class="bold-txt">Population:</span>${population}</p>
        <p class="country-info-name"><span class="bold-txt">Languages:</span>${language}</p>
    `
    countryInfo.innerHTML = countrySelect;
}








