"""Render de control de los árboles del bosque (Cycles, de noche)."""
import bpy, math, mathutils

OUT = r"C:\Users\Usuario\AppData\Local\Temp\claude\C--Users-Usuario-Desktop-Proyectos-2cc\77c3e7e7-46c8-4a8f-8ae3-b8feff881ffd\scratchpad\forest_preview.png"
sc = bpy.context.scene
for o in [o for o in sc.objects if o.type in ("CAMERA", "LIGHT")]:
    bpy.data.objects.remove(o, do_unlink=True)

bark = bpy.data.materials.get("pv_bark") or bpy.data.materials.new("pv_bark")
bark.use_nodes = True
nt = bark.node_tree
b = nt.nodes["Principled BSDF"]
vc = nt.nodes.new("ShaderNodeVertexColor")
vc.layer_name = "Col"
mixn = nt.nodes.new("ShaderNodeMix")
mixn.data_type = "RGBA"
mixn.blend_type = "MULTIPLY"
mixn.inputs[0].default_value = 1
mixn.inputs[6].default_value = (0.09, 0.07, 0.07, 1)
nt.links.new(vc.outputs["Color"], mixn.inputs[7])
nt.links.new(mixn.outputs[2], b.inputs["Base Color"])
b.inputs["Roughness"].default_value = 0.9

colors = {"a": (1, 0.16, 0.42), "b": (0.55, 0.36, 0.96), "c": (0.96, 0.62, 0.04), "giant": (0.06, 0.73, 0.5)}
xs = {"a": -14, "b": 0, "c": 14, "giant": 40}
for v, c in colors.items():
    lm = bpy.data.materials.new("pv_leaf_" + v)
    lm.use_nodes = True
    n2 = lm.node_tree
    for n in list(n2.nodes):
        n2.nodes.remove(n)
    out = n2.nodes.new("ShaderNodeOutputMaterial")
    em = n2.nodes.new("ShaderNodeEmission")
    em.inputs["Color"].default_value = (*c, 1)
    em.inputs["Strength"].default_value = 3.0
    n2.links.new(em.outputs[0], out.inputs[0])
    t = bpy.data.objects[v + "_trunk"]
    l = bpy.data.objects[v + "_leaves"]
    t.data.materials.clear()
    t.data.materials.append(bark)
    l.data.materials.clear()
    l.data.materials.append(lm)
    t.location.x = l.location.x = xs[v]
    if v == "giant":
        t.location.y = l.location.y = 30

cd = bpy.data.cameras.new("cam")
cam = bpy.data.objects.new("cam", cd)
sc.collection.objects.link(cam)
cam.location = (8, -48, 9)
d = mathutils.Vector((10, 10, 8)) - cam.location
cam.rotation_euler = d.to_track_quat("-Z", "Y").to_euler()
cd.lens = 30
sc.camera = cam
moon = bpy.data.lights.new("moon", "SUN")
moon.energy = 1.2
moon.color = (0.7, 0.75, 1)
mo = bpy.data.objects.new("moon", moon)
mo.rotation_euler = (math.radians(55), 0, math.radians(30))
sc.collection.objects.link(mo)
w = sc.world
w.use_nodes = True
w.node_tree.nodes["Background"].inputs["Color"].default_value = (0.03, 0.015, 0.05, 1)
sc.render.engine = "CYCLES"
sc.cycles.samples = 24
sc.render.resolution_x = 1100
sc.render.resolution_y = 600
sc.render.filepath = OUT
bpy.ops.render.render(write_still=True)
for v in colors:
    bpy.data.objects[v + "_trunk"].location = (0, 0, 0)
    bpy.data.objects[v + "_leaves"].location = (0, 0, 0)
result = {"out": OUT}
