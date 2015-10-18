import requests
import json
import unittest
import datetime

                

class TestCalendarJSONCRUD(unittest.TestCase):

    def setUp(self):
        self.headers = {'Accept': 'application/json;'}
        self.added_calendars = []
        self.test_calendar = None

    def get_existing_calendars(self):
        r = requests.get('http://127.0.0.1:3000/calendars', headers=self.headers)
        self.assertEqual(r.status_code, 200)
        return json.loads(r.text)

    def add_calendar(self):
        payload = {
            'name': 'A Calendar',
            'description': 'My calendar',
        }
        r = requests.post('http://127.0.0.1:3000/calendars', json=payload, headers=self.headers)
        self.assertEqual(r.status_code, 200)
        #print r.text
        calendar = json.loads(r.text)
        self.added_calendars.append(calendar)
        return calendar

    def get_test_calendar(self):
        if not self.test_calendar:
            self.test_calendar = self.add_calendar()
        return self.test_calendar

    def test_create_calendar(self):
        calendar = self.add_calendar()

    def test_read_calendars(self):
        r = requests.get('http://127.0.0.1:3000/calendars', headers=self.headers)
        self.assertEqual(r.status_code, 200)
        #print r.text


    def test_read_calendars_by_id(self):
        # First get the existing calendars
        calendars = self.get_existing_calendars()
        # Then get the first by id
        r = requests.get('http://127.0.0.1:3000/calendars/%s' % (calendars[0]['_id'], ), headers=self.headers)
        self.assertEqual(r.status_code, 200)

    def test_update_calendars_by_id(self):
        # First get the existing calendars
        calendars = self.get_existing_calendars()
        # Then update the first by id
        payload = {
              'name': 'A Calendar',
              'description': 'A new description'
        }
        r = requests.put(
                'http://127.0.0.1:3000/calendars/%s/edit' % (calendars[0]['_id'], ),
                json=payload,
                headers=self.headers
            )
        self.assertEqual(r.status_code, 200)

    def test_delete_calendars_by_id(self):
        # First add a calendar
        calendar = self.add_calendar()
        # Then delete the calendar
        r = requests.delete(
                'http://127.0.0.1:3000/calendars/%s/edit' % (calendar['_id'], ),
                headers=self.headers
            )
        self.assertEqual(r.status_code, 200)
        r = requests.get(
                'http://127.0.0.1:3000/calendars/%s/edit' % (calendar['_id'], ),
                headers=self.headers
            )
        self.assertEqual(r.status_code, 404)

    def add_calendarEvent(self):
        calendar = self.get_test_calendar()
        # Then add a calendarEvent
        payload = {
                'title': 'Meeting',
                'description': 'boring...',
                'location': 'meeting room',
                'startTime': str(datetime.datetime.utcnow()),
                'endTime': str(datetime.datetime.utcnow()),
            }
        r = requests.post(
                'http://127.0.0.1:3000/calendars/%s/events' % (calendar['_id'], ),
                headers=self.headers, json=payload,
            )
        self.assertEqual(r.status_code, 200)
        return json.loads(r.text)

    def test_add_calendarEvent(self):
        self.add_calendarEvent()

    def test_read_calendarEvents(self):
        calendar = self.get_test_calendar()
        calendarEvent = self.add_calendarEvent()
        r = requests.get(
                'http://127.0.0.1:3000/calendars/%s/events' % (calendar['_id'], ),
                headers=self.headers,
            )
        self.assertEqual(r.status_code, 200)

    def test_read_calendarEvent_by_id(self):
        calendar = self.get_test_calendar()
        calendarEvent = self.add_calendarEvent()
        r = requests.get(
                'http://127.0.0.1:3000/calendars/%s/events/%s' % (calendar['_id'], calendarEvent['_id']),
                headers=self.headers,
            )
        self.assertEqual(r.status_code, 200)

    def test_update_calendarEvent_by_id(self):
        calendar = self.get_test_calendar()
        calendarEvent = self.add_calendarEvent()
        payload = {
                'title': 'Meeting',
                'description': 'not so boring',
                'location': 'another meeting room',
                'startTime': str(datetime.datetime.utcnow()),
                'endTime': str(datetime.datetime.utcnow()),
        }
        r = requests.put(
                'http://127.0.0.1:3000/calendars/%s/events/%s/edit' % (calendar['_id'], calendarEvent['_id']),
                headers=self.headers, json=payload,
            )
        self.assertEqual(r.status_code, 200)

    def test_delete_calendarEvent_by_id(self):
        calendar = self.get_test_calendar()
        calendarEvent = self.add_calendarEvent()
        r = requests.delete(
                'http://127.0.0.1:3000/calendars/%s/events/%s/edit' % (calendar['_id'], calendarEvent['_id']),
                headers=self.headers,
            )
        self.assertEqual(r.status_code, 200)
        r = requests.get(
                'http://127.0.0.1:3000/calendars/%s/events/%s' % (calendar['_id'], calendarEvent['_id']),
                headers=self.headers,
            )
        self.assertEqual(r.status_code, 404)

if __name__ == '__main__':
    unittest.main()

