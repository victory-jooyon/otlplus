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
    count = 0

    def register(self, method, uri):
        if (method, uri) in self.api_map: return
        self.count += 1
        api = API(self.count, method, uri)
        self.idx_map[self.count] = api
        self.api_map[(method, uri)] = api

    def find_by_idx(self, idx):
        if idx in self.idx_map: return self.idx_map[idx]
        return None

    def find_by_uri(self, method, uri):
        for key in self.api_map:
            m, u = key
            if method == m and re.search(u, uri):
                return self.api_map[key]
        return API(None, method, uri)

APIS = [
    ('GET', '^/main/$'),
    ('GET', '^/session/$'),
    ('GET', '^/session/login/$'),
    ('GET', '^/session/login/callback/$'),
    ('GET', '^/session/logout/$'),
    ('GET', '^/session/unregister/$'),
    ('GET', '^/session/language/$'),
    ('GET', '^/session/settings/$'),
    ('POST', '^/session/settings/$'),
    ('GET', '^/api/subject/semesters/$'),
    ('GET', '^/api/subject/courses/$'),
    ('GET', '^/api/subject/courses/([0-9])/$'),
    ('GET', '^/api/subject/courses/autocomplete/$'),
    ('GET', '^/api/subject/courses/([0-9])/lectures/$'),
    ('GET', '^/api/subject/lectures/$'),
    # ('GET', '^/subject/lectures/([0-9])/$'),
    ('GET', '^/api/lectures'),
    ('GET', '^/api/lectures/autocomplete/$'),
    ('GET', '^/api/users/([0-9])/taken-courses/$'),
    ('GET', '^main'),
    ('GET', '^credit/$'),
    ('GET', '^license/$'),
    ('GET', '^/review/json/([0-9])/$'),
    ('GET', '^/review/comment/([1-9][0-9]*)/$'),
    ('GET', '^/review/result/professor/([1-9][0-9]*)/([^/]+)/$'),
    ('GET', '^/review/result/professor/([^/]+)/json/([^/]+)/([^/]+)/$'),
    ('GET', '^/review/result/course/([1-9][0-9]*)/([^/]+)/$'),
    ('GET', '^/review/result/course/([^/]+)/([^/]+)/json/([^/]+)/$'),
    ('GET', '^/review/result/$'),
    ('GET', '^/review/result/json/(?P<page>[0-9]+)/$'),

    # ('GET', '^/subject/courses/([0-9])/reviews/$'),
    # ('GET', '^/subject/lectures/([0-9])/reviews/$'),
    # ('GET', '^/subject/lectures/([0-9])/related-reviews/$'),
    # ('GET', '^/review/latest/([0-9])/$'),
    # ('GET', '^/review/insert/([0-9])/$'),
    # ('GET', '^/review/like/$'),
    # ('GET', '^/review/read/$'),
    ('GET', '^/timetable/$'),
    ('POST', '^/timetable/api/table_update/$'),
    ('POST', '^/timetable/api/table_create/$'),
    ('POST', '^/timetable/api/table_delete/$'),
    ('POST', '^/timetable/api/table_copy/$'),
    ('POST', '^/timetable/api/table_load/$'),
    ('POST', '^/timetable/api/autocomplete/$'),
    ('POST', '^/timetable/api/search/$'),
    ('POST', '^/timetable/api/comment_load/$'),
    ('POST', '^/timetable/api/list_load_major/$'),
    ('POST', '^/timetable/api/list_load_humanity/$'),
    ('POST', '^/timetable/api/wishlist_load/$'),
    ('POST', '^/timetable/api/wishlist_update/$'),
    ('DELETE', '^/timetable/api/wishlist_update'),      # DELETE인데 사실 POST임
    ('GET', '^/timetable/api/share_image/$'),
    ('GET', '^/timetable/api/share_calendar/$'),
    ('GET', '^/timetable/google_auth_return/$'),
]

API_MANAGER = APIManager()
def init():
    for api in APIS:
        API_MANAGER.register(api[0], api[1])


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
            for api, _ in logs:
#                p.append(api.idx)
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
#            lcs = [log1[i - 1].idx] + lcs
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
            result = (tuple(getLCS([api for api, _ in user_logs[keys[i]]], [api for api, _ in user_logs[keys[j]]])))
            if len(result) > 1:
                candidates.append(result)

    return sorted(dict(Counter(candidates)).items(), key=lambda item: (item[1], len(item[0])), reverse=True)


def extract_pattern3(user_logs):
    candidates = []
    for user, api_logs in user_logs.items():

        for api, log in api_logs:
            withins = [a for a, l in api_logs if log['timestamp'] <= l['timestamp'] < log['timestamp'] + 5 * 60 * 1000]
            if len(withins) >= 3:
                p = []
                for within in withins:
                    p.append((within.method, within.uri))
                candidates.append(tuple(p))

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
        if api: user_logs[key].append((api, log))

    for e in extract_pattern3(user_logs):
        print(e)
    # extract_pattern2(user_logs)

