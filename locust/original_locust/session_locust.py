from locust import HttpUser, constant, task

code = "c857eb3a9234ccab38eb"
state = "8d973242f7cca7d3e253"

class Session(HttpUser):
	wait_time = constant(1)

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
