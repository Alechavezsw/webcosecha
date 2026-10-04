"""Render de control del camión (Cycles) con las texturas horneadas."""
import bpy, math, mathutils

OUT = r"C:\Users\Usuario\AppData\Local\Temp\claude\C--Users-Usuario-Desktop-Proyectos-2cc\77c3e7e7-46c8-4a8f-8ae3-b8feff881ffd\scratchpad\truck_preview.png"
sc = bpy.context.scene
for o in [o for o in sc.objects if o.type in ("CAMERA", "LIGHT")]:
    bpy.data.objects.remove(o, do_unlink=True)

cd = bpy.data.cameras.new("cam")
cam = bpy.data.objects.new("cam", cd)
sc.collection.objects.link(cam)
cam.location = (24, -26, 7.5)
d = mathutils.Vector((0, 0, 3.6)) - cam.location
cam.rotation_euler = d.to_track_quat("-Z", "Y").to_euler()
cd.lens = 38
sc.camera = cam

sun_d = bpy.data.lights.new("sun", "SUN")
sun_d.energy = 4.0
sun_d.color = (1, 0.88, 0.72)
sun = bpy.data.objects.new("sun", sun_d)
sun.rotation_euler = (math.radians(50), math.radians(10), math.radians(-60))
sc.collection.objects.link(sun)
w = sc.world
w.use_nodes = True
w.node_tree.nodes["Background"].inputs["Color"].default_value = (0.45, 0.38, 0.3, 1)
w.node_tree.nodes["Background"].inputs["Strength"].default_value = 0.8

sc.render.engine = "CYCLES"
sc.cycles.samples = 24
sc.render.resolution_x = 1000
sc.render.resolution_y = 600
sc.render.filepath = OUT
sc.view_settings.view_transform = "AgX"
bpy.ops.render.render(write_still=True)
result = {"out": OUT}
