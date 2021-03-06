import ast, astor
import os

from extract_patterns import get_pattern_by_log_and_rule

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
    # print(astor.dump_tree(ast_tree))

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
    cmd = f"locust -f {file_name} --host={host} -u {u} -r {r}"
    print(f"EXEC locust with cmd ${cmd}")

    os.system(cmd)

if __name__ == '__main__':
    log_file = './otlplus.log'
    locust_src_file = 'locustfile.py'
    rule_list = [0, 1, 2, 3]

    for rule in rule_list:
        patterns = get_pattern_by_log_and_rule(log_file, rule)

        locust_output_file = f"locust_file_pattern{rule}.py"

        generate_locust_file(locust_src_file, locust_output_file, patterns)
