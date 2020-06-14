from locust import HttpUser, task, between

class Subject(HttpUser):
    wait_time = between(3, 5)
    user_id = "1"
    course_id = "1973" #CS453

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
