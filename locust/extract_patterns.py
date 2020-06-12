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

    def __eq__(self, rhs):
        return self.method == rhs.method and self.uri == rhs.uri

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

    def find_by_uri(self, method, uri):
        for key in self.api_map:
            m, u = key
            if method == m and re.search(u, uri):
                return self.api_map[key]
        return API(None, method, uri)

APIS = [
    (1, 'GET', '^/main/$'),
    (2, 'GET', '^/session/$'),
    (3, 'GET', '^/session/login/$'),
    (4, 'GET', '^/session/login/callback/$'),
    (5, 'GET', '^/session/logout/$'),
    (6, 'GET', '^/session/unregister/$'),
    (7, 'GET', '^/session/language/$'),
    (8, 'GET', '^/session/setting/$'),
    (9, 'POST', '^/session/setting/$'),
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

def extract_pattern1(user_logs, min_length = 10, max_length = 20):
    candidates = []
    keys = user_logs.keys()
    for key in keys:
        logs = user_logs[key]
        if len(logs) < min_length: continue
        for length in range(min_length, max_length + 1):
            p = []
            for api in logs:
                p.append((api.method, api.uri))
                if len(p) == length:
                    candidates.append(tuple(p))
                    p.pop(0)

    return sorted(dict(Counter(candidates)).items(), key=lambda item: (item[1], len(item[0])), reverse=True)

def getLCS(log1, log2):
    N = len(log1)
    M = len(log2)

    D = [[-1] * (M + 1)]
    P = [[0] * (M + 1)]
    for i in range(N):
        D.append([0] * (M + 1))
        P.append([0] * (M + 1))
        for j in range(M):
            if log1[i] == log2[j] and D[i + 1][j + 1] < D[i][j] + 1:
                D[i + 1][j + 1] = D[i][j] + 1
                P[i + 1][j + 1] = 1
            if D[i + 1][j + 1] < D[i + 1][j]:
                D[i + 1][j + 1] = D[i + 1][j]
                P[i + 1][j + 1] = 2
            if D[i + 1][j + 1] < D[i][j + 1]:
                D[i + 1][j + 1] = D[i][j + 1]
                P[i + 1][j + 1] = 3

    i = N
    j = M
    lcs = []
    while i > 0 and j > 0:
        if P[i][j] == 1:
            lcs = [(log1[i - 1].method, log1[i - 1].uri)] + lcs
            i -= 1
            j -= 1
        elif P[i][j] == 2:
            j -= 1
        elif P[i][j] == 3:
            i -= 1
        else:
            break

    return lcs

def extract_pattern2(user_logs):
    candidates = []
    keys = list(user_logs.keys())
    N = len(keys)
    for i in range(N):
        for j in range(i+1, N):
            result = (tuple(getLCS(user_logs[keys[i]], user_logs[keys[j]])))
            if len(result) > 1:
                candidates.append(result)

    return sorted(dict(Counter(candidates)).items(), key=lambda item: (item[1], len(item[0])), reverse=True)

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
