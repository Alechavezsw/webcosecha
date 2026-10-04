import bpy, math, os

OUT = r"C:\Users\Usuario\Desktop\Proyectos\2cc\2\XVkKlmC8H4l\public\models\flower.glb"

for o in list(bpy.data.objects):
    bpy.data.objects.remove(o, do_unlink=True)
for m in list(bpy.data.meshes):
    bpy.data.meshes.remove(m)


def smooth(a, b, x):
    u = max(0.0, min(1.0, (x - a) / (b - a)))
    return u * u * (3 - 2 * u)


def grid_mesh(name, nt, nu, fn):
    """fn(t, u) -> (x, y, z, shade). Grilla t (largo) x u (ancho, -1..1)."""
    verts, cols, faces = [], [], []
    for i in range(nt + 1):
        t = i / nt
        for j in range(nu + 1):
            u = j / nu * 2 - 1
            x, y, z, s = fn(t, u)
            verts.append((x, y, z))
            cols.append(s)
    w = nu + 1
    for i in range(nt):
        for j in range(nu):
            a = i * w + j
            faces.append((a, a + 1, a + w + 1, a + w))
    me = bpy.data.meshes.new(name)
    me.from_pydata(verts, [], faces)
    me.update()
    # que la cara de arriba (Z+) sea la "frontal"
    if sum(p.normal.z for p in me.polygons) < 0:
        for p in me.polygons:
            p.flip()
        me.update()
    attr = me.color_attributes.new("Col", "FLOAT_COLOR", "POINT")
    for i, s in enumerate(cols):
        attr.data[i].color = (s, s, s, 1.0)
    me.color_attributes.active_color = attr
    for p in me.polygons:
        p.use_smooth = True
    ob = bpy.data.objects.new(name, me)
    bpy.context.scene.collection.objects.link(ob)
    return ob


# -------------------------------------------------------------------------
# Pétalo. En Blender el largo va hacia -Y: el exportador glTF (Y arriba)
# lo deja apuntando a +Z, que es lo que espera la escena.
# -------------------------------------------------------------------------
def petal(name, curl, seed):
    def fn(t, u):
        # contorno de gota: base angosta, panza a 0.55, punta redondeada
        # base de gota y remate elíptico: punta redonda, no de cactus
        if t < 0.55:
            w = 0.47 * math.sin(math.pi * 0.5 * (t / 0.55) ** 0.9) ** 0.72
        else:
            e = (t - 0.55) / 0.45
            w = 0.47 * max(0.0, 1 - e ** 2.2) ** 0.5
        w *= 0.35 + 0.65 * smooth(0.0, 0.18, t)  # uña del pétalo
        x = u * w
        # muesca en la punta: el centro queda un poco más corto que los lados
        length = t * (1 - 0.055 * (1 - u * u) ** 3 * smooth(0.82, 1.0, t))
        # alto: curvatura + cuenco + nervadura hundida + volado del borde
        z = length * length * curl
        z += 0.16 * w * u * u
        z += 0.022 * min(1.0, abs(u) * 3) * smooth(0.05, 0.5, t)
        z += 0.03 * math.sin(t * 17 + seed) * abs(u) ** 3 * smooth(0.3, 1.0, t)
        # sombreado: venas longitudinales finas, nervadura clara, borde translúcido
        vein = (0.5 + 0.5 * math.cos(u * math.pi * 9 + math.sin(t * 6 + seed) * 0.6)) ** 8
        s = 1.0 - 0.16 * vein * smooth(0.05, 0.75, t) * (1 - smooth(0.85, 1.0, t))
        s += 0.12 * math.exp(-(u / 0.07) ** 2) * (1 - t)
        s *= 1 - 0.12 * smooth(0.0, 0.25, 0.25 - t)  # la uña, más oscura
        return (x, -length, z, max(0.0, min(1.15, s)))
    return grid_mesh(name, 34, 20, fn)


# -------------------------------------------------------------------------
# Hoja lanceolada: largo en +X, ancho en Z (three), arriba en Y (three).
# -------------------------------------------------------------------------
def leaf(name):
    L = 1.18
    def fn(t, u):
        w = 0.3 * math.sin(math.pi * min(t, 0.9999) ** 0.68) ** 0.85
        # dientes chicos en el borde
        w *= 1 - 0.07 * abs(math.sin(t * 46)) * smooth(0.15, 0.4, t) * (1 - smooth(0.85, 1, t))
        x = t * L
        y = u * w
        z = -x * x * 0.2 + y * y * 0.55        # cae en la punta, se ahueca
        z += 0.05 * min(1.0, abs(u) * 2.5) * (1 - t)  # pliegue de la nervadura
        z += 0.018 * math.sin(t * 11) * abs(u) ** 2  # borde ondulado
        midrib = math.exp(-(u / 0.06) ** 2)
        side = (0.5 + 0.5 * math.cos((t * 15 - abs(u) * 2.6) * math.pi)) ** 10 * (1 - midrib)
        s = 0.92 + 0.22 * midrib + 0.1 * side - 0.12 * abs(u) ** 2
        return (x, y, z, max(0.0, min(1.2, s)))
    return grid_mesh(name, 40, 16, fn)


objs = [petal("petal_0", 0.16, 1.3), petal("petal_1", 0.24, 4.1), petal("petal_2", 0.34, 2.2), leaf("leaf")]

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
result = {
    "bytes": os.path.getsize(OUT),
    "tris": {o.name: len(o.data.polygons) * 2 for o in objs},
}
