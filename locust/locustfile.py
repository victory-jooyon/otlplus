from locust import HttpUser, task, between


class OTL_Locust(HttpUser):
    wait_time = between(3, 5)

    code = "c857eb3a9234ccab38eb"
    state = "8d973242f7cca7d3e253"

    user_id = "1"
    course_id = "865"
    professor_id = "796"

    csrf_token = None

    lecture_id = 987440

    def on_start(self):
        self.get_main()
        self.session_login_callback()

    # session APIs
    @task
    def session(self):
        return self.session_login()

    @task
    def session_login(self):
        url = "/session/login" \
            # + "next=" + "/"

        data = {"sso_state": self.state}

        response = self.client.get(url, data=data, name='session_login')
        # print('Response status code:', response.status_code)
        # print('Response content:', response.content)

    @task
    def session_login_callback(self):

        url = "/session/login/callback?" \
            + "state= " + self.state + "&" \
            + "code= " + self.code

        data = {"sso_state": self.state}

        response = self.client.get(
            url, data=data, name='session_login_callback')

    @task
    def session_logout(self):
        url = "/session/logout?" \
            # + "next=" + "/"

        response = self.client.get(url, name='session_logout')

    # @task
    # def session_unregister(self):
    # 	code = "c857eb3a9234ccab38eb"
    # 	state = "8d973242f7cca7d3e253"

    # 	url = "/session/unregister"

    # 	response = self.client.post(url, name='session_unregister')

    @task
    def session_language(self):
        url = "/session/language"

        response = self.client.get(url, name='session_language')

    @task
    def session_setting_get(self):
        url = "/session/settings"

        response = self.client.get(url, name='session_setting_get')

    @task
    def session_setting_post(self):
        url = "/session/settings/"

        data = {
            'language': "ko",
            'fav_department': [132, 331, 4423]
        }

        response = self.client.post(url,
            data=data,
            headers={"X-CSRFToken": self.csrf_token},
            cookies={"csrftoken": self.csrf_token},
            name='session_setting_post'
        )

    # timetable APIs
    @task
    def get_table(self):
        response = self.client.get('/timetable', name='get_table')

    @task
    def table_update_lecture_delete(self):
        table_id = self.table_create()
        body = {
            'table_id': table_id,
            'lecture_id': 1377884,
            'delete': u'true',
        }
        response = self.client.post('/timetable/api/table_update/',
            data=body,
            headers={"X-CSRFToken": self.csrf_token},
            cookies={"csrftoken": self.csrf_token},
            name='table_update')

    @task
    def table_update(self):
        table_id = self.table_create()
        body = {
            'table_id': table_id,
            'lecture_id': 1377884,
            'delete': u'false',
        }
        response = self.client.post('/timetable/api/table_update/',
            data=body,
            headers={"X-CSRFToken": self.csrf_token},
            cookies={"csrftoken": self.csrf_token},
            name='table_update')

    @task
    def table_create(self):
        body = {
            'year': 2018,
            'semester': 1,
            'lectures': [1, 2],
        }
        response = self.client.post('/timetable/api/table_create/',
            data=body,
            headers={"X-CSRFToken": self.csrf_token},
            cookies={"csrftoken": self.csrf_token},
            name='table_create')

        return response.json()["id"]

    @task
    def table_delete(self):
        table_id = self.table_create()
        body = {
            'table_id': table_id,
            'year': 2018,
            'semester': 1,
        }
        response = self.client.post('/timetable/api/table_delete/',
            data=body,
            headers={"X-CSRFToken": self.csrf_token},
            cookies={"csrftoken": self.csrf_token},
            name='table_delete')

    @task
    def table_copy(self):
        table_id = self.table_create()
        body = {
            'table_id': table_id,
            'year': 2018,
            'semester': 1,
        }
        response = self.client.post('/timetable/api/table_copy/',
            data=body,
            headers={"X-CSRFToken": self.csrf_token},
            cookies={"csrftoken": self.csrf_token},
            name='table_copy')

    @task
    def table_load(self):
        body = {
            'year': 2018,
            'semester': 1,
        }
        response = self.client.post('/timetable/api/table_load/',
            data=body,
            headers={"X-CSRFToken": self.csrf_token},
            cookies={"csrftoken": self.csrf_token},
            name='table_load')

    @task
    def table_autocomplete(self):
        body = {
            'year': 2018,
            'semester': 1,
            'keyword': '논리',
        }
        response = self.client.post('/timetable/api/autocomplete/',
            data=body,
            headers={"X-CSRFToken": self.csrf_token},
            cookies={"csrftoken": self.csrf_token},
            name='table_autocomplete')

    @task
    def table_search(self):
        body = """{
            'year': 2018,
            'semester': 1,
        }"""
        response = self.client.post('/timetable/api/search/',
            data=body,
            headers={"X-CSRFToken": self.csrf_token},
            cookies={"csrftoken": self.csrf_token},
            name='table_search')

    @task
    def comment_load(self):
        body = {
            'lecture_id': self.lecture_id,
        }
        response = self.client.post('/timetable/api/comment_load/',
            data=body,
            headers={"X-CSRFToken": self.csrf_token},
            cookies={"csrftoken": self.csrf_token},
            name='comment_load'
        )

    @task
    def major_load(self):
        body = {
            'year': 2018,
            'semester': 1,
        }
        response = self.client.post('/timetable/api/list_load_major/',
            data=body,
            headers={"X-CSRFToken": self.csrf_token},
            cookies={"csrftoken": self.csrf_token},
            name='major_load'
        )

    @task
    def humanity_load(self):
        body = {
            'year': 2018,
            'semester': 1,
        }
        response = self.client.post('/timetable/api/list_load_humanity/',
            data=body,
            headers={"X-CSRFToken": self.csrf_token},
            cookies={"csrftoken": self.csrf_token},
            name='humanity_load'
        )

    @task
    def wishlist_load(self):
        body = {
            'year': 2018,
            'semester': 1,
        }
        response = self.client.post('/timetable/api/wishlist_load/',
            data=body,
            headers={"X-CSRFToken": self.csrf_token},
            cookies={"csrftoken": self.csrf_token},
            name='wishlist_load'
        )

    @task
    def wishlist_update(self):  # can fail due to call before load
        body = {
            'lecture_id': self.lecture_id,
            'delete': u'false',
        }
        response = self.client.post('/timetable/api/wishlist_update/',
            data=body,
            headers={"X-CSRFToken": self.csrf_token},
            cookies={"csrftoken": self.csrf_token},
            name='wishlist_update'
        )

    @task
    def wishlist_update_lecture_delete(self): # can fail due to call before update
        body = {
            'lecture_id': self.lecture_id,
            'delete': u'true',
        }
        response = self.client.post('/timetable/api/wishlist_update/',
            data=body,
            headers={"X-CSRFToken": self.csrf_token},
            cookies={"csrftoken": self.csrf_token},
            name='wishlist_update_lecture_delete'
        )

    @task
    def share_image(self):
        table_id = self.table_create()
        params = {
            'table_id': table_id,
        }
        response = self.client.get('/timetable/api/share_image', params=params, name='share_image')

    @task
    def share_calander(self):
        table_id = self.table_create()
        params = {
            'table_id': table_id,
            'year': 2018,
            'semester': 1,
        }
        response = self.client.get('/timetable/api/share_calendar', params=params, name='share_calander')

    @task
    def google_auth_return(self):
        params = {
            'state': 'some-valid-token',
        }
        response = self.client.get('/timetable/google_auth_return', params=params, name='google_auth_return')


    # review APIs
    @task
    def get_main(self):
        response= self.client.get("/main", name='get_main')
        self.csrf_token = response.cookies['csrftoken']
        # print("TOKEN : ", self.csrf_token)

    @task
    def get_review(self):
        self.client.get("/review/", name='get_review')

    @task
    def refresh_review(self):
        self.client.get("/review/refresh/", name='refresh_review')

    @task
    def insert_review(self):
        self.client.get("/review/refresh/", name='insert_review')

    @task
    def get_credits(self):
        self.client.get("/credits", name='get_credits')

    @task
    def get_licenses(self):
        self.client.get("/licenses", name='get_licenses')

    @task
    def get_last_comment_json(self):
        params = {
            "filter": ["F"],
        }
        self.client.get(f"/review/json/{self.course_id}", params=params, name='get_last_comment_json')

    @task
    def get_comment(self):
        self.client.get(f"/review/result/comment/{self.course_id}", name='get_comment')

    @task
    def get_professor_review(self):
        self.client.get(f"/review/result/professor/{self.professor_id}/{self.course_id}", name='get_professor_review')

    @task
    def get_professor_review_json(self):
        self.client.get(f"/review/result/professor/{self.professor_id}/json/{self.course_id}/1/", name='get_professor_review_json')

    @task
    def get_course_review(self):
        self.client.get(f"/review/result/course/{self.course_id}/1/", name='get_course_review')

    @task
    def get_course_review_json(self):
        self.client.get(f"/review/result/course/{self.course_id}/1/json/1", name='get_course_review_json')

    @task
    def get_result(self):
        params = {
            "q": "논리적",    # 키워드
            "sort": "name",
            # "sort": "total",
            # "sort": "grade",
            # "sort": "load",
            # "sort": "speech",
            # "semester": 1,
            # "department": "",
            # "type": "",
            # "grade": "",
        }
        self.client.get("/review/result/", params=params, name='get_result')

    @task
    def get_result_json(self):
        params = {
            "q": "논리적",    # 키워드
            "sort": "name",
            # "sort": "total",
            # "sort": "grade",
            # "sort": "load",
            # "sort": "speech",
            # "semester": 1,
            # "department": "",
            # "type": "",
            # "grade": "",
        }
        self.client.get("/review/result/json/1/", params=params, name='get_result_json')
