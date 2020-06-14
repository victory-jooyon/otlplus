from locust import HttpUser, task, between


class Review(HttpUser):
    wait_time = between(3, 5)
    user_id = "1"
    course_id = "1973" #CS453
    professor_id = "2007"

    @task
    def getMain(self):
        self.client.get("/main")

    @task
    def getCredit(self):
        self.client.get("/credit")

    @task
    def getLicense(self):
        self.client.get("/license")

    @task
    def getLastCommentJson(self):
        params = {
            "filter": ["F"],
        }
        self.client.get(f"/review/json/{self.course_id}", params=params)

    @task
    def getComment(self):
        self.client.get(f"/review/comment/{self.course_id}")

    @task
    def getProfessorReview(self):
        self.client.get(f"/review/result/professor/{self.professor_id}/{self.course_id}")

    @task
    def getProfessorReviewJson(self):
        self.client.get(f"/review/result/professor/{self.professor_id}/json/{self.course_id}/1/")

    @task
    def getCourseReview(self):
        self.client.get(f"/review/result/course/{self.course_id}/{self.professor_id}/")

    @task
    def getCourseReviewJson(self):
        self.client.get(f"/review/result/course/{self.course_id}/{self.professor_id}/1/")

    @task
    def getResult(self):
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
    def getResultJson(self):
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
