let tokenClient;
let accessToken = null;

const SCOPES = 'https://www.googleapis.com/auth/spreadsheets';
const CLIENT_ID = '939292928034-m9r62i6hpfvpg0muk9h17ngaebe1hus8.apps.googleusercontent.com'; // Replace with your client ID
const SPREADSHEET_ID = '1tPhiXiozYWXejeE9DtmsCHyzqY40Xco5ktvVvj-Wyuk'; // Replace with your spreadsheet ID

// Initialize the OAuth2 token client from GIS library
function initializeGoogleAuth() {
    tokenClient = google.accounts.oauth2.initTokenClient({
        client_id: CLIENT_ID,
        scope: SCOPES,
        callback: (tokenResponse) => {
            if (tokenResponse.error) {
                console.error('Error during token request:', tokenResponse.error);
                return;
            }
            accessToken = tokenResponse.access_token;
            console.log('Token received:', accessToken);
        },
    });
}

// Event listener for form submission
document.getElementById('personalInfoForm').addEventListener('submit', async function (event) {
    event.preventDefault(); // Prevent form submission

    if (!accessToken) {
        console.log('Requesting OAuth token...');
        tokenClient.requestAccessToken(); // Request token if not already available
        return; // Wait until token is obtained
    }

    // Get form data
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const address = document.getElementById('address').value;
    const city = document.getElementById('city').value;
    const state = document.getElementById('state').value;
    const zip = document.getElementById('zip').value;
    const dob = document.getElementById('dob').value;
    const notes = document.getElementById('notes').value;

    const dataToSubmit = [[firstName, lastName, email, phone, address, city, state, zip, dob, notes]];

    // Call Google Sheets API to append data
    appendDataToGoogleSheets(dataToSubmit);
});

// Function to append data to Google Sheets using the Sheets API
async function appendDataToGoogleSheets(values) {
    const requestBody = {
        values: values,
    };

    try {
        const response = await fetch(
            `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/Sheet1!A1:append?valueInputOption=RAW`,
            {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody),
            }
        );

        const result = await response.json();
        if (response.ok) {
            console.log('Data appended successfully:', result);
        } else {
            console.error('Error appending data:', result.error.message);
        }
    } catch (error) {
        console.error('Error calling Google Sheets API:', error);
    }
}

// Initialize Google OAuth2 on page load
window.onload = initializeGoogleAuth;
