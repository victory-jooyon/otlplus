import ast, astor

temp_func_name_map = [
    "session_login",
    "session_login_callback",
    "session_logout",
    "session_language",
    "session_setting_get",
    "session_setting_post"
]

temp_patterns = [
    [0, 1, 2],
    [0, 1, 1, 2, 4],
    [1, 3, 4]
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

def create_basic_task(func_name):
    arg = ast.arg('self', None)
    args = ast.arguments([arg], None, [], [], None, [])

    decorator_list = [ast.Name('task', None)]

    return ast.FunctionDef(func_name, args, [], decorator_list, None)

def create_file_with_content(file_name, content):
    f = open(file_name, "w", 0)
    f.write(content)
    f.close()

def generate_locust_file(input_filename, output_filename, func_name_map, patterns):
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
        func_name = f"pattern_{i}"
        task_func_def = create_basic_task(func_name)

        pattern = patterns[i]
        for j in range(len(pattern)):
            pattern_elem_func = ast.Attribute(
                ast.Name('self', None),
                func_name_map[pattern[j]],
                None
            )

            pattern_elem_func_call = ast.Expr(ast.Call(pattern_elem_func, [], []))
            task_func_def.body.append(pattern_elem_func_call)
    
        class_def.body.append(task_func_def)

    create_file_with_content(output_filename, astor.to_source(ast_tree))


generate_locust_file("locustfile.py", "locustfile_p.py", temp_func_name_map, temp_patterns)