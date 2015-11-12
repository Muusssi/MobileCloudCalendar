
var CLIENT_ID = '992324920493-itejc4liatlf00ab77ms4i28hlsi0lsf.apps.googleusercontent.com';

var SCOPES = ["https://www.googleapis.com/auth/calendar"];

var events = null;

// Check if current user has authorized this application.
function checkAuth() {
    gapi.auth.authorize(
      {
        'client_id': CLIENT_ID,
        'scope': SCOPES.join(' '),
        'immediate': false
      }, handleAuthResult);
}

// Handle response from authorization server.
function handleAuthResult(authResult) {
    var syncButton = document.getElementById('sync_button');
    if (authResult && !authResult.error) {
      // Hide auth UI, then load client library.
      console.log("Should none");
      syncButton.style.display = 'none';
      loadCalendarApi();
    } else {
        syncButton.style.display = 'inline';
    }
}


// Initiate auth flow in response to user clicking authorize button.
function handleAuthClick(event) {
    gapi.auth.authorize(
      {client_id: CLIENT_ID, scope: SCOPES, immediate: false},
      handleAuthResult);
    return false;
}

// Load Google Calendar client library. List upcoming GCevents
// once client library is loaded.
function loadCalendarApi() {
        gapi.client.load('calendar', 'v3', syncCalendar);
      }

function syncCalendar() {

    // Get Google calendar GCevents
    var request = gapi.client.calendar.events.list({
          'calendarId': 'primary',
          'timeMin': (new Date()).toISOString(),
          'showDeleted': false,
          'singleEvents': true,
          'maxResults': 10,
          'orderBy': 'startTime'
        });
    request.execute(function(resp) {
        var GCevents = resp.items;
        //alert(events);
        if (GCevents.length > 0) {
            for (i = 0; i < GCevents.length; i++) {
                var event = GCevents[i];

                var xmlhttp = new XMLHttpRequest();   // new HttpRequest instance 
                xmlhttp.open("POST", "./events");
                xmlhttp.setRequestHeader("Content-Type", "application/json");
                xmlhttp.send(JSON.stringify(
                    {
                        title: event.summary,
                        description: event.description,
                        location: event.location,
                        startTime: event.start.dateTime,
                        endTime: event.end.dateTime,
                        googleCalendarId: event.id,
                        etag: event.etag,
                    }));
            }
            location.reload();
        }
    });

}


