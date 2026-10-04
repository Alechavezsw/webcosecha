"""Camión minero de acarreo (referencia: CAT 797F) para la sección de /mineria.

Medidas aproximadas en metros: largo 15 m, ancho 9.8 m, cubiertas de 4 m.
Ejes de Blender: X = largo (+X hacia el frente), Y = ancho, Z = alto; el
exportador glTF lo deja con Y arriba para three.js. El piso está en z = 0.

Salida: public/models/truck.glb (comprimido con meshopt).
- "body": toda la carrocería en una sola malla multi-material.
- "wheel_FL", "wheel_RLo", ...: pivotes en el eje de cada rueda (la página los
  hace girar), con su malla como hija.
- Texturas horneadas con Cycles (polvo, barro desde el piso, chorreaduras,
  cantos gastados y oclusión ambiental) como color base: truck_body (2048) y
  truck_wheel (1024, compartida por las seis ruedas).
- light_head / light_tail son emisivos: la página los enciende.
"""
import bpy, bmesh, math, os, random
from mathutils import Vector, Matrix, noise

OUT = r"C:\Users\Usuario\Desktop\Proyectos\2cc\2\XVkKlmC8H4l\public\models\truck.glb"
rnd = random.Random(7)

for o in list(bpy.data.objects):
    bpy.data.objects.remove(o, do_unlink=True)
for coll in (bpy.data.meshes, bpy.data.materials, bpy.data.curves):
    for b in list(coll):
        coll.remove(b)


# ------------------------------------------------------------ materiales ---
def mat(name, color, metal=0.0, rough=0.5, emit=None, strength=0.0):
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    m.diffuse_color = (*color, 1)
    b = m.node_tree.nodes["Principled BSDF"]
    b.inputs["Base Color"].default_value = (*color, 1)
    b.inputs["Metallic"].default_value = metal
    b.inputs["Roughness"].default_value = rough
    if emit:
        b.inputs["Emission Color"].default_value = (*emit, 1)
        b.inputs["Emission Strength"].default_value = strength
    return m


MATS = [
    mat("paint", (0.52, 0.32, 0.045), metal=0.08, rough=0.66),     # 0 amarillo CAT con polvo
    mat("steel", (0.035, 0.035, 0.038), metal=0.55, rough=0.6),     # 1 chasis, rejilla
    mat("rubber", (0.022, 0.021, 0.02), rough=0.93),                # 2 cubiertas
    mat("chrome", (0.7, 0.7, 0.72), metal=1.0, rough=0.22),         # 3 vástagos, bulones
    mat("glass", (0.02, 0.028, 0.035), metal=0.4, rough=0.06),      # 4 vidrios
    mat("light_head", (1, 0.95, 0.82), emit=(1, 0.92, 0.72), strength=1.0),  # 5
    mat("light_tail", (0.5, 0.02, 0.02), emit=(1, 0.06, 0.02), strength=2.0),  # 6
    mat("ink", (0.015, 0.015, 0.015), rough=0.55),                  # 7 letras
    mat("rock", (0.34, 0.27, 0.2), rough=1.0),                     # 8 carga
]
PAINT, STEEL, RUBBER, CHROME, GLASS, HEAD, TAIL, INK, ROCK = range(9)


# ------------------------------------------------------------- utilidades ---
def faces_of(verts):
    return {f for v in verts for f in v.link_faces}


def add_box(bm, mi, x0, x1, y0, y1, z0, z1, bevel=0.05, M=None, segs=2):
    verts = bmesh.ops.create_cube(bm, size=1)["verts"]
    for v in verts:
        v.co = Vector((x0 if v.co.x < 0 else x1, y0 if v.co.y < 0 else y1, z0 if v.co.z < 0 else z1))
        if M is not None:
            v.co = M @ v.co
    for f in faces_of(verts):
        f.material_index = mi
    if bevel:
        edges = list({e for v in verts for e in v.link_edges})
        res = bmesh.ops.bevel(bm, geom=edges, offset=bevel, segments=segs, profile=0.5,
                              affect="EDGES", clamp_overlap=True)
        # Las caras nuevas del bisel no heredan el material: sin esto los
        # cantos de las piezas oscuras salían amarillos.
        for f in res["faces"]:
            f.material_index = mi
    return verts


def add_cyl(bm, mi, r, h, M, segs=16, r2=None):
    verts = bmesh.ops.create_cone(bm, cap_ends=True, segments=segs, radius1=r,
                                  radius2=r if r2 is None else r2, depth=h, matrix=M)["verts"]
    for f in faces_of(verts):
        f.material_index = mi
        f.smooth = True
    return verts


def revolve(bm, mi, prof, segs, outward_first=True):
    """Gira un perfil (r, y) alrededor del eje Y. El orden de las caras deja
    las normales hacia afuera si el perfil va de -y a +y por el lado externo."""
    rings = []
    for i in range(segs):
        a = i / segs * math.tau
        c, s = math.cos(a), math.sin(a)
        rings.append([bm.verts.new((r * c, y, r * s)) for r, y in prof])
    for i in range(segs):
        A, B = rings[i], rings[(i + 1) % segs]
        for j in range(len(prof) - 1):
            q = (A[j], A[j + 1], B[j + 1], B[j]) if outward_first else (A[j], B[j], B[j + 1], A[j + 1])
            f = bm.faces.new(q)
            f.material_index = mi
            f.smooth = True


def to_object(bm, name, parent=None, loc=(0, 0, 0)):
    me = bpy.data.meshes.new(name)
    bm.normal_update()
    bm.to_mesh(me)
    bm.free()
    for m in MATS:
        me.materials.append(m)
    ob = bpy.data.objects.new(name, me)
    bpy.context.scene.collection.objects.link(ob)
    ob.location = loc
    if parent:
        ob.parent = parent
    return ob


# ----------------------------------------------------------------- ruedas ---
R = 2.0
TIRE = [(1.3, -0.70), (1.6, -0.76), (1.84, -0.73), (1.96, -0.62), (2.03, -0.42),
        (2.06, -0.16), (2.06, 0.16), (2.03, 0.42), (1.96, 0.62), (1.84, 0.73),
        (1.6, 0.76), (1.3, 0.70)]
RIM_OUT = [(0.0, 0.58), (0.3, 0.58), (0.36, 0.5), (0.98, 0.44), (1.18, 0.55), (1.32, 0.68)]


def wheel_mesh(name):
    bm = bmesh.new()
    revolve(bm, RUBBER, TIRE, 72, outward_first=True)
    # Llanta de los dos lados (disco hundido) y aro interno que cierra el asiento
    revolve(bm, PAINT, [(r, y) for r, y in reversed(RIM_OUT)], 48, outward_first=True)
    revolve(bm, PAINT, [(r, -y) for r, y in RIM_OUT], 48, outward_first=True)
    revolve(bm, STEEL, [(1.3, 0.7), (1.3, -0.7)], 48, outward_first=False)
    # Bulones en las dos caras
    for side in (1, -1):
        for k in range(16):
            a = k / 16 * math.tau
            M = (Matrix.Translation((0.7 * math.cos(a), side * 0.49, 0.7 * math.sin(a)))
                 @ Matrix.Rotation(math.pi / 2, 4, "X"))
            add_cyl(bm, CHROME, 0.055, 0.1, M, segs=6)
        add_cyl(bm, STEEL, 0.28, 0.16, Matrix.Translation((0, side * 0.6, 0)) @ Matrix.Rotation(math.pi / 2, 4, "X"), segs=20)
    # Tacos en chevrón: dos mitades inclinadas en sentidos opuestos y alternadas
    N = 38
    for k in range(N):
        for half in (-1, 1):
            a = (k + (0.5 if half > 0 else 0)) / N * math.tau
            yc = half * 0.34
            M = Matrix.Rotation(a, 4, "Y") @ Matrix.Rotation(-half * 0.45, 4, "Z")
            add_box(bm, RUBBER, -0.17, 0.17, yc - 0.3, yc + 0.3, 1.96, 2.15, bevel=0.03, M=M, segs=1)
    return bm


FX, RX = 4.4, -2.4
WHEELS = [("wheel_FL", FX, 3.45), ("wheel_FR", FX, -3.45),
          ("wheel_RLo", RX, 3.95), ("wheel_RLi", RX, 2.4),
          ("wheel_RRo", RX, -3.95), ("wheel_RRi", RX, -2.4)]
wheel_objs = []
for name, x, y in WHEELS:
    pivot = bpy.data.objects.new(name, None)
    pivot.location = (x, y, R)
    bpy.context.scene.collection.objects.link(pivot)
    wheel_objs.append(to_object(wheel_mesh(name), name + "_mesh", parent=pivot))

# ------------------------------------------------------------- carrocería ---
bm = bmesh.new()
B = lambda *a, **k: add_box(bm, *a, **k)

# Chasis, ejes, suspensión
B(STEEL, -6.4, 6.4, 0.75, 1.4, 1.6, 2.7)
B(STEEL, -6.4, 6.4, -1.4, -0.75, 1.6, 2.7)
B(STEEL, RX - 0.8, RX + 0.8, -3.2, 3.2, 1.45, 2.55, bevel=0.12)       # carcasa del eje trasero
B(STEEL, FX - 0.45, FX + 0.45, -2.75, 2.75, 1.55, 2.35)
for y in (2.2, -2.2):                                                  # amortiguadores delanteros
    add_cyl(bm, CHROME, 0.2, 1.6, Matrix.Translation((FX - 0.1, y, 3.1)), segs=16)
    add_cyl(bm, PAINT, 0.32, 0.9, Matrix.Translation((FX - 0.1, y, 4.0)), segs=16)
for y in (1.5, -1.5):                                                  # suspensión trasera
    add_cyl(bm, CHROME, 0.18, 1.4, Matrix.Translation((RX + 0.4, y, 3.0)), segs=16)
for y in (1.25, -1.25):                                                # cilindros de volteo
    M = Matrix.Translation((0.6, y, 2.9)) @ Matrix.Rotation(-0.35, 4, "Y")
    add_cyl(bm, PAINT, 0.24, 1.3, M @ Matrix.Translation((0, 0, -0.4)), segs=16)
    add_cyl(bm, CHROME, 0.15, 1.3, M @ Matrix.Translation((0, 0, 0.6)), segs=16)
B(PAINT, -0.4, 2.5, 1.55, 3.05, 1.75, 3.15, bevel=0.15)                # tanque de combustible
B(PAINT, -0.4, 2.5, -3.05, -1.55, 1.75, 3.15, bevel=0.15)              # tanque hidráulico

# Frente: paragolpes, radiador con rejilla, capot
B(PAINT, 6.4, 7.55, -2.95, 2.95, 1.15, 2.35, bevel=0.1)
B(STEEL, 6.0, 7.12, -2.05, 2.05, 2.3, 4.3)
for i in range(10):
    z = 2.45 + i * 0.18
    B(STEEL, 7.1, 7.22, -1.92, 1.92, z, z + 0.06, bevel=0.0)
for y in (-1.3, 0.0, 1.3):
    B(STEEL, 7.16, 7.24, y - 0.05, y + 0.05, 2.35, 4.25, bevel=0.0)
B(PAINT, 3.3, 6.05, -2.15, 2.15, 2.35, 4.3)
B(HEAD, 7.5, 7.58, 2.1, 2.6, 1.6, 1.9, bevel=0.02)                     # faros bajos
B(HEAD, 7.5, 7.58, -2.6, -2.1, 1.6, 1.9, bevel=0.02)

# Plataforma superior
B(PAINT, 3.3, 7.35, -4.8, 4.8, 4.3, 4.56)
for x in (4.0, 5.4, 6.8):                                              # ménsulas bajo la plataforma
    for s in (1, -1):
        M = Matrix.Translation((x, s * 3.6, 3.75)) @ Matrix.Rotation(s * 0.55, 4, "X")
        B(STEEL, -0.08, 0.08, -0.08, 0.08, -0.85, 0.85, bevel=0.0, M=M)
# Barandas (tubo + postes)
B(STEEL, 7.22, 7.3, -4.7, 4.7, 5.5, 5.58, bevel=0.0)
B(STEEL, 7.22, 7.3, -4.7, 4.7, 5.0, 5.05, bevel=0.0)
B(STEEL, 3.4, 7.3, -4.74, -4.66, 5.5, 5.58, bevel=0.0)
B(STEEL, 3.4, 7.3, 4.66, 4.74, 5.5, 5.58, bevel=0.0)
for y in [-4.7 + i * 1.175 for i in range(9)]:
    B(STEEL, 7.22, 7.3, y - 0.04, y + 0.04, 4.56, 5.58, bevel=0.0)
for x in (3.6, 4.8, 6.0):
    for s in (1, -1):
        B(STEEL, x - 0.04, x + 0.04, s * 4.7 - 0.04, s * 4.7 + 0.04, 4.56, 5.58, bevel=0.0)

# Escalera diagonal sobre el radiador (la firma visual del 797)
p0 = Vector((7.62, -3.4, 1.0))
p1 = Vector((7.62, 2.6, 4.3))
d = p1 - p0
L = d.length
ang = math.atan2(d.z, d.y)
Mst = Matrix.Translation(p0) @ Matrix.Rotation(ang, 4, "X")
for side in (-0.42, 0.42):                                             # largueros
    B(STEEL, side - 0.04, side + 0.04, 0, L, -0.12, 0.05, bevel=0.0,
      M=Mst)
for k in range(11):                                                    # peldaños
    t = (k + 0.5) / 11
    c = p0 + d * t
    B(STEEL, c.x - 0.42, c.x + 0.42, c.y - 0.16, c.y + 0.16, c.z - 0.03, c.z + 0.03, bevel=0.0)
for off in (0.95,):                                                    # pasamanos
    B(STEEL, 0.38, 0.46, 0, L, off, off + 0.06, bevel=0.0, M=Mst)

# Cabina (izquierda) y filtros de aire (derecha)
B(PAINT, 3.6, 6.05, 1.9, 4.45, 4.56, 7.0, bevel=0.08)
B(GLASS, 6.02, 6.1, 2.1, 4.25, 5.45, 6.8, bevel=0.0)
B(GLASS, 3.8, 5.85, 4.42, 4.5, 5.45, 6.8, bevel=0.0)
B(GLASS, 3.8, 5.85, 1.85, 1.93, 5.45, 6.8, bevel=0.0)
B(STEEL, 3.55, 6.1, 1.85, 4.5, 7.0, 7.12, bevel=0.03)
for y in (-2.9, -3.9):
    add_cyl(bm, PAINT, 0.42, 1.6, Matrix.Translation((5.0, y, 5.35)), segs=20)
    add_cyl(bm, STEEL, 0.44, 0.12, Matrix.Translation((5.0, y, 6.2)), segs=20)
for s in (1, -1):                                                      # espejos
    B(STEEL, 7.0, 7.08, s * 4.9 - 0.04, s * 4.9 + 0.04, 4.56, 6.2, bevel=0.0)
    B(STEEL, 6.9, 7.1, s * 5.0 - 0.2, s * 5.0 + 0.2, 6.0, 6.6, bevel=0.03)
for y in (3.95, 3.15, -3.15, -3.95):                                   # faros superiores
    B(HEAD, 7.3, 7.42, y - 0.3, y + 0.3, 4.35, 4.55, bevel=0.02)
for y in (2.0, -2.0):                                                  # luces traseras
    B(TAIL, -6.5, -6.4, y - 0.3, y + 0.3, 1.9, 2.3, bevel=0.02)


# Caja de volteo: sección en V, la cola sube y el interior se ahueca.
def section(x, zb):
    return [(x, -4.85, 7.3), (x, -4.6, 4.6), (x, -2.4, zb), (x, 2.4, zb), (x, 4.6, 4.6), (x, 4.85, 7.3)]


secs = [section(3.3, 3.3), section(-5.4, 3.3), section(-7.7, 4.6)]
ring = [[bm.verts.new(p) for p in s] for s in secs]
body_faces = []
for i in range(len(ring) - 1):
    a, b = ring[i], ring[i + 1]
    for j in range(5):
        body_faces.append(bm.faces.new((a[j], b[j], b[j + 1], a[j + 1])))
    body_faces.append(bm.faces.new((a[5], b[5], b[0], a[0])))      # tapa superior (se ahueca)
body_faces.append(bm.faces.new(list(reversed(ring[0]))))
body_faces.append(bm.faces.new(ring[-1]))
for f in body_faces:
    f.material_index = PAINT
bm.normal_update()
bmesh.ops.recalc_face_normals(bm, faces=body_faces)
tops = [f for f in body_faces if f.normal.z > 0.9]
ins = bmesh.ops.inset_region(bm, faces=tops, thickness=0.3, depth=0)
inner = {v for f in tops for v in f.verts}
for v in inner:
    v.co.z -= 3.0 if v.co.x > -5.4 else 2.0
# Borde superior grueso, costillas, faja y techo protector
B(PAINT, -7.75, 3.35, -5.05, -4.75, 7.15, 7.55, bevel=0.12)
B(PAINT, -7.75, 3.35, 4.75, 5.05, 7.15, 7.55, bevel=0.12)
for s in (1, -1):
    B(PAINT, -7.6, 3.2, s * 4.68 - 0.13, s * 4.68 + 0.13, 6.1, 6.4, bevel=0.06)
    for x in (-6.6, -4.9, -3.2, -1.5, 0.2, 1.9):
        B(PAINT, x - 0.17, x + 0.17, s * 4.62 - 0.14, s * 4.62 + 0.14, 4.4, 6.15, bevel=0.05)
B(PAINT, 3.2, 7.75, -4.95, 4.95, 7.15, 7.45, bevel=0.08)
B(PAINT, 7.55, 7.8, -4.95, 4.95, 6.85, 7.45, bevel=0.06)
for y in (-3.6, -1.2, 1.2, 3.6):
    B(PAINT, 3.3, 7.6, y - 0.12, y + 0.12, 6.75, 7.15, bevel=0.03)

# Carga de piedra: un montículo grumoso y piedras sueltas encima
pile = bmesh.ops.create_icosphere(bm, subdivisions=3, radius=1.0)["verts"]
off = Vector((3.1, 7.7, 1.3))
for v in pile:
    n = v.co.normalized()
    k = 1 + 0.18 * noise.noise(n * 2.2 + off) + 0.08 * noise.noise(n * 6.0 + off)
    v.co = Vector((n.x * 5.0 * k - 2.3, n.y * 4.25 * k, max(n.z, -0.2) * 1.7 * k + 6.9))
for f in faces_of(pile):
    f.material_index = ROCK
for i in range(55):
    a = rnd.random() * math.tau
    rr = rnd.random() ** 0.7
    c = Vector((-2.3 + math.cos(a) * rr * 4.3, math.sin(a) * rr * 3.6, 0))
    c.z = 6.9 + 1.55 * math.sqrt(max(0.0, 1 - (rr * 0.92) ** 2)) - 0.05
    s = 0.25 + rnd.random() * 0.45
    rv = bmesh.ops.create_icosphere(bm, subdivisions=1, radius=s)["verts"]
    for v in rv:
        v.co = v.co * (0.8 + 0.4 * rnd.random())
        v.co.z *= 0.7
        v.co += c
    for f in faces_of(rv):
        f.material_index = ROCK
        f.smooth = True  # facetadas se leían como polígonos, no como piedra

body = to_object(bm, "body")

# Marca en los dos costados de la caja, entre el borde y la faja
for side, rotz in ((-1, 0.0), (1, math.pi)):
    bpy.ops.object.text_add(location=(0, 0, 0))
    t = bpy.context.object
    t.data.body = "COSECHA CREATIVA"
    t.data.size = 0.58
    t.data.extrude = 0.008
    t.data.align_x = "CENTER"
    t.data.align_y = "CENTER"
    bpy.ops.object.convert(target="MESH")
    t = bpy.context.object
    t.data.materials.clear()
    for m in MATS:
        t.data.materials.append(m)
    for p in t.data.polygons:
        p.material_index = INK
    # Pegado a la pared, que se abre hacia arriba ~5°: separado, el cartel
    # proyectaba sombra y se leía doble.
    tilt = math.atan2(0.25, 2.7)
    t.rotation_euler = (math.pi / 2 + tilt, 0, rotz)
    t.location = (-2.4, side * 4.818, 6.82)
    bpy.ops.object.select_all(action="DESELECT")
    t.select_set(True)
    body.select_set(True)
    bpy.context.view_layer.objects.active = body
    bpy.ops.object.join()

# ------------------------------------------ texturas horneadas (Cycles) ---
# Las caras grandes de la caja tienen 4 vértices: el color por vértice no
# alcanza para ensuciar un panel. Se arma un material procedural por pieza
# (polvo, barro que sube desde el piso, chorreaduras verticales, cantos
# gastados y oclusión ambiental real), se hornea a una imagen y la imagen
# viaja dentro del GLB como color base.
sc = bpy.context.scene
sc.render.engine = "CYCLES"
sc.cycles.device = "CPU"
sc.cycles.samples = 16
sc.render.bake.target = "IMAGE_TEXTURES"
sc.render.bake.margin = 6
if sc.world is None:
    sc.world = bpy.data.worlds.new("w")

# Las seis ruedas son iguales: comparten malla (y por lo tanto textura).
wheel_me = wheel_objs[0].data
for ob in wheel_objs[1:]:
    old = ob.data
    ob.data = wheel_me
    bpy.data.meshes.remove(old)


def unwrap(ob):
    bpy.ops.object.select_all(action="DESELECT")
    ob.select_set(True)
    bpy.context.view_layer.objects.active = ob
    bpy.ops.object.mode_set(mode="EDIT")
    bpy.ops.mesh.select_all(action="SELECT")
    bpy.ops.uv.smart_project(angle_limit=math.radians(60), island_margin=0.004)
    bpy.ops.object.mode_set(mode="OBJECT")


unwrap(body)
unwrap(wheel_objs[0])

# kind: (color base, polvo, barro, chorreaduras, desgaste de cantos, variación)
LOOK = {
    "paint":      ((0.55, 0.33, 0.035), 0.16, 0.8, 0.3, 0.35, 0.0),
    "steel":      ((0.04, 0.038, 0.036), 0.2, 0.6, 0.15, 0.0, 0.0),
    "rubber":     ((0.03, 0.028, 0.026), 0.35, 0.5, 0.0, 0.0, 0.0),
    "chrome":     ((0.62, 0.62, 0.64), 0.2, 0.3, 0.0, 0.0, 0.0),
    "glass":      ((0.025, 0.03, 0.035), 0.35, 0.0, 0.2, 0.0, 0.0),
    "light_head": ((1.0, 0.95, 0.85), 0.0, 0.0, 0.0, 0.0, 0.0),
    "light_tail": ((0.5, 0.03, 0.02), 0.0, 0.0, 0.0, 0.0, 0.0),
    "ink":        ((0.02, 0.02, 0.02), 0.0, 0.0, 0.0, 0.0, 0.0),
    "rock":       ((0.33, 0.26, 0.19), 0.2, 0.0, 0.0, 0.0, 0.6),
}
DUST = (0.5, 0.41, 0.3)
MUD = (0.17, 0.12, 0.08)
STREAK = (0.2, 0.15, 0.1)
WORN = (0.1, 0.09, 0.085)


def bake_material(name, image):
    base, dust, mud, streak, wear, var = LOOK[name]
    m = bpy.data.materials.new("bake_" + name)
    m.use_nodes = True
    nt = m.node_tree
    N, Lk = nt.nodes, nt.links
    for n in list(N):
        N.remove(n)
    out = N.new("ShaderNodeOutputMaterial")
    emis = N.new("ShaderNodeEmission")
    Lk.new(emis.outputs["Emission"], out.inputs["Surface"])
    img = N.new("ShaderNodeTexImage")
    img.image = image
    N.active = img
    tc = N.new("ShaderNodeTexCoord")
    geo = N.new("ShaderNodeNewGeometry")
    sep = N.new("ShaderNodeSeparateXYZ")
    Lk.new(geo.outputs["Position"], sep.inputs["Vector"])

    def noise(scale, detail=6.0, stretch=None):
        n = N.new("ShaderNodeTexNoise")
        n.inputs["Scale"].default_value = scale
        n.inputs["Detail"].default_value = detail
        if stretch:
            mp = N.new("ShaderNodeMapping")
            mp.inputs["Scale"].default_value = stretch
            Lk.new(tc.outputs["Object"], mp.inputs["Vector"])
            Lk.new(mp.outputs["Vector"], n.inputs["Vector"])
        else:
            Lk.new(tc.outputs["Object"], n.inputs["Vector"])
        return n.outputs["Fac"]

    def remap(sock, a, b, lo=0.0, hi=1.0):
        r = N.new("ShaderNodeMapRange")
        r.clamp = True
        r.inputs["From Min"].default_value = a
        r.inputs["From Max"].default_value = b
        r.inputs["To Min"].default_value = lo
        r.inputs["To Max"].default_value = hi
        Lk.new(sock, r.inputs["Value"])
        return r.outputs["Result"]

    def mul(a, b):
        mth = N.new("ShaderNodeMath")
        mth.operation = "MULTIPLY"
        mth.use_clamp = True
        if isinstance(a, float):
            mth.inputs[0].default_value = a
        else:
            Lk.new(a, mth.inputs[0])
        if isinstance(b, float):
            mth.inputs[1].default_value = b
        else:
            Lk.new(b, mth.inputs[1])
        return mth.outputs[0]

    def mix(col_sock, rgb, fac_sock):
        mx = N.new("ShaderNodeMix")
        mx.data_type = "RGBA"
        if isinstance(col_sock, tuple):
            mx.inputs[6].default_value = (*col_sock, 1)
        else:
            Lk.new(col_sock, mx.inputs[6])
        mx.inputs[7].default_value = (*rgb, 1)
        Lk.new(fac_sock, mx.inputs[0])
        return mx.outputs[2]

    col = base
    if var:  # piedra: manchas de color propias
        col = mix(col, (base[0] * 0.55, base[1] * 0.55, base[2] * 0.6), mul(remap(noise(1.6, 8), 0.3, 0.7), var))
        col = mix(col, (0.42, 0.37, 0.31), mul(remap(noise(4.0, 4), 0.55, 0.75), var))
    if dust:  # polvo general en manchones grandes
        # Velo fino y parejo, no manchones (a escala grande parecía camuflaje)
        col = mix(col, DUST, mul(remap(noise(1.2, 3), 0.25, 0.8, 0.5, 1.0), dust))
    if mud:   # barro que sube desde el piso, con borde irregular
        grad = remap(sep.outputs["Z"], 0.5, 2.9, 1.0, 0.0)
        edge = remap(noise(2.2, 8), 0.3, 0.7, 0.55, 1.35)
        col = mix(col, MUD, mul(mul(grad, edge), mud))
    if streak:  # chorreaduras verticales (ruido estirado en Z)
        col = mix(col, STREAK, mul(remap(noise(1.6, 3, stretch=(2.2, 2.2, 0.18)), 0.58, 0.7), streak))
    if wear:  # cantos gastados: aparece el metal oscuro debajo de la pintura
        pts = remap(geo.outputs["Pointiness"], 0.515, 0.56)
        col = mix(col, WORN, mul(mul(pts, remap(noise(6.0, 4), 0.4, 0.65)), wear))
    if name not in ("light_head", "light_tail"):
        ao = N.new("ShaderNodeAmbientOcclusion")
        ao.samples = 16
        ao.inputs["Distance"].default_value = 1.4
        aof = remap(ao.outputs["AO"], 0.0, 1.0, 0.22, 1.0)
        col = mix(col if not isinstance(col, tuple) else col, (0, 0, 0), remap(aof, 0.22, 1.0, 0.78, 0.0))
    if isinstance(col, tuple):
        emis.inputs["Color"].default_value = (*col, 1)
    else:
        Lk.new(col, emis.inputs["Color"])
    return m


ORDER = ["paint", "steel", "rubber", "chrome", "glass", "light_head", "light_tail", "ink", "rock"]
PBR = {  # rugosidad / metal finales para la página
    "paint": (0.7, 0.05), "steel": (0.62, 0.5), "rubber": (0.95, 0.0), "chrome": (0.28, 1.0),
    "glass": (0.08, 0.3), "light_head": (0.3, 0.0), "light_tail": (0.3, 0.0), "ink": (0.6, 0.0), "rock": (1.0, 0.0),
}


def bake_into(ob, image, suffix):
    me = ob.data
    for i, name in enumerate(ORDER):
        me.materials[i] = bake_material(name, image)
    bpy.ops.object.select_all(action="DESELECT")
    ob.select_set(True)
    bpy.context.view_layer.objects.active = ob
    bpy.ops.object.bake(type="EMIT")
    image.pack()
    # Materiales finales: el horneado como color base + rugosidad/metal propios
    for i, name in enumerate(ORDER):
        fm = bpy.data.materials.new(name + suffix)
        fm.use_nodes = True
        nt = fm.node_tree
        bsdf = nt.nodes["Principled BSDF"]
        tex = nt.nodes.new("ShaderNodeTexImage")
        tex.image = image
        nt.links.new(tex.outputs["Color"], bsdf.inputs["Base Color"])
        rough, metal = PBR[name]
        bsdf.inputs["Roughness"].default_value = rough
        bsdf.inputs["Metallic"].default_value = metal
        if name == "light_head":
            bsdf.inputs["Emission Color"].default_value = (1, 0.92, 0.72, 1)
            bsdf.inputs["Emission Strength"].default_value = 1.0
        if name == "light_tail":
            bsdf.inputs["Emission Color"].default_value = (1, 0.06, 0.02, 1)
            bsdf.inputs["Emission Strength"].default_value = 2.0
        me.materials[i] = fm


body_img = bpy.data.images.new("truck_body", 2048, 2048)
wheel_img = bpy.data.images.new("truck_wheel", 1024, 1024)
bake_into(body, body_img, "")
bake_into(wheel_objs[0], wheel_img, "_w")

# ---------------------------------------------------------------- export ---
os.makedirs(os.path.dirname(OUT), exist_ok=True)
bpy.ops.object.select_all(action="DESELECT")
for ob in bpy.context.scene.objects:
    ob.select_set(True)
bpy.ops.export_scene.gltf(
    filepath=OUT,
    export_format="GLB",
    use_selection=True,
    export_apply=True,
    export_materials="EXPORT",
    export_vertex_color="NONE",
    export_normals=True,
    export_texcoords=True,
    export_image_format="JPEG",
    # Comprimido con meshopt: three.js lo decodifica con MeshoptDecoder (viene
    # en three/examples, no hay que bajar nada de afuera).
    export_meshopt_compression_enable=True,
)
dg = bpy.context.evaluated_depsgraph_get()
tris = sum(len(o.evaluated_get(dg).data.loop_triangles) for o in [body, wheel_objs[0]])
result = {"bytes": os.path.getsize(OUT), "tris": tris}
