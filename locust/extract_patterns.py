import json
import re
from collections import defaultdict, Counter
from itertools import combinations, groupby


class API(object):
    def __init__(self, idx, method, uri, func_name):
        self.idx = idx
        self.method = method
        self.uri = uri
        self.func_name = func_name

    def __str__(self):
        return f"Idx: {self.idx}, Method: {self.method}, URI: {self.uri}, func_name: {self.func_name}"

    def __eq__(self, rhs):
        return self.method == rhs.method and self.uri == rhs.uri


class APIManager(object):
    api_map = {}
    idx_map = {}
    count = 0

    def register(self, method, uri, func_name):
        if (method, uri) in self.api_map: return
        self.count += 1
        api = API(self.count, method, uri, func_name)
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
        print('----------fail', method, uri)
        return API(None, method, uri, None)

APIS = [
    ('GET', '^/$', 'get_main'),
    ('GET', '^/main/$', 'get_main'),
    ('GET', '^/session/$', 'session'),
    ('GET', '^/session/login/$', 'session_login'),
    ('GET', '^/session/login/callback/$', 'session_login_callback'),
    ('GET', '^/session/logout/$', 'session_logout'),
    ('GET', '^/session/unregister/$', None),
    ('GET', '^/session/language/$', 'session_language'),
    ('GET', '^/session/settings/$', 'session_setting_get'),
    ('POST', '^/session/settings/$', 'session_setting_post'),
    ('GET', '^/api/subject/semesters/$', None),
    ('GET', '^/api/subject/courses/$', None),
    ('GET', '^/api/subject/courses/([0-9]*)/$', None),
    ('GET', '^/api/subject/courses/autocomplete/$', None),
    ('GET', '^/api/subject/courses/([0-9]*)/lectures/$', None),
    ('GET', '^/api/subject/lectures/$', None),
    # ('GET', '^/subject/lectures/([0-9])/$'),
    ('GET', '^/api/lectures', 'get_lectures'),
    ('GET', '^/api/lectures/autocomplete/$', 'get_Lectures_auto_complete'),
    ('GET', '^/api/users/([0-9]*)/taken-courses/$', 'get_taken_courses'),
    ('GET', '^main', 'get_main'),
    ('GET', '^/credits/$', 'get_credits'),
    ('GET', '^/licenses/$', 'get_licenses'),
    ('GET', '^/review/$', 'get_review'),
    ('GET', '^/review/refresh/$', 'refresh_review'),
    ('GET', '^/review/insert/$', 'insert_review'),
    ('GET', '^/review/json/([0-9]*)/$', 'get_last_comment_json'),
    ('GET', '^/review/result/comment/([0-9]*)/$', 'get_comment'),
    ('GET', '^/review/result/professor/([0-9]*)/([^/]+)/$', 'get_professor_review'),
    ('GET', '^/review/result/professor/([^/]+)/json/([^/]+)/([^/]+)/$', 'get_professor_review_json'),
    ('GET', '^/review/result/course/([0-9]*)/$', 'get_course_review'),
    ('GET', '^/review/result/course/([1-9][0-9]*)/([^/]+)/$', 'get_course_review'),
    ('GET', '^/review/result/course/([^/]+)/([^/]+)/json/([^/]+)/$', 'get_course_review_json'),
    ('GET', '^/review/result/$', 'get_result'),
    ('GET', '^/review/result/json/(?P<page>[0-9]+)/$', 'get_result_json'),

    # ('GET', '^/subject/courses/([0-9])/reviews/$'),
    # ('GET', '^/subject/lectures/([0-9])/reviews/$'),
    # ('GET', '^/subject/lectures/([0-9])/related-reviews/$'),
    # ('GET', '^/review/latest/([0-9])/$'),
    # ('GET', '^/review/insert/([0-9])/$'),
    # ('GET', '^/review/like/$'),
    # ('GET', '^/review/read/$'),
    ('GET', '^/timetable/$', 'get_table'),
    ('POST', '^/timetable/api/table_update/$', 'table_update'),
    ('POST', '^/timetable/api/table_create/$', 'table_create'),
    ('POST', '^/timetable/api/table_delete/$', 'table_delete'),
    ('POST', '^/timetable/api/table_copy/$', 'table_copy'),
    ('POST', '^/timetable/api/table_load/$', 'table_load'),
    ('POST', '^/timetable/api/autocomplete/$', 'table_autocomplete'),
    ('POST', '^/timetable/api/search/$', 'table_search'),
    ('POST', '^/timetable/api/comment_load/$', 'comment_load'),
    ('POST', '^/timetable/api/list_load_major/$', 'major_load'),
    ('POST', '^/timetable/api/list_load_humanity/$', 'humanity_load'),
    ('POST', '^/timetable/api/wishlist_load/$', 'wishlist_load'),
    ('POST', '^/timetable/api/wishlist_update/$', 'wishlist_update'),
    ('DELETE', '^/timetable/api/wishlist_update', 'wishlist_update_lecture_delete'),      # DELETE인데 사실 POST임
    ('GET', '^/timetable/api/share_image/$', 'share_image'),
    ('GET', '^/timetable/api/share_calendar/$', 'share_calander'),
    ('GET', '^/timetable/google_auth_return/$', 'google_auth_return'),
]

API_MANAGER = APIManager()
def init():
    for api in APIS:
        API_MANAGER.register(api[0], api[1], api[2])


def validate(line):
    d = json.loads(line)
    return not d['URI'].endswith('.css') and not d['URI'].endswith('.js') and not d['URI'].endswith('&filter=HSS') and not d['URI'].endswith('.ico') and not 'media' in d['URI']


def extract_pattern1(user_logs, min_length = 10, max_length = 20):
    candidates = []
    keys = user_logs.keys()
    for key in keys:
        logs = user_logs[key]
        if len(logs) < min_length: continue
        for length in range(min_length, max_length + 1):
            p = []
            for api, _ in logs:
                # p.append(api.idx)
                p.append(api.func_name)
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
            # lcs = [log1[i - 1].idx] + lcs
            lcs = [log1[i - 1].func_name] + lcs
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
            if len(withins) >= 5:
                p = []
                for within in withins:
                    p.append(within.func_name)
                candidates.append(tuple(p))

    return sorted(dict(Counter(candidates)).items(), key=lambda item: (item[1], len(item[0])), reverse=True)


def print_mat_2d(mat):
  for i in range(len(mat)): print(mat[i])


def extract_pattern4(user_logs):
    candidates = []
    apis = []
    for user, api_logs in user_logs.items():
        # 연속한 같은 api는 하나로 처리 (e.g. AABBA -> ABA)
        apis.append([x[0] for x in groupby([a.func_name for a, _ in api_logs])])

    combis = list(combinations(apis, 2))
    for a, b in combis:
        la = len(a)
        lb = len(b)

        d = [[0 for _ in range(lb+1)] for _ in range(la+1)]
        for i in range(0, la):
            for j in range(0, lb):
                d[i][j] = max(d[i-1][j], d[i][j-1], d[i-1][j-1]+1) if a[i] == b[j] else max(d[i][j-1], d[i-1][j])

        if d[la-1][lb-1] >= 5 and (d[la-1][lb-1] / min(la, lb)) >= 0.8:
            if la >= lb:
                candidates.append(tuple(a))
            else:
                candidates.append(tuple(b))

    return sorted(dict(Counter(candidates)).items(), key=lambda item: (item[1], len(item[0])), reverse=True)


def get_pattern_by_log_and_rule(log_file_name, rule):
    init()

    f = open(log_file_name, 'r')
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
    
    extract_func = None
    if (rule == 0):
        extract_func = extract_pattern1
    elif (rule == 1):
        extract_func = extract_pattern2
    elif (rule == 2):
        extract_func = extract_pattern3
    elif (rule == 3):
        extract_func = extract_pattern4
    else:
        print("Invalid rule")
        exit(-1)

    return extract_func(user_logs)


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

    print(extract_pattern4(user_logs))
    # extract_pattern2(user_logs)