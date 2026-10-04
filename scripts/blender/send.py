import sys
sys.path.insert(0, r"C:\blender_mcp\mcp")
from blmcp.tools_helpers import connection

connection._TIMEOUT = 900
code = open(sys.argv[1], encoding="utf-8").read()
r = connection.send_code(code, False)
print(r.get("status"), r.get("result") or r.get("message"))
if r.get("stdout"):
    print("STDOUT:", r["stdout"][-3000:])
if r.get("stderr"):
    print("STDERR:", r["stderr"][-3000:])
