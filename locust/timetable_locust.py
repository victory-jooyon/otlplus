from locust import HttpUser, task, between, constant


class Timetable(HttpUser):
    wait_time = constant(1)

    @task
    def table_update(self):
        body = {
            'table_id': 1,
            'lecture_id': 1,
            'delete': False,
        }
        response = self.client.post('timetable/table_update', data=body)

    @task
    def table_update_lecture_delete(self):
        body = {
            'table_id': 1,
            'lecture_id': 1,
            'delete': True,
        }
        response = self.client.post('timetable/table_update', data=body)

    @task
    def table_create(self):
        body = {
            'year': 2018,
            'semester': 1,
            'lectures': [1, 2],
        }
        response = self.client.post('timetable/table_create', data=body)

    @task
    def table_delete(self):
        body = {
            'table_id': 1,
            'year': 2018,
            'semester': 1,
        }
        response = self.client.post('timetable/table_delete', data=body)

    @task
    def table_load(self):
        body = {
            'year': 2018,
            'semester': 1,
        }
        response = self.client.post('timetable/table_load', data=body)

    @task
    def wishlist_load(self):
        body = {
            'year': 2018,
            'semester': 1,
        }
        response = self.client.post('timetable/wishlist_load', data=body)

    @task
    def wishlist_update(self):
        body = {
            'lecture_id': 1,
            'delete': False,
        }
        response = self.client.post('timetable/wishlist_update', data=body)

    @task
    def wishlist_update_lecture_delete(self):
        body = {
            'lecture_id': 1,
            'delete': True,
        }
        response = self.client.post('timetable/wishlist_update', data=body)

    @task
    def table_delete(self):
        body = {
            'table_id': 1,
            'year': 2018,
            'semester': 1,
        }
        response = self.client.post('timetable/table_delete', data=body)

    @task
    def share_image(self):
        params = {
            'table_id': 1,
            'year': 2018,
            'semester': 1,
        }
        response = self.client.get('timetable/share_image', params=params)

    @task
    def share_calander(self):
        params = {
            'table_id': 1,
            'year': 2018,
            'semester': 1,
        }
        response = self.client.get('timetable/share_calander', params=params)

    @task
    def google_auth_return(self):
        response = self.client.get('external/google/google_auth_return')
