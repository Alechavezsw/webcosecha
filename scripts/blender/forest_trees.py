"""Árboles bioluminiscentes para /servicios (El Bosque Digital).

Salida: public/models/bio-trees.glb con, por variante (a, b, c, giant):
- "<v>_trunk": tronco con raíces y ramas (esqueleto + modificador Skin +
  subdivisión), con oclusión ambiental horneada en el color por vértice.
- "<v>_leaves": tarjetas de hoja (cuadrados con UV 0..1) agrupadas en las
  puntas de las ramas; el color por vértice trae la profundidad de la copa
  (adentro más oscuro). La página les pone la forma de hoja, el color del
  servicio y el viento.
Ejes de Blender: Z arriba; el exportador glTF lo deja con Y arriba. Base en 0.
"""
import bpy, bmesh, math, os, random
from mathutils import Vector, Matrix, noise

OUT = r"C:\Users\Usuario\Desktop\Proyectos\2cc\2\XVkKlmC8H4l\public\models\bio-trees.glb"

for o in list(bpy.data.objects):
    bpy.data.objects.remove(o, do_unlink=True)
for coll in (bpy.data.meshes, bpy.data.materials):
    for b in list(coll):
        coll.remove(b)


def rotate_towards(d, rnd, spread):
    """Desvía la dirección d un ángulo `spread` hacia un eje al azar."""
    axis = d.cross(Vector((rnd.uniform(-1, 1), rnd.uniform(-1, 1), rnd.uniform(-1, 1)))).normalized()
    return (Matrix.Rotation(spread, 3, axis) @ d).normalized()


def build_tree(name, seed, height, levels, fanout, trunk_r, lean_up=0.35):
    rnd = random.Random(seed)
    verts, edges, radii, tips = [], [], [], []

    def add(p, r):
        verts.append(p.copy())
        radii.append(r)
        return len(verts) - 1

    def grow(i0, p, d, length, r0, r1, level):
        # Segmento curvo en 4 tramos: un rama recta se lee como palo.
        steps = 4
        prev = i0
        for s in range(1, steps + 1):
            t = s / steps
            bend = Vector((noise.noise(p * 0.7 + Vector((s, seed, 0))),
                           noise.noise(p * 0.7 + Vector((seed, s, 3))), 0.0)) * 0.18 * length / steps
            p = p + d * (length / steps) + bend
            # las ramas tienden a subir hacia la luz
            d = (d + Vector((0, 0, lean_up * 0.15))).normalized()
            i = add(p, r0 + (r1 - r0) * t)
            edges.append((prev, i))
            prev = i
        if level == 0:
            tips.append(p.copy())
            return
        n = fanout[level - 1] if level - 1 < len(fanout) else 2
        for k in range(n):
            nd = rotate_towards(d, rnd, rnd.uniform(0.6, 1.05))
            # reparto alrededor del eje para que la copa sea redonda
            nd = (Matrix.Rotation(k / n * math.tau + rnd.uniform(-0.4, 0.4), 3, d) @ nd).normalized()
            grow(prev, p, nd, length * rnd.uniform(0.62, 0.78), r1, r1 * 0.62, level - 1)
        # brotes cortos a mitad de la rama madre: llenan la copa
        if level <= 2:
            tips.append(p - d * length * 0.35)

    base = add(Vector((0, 0, 0)), trunk_r * 1.35)
    grow(base, Vector((0, 0, 0)), Vector((rnd.uniform(-0.08, 0.08), rnd.uniform(-0.08, 0.08), 1)).normalized(),
         height * 0.44, trunk_r, trunk_r * 0.7, levels)
    # Raíces que se abren en el piso
    for k in range(5):
        a = k / 5 * math.tau + rnd.uniform(-0.3, 0.3)
        mid = add(Vector((math.cos(a) * trunk_r * 2.2, math.sin(a) * trunk_r * 2.2, 0.15)), trunk_r * 0.55)
        end = add(Vector((math.cos(a) * trunk_r * 4.2, math.sin(a) * trunk_r * 4.2, -0.25)), trunk_r * 0.18)
        edges.append((base, mid))
        edges.append((mid, end))

    me = bpy.data.meshes.new(name + "_skel")
    me.from_pydata([tuple(v) for v in verts], edges, [])
    ob = bpy.data.objects.new(name + "_trunk", me)
    bpy.context.scene.collection.objects.link(ob)
    sk = ob.modifiers.new("skin", "SKIN")
    ob.modifiers.new("sub", "SUBSURF").levels = 1
    for i, r in enumerate(radii):
        me.skin_vertices[0].data[i].radius = (r, r)
    me.skin_vertices[0].data[0].use_root = True
    bpy.ops.object.select_all(action="DESELECT")
    ob.select_set(True)
    bpy.context.view_layer.objects.active = ob
    bpy.ops.object.convert(target="MESH")
    # Corteza: relieve con ruido estirado a lo largo (surcos verticales)
    for v in ob.data.vertices:
        n = v.normal
        k = noise.noise(Vector((v.co.x * 3.0, v.co.y * 3.0, v.co.z * 0.6)) + Vector((seed, 0, 0)))
        v.co += n * k * 0.05 * (1.0 + trunk_r)
    for p in ob.data.polygons:
        p.use_smooth = True
    return ob, tips, rnd


def build_leaves(name, tips, rnd, per_tip, cluster_r, leaf_size):
    bm = bmesh.new()
    uv = bm.loops.layers.uv.new("UVMap")
    col = bm.loops.layers.color.new("Col")
    for c in tips:
        for _ in range(per_tip):
            # dentro de una esfera achatada; más densas hacia afuera
            r = cluster_r * rnd.random() ** 0.45
            th = rnd.uniform(0, math.tau)
            ph = math.acos(rnd.uniform(-1, 1))
            off = Vector((math.sin(ph) * math.cos(th), math.sin(ph) * math.sin(th), math.cos(ph) * 0.7)) * r
            p = c + off
            nrm = Vector((rnd.uniform(-1, 1), rnd.uniform(-1, 1), rnd.uniform(-0.2, 1))).normalized()
            t = nrm.cross(Vector((0, 0, 1)) if abs(nrm.z) < 0.95 else Vector((1, 0, 0))).normalized()
            b = nrm.cross(t)
            s = leaf_size * rnd.uniform(0.7, 1.25)
            rot = rnd.uniform(0, math.tau)
            t, b = t * math.cos(rot) + b * math.sin(rot), b * math.cos(rot) - t * math.sin(rot)
            corners = [p - t * s * 0.5 - b * s * 0.5, p + t * s * 0.5 - b * s * 0.5,
                       p + t * s * 0.5 + b * s * 0.5, p - t * s * 0.5 + b * s * 0.5]
            vs = [bm.verts.new(q) for q in corners]
            f = bm.faces.new(vs)
            # Profundidad de copa: las hojas de adentro quedan en sombra
            depth = 0.35 + 0.65 * (r / cluster_r)
            shade = depth * rnd.uniform(0.8, 1.05)
            for lp, (u, w) in zip(f.loops, ((0, 0), (1, 0), (1, 1), (0, 1))):
                lp[uv].uv = (u, w)
                lp[col] = (shade, shade, shade, 1.0)
    me = bpy.data.meshes.new(name + "_leaves")
    bm.to_mesh(me)
    bm.free()
    me.color_attributes.active_color = me.color_attributes["Col"]
    ob = bpy.data.objects.new(name + "_leaves", me)
    bpy.context.scene.collection.objects.link(ob)
    return ob


VARIANTS = [
    # name, seed, alto, niveles, ramificación por nivel, radio tronco, hojas por punta, radio copa, tamaño hoja
    ("a", 11, 10.0, 3, [2, 2, 3], 0.42, 46, 1.2, 0.24),
    ("b", 23, 11.0, 3, [3, 2, 2], 0.38, 42, 1.3, 0.23),
    ("c", 37, 9.0, 3, [2, 3, 2], 0.46, 48, 1.15, 0.25),
    ("giant", 5, 30.0, 4, [2, 2, 3, 3], 1.3, 60, 2.7, 0.42),
]
trunks, leaves = [], []
for name, seed, h, lv, fan, tr, per, cr, ls in VARIANTS:
    t, tips, rnd = build_tree(name, seed, h, lv, fan, tr)
    trunks.append(t)
    leaves.append(build_leaves(name, tips, rnd, per, cr, ls))
# Cada variante en el origen; se separan sólo para hornear sin que se tapen
for i, ob in enumerate(trunks):
    ob.location.x = i * 60

# ------------------------------------ oclusión ambiental de la corteza ---
sc = bpy.context.scene
sc.render.engine = "CYCLES"
sc.cycles.samples = 32
sc.cycles.device = "CPU"
if sc.world is None:
    sc.world = bpy.data.worlds.new("w")
sc.world.light_settings.distance = 1.5
for ob in trunks:
    a = ob.data.color_attributes.new("Col", "BYTE_COLOR", "CORNER")
    ob.data.color_attributes.active_color = a
bpy.ops.object.select_all(action="DESELECT")
for ob in trunks:
    ob.select_set(True)
bpy.context.view_layer.objects.active = trunks[0]
sc.render.bake.target = "VERTEX_COLORS"
bpy.ops.object.bake(type="AO")
for ob in trunks:
    me = ob.data
    col = me.color_attributes["Col"]
    for poly in me.polygons:
        for li in poly.loop_indices:
            v = me.vertices[me.loops[li].vertex_index].co
            ao = col.data[li].color[0]
            moss = max(0.0, noise.noise(v * 1.3) * 0.5 + 0.5 - 0.45) * max(0.0, 1.0 - v.z / 4.0)
            c = 0.2 + 0.8 * ao
            col.data[li].color = (c * (1 - moss * 0.4), c * (1 + moss * 0.6), c * (1 - moss * 0.2), 1)
for ob in trunks:
    ob.location.x = 0

# ---------------------------------------------------------------- export ---
os.makedirs(os.path.dirname(OUT), exist_ok=True)
bpy.ops.object.select_all(action="DESELECT")
for ob in trunks + leaves:
    ob.select_set(True)
bpy.ops.export_scene.gltf(
    filepath=OUT,
    export_format="GLB",
    use_selection=True,
    export_apply=True,
    export_materials="NONE",
    export_vertex_color="ACTIVE",
    export_normals=True,
    export_texcoords=True,
    export_meshopt_compression_enable=True,
)
result = {
    "bytes": os.path.getsize(OUT),
    "tris": {o.name: sum(len(p.vertices) - 2 for p in o.data.polygons) for o in trunks + leaves},
}
