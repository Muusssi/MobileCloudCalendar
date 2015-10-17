import requests
import json
import unittest
import datetime

                

class TestCalendarJSONCRUD(unittest.TestCase):

    def setUp(self):
        self.headers = {'Accept': 'application/json;'}
        self.added_calendars = []

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
        calendar = json.loads(r.text)
        self.added_calendars.append(calendar)
        return calendar

    def test_create_calendar(self):
        calendar = self.add_calendar()

    def test_read_calendars(self):
        r = requests.get('http://127.0.0.1:3000/calendars', headers=self.headers)
        self.assertEqual(r.status_code, 200)


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
           # First get the existing calendars
        calendar = self.add_calendar()
        # Then delete the first by id
        r = requests.delete(
                'http://127.0.0.1:3000/calendars/%s/edit' % (calendar['_id'], ),
                headers=self.headers
            )
        self.assertEqual(r.status_code, 200)


class TestEventJSONCRUD(unittest.TestCase):

    def setUp(self):
        self.headers = {'Accept': 'application/json;'}


# {
#     'title': 'Meeting',
#     'description': 'boring...',
#     'location': 'meeting room',
#     'startTime': str(datetime.datetime.utcnow()),
#     'endTime': str(datetime.datetime.utcnow()),
# },


if __name__ == '__main__':
    unittest.main()
