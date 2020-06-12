import json
import re
from collections import defaultdict, Counter

class API(object):
    def __init__(self, idx, method, uri):
        self.idx = idx
        self.method = method
        self.uri = uri
    
    def __str__(self):
        return f"Idx: {self.idx}, Method: {self.method}, URI: {self.uri}"

class APIManager(object):
    api_map = {}
    idx_map = {}

    def register(self, idx, method, uri):
        if idx in self.idx_map: return
        if (method, uri) in self.api_map: return 
        api = API(idx, method, uri)
        self.idx_map[idx] = api
        self.api_map[(method, uri)] = api
    
    def find_by_idx(self, idx):
        if idx in self.idx_map: return self.idx_map[uri]
        return None

    def lookup(s):
        for pattern, value in API_MAP:
            if re.search(pattern, s):
                return value
        return None

    def find_by_uri(self, method, uri):
        for key in self.api_map:
            m, u = key
            if method == m and re.search(u, uri):
                return self.api_map[key]

        return None

APIS = [
    (1, 'GET', '^/main/$'),
    (2, 'GET', '^/session/$'),
    (3, 'GET', '^/session/login/$'),
    (4, 'GET', '^/session/login/callback/$'),
    (5, 'GET', '^/session/logout/$'),
    (6, 'GET', '^/session/unregister/$'),
    (9, 'GET', '^/session/language/$'),
    (10, 'GET', '^/session/setting/$'),
    (11, 'GET', '^/subject/semesters/$'),
    (12, 'GET', '^/subject/courses/$'),
    (13, 'GET', '^/subject/courses/([0-9])/$'),
    (14, 'GET', '^/subject/courses/autocomplete/$'),
    (15, 'GET', '^/subject/courses/([0-9])/lectures/$'),
    (16, 'GET', '^/subject/lectures/$'),
    (17, 'GET', '^/subject/lectures/([0-9])/$'),
    (18, 'GET', '^/subject/lectures/autocomplete/$'),
    (19, 'GET', '^/subject/users/([0-9])/taken-courses/$'),
    (20, 'GET', '^/subject/courses/([0-9])/reviews/$'),
    (21, 'GET', '^/subject/lectures/([0-9])/reviews/$'),
    (22, 'GET', '^/subject/lectures/([0-9])/related-reviews/$'),
    (23, 'GET', '^/review/latest/([0-9])/$'),
    (24, 'GET', '^/review/insert/([0-9])/$'),
    (25, 'GET', '^/review/like/$'),
    (26, 'GET', '^/review/read/$'),
    (27, 'GET', '^/timetable/table_update/$'),
    (28, 'GET', '^/timetable/table_create/$'),
    (29, 'GET', '^/timetable/table_delete/$'),
    (30, 'GET', '^/timetable/table_load/$'),
    (31, 'GET', '^/timetable/wishlist_load/$'),
    (32, 'GET', '^/timetable/wishlist_update/$'),
    (33, 'GET', '^/timetable/share_image/$'),
    (34, 'GET', '^/timetable/share_calendar/$'),
    (35, 'GET', '^/external/google/google_auth_return/$'),
]

API_MANAGER = APIManager()
def init():
    for api in APIS:
        API_MANAGER.register(api[0], api[1], api[2])

def validate(line):
    d = json.loads(line)
    return not d['URI'].endswith('.css') and not d['URI'].endswith('.js') and not 'media' in d['URI']

if __name__ == '__main__':
    init()

    f = open('./otlplus.log', 'r')
    raw_logs = f.readlines()
    logs = []
    for log in raw_logs:
        if not validate(log): continue
        logs.append(json.loads(log))
    f.close()

    user_logs = defaultdict(list)
    for log in logs:
        if 'csrftoken' not in log['cookie']: continue
        key = log['cookie']['csrftoken']
        api = API_MANAGER.find_by_uri(log['method'], log['URI'])
        if api: user_logs[key].append(api)
    

