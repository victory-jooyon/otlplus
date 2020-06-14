from locust import HttpUser, task, between, constant


class Timetable(HttpUser):
    wait_time = constant(1)

    @task
    def get_table(self):
        response = self.client.get('timetable')

    @task
    def table_update_lecture_delete(self):
        body = {
            'table_id': 1,
            'lecture_id': 1,
            'delete': u'true',
        }
        response = self.client.post('timetable/api/table_update', data=body)

    @task
    def table_update(self):
        body = {
            'table_id': 1,
            'lecture_id': 1,
            'delete': u'false',
        }
        response = self.client.post('timetable/api/table_update', data=body)

    @task
    def table_create(self):
        body = {
            'year': 2018,
            'semester': 1,
            'lectures': [1, 2],
        }
        response = self.client.post('timetable/api/table_create', data=body)

    @task
    def table_delete(self):
        body = {
            'table_id': 1,
            'year': 2018,
            'semester': 1,
        }
        response = self.client.post('timetable/api/table_delete', data=body)

    @task
    def table_copy(self):
        body = {
            'table_id': 1,
            'year': 2018,
            'semester': 1,
        }
        response = self.client.post('timetable/api/table_copy', data=body)

    @task
    def table_load(self):
        body = {
            'year': 2018,
            'semester': 1,
        }
        response = self.client.post('timetable/api/table_load', data=body)

    @task
    def autocomplete(self):
        body = {
            'year': 2018,
            'semester': 1,
            'keyword': '논리',
        }
        response = self.client.post('api/autocomplete', data=body)

    @task
    def search(self):
        body = {
            'year': 2018,
            'semester': 1,
        }
        response = self.client.post('api/search', data=body)

    @task
    def comment_load(self):
        body = {
            'lecture_id': 1,
        }
        response = self.client.post('timetable/api/comment_load', data=body)

    @task
    def major_load(self):
        body = {
            'year': 2018,
            'semester': 1,
        }
        response = self.client.post('timetable/api/list_load_major', data=body)

    @task
    def humanity_load(self):
        body = {
            'year': 2018,
            'semester': 1,
        }
        response = self.client.post('timetable/api/list_load_humanity', data=body)

    @task
    def wishlist_load(self):
        body = {
            'year': 2018,
            'semester': 1,
        }
        response = self.client.post('timetable/api/wishlist_load', data=body)

    @task
    def wishlist_update(self):
        body = {
            'lecture_id': 1,
            'delete': u'false',
        }
        response = self.client.post('timetable/api/wishlist_update', data=body)

    @task
    def wishlist_update_lecture_delete(self):
        body = {
            'lecture_id': 1,
            'delete': u'true',
        }
        response = self.client.post('timetable/api/wishlist_update', data=body)

    @task
    def share_image(self):
        params = {
            'table_id': 1,
        }
        response = self.client.get('timetable/api/share_image', params=params)

    @task
    def share_calander(self):
        params = {
            'table_id': 1,
            'year': 2018,
            'semester': 1,
        }
        response = self.client.get('timetable/api/share_calander', params=params)

    @task
    def google_auth_return(self):
        params = {
            'state': 'some-valid-token',
        }
        response = self.client.get('timetable/google_auth_return', params=params)
