from locust import HttpUser, task, between


class OTL_Locust(HttpUser):
    wait_time = between(3, 5)

    code = "c857eb3a9234ccab38eb"
    state = "8d973242f7cca7d3e253"

    user_id = "1"
    course_id = "1973"  # CS453
    professor_id = "2007"

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
        url = "/session/setting"

        response = self.client.get(url, name='session_setting_get')

    @task
    def session_setting_post(self):
        url = "/session/setting"

        data = {"fav_department": ["EE", "CS", "MSB"]}

        response = self.client.post(url, name='session_setting_post')

    # subject APIs
    @task
    def get_semesters(self):
        self.client.get("/api/semesters")

    @task
    def get_courses(self):
        params = {
            "department": "ALL",
            "type": "ALL",
            "grade": "ALL",
            "term": "ALL",
            "keyword": "cs453"
        }
        self.client.get("/api/courses", params=params)

    @task
    def get_course(self):
        self.client.get(f"/api/courses/{self.course_id}")

    @task
    def get_courses_auto_complete(self):
        params = {"keyword": "전산"}
        self.client.get("/api/courses/autocomplete", params=params)

    @task
    def get_lectures_from_course(self):
        self.client.get(f"/api/courses/{self.course_id}/lectures")

    @task
    def get_lectures(self):
        params = {
            "year": "2020",
            "semester": "1",
            "department": "CS",
            "type": "ALL",
            "grade": "400",
            "day": "",
            "begin": "",
            "end": "",
            "keyword": "테스팅",
        }
        self.client.get("/api/lectures", params=params)

    @task
    def get_Lectures_auto_complete(self):
        params = {
            "year": "2020",
            "semester": "1",
            "keyword": "cs"
        }
        self.client.get("/api/lectures/automcomplete", params=params)

    @task
    def get_taken_courses(self):
        user_id = "1"
        self.client.get(f"/api/users/{user_id}/taken-courses")
    
    # timetable APIs
    @task
    def get_table(self):
        response = self.client.get('/timetable')

    @task
    def table_update_lecture_delete(self):
        body = {
            'table_id': 1,
            'lecture_id': 1,
            'delete': u'true',
        }
        response = self.client.post('/timetable/api/table_update', data=body)

    @task
    def table_update(self):
        body = {
            'table_id': 1,
            'lecture_id': 1,
            'delete': u'false',
        }
        response = self.client.post('/timetable/api/table_update', data=body)

    @task
    def table_create(self):
        body = {
            'year': 2018,
            'semester': 1,
            'lectures': [1, 2],
        }
        response = self.client.post('/timetable/api/table_create', data=body)

    @task
    def table_delete(self):
        body = {
            'table_id': 1,
            'year': 2018,
            'semester': 1,
        }
        response = self.client.post('/timetable/api/table_delete', data=body)

    @task
    def table_copy(self):
        body = {
            'table_id': 1,
            'year': 2018,
            'semester': 1,
        }
        response = self.client.post('/timetable/api/table_copy', data=body)

    @task
    def table_load(self):
        body = {
            'year': 2018,
            'semester': 1,
        }
        response = self.client.post('/timetable/api/table_load', data=body)

    @task
    def autocomplete(self):
        body = {
            'year': 2018,
            'semester': 1,
            'keyword': '논리',
        }
        response = self.client.post('/api/autocomplete', data=body)

    @task
    def search(self):
        body = {
            'year': 2018,
            'semester': 1,
        }
        response = self.client.post('/api/search', data=body)

    @task
    def comment_load(self):
        body = {
            'lecture_id': 1,
        }
        response = self.client.post('/timetable/api/comment_load', data=body)

    @task
    def major_load(self):
        body = {
            'year': 2018,
            'semester': 1,
        }
        response = self.client.post('/timetable/api/list_load_major', data=body)

    @task
    def humanity_load(self):
        body = {
            'year': 2018,
            'semester': 1,
        }
        response = self.client.post('/timetable/api/list_load_humanity', data=body)

    @task
    def wishlist_load(self):
        body = {
            'year': 2018,
            'semester': 1,
        }
        response = self.client.post('/timetable/api/wishlist_load', data=body)

    @task
    def wishlist_update(self):
        body = {
            'lecture_id': 1,
            'delete': u'false',
        }
        response = self.client.post('/timetable/api/wishlist_update', data=body)

    @task
    def wishlist_update_lecture_delete(self):
        body = {
            'lecture_id': 1,
            'delete': u'true',
        }
        response = self.client.post('/timetable/api/wishlist_update', data=body)

    @task
    def share_image(self):
        params = {
            'table_id': 1,
        }
        response = self.client.get('/timetable/api/share_image', params=params)

    @task
    def share_calander(self):
        params = {
            'table_id': 1,
            'year': 2018,
            'semester': 1,
        }
        response = self.client.get('/timetable/api/share_calander', params=params)

    @task
    def google_auth_return(self):
        params = {
            'state': 'some-valid-token',
        }
        response = self.client.get('/timetable/google_auth_return', params=params)


    # review APIs
    @task
    def get_main(self):
        self.client.get("/main")

    @task
    def get_credit(self):
        self.client.get("/credit")

    @task
    def get_license(self):
        self.client.get("/license")

    @task
    def get_last_comment_json(self):
        params = {
            "filter": ["F"],
        }
        self.client.get(f"/review/json/{self.course_id}", params=params)

    @task
    def get_comment(self):
        self.client.get(f"/review/comment/{self.course_id}")

    @task
    def get_professor_review(self):
        self.client.get(f"/review/result/professor/{self.professor_id}/{self.course_id}")

    @task
    def get_professor_review_json(self):
        self.client.get(f"/review/result/professor/{self.professor_id}/json/{self.course_id}/1/")

    @task
    def get_course_review(self):
        self.client.get(f"/review/result/course/{self.course_id}/{self.professor_id}/")

    @task
    def get_course_review_json(self):
        self.client.get(f"/review/result/course/{self.course_id}/{self.professor_id}/1/")

    @task
    def get_result(self):
        params = {
            "q": "테스팅",    # 키워드
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
        self.client.get("/review/result/", params=params)

    @task
    def get_result_json(self):
        params = {
            "q": "테스팅",    # 키워드
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
        self.client.get("/review/result.json/1/", params=params)
