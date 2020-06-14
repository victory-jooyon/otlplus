import ast, astor
import os

temp_patterns = [
    (("session_login", "session_login_callback", 'session_setting_get'), 3),
    (("session_login", "session_login_callback", "session_language", "session_language", "session_setting_post"), 3),
    (("session_login_callback", "session_setting_get", "session_setting_post"), 5)
]

def is_HttpUser_Inherit_class(x):
    if (isinstance(x, ast.ClassDef)):
        for base in x.bases:
            if (isinstance(base, ast.Name)):
                if (base.id == "HttpUser"):
                    return True
    return False

def is_task(x):
    if (isinstance(x, ast.FunctionDef)):
        for decorator in x.decorator_list:
            if (isinstance(decorator, ast.Name)):
                if (decorator.id == "task"):
                    return True
    
    return False

def remove_task_decorator(x):
    for decorator in x.decorator_list:
        if (isinstance(decorator, ast.Name)):
            if (decorator.id == "task"):
                x.decorator_list.remove(decorator)
                return

def create_basic_task(func_name, weight):
    arg = ast.arg('self', None)
    args = ast.arguments([arg], None, [], [], None, [])

    decorator_list = [
        ast.Call(
            ast.Name('task', None),
            [ast.Num(weight)],
            []
        )
    ]

    return ast.FunctionDef(func_name, args, [], decorator_list, None)

def create_file_with_content(file_name, content):
    f = open(file_name, "w", encoding="utf-8")
    f.write(content)
    f.close()

def generate_locust_file(input_filename, output_filename, patterns):
    ast_tree = astor.code_to_ast.parse_file(input_filename)
    print(astor.dump_tree(ast_tree))

    # assume only one class def
    class_def = None
    for body_elem in ast_tree.body:
        if (is_HttpUser_Inherit_class(body_elem)):
            class_def = body_elem
            break
    
    if (class_def == None):
        print("No HttpUser inherit class")
        exit(-1)

    # get function and delete task
    for body_elem in class_def.body:
        if (is_task(body_elem)):
            remove_task_decorator(body_elem)
    
    # add task by pattern
    for i in range(len(patterns)):
        pattern_list, weight = patterns[i]
    
        func_name = f"pattern_{i}"
        task_func_def = create_basic_task(func_name, weight)

        for j in range(len(pattern_list)):
            pattern_fname = pattern_list[j]
            if (pattern_fname is None):
                continue
        
            pattern_elem_func = ast.Attribute(
                ast.Name('self', None),
                pattern_fname,
                None
            )

            pattern_elem_func_call = ast.Expr(ast.Call(pattern_elem_func, [], []))
            task_func_def.body.append(pattern_elem_func_call)
    
        class_def.body.append(task_func_def)

    create_file_with_content(output_filename, astor.to_source(ast_tree))

def execute_locust(file_name, host, u, r):
    print("EXEC")
    cmd = f"locust -f {file_name} --host={host} -u {u} -r {r} --headless"

    os.system(cmd)
    print("END")

src_file = "locustfile.py"
output_file = "locustfile_p.py"

generate_locust_file(src_file, output_file, temp_patterns)
execute_locust(output_file, "http://13.125.233.178:8000", 5, 5)