import bpy, bmesh, math, os, random
from mathutils import Vector, noise

OUT = r"C:\Users\Usuario\Desktop\Proyectos\2cc\2\XVkKlmC8H4l\public\models\landscape.glb"

for o in list(bpy.data.objects):
    bpy.data.objects.remove(o, do_unlink=True)
for m in list(bpy.data.meshes):
    bpy.data.meshes.remove(m)


def smooth(a, b, x):
    u = max(0.0, min(1.0, (x - a) / (b - a)))
    return u * u * (3 - 2 * u)


def mix(a, b, t):
    return tuple(a[i] + (b[i] - a[i]) * t for i in range(3))


def paint(me, fn):
    """fn(vertex) -> rgb, guardado como color por punto."""
    me.update()
    attr = me.color_attributes.new("Col", "FLOAT_COLOR", "POINT")
    for v in me.vertices:
        c = fn(v)
        attr.data[v.index].color = (c[0], c[1], c[2], 1.0)
    me.color_attributes.active_color = attr


# -------------------------------------------------------------------------
# Cordillera del fondo. Ejes Blender: X ancho, -Y hacia la cámara, Z alto.
# Se ubica en z = -86 de la escena; el sol nace en x = -11, z = -95, así que
# ahí abrimos un portezuelo para que siga asomando entre los cerros.
# -------------------------------------------------------------------------
W, NX, NY = 340.0, 230, 20
Y0, Y1 = -3.0, 6.0
SUN_X = -11.0


def ridged(x, y, octaves=5):
    tot, amp, freq, norm = 0.0, 1.0, 1.0, 0.0
    for _ in range(octaves):
        n = 1.0 - abs(noise.noise(Vector((x * freq, y * freq, 3.7))))
        tot += n * n * amp
        norm += amp
        amp *= 0.5
        freq *= 2.1
    return tot / norm


def crest(x):
    h = 6.0 + 19.0 * ridged(x * 0.02, 0.0) ** 1.5
    h *= 1 - 0.6 * math.exp(-((x - SUN_X) / 18.0) ** 2)  # portezuelo del sol
    return h


verts = []
for j in range(NY + 1):
    y = Y0 + (Y1 - Y0) * j / NY
    prof = math.exp(-((y - 1.2) / 2.4) ** 2)
    for i in range(NX + 1):
        x = -W / 2 + W * i / NX
        xx = x + 7 * noise.noise(Vector((y * 0.25, 1.3, 0.0)))  # cresta no recta
        z = crest(xx) * prof + 3.2 * ridged(x * 0.08, y * 0.35, 4) * prof
        if j == 0:
            z = -9.0  # el pie se hunde: nunca se ve el borde
        verts.append((x, y, z - 1.0))
faces = []
for j in range(NY):
    for i in range(NX):
        a = j * (NX + 1) + i
        faces.append((a, a + 1, a + NX + 2, a + NX + 1))
me = bpy.data.meshes.new("range_far")
me.from_pydata(verts, [], faces)
me.update()
if sum(p.normal.z for p in me.polygons) < 0:
    for p in me.polygons:
        p.flip()
    me.update()
L = Vector((-0.45, -0.55, 0.7)).normalized()  # luz de cielo desde adelante-izquierda
ROCK = (0.42, 0.34, 0.31)
SNOW = (0.97, 0.95, 1.0)


def range_col(v):
    n = v.normal
    lit = 0.38 + 0.62 * max(0.0, n.dot(L))
    gully = 0.85 + 0.15 * noise.noise(v.co * 0.35)
    line = 12.5 + 2.5 * noise.noise(v.co * 0.08)
    snow = smooth(line, line + 1.6, v.co.z) * smooth(0.35, 0.7, n.z)
    c = mix(ROCK, SNOW, snow)
    k = lit * gully * (1 if snow < 0.5 else 0.9 + 0.1 * lit)
    return tuple(ch * k for ch in c)


paint(me, range_col)
for p in me.polygons:
    p.use_smooth = True
rng_ob = bpy.data.objects.new("range_far", me)
bpy.context.scene.collection.objects.link(rng_ob)


# -------------------------------------------------------------------------
# Rocas facetadas, alto ~1, base en el origen, con musgo arriba.
# -------------------------------------------------------------------------
def rock(name, seed, stretch):
    rnd = random.Random(seed)
    bm = bmesh.new()
    bmesh.ops.create_icosphere(bm, subdivisions=3, radius=1.0)
    off = Vector((rnd.random() * 40, rnd.random() * 40, rnd.random() * 40))
    for v in bm.verts:
        d = v.co.normalized()
        k = 1 + 0.32 * noise.noise(d * 1.4 + off) + 0.12 * noise.noise(d * 3.5 + off)
        v.co = d * k
        v.co.x *= stretch[0]
        v.co.y *= stretch[1]
        v.co.z *= stretch[2]
        if v.co.z < -0.15:
            v.co.z = -0.15 + (v.co.z + 0.15) * 0.25
    # facetas grandes: disolver caras casi coplanares y triangular
    bmesh.ops.dissolve_limit(bm, angle_limit=math.radians(9), verts=bm.verts, edges=bm.edges)
    bmesh.ops.triangulate(bm, faces=bm.faces)
    me = bpy.data.meshes.new(name)
    bm.to_mesh(me)
    bm.free()
    zs = [v.co.z for v in me.vertices]
    zmin, zmax = min(zs), max(zs)
    for v in me.vertices:
        v.co.z = (v.co.z - zmin) / (zmax - zmin)
        v.co.x /= (zmax - zmin)
        v.co.y /= (zmax - zmin)
    me.update()

    def col(v):
        n = v.normal
        base = mix((0.24, 0.2, 0.17), (0.5, 0.44, 0.38), smooth(0.0, 0.8, v.co.z))
        moss = smooth(0.55, 0.85, n.z) * smooth(-0.1, 0.4, noise.noise(v.co * 3 + off))
        return mix(base, (0.3, 0.38, 0.15), moss * 0.85)

    paint(me, col)
    for p in me.polygons:
        p.use_smooth = False
    ob = bpy.data.objects.new(name, me)
    bpy.context.scene.collection.objects.link(ob)
    return ob


objs = [rng_ob, rock("rock_0", 3, (1.3, 1.0, 0.8)), rock("rock_1", 8, (1.0, 0.9, 1.1)), rock("rock_2", 21, (1.7, 1.2, 0.6))]

os.makedirs(os.path.dirname(OUT), exist_ok=True)
bpy.ops.object.select_all(action="DESELECT")
for o in objs:
    o.select_set(True)
bpy.ops.export_scene.gltf(
    filepath=OUT,
    export_format="GLB",
    use_selection=True,
    export_apply=True,
    export_vertex_color="ACTIVE",
    export_materials="NONE",
    export_normals=True,
    export_texcoords=False,
)
result = {"bytes": os.path.getsize(OUT), "tris": {o.name: sum(len(p.vertices) - 2 for p in o.data.polygons) for o in objs}}
