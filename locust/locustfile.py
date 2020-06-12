from locust import HttpUser, task, between

class OTL_Locust(HttpUser):
    wait_time = between(3, 5)

    code = "c857eb3a9234ccab38eb"
    state = "8d973242f7cca7d3e253"

    user_id = "1"
    course_id = "1973" #CS453

    @task
    def session(self):
        return self.session_login()

	@task
	def session_login(self):
		url = "/session/login" \
			# + "next=" + "/"

		data = { "sso_state": state }

		response = self.client.get(url, data = data, name='session_login')
		# print('Response status code:', response.status_code)
		# print('Response content:', response.content)

	@task
	def session_login_callback(self):

		url = "/session/login/callback?" \
			+ "state= " + state + "&" \
			+ "code= " + code
		
		data = { "sso_state": state }

		response = self.client.get(url, data = data, name='session_login_callback')
	
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
		
		data = { "fav_department": ["EE", "CS", "MSB"] }

		response = self.client.post(url, name='session_setting_post')


    @task
    def getSemesters(self):
        self.client.get("/api/semesters")

    @task
    def getCourses(self):
        params = {
            "department": "ALL",
            "type": "ALL",
            "grade": "ALL",
            "term": "ALL",
            "keyword": "cs453"
        }
        self.client.get("/api/courses", params=params)

    @task
    def getCourse(self):
        self.client.get(f"/api/courses/{self.course_id}")

    @task
    def getCoursesAutoComplete(self):
        params = {"keyword": "전산"}
        self.client.get("/api/courses/autocomplete", params=params)
    
    @task
    def getLecturesFromCourse(self):
        self.client.get(f"/api/courses/{self.course_id}/lectures")

    @task
    def getLectures(self):
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
    def getLecturesAutocomplete(self):
        params = {
            "year": "2020",
            "semester": "1",
            "keyword": "cs"
        }
        self.client.get("/api/lectures/automcomplete", params=params)
    
    @task
    def getTakenCourses(self):
        user_id = "1"
        self.client.get(f"/api/users/{user_id}/taken-courses")
