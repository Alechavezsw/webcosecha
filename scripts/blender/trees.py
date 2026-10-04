import bpy, bmesh, random, math
from mathutils import Vector, noise

OUT = r"C:\Users\Usuario\Desktop\Proyectos\2cc\2\XVkKlmC8H4l\public\models\trees.glb"

# Escena limpia sin resetear preferencias (el add-on del servidor vive ahí)
for o in list(bpy.data.objects):
    bpy.data.objects.remove(o, do_unlink=True)
for m in list(bpy.data.meshes):
    bpy.data.meshes.remove(m)

TRUNK = (0.16, 0.10, 0.06)


def lerp3(a, b, t):
    return tuple(a[i] + (b[i] - a[i]) * t for i in range(3))


class Builder:
    def __init__(self, seed):
        self.bm = bmesh.new()
        self.lay = self.bm.verts.layers.float_color.new("Col")
        self.rng = random.Random(seed)

    def _tag(self, verts, fn):
        for v in verts:
            c = fn(v)
            v[self.lay] = (c[0], c[1], c[2], 1.0)

    def limb(self, a, b, r0, r1, segs=6):
        """Cono de a -> b (tronco o rama)."""
        a, b = Vector(a), Vector(b)
        d = b - a
        res = bmesh.ops.create_cone(self.bm, cap_ends=True, cap_tris=False, segments=segs,
                                    radius1=r0, radius2=r1, depth=d.length)
        verts = res["verts"]
        rot = Vector((0, 0, 1)).rotation_difference(d.normalized()).to_matrix().to_4x4()
        bmesh.ops.transform(self.bm, matrix=rot, verts=verts)
        bmesh.ops.translate(self.bm, vec=(a + b) / 2, verts=verts)
        self._tag(verts, lambda v: lerp3((0.07, 0.045, 0.03), TRUNK, min(1, v.co.z / 0.6)))

    def blob(self, c, r, green, squash=1.0, amp=0.34, subdiv=2):
        """Masa de follaje: icoesfera deformada con ruido."""
        c = Vector(c)
        res = bmesh.ops.create_icosphere(self.bm, subdivisions=subdiv, radius=r)
        verts = res["verts"]
        off = Vector((self.rng.random() * 50, self.rng.random() * 50, self.rng.random() * 50))
        for v in verts:
            n = v.co.normalized()
            k = noise.noise(v.co * (2.2 / r) + off) + 0.5 * noise.noise(v.co * (5.0 / r) + off)
            v.co = v.co * (1 + k * amp)
            v.co.z *= squash
            if v.co.z < -r * 0.35:  # panza aplanada: la copa se apoya
                v.co.z = -r * 0.35 + (v.co.z + r * 0.35) * 0.4
            v.co += c
        def shade(v):
            rel = (v.co - c)
            out = max(0.0, min(1.0, rel.normalized().dot(Vector((0.25, -0.2, 0.95))) * 0.5 + 0.5))
            ao = 0.35 + 0.65 * out
            top = max(0.0, (v.co.z - c.z) / r)
            warm = lerp3(green, (green[0] * 1.6, green[1] * 1.35, green[2] * 0.9), top * 0.6)
            return tuple(g * ao for g in warm)
        self._tag(verts, shade)

    def build(self, name, height=1.35):
        bm = self.bm
        me = bpy.data.meshes.new(name)
        bm.to_mesh(me)
        me.color_attributes.active_color = me.color_attributes["Col"]
        me.color_attributes.render_color_index = me.color_attributes.active_color_index
        for p in me.polygons:
            p.use_smooth = True
        bm.free()
        ob = bpy.data.objects.new(name, me)
        bpy.context.scene.collection.objects.link(ob)
        # normaliza alto a 1.35 (el mismo que usaban los recortes planos)
        zs = [v.co.z for v in me.vertices]
        s = height / (max(zs) - min(zs))
        me.transform(__import__("mathutils").Matrix.Scale(s, 4))
        return ob


def greens(rng, base):
    return tuple(max(0, min(1, c * (0.85 + rng.random() * 0.3))) for c in base)


# --- Árbol de copa redonda --------------------------------------------------
def round_tree(seed):
    b = Builder(seed)
    r = b.rng
    b.limb((0, 0, 0), (0.05, 0, 1.3), 0.13, 0.07, 7)
    for ang in (0.4, 2.5, 4.4):
        tip = (math.cos(ang) * 0.55, math.sin(ang) * 0.55, 1.75)
        b.limb((0.04, 0, 1.0), tip, 0.06, 0.025)
    base = (0.22, 0.30, 0.12)
    b.blob((0, 0, 2.05), 0.85, greens(r, base))
    for i in range(13):
        a = i / 13 * math.tau * 2 + r.random() * 0.6
        rad = 0.55 + r.random() * 0.35
        b.blob((math.cos(a) * rad, math.sin(a) * rad, 1.65 + r.random() * 0.95),
               0.3 + r.random() * 0.22, greens(r, base), amp=0.4, subdiv=1 if i % 2 else 2)
    b.blob((0.1, 0.05, 2.7), 0.5, greens(r, (0.28, 0.36, 0.14)))
    return b.build("tree_round")


# --- Álamo: huso alto y angosto --------------------------------------------
def poplar(seed):
    b = Builder(seed)
    r = b.rng
    b.limb((0, 0, 0), (0, 0, 1.0), 0.09, 0.05, 6)
    base = (0.24, 0.32, 0.11)
    n = 20
    for i in range(n):
        t = i / (n - 1)
        z = 0.75 + t * 3.6
        w = math.sin(math.pi * (0.12 + t * 0.85)) * 0.36 + 0.07
        a = r.random() * math.tau
        b.blob((math.cos(a) * w * 0.25, math.sin(a) * w * 0.25, z), w,
               greens(r, lerp3(base, (0.32, 0.38, 0.14), t)), squash=1.5, amp=0.4, subdiv=1)
    return b.build("tree_poplar", 1.9)


# --- Algarrobo: tronco torcido y copa ancha y plana ------------------------
def carob(seed):
    b = Builder(seed)
    r = b.rng
    b.limb((0, 0, 0), (0.25, 0.05, 0.9), 0.14, 0.09, 7)
    b.limb((0.25, 0.05, 0.9), (-0.7, 0.2, 1.65), 0.08, 0.035)
    b.limb((0.25, 0.05, 0.9), (1.05, -0.1, 1.55), 0.08, 0.035)
    b.limb((0.25, 0.05, 0.9), (0.2, -0.75, 1.6), 0.06, 0.03)
    base = (0.2, 0.26, 0.1)
    for i in range(10):
        a = r.random() * math.tau
        rad = r.random() ** 0.6 * 1.25
        b.blob((0.15 + math.cos(a) * rad, math.sin(a) * rad * 0.8, 1.7 + r.random() * 0.3),
               0.45 + r.random() * 0.2, greens(r, base), squash=0.55, amp=0.3)
    return b.build("tree_carob", 1.15)


# --- Arbusto -----------------------------------------------------------------
def bush(seed):
    b = Builder(seed)
    r = b.rng
    base = (0.2, 0.27, 0.1)
    for i in range(5):
        a = i / 5 * math.tau
        b.blob((math.cos(a) * 0.45, math.sin(a) * 0.35, 0.35 + r.random() * 0.15),
               0.4 + r.random() * 0.15, greens(r, base), squash=0.85)
    b.blob((0, 0, 0.6), 0.5, greens(r, (0.26, 0.33, 0.12)))
    return b.build("tree_bush", 0.5)


objs = [round_tree(7), poplar(11), carob(5), bush(3)]
for i, o in enumerate(objs):
    o.location.x = i * 3

import os
os.makedirs(os.path.dirname(OUT), exist_ok=True)
bpy.ops.object.select_all(action="DESELECT")
for o in objs:
    o.select_set(True)
# los dejo en el origen para el export (cada uno se instancia aparte)
for o in objs:
    o.location.x = 0
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
result = {
    "file": OUT,
    "bytes": os.path.getsize(OUT),
    "tris": {o.name: sum(len(p.vertices) - 2 for p in o.data.polygons) for o in objs},
}
