/**
 * EcoPulse — True 3D Volumetric Airflow (Blue Theme)
 * ───────────────────────────────────────────────────
 * WHY THE OLD VERSION LOOKED FLAT:
 *   - LineSegments were all at nearly the same Z depth → no perspective scaling
 *   - Uniform opacity/size → no distance cue (no atmospheric falloff)
 *   - Streaks were axis-aligned → obviously 2D constructs
 *
 * HOW THIS ACHIEVES 3D:
 *   - THREE layers of particles at genuinely different Z depths (−15, 0, +12)
 *   - sizeAttenuation:true → WebGL perspective-divides particle size by depth
 *     so near particles are naturally larger, far ones smaller
 *   - Exponential fog fades distant particles (atmospheric depth)
 *   - Near layer: fast, bright, large   |  Far layer: slow, dim, tiny
 *   - Tiny camera drift creates parallax (elements at different depths shift
 *     at different rates as the camera moves)
 *   - Each 3D "wisp" is an oriented Billboard sprite: a small textured quad
 *     that always faces camera but lives at a real 3D position
 *
 * AIRFLOW FIELD: curl-noise (same field for wisps + leaves = physical cohesion)
 */
(function () {
    'use strict';

    const PRM = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const canvas = document.getElementById('eco-canvas');
    if (!canvas) return;

    const THREE = window.THREE;
    if (!THREE) { showFallback(); return; }

    // ── Renderer ─────────────────────────────────────────────────────────────
    let renderer;
    try {
        renderer = new THREE.WebGLRenderer({
            canvas,
            antialias: true,
            alpha: false,
            powerPreference: 'high-performance'
        });
    } catch (_) { showFallback(); return; }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);

    // ── Scene / Camera / Fog ──────────────────────────────────────────────────
    const scene = new THREE.Scene();
    // Exponential fog: near elements vivid, far elements dissolve into bg colour
    scene.fog = new THREE.FogExp2(0x0b1932, 0.025);
    scene.background = new THREE.Color(0x0b1932);

    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.5, 80);
    camera.position.set(0, 0, 20);

    // ── Lighting ──────────────────────────────────────────────────────────────
    scene.add(new THREE.AmbientLight(0x9bbef0, 1.8));
    const key = new THREE.DirectionalLight(0xffffff, 0.7);
    key.position.set(4, 8, 10);
    scene.add(key);
    const rim = new THREE.DirectionalLight(0x3a78d4, 0.6);
    rim.position.set(-10, -3, 5);
    scene.add(rim);

    // ══════════════════════════════════════════════════════════════════════════
    //  CURL NOISE FLOW FIELD (shared by every layer)
    // ══════════════════════════════════════════════════════════════════════════
    // Approximates 3D curl noise using layered trig. Fast, no external dep.
    function curl(x, y, z, t) {
        const S = 0.065;
        const T = t * 0.14;
        // Pseudo-potential Ψ(x,y,z)
        const ux = Math.cos(y * S + T) * Math.sin(z * S * 0.6 + T * 0.4) * 0.055;
        const uy = Math.sin(x * S + T * 0.8) * Math.cos(z * S * 0.5) * 0.035;
        const uz = Math.cos(x * S * 0.7 + T * 0.6) * Math.sin(y * S) * 0.022;
        // Second harmonic for complexity
        const ux2 = Math.sin(y * S * 1.7 + z * S + T * 1.3) * 0.018;
        const uy2 = Math.cos(x * S * 1.4 + T * 1.1) * 0.012;
        return {
            fx: ux + ux2 + 0.035,    // gentle rightward bias
            fy: uy + uy2 - 0.005,    // very slight downward gravity
            fz: uz
        };
    }

    // ══════════════════════════════════════════════════════════════════════════
    //  VOLUMETRIC WISP LAYERS  (3 depth planes)
    // ══════════════════════════════════════════════════════════════════════════
    // --- Wisp sprite texture (programmatic: soft gaussian disk) ---------------
    function makeWispTexture(size) {
        const c = document.createElement('canvas');
        c.width = c.height = size;
        const ctx = c.getContext('2d');
        const hw = size / 2;
        // radial gradient: bright centre → transparent edge
        const g = ctx.createRadialGradient(hw, hw, 0, hw, hw, hw);
        g.addColorStop(0, 'rgba(140,195,255,0.95)');
        g.addColorStop(0.3, 'rgba(90,155,230,0.55)');
        g.addColorStop(0.7, 'rgba(50,100,200,0.15)');
        g.addColorStop(1, 'rgba(20,60,160,0)');
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, size, size);
        return new THREE.CanvasTexture(c);
    }
    const wispTex = makeWispTexture(64);

    // --- Layer descriptor: z-centre, count, speed-scale, size, opacity --------
    const LAYER_DEFS = PRM ? [
        { z: 0, n: 30, speed: 1.0, size: 0.55, opa: 0.28 }
    ] : [
        { z: -13, n: 110, speed: 0.5, size: 0.35, opa: 0.18 },  // far / small / dim
        { z: 0, n: 90, speed: 0.85, size: 0.55, opa: 0.28 },  // mid
        { z: 10, n: 60, speed: 1.3, size: 0.90, opa: 0.40 },  // near / large / bright
    ];

    const SX = 42, SY = 26;  // world-space scatter bounds

    const wispSystems = LAYER_DEFS.map(def => {
        const n = def.n;
        const pos = new Float32Array(n * 3);
        const data = [];

        for (let i = 0; i < n; i++) {
            const px = (Math.random() - 0.5) * SX;
            const py = (Math.random() - 0.5) * SY;
            const pz = def.z + (Math.random() - 0.5) * 3.5;  // slight Z spread per layer
            pos[i * 3] = px;
            pos[i * 3 + 1] = py;
            pos[i * 3 + 2] = pz;
            data.push({ px, py, pz: def.z + (Math.random() - 0.5) * 3.5, speed: def.speed });
        }

        const geo = new THREE.BufferGeometry();
        geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));

        const mat = new THREE.PointsMaterial({
            map: wispTex,
            size: def.size,
            sizeAttenuation: true,   // ← KEY: WebGL divides by depth → perspective
            transparent: true,
            opacity: def.opa,
            depthWrite: false,
            blending: THREE.AdditiveBlending,  // wisps add light, look volumetric
        });

        const pts = new THREE.Points(geo, mat);
        scene.add(pts);
        return { geo, mat, pts, data, def };
    });

    // ══════════════════════════════════════════════════════════════════════════
    //  LEAVES (same curl field, depth layers)
    // ══════════════════════════════════════════════════════════════════════════
    function makeLeaf(w, h) {
        const s = new THREE.Shape();
        s.moveTo(0, h * 0.5);
        s.bezierCurveTo(w * 0.7, h * 0.3, w * 0.55, 0.05, 0, -h * 0.5);
        s.bezierCurveTo(-w * 0.45, 0.05, -w * 0.6, h * 0.3, 0, h * 0.5);
        return new THREE.ShapeGeometry(s, 5);
    }

    const LEAF_COLORS = [0x2e9e80, 0x40b890, 0x237060, 0x4ab0a0, 0x357a8a, 0x3a8faa];
    const LEAF_COUNT = PRM ? 6 : 40;
    const leafObjects = [];

    for (let i = 0; i < LEAF_COUNT; i++) {
        const layer = Math.random();                         // 0=far, 1=near
        const scale = 0.22 + layer * 0.85;                  // perspective mimicry
        const w = scale * (0.45 + Math.random() * 0.35);
        const h = scale * (0.75 + Math.random() * 0.45);
        const geo = makeLeaf(w, h);
        const color = LEAF_COLORS[Math.floor(Math.random() * LEAF_COLORS.length)];
        const mat = new THREE.MeshLambertMaterial({
            color,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.25 + layer * 0.65,
            depthWrite: false
        });
        const mesh = new THREE.Mesh(geo, mat);
        const pz = -12 + layer * 22;                          // real 3D Z position
        mesh.position.set(
            (Math.random() - 0.5) * SX,
            (Math.random() - 0.5) * SY,
            pz
        );
        mesh.rotation.set(
            Math.random() * Math.PI * 2,
            Math.random() * Math.PI * 1.5,
            Math.random() * Math.PI * 2
        );
        scene.add(mesh);

        leafObjects.push({
            mesh,
            layer,
            pz,
            windScale: 0.4 + layer * 1.1,     // near leaves feel more wind
            gravity: -(0.0008 + Math.random() * 0.002),
            spinAx: (Math.random() - 0.5) * 0.006 * (0.5 + layer),
            spinAy: (Math.random() - 0.5) * 0.010 * (0.5 + layer),
            spinAz: (Math.random() - 0.5) * 0.005,
            flutterPhase: Math.random() * Math.PI * 2,
            flutterFreq: 1.0 + Math.random() * 1.8,
            flutterAmp: 0.0015 + Math.random() * 0.003
        });
    }

    // ══════════════════════════════════════════════════════════════════════════
    //  BACKGROUND gradient quad (behind everything)
    // ══════════════════════════════════════════════════════════════════════════
    (function () {
        const bGeo = new THREE.PlaneGeometry(200, 120, 1, 6);
        const bCol = [];
        const bPos = bGeo.attributes.position;
        for (let i = 0; i < bPos.count; i++) {
            const ny = (bPos.getY(i) + 60) / 120;  // 0=bottom 1=top
            bCol.push(0.04 + ny * 0.05, 0.09 + ny * 0.12, 0.20 + ny * 0.22);
        }
        bGeo.setAttribute('color', new THREE.BufferAttribute(new Float32Array(bCol), 3));
        const bMat = new THREE.MeshBasicMaterial({ vertexColors: true });
        const bMesh = new THREE.Mesh(bGeo, bMat);
        bMesh.position.z = -22;
        scene.add(bMesh);
    })();

    // ══════════════════════════════════════════════════════════════════════════
    //  CLOCK + STATE
    // ══════════════════════════════════════════════════════════════════════════
    const clock = new THREE.Clock();
    let paused = false, rafId = null;

    // ══════════════════════════════════════════════════════════════════════════
    //  ANIMATE
    // ══════════════════════════════════════════════════════════════════════════
    function animate() {
        rafId = requestAnimationFrame(animate);
        if (paused) return;

        const t = clock.getElapsedTime();

        // ── Volumetric wisps ──────────────────────────────────────────────────
        for (const sys of wispSystems) {
            const posArr = sys.geo.attributes.position.array;
            const { data, def } = sys;
            for (let i = 0; i < data.length; i++) {
                const d = data[i];
                const { fx, fy, fz } = curl(d.px, d.py, d.pz, t);
                d.px += fx * d.speed;
                d.py += fy * d.speed;
                d.pz += fz * d.speed * 0.4;   // subtle Z drift for depth variation

                // Horizontal wrap (wind flows right)
                if (d.px > SX * 0.55) { d.px = -SX * 0.55; d.py = (Math.random() - 0.5) * SY; }
                if (d.px < -SX * 0.55) { d.px = SX * 0.55; }
                // Vertical soft wrap
                if (d.py > SY * 0.60) d.py = -SY * 0.55;
                if (d.py < -SY * 0.60) d.py = SY * 0.55;
                // Z clamp to layer
                d.pz = def.z + Math.max(-4, Math.min(4, d.pz - def.z));

                posArr[i * 3] = d.px;
                posArr[i * 3 + 1] = d.py;
                posArr[i * 3 + 2] = d.pz;
            }
            sys.geo.attributes.position.needsUpdate = true;
        }

        // ── Leaves ride the same curl field ───────────────────────────────────
        for (const d of leafObjects) {
            const p = d.mesh.position;
            const { fx, fy, fz } = curl(p.x, p.y, p.z, t);
            const ws = d.windScale;

            p.x += fx * ws;
            p.y += fy * ws + d.gravity;
            p.z += fz * ws * 0.3;               // leaves drift in Z slightly

            // Micro-flutter: leaf tumbles as it rides airstream
            d.mesh.rotation.x += d.spinAx + Math.sin(t * d.flutterFreq + d.flutterPhase) * d.flutterAmp;
            d.mesh.rotation.y += d.spinAy;
            d.mesh.rotation.z += d.spinAz + Math.cos(t * d.flutterFreq * 0.65 + d.flutterPhase) * d.flutterAmp * 0.55;

            // Z clamp to keep leaves in viewable depth range
            p.z = Math.max(-14, Math.min(13, p.z));

            // Respawn off right or bottom edge
            if (p.x > SX * 0.6 || p.y < -SY * 0.65) {
                p.x = -SX * 0.55 - Math.random() * 5;
                p.y = (Math.random() - 0.5) * SY;
                p.z = d.pz;
            }
        }

        // ── Camera parallax drift ─────────────────────────────────────────────
        // Slight drift so elements at different Z depths shift at different
        // speeds → creates parallax → confirms spatial depth
        camera.position.x = Math.sin(t * 0.055) * 0.65;
        camera.position.y = Math.cos(t * 0.040) * 0.40;
        camera.lookAt(0, 0, 0);

        renderer.render(scene, camera);
    }

    if (!PRM) {
        animate();
    } else {
        renderer.render(scene, camera);
    }

    // ── Resize ────────────────────────────────────────────────────────────────
    function onResize() {
        const w = window.innerWidth, h = window.innerHeight;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    }
    window.addEventListener('resize', onResize);

    // ── Pause when tab hidden ─────────────────────────────────────────────────
    document.addEventListener('visibilitychange', () => {
        paused = document.hidden;
        if (!paused) clock.getDelta();   // discard stale delta on resume
    });

    // ── Cleanup ───────────────────────────────────────────────────────────────
    window.addEventListener('pagehide', () => {
        if (rafId) cancelAnimationFrame(rafId);
        renderer.dispose();
        wispSystems.forEach(s => { s.geo.dispose(); s.mat.dispose(); });
        wispTex.dispose();
        leafObjects.forEach(d => { d.mesh.geometry.dispose(); d.mesh.material.dispose(); });
        window.removeEventListener('resize', onResize);
    });

    function showFallback() {
        if (canvas) canvas.style.display = 'none';
        const fb = document.getElementById('eco-fallback');
        if (fb) fb.style.display = 'block';
    }

})();
