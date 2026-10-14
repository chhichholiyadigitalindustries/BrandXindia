/**
 * BRANDX — THE NEXT-GENERATION FULL 3D CINEMATIC UNIVERSE
 * Genuine WebGL 3D scene powered by Three.js
 * Features:
 * - Real-time 3D PBR Smartphone with metallic rim lighting & live dynamic canvas screen texture
 * - Thousands of floating 3D cosmic particles with velocity vectors & luminous portal trails
 * - Floating 3D architectural workspace elements for all 8 product chapters
 * - Smooth camera dolly, orbital navigation, and lighting transitions synced with native scroll
 * - Emotional Indian Business journey visual lighting (warm sunrise dawn -> futuristic cyan-blue digital cosmos)
 * - Built-in procedural Web Audio API ambient atmosphere (Muted by default with user toggle)
 */

class BrandXUniverse3D {
  constructor() {
    this.container = document.getElementById('filmStickyViewport');
    this.canvas = document.getElementById('webglCanvas');
    if (!this.canvas || !window.THREE) {
      console.warn('BrandX 3D: Canvas or THREE.js unavailable, activating CSS 3D fallback.');
      return;
    }

    this.isWebGLSupported = this.checkWebGL();
    if (!this.isWebGLSupported) {
      console.warn('BrandX 3D: WebGL not supported on this device. Fallback mode active.');
      return;
    }

    this.isMobile = window.innerWidth <= 768;
    this.isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.scrollProgress = 0;
    this.targetProgress = 0;
    this.activeChapter = 0;
    this.mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    this.clock = new THREE.Clock();
    this.isVisible = true;

    // Audio State (Muted by default)
    this.audioCtx = null;
    this.isSoundEnabled = false;
    this.ambientGain = null;
    this.lastChimedChapter = -1;

    this.init();
  }

  checkWebGL() {
    try {
      const testCanvas = document.createElement('canvas');
      return !!(window.WebGLRenderingContext && (testCanvas.getContext('webgl') || testCanvas.getContext('experimental-webgl')));
    } catch (e) {
      return false;
    }
  }

  init() {
    if (this.container) {
      this.container.classList.add('webgl-active');
    }
    document.body.classList.add('webgl-active');

    // 1. Scene & Camera
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0x060b19, 0.028);

    const aspect = window.innerWidth / window.innerHeight;
    this.camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 200);
    this.camera.position.set(0, 0, 13);
    this.scene.add(this.camera);

    // 2. WebGL Renderer
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.25;

    // 3. Lighting Rig
    this.setupLighting();

    // 4. Particle Field (Cosmic Universe & Energy Vortex)
    this.setupParticles();

    // 5. 3D Smartphone Hero Model
    this.setupPhoneModel();

    // 6. Floating 3D Chapter Objects (Scenes A to H)
    this.setupSceneObjects();

    // 7. Event Listeners
    this.bindEvents();

    // 8. Performance Visibility Observer
    this.setupVisibilityObserver();

    // 9. Start Render Loop
    this.animate();
  }

  setupLighting() {
    // Deep Navy Ambient Light
    this.ambientLight = new THREE.AmbientLight(0x0a1435, 1.8);
    this.scene.add(this.ambientLight);

    // Main Studio Key Light
    this.keyLight = new THREE.DirectionalLight(0xffffff, 1.6);
    this.keyLight.position.set(6, 10, 10);
    this.scene.add(this.keyLight);

    // Cyan Rim Light (Left)
    this.rimCyan = new THREE.PointLight(0x22d3ee, 4.2, 50);
    this.rimCyan.position.set(-8, 5, -2);
    this.scene.add(this.rimCyan);

    // Electric Blue Rim Light (Right)
    this.rimBlue = new THREE.PointLight(0x3b82f6, 4.0, 50);
    this.rimBlue.position.set(8, -4, -2);
    this.scene.add(this.rimBlue);

    // Emotional Warm Sunrise Dawn Light (Transitions into futuristic cyan-blue)
    this.dawnLight = new THREE.PointLight(0xf59e0b, 1.8, 35);
    this.dawnLight.position.set(0, -6, 4);
    this.scene.add(this.dawnLight);
  }

  setupParticles() {
    const particleCount = this.isMobile ? 450 : 1400;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const scales = new Float32Array(particleCount);

    const colorA = new THREE.Color(0x38bdf8); // Cyan
    const colorB = new THREE.Color(0x818cf8); // Electric Violet
    const colorC = new THREE.Color(0xffffff); // Star White

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      // Cylindrical / spherical spread through depth
      const radius = 3 + Math.random() * 26;
      const theta = Math.random() * Math.PI * 2;
      const z = (Math.random() - 0.5) * 60;

      positions[i3] = Math.cos(theta) * radius;
      positions[i3 + 1] = Math.sin(theta) * radius * 0.7;
      positions[i3 + 2] = z;

      // Color variation
      const choice = Math.random();
      const col = choice < 0.45 ? colorA : choice < 0.85 ? colorB : colorC;
      colors[i3] = col.r;
      colors[i3 + 1] = col.g;
      colors[i3 + 2] = col.b;

      scales[i] = Math.random() * 0.12 + 0.04;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('scale', new THREE.BufferAttribute(scales, 1));

    // Particle Material
    const material = new THREE.PointsMaterial({
      size: 0.18,
      vertexColors: true,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    this.particleSystem = new THREE.Points(geometry, material);
    this.scene.add(this.particleSystem);
  }

  // Helper: Generate smooth squircle rounded rectangle shape for Three.js
  createRoundedRectShape(width, height, radius) {
    const shape = new THREE.Shape();
    const x = -width / 2;
    const y = -height / 2;
    const r = Math.min(radius, width / 2, height / 2);
    shape.moveTo(x + r, y);
    shape.lineTo(x + width - r, y);
    shape.absarc(x + width - r, y + r, r, -Math.PI / 2, 0, false);
    shape.lineTo(x + width, y + height - r);
    shape.absarc(x + width - r, y + height - r, r, 0, Math.PI / 2, false);
    shape.lineTo(x + r, y + height);
    shape.absarc(x + r, y + height - r, r, Math.PI / 2, Math.PI, false);
    shape.lineTo(x, y + r);
    shape.absarc(x + r, y + r, r, Math.PI, Math.PI * 1.5, false);
    return shape;
  }

  // ========================================================================
  // REAL 3D SMARTPHONE HERO OBJECT (Realistic iPhone-Inspired Unibody)
  // ========================================================================
  setupPhoneModel() {
    this.phoneGroup = new THREE.Group();
    this.scene.add(this.phoneGroup);

    // Realistic iPhone proportions
    const w = 3.2;
    const h = 6.6;
    const d = 0.36;
    const r = 0.48; // Squircle corner radius

    // 1. Phone Body Chassis (Titanium Unibody with extruded squircle & beveled edges)
    const chassisShape = this.createRoundedRectShape(w, h, r);
    const extrudeSettings = {
      depth: d - 0.08,
      bevelEnabled: true,
      bevelSegments: 5,
      steps: 1,
      bevelSize: 0.04,
      bevelThickness: 0.04
    };
    const chassisGeo = new THREE.ExtrudeGeometry(chassisShape, extrudeSettings);
    chassisGeo.center();

    const chassisMat = new THREE.MeshStandardMaterial({
      color: 0x0c152a, // Deep Titanium Blue-Grey
      metalness: 0.92,
      roughness: 0.22,
      envMapIntensity: 2.0
    });
    this.chassisMesh = new THREE.Mesh(chassisGeo, chassisMat);
    this.phoneGroup.add(this.chassisMesh);

    // 2. Metallic Beveled Edge Chamfer (Glistening cyan rim line)
    const edgeGeo = new THREE.EdgesGeometry(chassisGeo, 24);
    const edgeMat = new THREE.LineBasicMaterial({
      color: 0x38bdf8,
      linewidth: 2,
      transparent: true,
      opacity: 0.75
    });
    this.edgeLines = new THREE.LineSegments(edgeGeo, edgeMat);
    this.phoneGroup.add(this.edgeLines);

    // 3. Dynamic Screen Canvas Texture
    this.screenCanvas = document.createElement('canvas');
    this.screenCanvas.width = 512;
    this.screenCanvas.height = 1024;
    this.screenCtx = this.screenCanvas.getContext('2d');
    this.drawScreenContent(0);

    this.screenTexture = new THREE.CanvasTexture(this.screenCanvas);
    this.screenTexture.minFilter = THREE.LinearFilter;
    this.screenTexture.magFilter = THREE.LinearFilter;

    // 4. Front Screen Display Mesh (Deeply rounded display with normalized UV mapping)
    const dispW = w - 0.22;
    const dispH = h - 0.22;
    const dispR = r - 0.08;
    const dispShape = this.createRoundedRectShape(dispW, dispH, dispR);
    const dispGeo = new THREE.ShapeGeometry(dispShape, 32);

    // Map UVs across the rounded display shape
    const posAttr = dispGeo.attributes.position;
    const uvs = new Float32Array(posAttr.count * 2);
    for (let i = 0; i < posAttr.count; i++) {
      const px = posAttr.getX(i);
      const py = posAttr.getY(i);
      uvs[i * 2] = (px + dispW / 2) / dispW;
      uvs[i * 2 + 1] = (py + dispH / 2) / dispH;
    }
    dispGeo.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));

    const screenMat = new THREE.MeshBasicMaterial({
      map: this.screenTexture,
      transparent: false
    });
    this.screenMesh = new THREE.Mesh(dispGeo, screenMat);
    this.screenMesh.position.z = d / 2 + 0.005;
    this.phoneGroup.add(this.screenMesh);

    // 5. Glass Screen Reflection Plane (Fresnel sheen with clearcoat)
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.16,
      roughness: 0.08,
      metalness: 0.08,
      clearcoat: 1.0,
      clearcoatRoughness: 0.04
    });
    const glassMesh = new THREE.Mesh(dispGeo, glassMat);
    glassMesh.position.z = d / 2 + 0.008;
    this.phoneGroup.add(glassMesh);

    // 6. Dynamic Island Pill (With camera sensor dot and micro speaker slit)
    const islandShape = this.createRoundedRectShape(0.84, 0.22, 0.11);
    const islandGeo = new THREE.ShapeGeometry(islandShape, 16);
    const islandMat = new THREE.MeshBasicMaterial({ color: 0x020617 });
    const islandMesh = new THREE.Mesh(islandGeo, islandMat);
    islandMesh.position.set(0, h * 0.42, d / 2 + 0.012);
    this.phoneGroup.add(islandMesh);

    // Camera sensor dot inside island
    const sensorGeo = new THREE.CircleGeometry(0.035, 16);
    const sensorMat = new THREE.MeshBasicMaterial({ color: 0x0a1426 });
    const sensorMesh = new THREE.Mesh(sensorGeo, sensorMat);
    sensorMesh.position.set(-0.24, h * 0.42, d / 2 + 0.013);
    this.phoneGroup.add(sensorMesh);

    // Top bezel speaker slit
    const speakerGeo = new THREE.PlaneGeometry(0.5, 0.03);
    const speakerMat = new THREE.MeshBasicMaterial({ color: 0x030712 });
    const speakerMesh = new THREE.Mesh(speakerGeo, speakerMat);
    speakerMesh.position.set(0, h / 2 - 0.07, d / 2 + 0.009);
    this.phoneGroup.add(speakerMesh);

    // 7. Hardware Side Buttons (Action, Volume Up/Down, Power)
    const btnMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      metalness: 0.95,
      roughness: 0.18
    });

    // Left: Action Button
    const actionGeo = new THREE.BoxGeometry(0.05, 0.35, 0.12);
    const actionBtn = new THREE.Mesh(actionGeo, btnMat);
    actionBtn.position.set(-w / 2 - 0.02, 1.65, 0);
    this.phoneGroup.add(actionBtn);

    // Left: Volume Up Button
    const volUpGeo = new THREE.BoxGeometry(0.05, 0.52, 0.12);
    const volUpBtn = new THREE.Mesh(volUpGeo, btnMat);
    volUpBtn.position.set(-w / 2 - 0.02, 0.95, 0);
    this.phoneGroup.add(volUpBtn);

    // Left: Volume Down Button
    const volDownGeo = new THREE.BoxGeometry(0.05, 0.52, 0.12);
    const volDownBtn = new THREE.Mesh(volDownGeo, btnMat);
    volDownBtn.position.set(-w / 2 - 0.02, 0.25, 0);
    this.phoneGroup.add(volDownBtn);

    // Right: Power / Lock Button
    const powerGeo = new THREE.BoxGeometry(0.05, 0.75, 0.12);
    const powerBtn = new THREE.Mesh(powerGeo, btnMat);
    powerBtn.position.set(w / 2 + 0.02, 0.85, 0);
    this.phoneGroup.add(powerBtn);

    // 8. Rear Triple Camera System
    // Camera Plateau (Squircle Bump)
    const bumpShape = this.createRoundedRectShape(1.4, 1.4, 0.28);
    const bumpGeo = new THREE.ExtrudeGeometry(bumpShape, {
      depth: 0.08,
      bevelEnabled: true,
      bevelSegments: 3,
      bevelSize: 0.02,
      bevelThickness: 0.02
    });
    bumpGeo.center();
    const bumpMat = new THREE.MeshStandardMaterial({
      color: 0x081022,
      metalness: 0.88,
      roughness: 0.28
    });
    const bumpMesh = new THREE.Mesh(bumpGeo, bumpMat);
    bumpMesh.position.set(-0.72, 2.05, -d / 2 - 0.05);
    this.phoneGroup.add(bumpMesh);

    // 3 Stepped Lenses
    const lensCenters = [
      [-1.00, 2.33], // Top-Left
      [-1.00, 1.77], // Bottom-Left
      [-0.44, 2.05]  // Right
    ];

    const outerRimGeo = new THREE.CylinderGeometry(0.24, 0.24, 0.06, 24);
    const outerRimMat = new THREE.MeshStandardMaterial({
      color: 0x94a3b8, // Titanium silver chamfer ring
      metalness: 0.98,
      roughness: 0.12
    });

    const innerConeGeo = new THREE.CylinderGeometry(0.20, 0.20, 0.07, 24);
    const innerConeMat = new THREE.MeshStandardMaterial({
      color: 0x020617,
      metalness: 0.9,
      roughness: 0.2
    });

    const opticGeo = new THREE.CylinderGeometry(0.16, 0.16, 0.08, 24);
    const opticMat = new THREE.MeshPhysicalMaterial({
      color: 0x030712,
      roughness: 0.04,
      metalness: 0.4,
      clearcoat: 1.0,
      clearcoatRoughness: 0.05
    });

    lensCenters.forEach(pos => {
      // Outer titanium stepped ring
      const rim = new THREE.Mesh(outerRimGeo, outerRimMat);
      rim.rotation.x = Math.PI / 2;
      rim.position.set(pos[0], pos[1], -d / 2 - 0.11);
      this.phoneGroup.add(rim);

      // Inner barrel
      const cone = new THREE.Mesh(innerConeGeo, innerConeMat);
      cone.rotation.x = Math.PI / 2;
      cone.position.set(pos[0], pos[1], -d / 2 - 0.12);
      this.phoneGroup.add(cone);

      // Sapphire optic lens
      const optic = new THREE.Mesh(opticGeo, opticMat);
      optic.rotation.x = Math.PI / 2;
      optic.position.set(pos[0], pos[1], -d / 2 - 0.13);
      this.phoneGroup.add(optic);
    });

    // True Tone Flash
    const flashGeo = new THREE.CircleGeometry(0.08, 16);
    const flashMat = new THREE.MeshStandardMaterial({
      color: 0xfef08a,
      emissive: 0xfef08a,
      emissiveIntensity: 0.5,
      side: THREE.DoubleSide
    });
    const flashMesh = new THREE.Mesh(flashGeo, flashMat);
    flashMesh.position.set(-0.44, 2.33, -d / 2 - 0.095);
    this.phoneGroup.add(flashMesh);

    // LiDAR Scanner Sensor
    const lidarGeo = new THREE.CircleGeometry(0.08, 16);
    const lidarMat = new THREE.MeshBasicMaterial({ color: 0x020617, side: THREE.DoubleSide });
    const lidarMesh = new THREE.Mesh(lidarGeo, lidarMat);
    lidarMesh.position.set(-0.44, 1.77, -d / 2 - 0.095);
    this.phoneGroup.add(lidarMesh);

    // Rear Mic Dot
    const micGeo = new THREE.CircleGeometry(0.022, 12);
    const micMat = new THREE.MeshBasicMaterial({ color: 0x010409, side: THREE.DoubleSide });
    const micMesh = new THREE.Mesh(micGeo, micMat);
    micMesh.position.set(-0.44, 1.93, -d / 2 - 0.095);
    this.phoneGroup.add(micMesh);

    // 9. Circular Screen Portal System (Connected to phone screen)
    this.screenPortalGroup = new THREE.Group();
    this.screenPortalGroup.position.set(0, 0, d / 2 + 0.010);
    this.phoneGroup.add(this.screenPortalGroup);

    // Central Luminous Portal Core
    const portalCoreGeo = new THREE.CircleGeometry(0.9, 48);
    const portalCoreMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending
    });
    this.portalCoreMesh = new THREE.Mesh(portalCoreGeo, portalCoreMat);
    this.screenPortalGroup.add(this.portalCoreMesh);

    // Concentric Neon Plasma Ring 1 (Cyan)
    const pRing1Geo = new THREE.RingGeometry(0.9, 1.04, 48);
    const pRing1Mat = new THREE.MeshBasicMaterial({
      color: 0x22d3ee,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending
    });
    this.portalRing1 = new THREE.Mesh(pRing1Geo, pRing1Mat);
    this.screenPortalGroup.add(this.portalRing1);

    // Concentric Neon Plasma Ring 2 (Violet)
    const pRing2Geo = new THREE.RingGeometry(1.08, 1.22, 48);
    const pRing2Mat = new THREE.MeshBasicMaterial({
      color: 0xc084fc,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending
    });
    this.portalRing2 = new THREE.Mesh(pRing2Geo, pRing2Mat);
    this.screenPortalGroup.add(this.portalRing2);

    // Initial scale
    this.screenPortalGroup.scale.set(0.001, 0.001, 0.001);

    // Initial orientation
    this.phoneGroup.position.set(0, 0, 0);
  }

  // ========================================================================
  // PROCEDURAL LIVE 3D PHONE SCREEN TEXTURE RENDERER
  // ========================================================================
  drawScreenContent(chapterIndex) {
    const ctx = this.screenCtx;
    if (!ctx) return;
    const w = 512;
    const h = 1024;

    ctx.clearRect(0, 0, w, h);
    ctx.save();
    // Strictly clip screen drawings to iPhone rounded display boundary
    ctx.beginPath();
    ctx.roundRect(0, 0, w, h, 64);
    ctx.clip();

    // Background gradient
    const bgGrad = ctx.createLinearGradient(0, 0, 0, h);
    bgGrad.addColorStop(0, '#0a1128');
    bgGrad.addColorStop(1, '#060b19');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, w, h);

    // Header Status Bar
    ctx.fillStyle = '#CBD5E1';
    ctx.font = 'bold 22px sans-serif';
    ctx.fillText('9:41', 36, 54);
    ctx.fillText('5G ●●●', w - 120, 54);

    // Top BrandX Pill
    ctx.fillStyle = 'rgba(37, 99, 235, 0.25)';
    ctx.beginPath();
    ctx.roundRect(36, 80, w - 72, 60, 16);
    ctx.fill();
    ctx.fillStyle = '#60A5FA';
    ctx.font = 'bold 24px sans-serif';
    ctx.fillText('BRANDX BUSINESS SUPER APP', 54, 118);

    // Chapter Specific Live UI Card
    if (chapterIndex === 0) {
      // Scene 0: Welcome Dashboard
      ctx.fillStyle = 'rgba(59, 130, 246, 0.2)';
      ctx.beginPath();
      ctx.roundRect(36, 170, w - 72, 220, 24);
      ctx.fill();
      ctx.strokeStyle = 'rgba(59, 130, 246, 0.4)';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.fillStyle = '#93C5FD';
      ctx.font = 'bold 20px sans-serif';
      ctx.fillText("TODAY'S BUSINESS RECOVERY", 64, 215);

      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 54px sans-serif';
      ctx.fillText('₹24,850.00', 64, 285);

      ctx.fillStyle = '#34D399';
      ctx.font = 'bold 22px sans-serif';
      ctx.fillText('↑ 18% Active Invoices • GST Ready', 64, 340);

      // 4 Quick Apps Grid
      const apps = [
        { name: 'GST Billing', icon: '🧾', col: '#60A5FA' },
        { name: 'Khata Diary', icon: '📒', col: '#22D3EE' },
        { name: 'Digital Store', icon: '🏪', col: '#C084FC' },
        { name: 'AI Copilot', icon: '🤖', col: '#F472B6' }
      ];
      apps.forEach((app, idx) => {
        const x = 36 + (idx % 2) * 228;
        const y = 420 + Math.floor(idx / 2) * 150;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
        ctx.beginPath();
        ctx.roundRect(x, y, 212, 130, 18);
        ctx.fill();

        ctx.font = '36px sans-serif';
        ctx.fillText(app.icon, x + 24, y + 54);
        ctx.fillStyle = app.col;
        ctx.font = 'bold 22px sans-serif';
        ctx.fillText(app.name, x + 24, y + 100);
      });
    } else if (chapterIndex === 1) {
      // Scene 1: GST Billing & POS
      ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
      ctx.beginPath();
      ctx.roundRect(36, 170, w - 72, 540, 24);
      ctx.fill();
      ctx.strokeStyle = 'rgba(34, 211, 238, 0.4)';
      ctx.stroke();

      // Scanning Laser Beam Animation on screen
      const laserY = 220 + ((Date.now() / 8) % 400);
      const lGrad = ctx.createLinearGradient(36, laserY, w - 36, laserY);
      lGrad.addColorStop(0, 'transparent');
      lGrad.addColorStop(0.5, '#22D3EE');
      lGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = lGrad;
      ctx.fillRect(36, laserY - 2, w - 72, 4);

      ctx.fillStyle = '#38BDF8';
      ctx.font = 'bold 26px sans-serif';
      ctx.fillText('TAX INVOICE #BX-1049', 64, 230);

      ctx.fillStyle = '#E2E8F0';
      ctx.font = '22px sans-serif';
      ctx.fillText('Essential Retail Goods x2', 64, 290);
      ctx.fillText('₹900.00', w - 160, 290);
      ctx.fillText('Commercial Stock Pack x1', 64, 340);
      ctx.fillText('₹1,200.00', w - 160, 340);

      ctx.fillStyle = '#94A3B8';
      ctx.fillText('CGST (9%) + SGST (9%)', 64, 410);
      ctx.fillText('₹189.00', w - 160, 410);

      ctx.fillStyle = '#34D399';
      ctx.font = 'bold 36px sans-serif';
      ctx.fillText('NET: ₹2,289.00', 64, 490);

      ctx.fillStyle = '#2563EB';
      ctx.beginPath();
      ctx.roundRect(64, 560, w - 128, 64, 16);
      ctx.fill();
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 22px sans-serif';
      ctx.fillText('⚡ 1-Tap WhatsApp Share & Print', 84, 602);
    } else if (chapterIndex === 2) {
      // Scene 2: Customer Khata
      ctx.fillStyle = 'rgba(239, 68, 68, 0.15)';
      ctx.beginPath();
      ctx.roundRect(36, 170, 212, 140, 20);
      ctx.fill();
      ctx.fillStyle = '#FCA5A5';
      ctx.font = 'bold 20px sans-serif';
      ctx.fillText('TOTAL UDHAAR', 56, 210);
      ctx.fillStyle = '#EF4444';
      ctx.font = 'bold 36px sans-serif';
      ctx.fillText('₹4,820', 56, 265);

      ctx.fillStyle = 'rgba(16, 185, 129, 0.15)';
      ctx.beginPath();
      ctx.roundRect(264, 170, 212, 140, 20);
      ctx.fill();
      ctx.fillStyle = '#86EFAC';
      ctx.font = 'bold 20px sans-serif';
      ctx.fillText('TOTAL JAMA', 284, 210);
      ctx.fillStyle = '#10B981';
      ctx.font = 'bold 36px sans-serif';
      ctx.fillText('₹12,400', 284, 265);

      ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.beginPath();
      ctx.roundRect(36, 340, w - 72, 380, 20);
      ctx.fill();

      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 24px sans-serif';
      ctx.fillText('Recent Customer Ledgers', 60, 390);

      ctx.font = '22px sans-serif';
      ctx.fillStyle = '#E2E8F0';
      ctx.fillText('Ramesh Sharma (Due Today)', 60, 460);
      ctx.fillStyle = '#EF4444';
      ctx.fillText('₹1,250', w - 150, 460);

      ctx.fillStyle = '#E2E8F0';
      ctx.fillText('Vijay Kumar (Paid)', 60, 540);
      ctx.fillStyle = '#10B981';
      ctx.fillText('+ ₹3,500', w - 170, 540);
    } else if (chapterIndex === 4) {
      // Scene 4: Digital Dukaan
      ctx.fillStyle = 'rgba(16, 185, 129, 0.15)';
      ctx.beginPath();
      ctx.roundRect(36, 170, w - 72, 70, 16);
      ctx.fill();
      ctx.fillStyle = '#6EE7B7';
      ctx.font = 'bold 22px sans-serif';
      ctx.fillText('🔒 brandx.in/store/vyapari-hub', 54, 214);

      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 30px sans-serif';
      ctx.fillText('Your Online Catalogue', 54, 300);

      const items = ['Product Catalog #1', 'Product Catalog #2', 'Product Catalog #3'];
      items.forEach((it, i) => {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.06)';
        ctx.beginPath();
        ctx.roundRect(36, 340 + i * 110, w - 72, 90, 16);
        ctx.fill();
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 22px sans-serif';
        ctx.fillText(it, 60, 395 + i * 110);
        ctx.fillStyle = '#34D399';
        ctx.fillText('0% Commission', w - 210, 395 + i * 110);
      });
    } else if (chapterIndex === 8) {
      // Scene 8: AI Copilot
      ctx.fillStyle = 'rgba(139, 92, 246, 0.18)';
      ctx.beginPath();
      ctx.roundRect(36, 170, w - 72, 540, 24);
      ctx.fill();
      ctx.strokeStyle = 'rgba(192, 132, 252, 0.4)';
      ctx.stroke();

      ctx.fillStyle = '#C084FC';
      ctx.font = 'bold 26px sans-serif';
      ctx.fillText('✨ BRANDX AI BUSINESS COPILOT', 64, 230);

      // Prompt bubble
      ctx.fillStyle = 'rgba(37, 99, 235, 0.35)';
      ctx.beginPath();
      ctx.roundRect(64, 270, w - 128, 90, 16);
      ctx.fill();
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '22px sans-serif';
      ctx.fillText('"Payment reminder message banao."', 84, 324);

      // AI response bubble
      ctx.fillStyle = 'rgba(139, 92, 246, 0.25)';
      ctx.beginPath();
      ctx.roundRect(64, 390, w - 128, 260, 16);
      ctx.fill();
      ctx.fillStyle = '#E2E8F0';
      ctx.font = '22px sans-serif';
      ctx.fillText('Namaste Sharma ji, BrandX se reminder:', 84, 440);
      ctx.fillText('Aapka ₹2,450 ka balance pending hai.', 84, 480);
      ctx.fillText('Kripya UPI link se payment karein.', 84, 520);
      ctx.fillStyle = '#38BDF8';
      ctx.fillText('Dhanyawad! (1-Tap Share to WhatsApp)', 84, 580);
    } else {
      // Generic BrandX feature view for other chapters
      ctx.fillStyle = 'rgba(37, 99, 235, 0.15)';
      ctx.beginPath();
      ctx.roundRect(36, 170, w - 72, 480, 24);
      ctx.fill();
      ctx.fillStyle = '#60A5FA';
      ctx.font = 'bold 28px sans-serif';
      ctx.fillText('BrandX Business Solution', 64, 240);
      ctx.fillStyle = '#E2E8F0';
      ctx.font = '22px sans-serif';
      ctx.fillText('Designed for Indian Vyaparis & MSMEs', 64, 300);
      ctx.fillText('All operations synchronized in real-time.', 64, 350);
    }

    ctx.restore();

    if (this.screenTexture) {
      this.screenTexture.needsUpdate = true;
    }
  }

  // ========================================================================
  // FLOATING 3D UNIVERSE ARCHITECTURAL OBJECTS (Scenes A to H)
  // ========================================================================
  setupSceneObjects() {
    this.sceneObjects = new THREE.Group();
    this.scene.add(this.sceneObjects);

    // 1. Chapter 1: 3D Holographic Thermal Receipt Slab
    const rcptGeo = new THREE.PlaneGeometry(2.4, 3.8);
    const rcptMat = new THREE.MeshBasicMaterial({
      color: 0x0f172a,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0
    });
    this.holoReceipt = new THREE.Mesh(rcptGeo, rcptMat);
    this.holoReceipt.position.set(3.4, 0.5, 1.2);
    this.holoReceipt.rotation.y = -0.3;
    const rcptWire = new THREE.LineSegments(new THREE.EdgesGeometry(rcptGeo), new THREE.LineBasicMaterial({ color: 0x22d3ee, transparent: true, opacity: 0 }));
    this.holoReceipt.add(rcptWire);
    this.holoReceiptWire = rcptWire;
    this.sceneObjects.add(this.holoReceipt);

    // 2. Chapter 2: Floating 3D Ledger Tablets
    const tabGeo = new THREE.BoxGeometry(1.6, 2.2, 0.15);
    const tabGreenMat = new THREE.MeshStandardMaterial({ color: 0x064e3b, metalness: 0.8, roughness: 0.2, transparent: true, opacity: 0 });
    const tabRedMat = new THREE.MeshStandardMaterial({ color: 0x7f1d1d, metalness: 0.8, roughness: 0.2, transparent: true, opacity: 0 });
    this.ledgerGreen = new THREE.Mesh(tabGeo, tabGreenMat);
    this.ledgerRed = new THREE.Mesh(tabGeo, tabRedMat);
    this.ledgerGreen.position.set(3.2, -0.6, 1.4);
    this.ledgerRed.position.set(-3.2, 0.8, 1.2);
    this.sceneObjects.add(this.ledgerGreen);
    this.sceneObjects.add(this.ledgerRed);

    // 3. Chapter 3: Floating 3D Inventory Cubes
    this.invCubes = [];
    const cubeMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.9, roughness: 0.2, transparent: true, opacity: 0 });
    for (let i = 0; i < 3; i++) {
      const cubeGeo = new THREE.BoxGeometry(0.8, 0.8, 0.8);
      const cube = new THREE.Mesh(cubeGeo, cubeMat.clone());
      const cWire = new THREE.LineSegments(new THREE.EdgesGeometry(cubeGeo), new THREE.LineBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0 }));
      cube.add(cWire);
      cube.wire = cWire;
      cube.position.set(2.8 + i * 0.8, (i - 1) * 1.1, 1.0);
      this.sceneObjects.add(cube);
      this.invCubes.push(cube);
    }

    // 4. Chapter 4: Luminous 3D Digital Dukaan Portal Doorway
    const portalGeo = new THREE.BoxGeometry(3.6, 6.2, 0.2);
    const portalMat = new THREE.MeshPhysicalMaterial({ color: 0x06b6d4, transparent: true, opacity: 0, roughness: 0.1, transmission: 0.7 });
    this.portalFrame = new THREE.Mesh(portalGeo, portalMat);
    this.portalFrame.position.set(-3.4, 0, 0.8);
    const pEdges = new THREE.LineSegments(new THREE.EdgesGeometry(portalGeo), new THREE.LineBasicMaterial({ color: 0x34d399, transparent: true, opacity: 0 }));
    this.portalFrame.add(pEdges);
    this.portalFrameWire = pEdges;
    this.sceneObjects.add(this.portalFrame);

    // 5. Chapter 5: 3D NFC Smart Card with Expanding Signal Rings
    const nfcGeo = new THREE.BoxGeometry(2.4, 1.5, 0.08);
    const nfcMat = new THREE.MeshStandardMaterial({ color: 0x3b0764, metalness: 0.9, roughness: 0.25, transparent: true, opacity: 0 });
    this.nfcCard = new THREE.Mesh(nfcGeo, nfcMat);
    this.nfcCard.position.set(3.2, -0.4, 1.6);
    this.sceneObjects.add(this.nfcCard);

    // Signal Ring
    const ringGeo = new THREE.RingGeometry(1.2, 1.35, 32);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0xc084fc, side: THREE.DoubleSide, transparent: true, opacity: 0 });
    this.nfcRing = new THREE.Mesh(ringGeo, ringMat);
    this.nfcRing.position.set(3.2, -0.4, 1.4);
    this.sceneObjects.add(this.nfcRing);

    // 6. Chapter 7: 3D Acrylic UPI Standee
    const standeeBaseGeo = new THREE.BoxGeometry(2.0, 0.25, 1.2);
    const standeeBackGeo = new THREE.BoxGeometry(1.8, 2.6, 0.1);
    const standeeMat = new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 0.1, roughness: 0.1, transparent: true, opacity: 0 });
    this.standeeGroup = new THREE.Group();
    const base = new THREE.Mesh(standeeBaseGeo, standeeMat);
    const back = new THREE.Mesh(standeeBackGeo, standeeMat);
    back.position.set(0, 1.3, -0.2);
    back.rotation.x = -0.15;
    this.standeeGroup.add(base);
    this.standeeGroup.add(back);
    this.standeeGroup.position.set(3.2, -0.8, 1.4);
    this.standeeMat = standeeMat;
    this.sceneObjects.add(this.standeeGroup);

    // 7. Chapter 8: Luminous 3D AI Orb Cluster
    this.aiOrbGroup = new THREE.Group();
    const sphereGeo = new THREE.SphereGeometry(1.3, 32, 32);
    const sphereMat = new THREE.MeshPhysicalMaterial({
      color: 0x7c3aed,
      emissive: 0x06b6d4,
      emissiveIntensity: 0.7,
      roughness: 0.1,
      metalness: 0.3,
      transparent: true,
      opacity: 0
    });
    this.aiSphere = new THREE.Mesh(sphereGeo, sphereMat);
    this.aiSphereMat = sphereMat;
    this.aiOrbGroup.add(this.aiSphere);

    // Concentric Torus Rings
    const ring1Geo = new THREE.TorusGeometry(2.1, 0.04, 16, 64);
    const ring1Mat = new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0 });
    this.aiRing1 = new THREE.Mesh(ring1Geo, ring1Mat);
    this.aiRing1Mat = ring1Mat;
    this.aiOrbGroup.add(this.aiRing1);

    const ring2Geo = new THREE.TorusGeometry(1.7, 0.03, 16, 64);
    const ring2Mat = new THREE.MeshBasicMaterial({ color: 0xc084fc, transparent: true, opacity: 0 });
    this.aiRing2 = new THREE.Mesh(ring2Geo, ring2Mat);
    this.aiRing2Mat = ring2Mat;
    this.aiOrbGroup.add(this.aiRing2);

    this.aiOrbGroup.position.set(0, 0, -2);
    this.sceneObjects.add(this.aiOrbGroup);
  }

  // ========================================================================
  // EVENT LISTENERS & AUDIO SYNTHESIS
  // ========================================================================
  bindEvents() {
    window.addEventListener('resize', () => this.onResize());

    // Mouse Movement
    if (!this.isReducedMotion) {
      window.addEventListener('mousemove', (e) => {
        this.mouse.targetX = (e.clientX / window.innerWidth - 0.5) * 2;
        this.mouse.targetY = -(e.clientY / window.innerHeight - 0.5) * 2;
      });
    }

    // Audio Toggle Controls
    const soundBtn = document.getElementById('soundToggleBtn');
    const soundBtnMobile = document.getElementById('soundToggleBtnMobile');

    if (soundBtn) soundBtn.addEventListener('click', () => this.toggleSound());
    if (soundBtnMobile) soundBtnMobile.addEventListener('click', () => this.toggleSound());
  }

  setupVisibilityObserver() {
    if (!('IntersectionObserver' in window)) return;
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        this.isVisible = entry.isIntersecting;
      });
    }, { threshold: 0.01 });

    const track = document.getElementById('filmTrack');
    if (track) observer.observe(track);
  }

  onResize() {
    this.isMobile = window.innerWidth <= 768;
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  // ========================================================================
  // PROCEDURAL WEB AUDIO API (Subtle Ambient Sound, Muted by Default)
  // ========================================================================
  initAudio() {
    if (this.audioCtx) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.audioCtx = new AudioCtx();

      // Master Gain
      this.masterGain = this.audioCtx.createGain();
      this.masterGain.gain.setValueAtTime(0.001, this.audioCtx.currentTime);
      this.masterGain.connect(this.audioCtx.destination);

      // Ambient Drone Oscillator (Soft atmospheric chord: 110Hz A2)
      this.osc1 = this.audioCtx.createOscillator();
      this.osc1.type = 'sine';
      this.osc1.frequency.setValueAtTime(110, this.audioCtx.currentTime);

      this.osc2 = this.audioCtx.createOscillator();
      this.osc2.type = 'triangle';
      this.osc2.frequency.setValueAtTime(164.81, this.audioCtx.currentTime); // E3 fifth

      // Lowpass Filter for warmth
      this.filter = this.audioCtx.createBiquadFilter();
      this.filter.type = 'lowpass';
      this.filter.frequency.setValueAtTime(280, this.audioCtx.currentTime);

      this.ambientGain = this.audioCtx.createGain();
      this.ambientGain.gain.setValueAtTime(0.12, this.audioCtx.currentTime);

      this.osc1.connect(this.filter);
      this.osc2.connect(this.filter);
      this.filter.connect(this.ambientGain);
      this.ambientGain.connect(this.masterGain);

      this.osc1.start();
      this.osc2.start();
    } catch (e) {
      console.warn('AudioContext initialization prevented:', e);
    }
  }

  toggleSound() {
    this.isSoundEnabled = !this.isSoundEnabled;
    const soundBtns = [document.getElementById('soundToggleBtn'), document.getElementById('soundToggleBtnMobile')];

    soundBtns.forEach(btn => {
      if (!btn) return;
      const mutedIcon = btn.querySelector('.sound-icon-muted');
      const activeIcon = btn.querySelector('.sound-icon-active');
      const label = btn.querySelector('.sound-label');

      if (this.isSoundEnabled) {
        if (mutedIcon) mutedIcon.style.display = 'none';
        if (activeIcon) activeIcon.style.display = 'inline-block';
        if (label) label.textContent = 'Audio: On';
        btn.classList.add('sound-active');
      } else {
        if (mutedIcon) mutedIcon.style.display = 'inline-block';
        if (activeIcon) activeIcon.style.display = 'none';
        if (label) label.textContent = 'Audio: Off';
        btn.classList.remove('sound-active');
      }
    });

    if (this.isSoundEnabled) {
      this.initAudio();
      if (this.audioCtx && this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }
      if (this.masterGain) {
        this.masterGain.gain.linearRampToValueAtTime(0.35, this.audioCtx.currentTime + 1.2);
      }
      this.playTransitionChime(440);
    } else {
      if (this.masterGain && this.audioCtx) {
        this.masterGain.gain.linearRampToValueAtTime(0.0001, this.audioCtx.currentTime + 0.6);
      }
    }
  }

  playTransitionChime(freq = 523.25) {
    if (!this.isSoundEnabled || !this.audioCtx) return;
    try {
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);
      gain.gain.setValueAtTime(0.15, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 1.0);
      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start();
      osc.stop(this.audioCtx.currentTime + 1.1);
    } catch (e) {}
  }

  // ========================================================================
  // SCROLL-DRIVEN 3D CAMERA & ENVIRONMENT COORDINATION
  // ========================================================================
  setScrollProgress(p) {
    this.targetProgress = Math.max(0, Math.min(1, p));
  }

  updateScrollTransitions(delta) {
    // Smooth lerp on scroll progress
    this.scrollProgress += (this.targetProgress - this.scrollProgress) * 0.085;
    const p = this.scrollProgress;

    // Mouse parallax lerp
    this.mouse.x += (this.mouse.targetX - this.mouse.x) * 0.05;
    this.mouse.y += (this.mouse.targetY - this.mouse.y) * 0.05;

    // Determine current chapter
    let ch = 0;
    if (p < 0.10) ch = 0;
    else if (p < 0.22) ch = 1;
    else if (p < 0.34) ch = 2;
    else if (p < 0.46) ch = 3;
    else if (p < 0.58) ch = 4;
    else if (p < 0.70) ch = 5;
    else if (p < 0.82) ch = 6;
    else if (p < 0.92) ch = 7;
    else ch = 8;

    if (ch !== this.activeChapter) {
      this.activeChapter = ch;
      this.drawScreenContent(ch);
      if (this.lastChimedChapter !== ch && this.isSoundEnabled) {
        this.lastChimedChapter = ch;
        const freqs = [440, 523.25, 587.33, 659.25, 783.99, 880, 987.77, 1046.5, 1174.66];
        this.playTransitionChime(freqs[ch] || 659.25);
      }
    }

    // 1. Emotional Sunrise Lighting Transition in Scene 0
    // Warm dawn sunrise light is visible in opening (p < 0.12), then transitions to cyan/blue
    if (p < 0.12) {
      const dawnIntensity = (1 - p / 0.12) * 2.2;
      this.dawnLight.intensity = dawnIntensity;
    } else {
      this.dawnLight.intensity = 0;
    }

    // 2. 3D Camera & Phone Waypoints
    const isMobile = this.isMobile;
    let targetPx = 0, targetPy = 0, targetPz = 0;
    let targetRx = 0, targetRy = 0, targetRz = 0;
    let targetScale = 1.0;

    if (p < 0.10) {
      // Scene 0: Intro (floating in center)
      targetPx = 0; targetPy = -0.2; targetPz = 0;
      targetRx = 0.18; targetRy = -0.08; targetRz = 0;
      targetScale = isMobile ? 0.85 : 0.96;
    } else if (p < 0.22) {
      // Chapter 1: GST Billing (shifts right)
      targetPx = isMobile ? 0 : 2.4; targetPy = isMobile ? -0.8 : 0; targetPz = 0.5;
      targetRx = 0.08; targetRy = -0.28; targetRz = -0.04;
      targetScale = isMobile ? 0.82 : 1.02;
    } else if (p < 0.34) {
      // Chapter 2: Khata (shifts left)
      targetPx = isMobile ? 0 : -2.4; targetPy = isMobile ? -0.8 : -0.1; targetPz = 0.5;
      targetRx = -0.06; targetRy = 0.28; targetRz = 0.04;
      targetScale = isMobile ? 0.82 : 1.02;
    } else if (p < 0.46) {
      // Chapter 3: Items (shifts right)
      targetPx = isMobile ? 0 : 2.3; targetPy = isMobile ? -0.8 : 0.2; targetPz = 0.4;
      targetRx = 0.12; targetRy = -0.24; targetRz = -0.02;
      targetScale = isMobile ? 0.82 : 1.0;
    } else if (p < 0.58) {
      // Chapter 4: Dukaan (shifts left)
      targetPx = isMobile ? 0 : -2.3; targetPy = isMobile ? -0.8 : 0; targetPz = 0.5;
      targetRx = 0.0; targetRy = 0.30; targetRz = 0.02;
      targetScale = isMobile ? 0.82 : 1.04;
    } else if (p < 0.70) {
      // Chapter 5: NFC (shifts right)
      targetPx = isMobile ? 0 : 2.3; targetPy = isMobile ? -0.8 : -0.2; targetPz = 0.6;
      targetRx = -0.12; targetRy = -0.28; targetRz = -0.04;
      targetScale = isMobile ? 0.82 : 1.02;
    } else if (p < 0.82) {
      // Chapter 6: Posters (shifts left)
      targetPx = isMobile ? 0 : -2.2; targetPy = isMobile ? -0.8 : 0.1; targetPz = 0.4;
      targetRx = 0.08; targetRy = 0.26; targetRz = 0.03;
      targetScale = isMobile ? 0.82 : 1.0;
    } else if (p < 0.92) {
      // Chapter 7: Standee (shifts right)
      targetPx = isMobile ? 0 : 2.2; targetPy = isMobile ? -0.8 : 0; targetPz = 0.5;
      targetRx = 0.05; targetRy = -0.20; targetRz = 0;
      targetScale = isMobile ? 0.82 : 1.02;
    } else {
      // Chapter 8: AI Copilot (centered hero position)
      targetPx = 0; targetPy = isMobile ? -0.5 : 0.2; targetPz = 0.8;
      targetRx = 0.12; targetRy = 0; targetRz = 0;
      targetScale = isMobile ? 0.88 : 1.08;
    }

    // Apply mouse parallax to rotations
    const mouseRx = this.mouse.y * 0.06;
    const mouseRy = this.mouse.x * 0.08;

    // 2b. Circular Screen Portal Expansion & Camera Travel Dynamics
    const boundaries = [0.10, 0.22, 0.34, 0.46, 0.58, 0.70, 0.82, 0.92];
    const halfZone = 0.038;
    let maxPortalFactor = 0;

    for (let i = 0; i < boundaries.length; i++) {
      const b = boundaries[i];
      const dist = Math.abs(p - b);
      if (dist < halfZone) {
        const factor = Math.cos((dist / halfZone) * (Math.PI * 0.5));
        if (factor > maxPortalFactor) {
          maxPortalFactor = factor;
        }
      }
    }

    if (maxPortalFactor > 0) {
      // Zoom camera / phone forward so screen fills more of the viewport
      targetPz += maxPortalFactor * 1.5;
      targetScale += maxPortalFactor * 0.35;

      // Expand 3D Portal on phone display smoothly beyond device boundaries
      const pScale = maxPortalFactor * 5.2;
      if (this.screenPortalGroup) {
        this.screenPortalGroup.scale.set(pScale, pScale, 1);
        if (this.portalCoreMesh) {
          this.portalCoreMesh.material.opacity = maxPortalFactor * 0.88;
        }
        if (this.portalRing1) {
          this.portalRing1.material.opacity = maxPortalFactor * 0.95;
          this.portalRing1.rotation.z += delta * 3.4;
        }
        if (this.portalRing2) {
          this.portalRing2.material.opacity = maxPortalFactor * 0.88;
          this.portalRing2.rotation.z -= delta * 2.6;
        }
      }

      // Synchronize with DOM Circular Portal Overlay
      const portalOverlay = document.getElementById('circularPortalOverlay');
      if (portalOverlay) {
        portalOverlay.style.setProperty('--portal-opacity', (maxPortalFactor * 0.95).toFixed(3));
        portalOverlay.style.setProperty('--portal-scale', (maxPortalFactor * 1.85).toFixed(3));
      }
    } else {
      if (this.screenPortalGroup) {
        this.screenPortalGroup.scale.set(0.001, 0.001, 0.001);
        if (this.portalCoreMesh) this.portalCoreMesh.material.opacity = 0;
        if (this.portalRing1) this.portalRing1.material.opacity = 0;
        if (this.portalRing2) this.portalRing2.material.opacity = 0;
      }
      const portalOverlay = document.getElementById('circularPortalOverlay');
      if (portalOverlay) {
        portalOverlay.style.setProperty('--portal-opacity', '0');
        portalOverlay.style.setProperty('--portal-scale', '0');
      }
    }

    this.phoneGroup.position.x += (targetPx - this.phoneGroup.position.x) * 0.08;
    this.phoneGroup.position.y += (targetPy - this.phoneGroup.position.y) * 0.08;
    this.phoneGroup.position.z += (targetPz - this.phoneGroup.position.z) * 0.08;

    this.phoneGroup.rotation.x += (targetRx + mouseRx - this.phoneGroup.rotation.x) * 0.08;
    this.phoneGroup.rotation.y += (targetRy + mouseRy - this.phoneGroup.rotation.y) * 0.08;
    this.phoneGroup.rotation.z += (targetRz - this.phoneGroup.rotation.z) * 0.08;

    const curScale = this.phoneGroup.scale.x;
    const newScale = curScale + (targetScale - curScale) * 0.08;
    this.phoneGroup.scale.set(newScale, newScale, newScale);

    // 3. Fade & Animate Scene-Specific 3D Objects
    this.update3DObjects(ch, delta);

    // 4. Subtle Particle Motion
    if (this.particleSystem) {
      this.particleSystem.rotation.y = p * 1.5 + this.clock.getElapsedTime() * 0.02;
      this.particleSystem.rotation.x = Math.sin(p * Math.PI) * 0.15;
    }
  }

  update3DObjects(activeCh, delta) {
    const elapsed = this.clock.getElapsedTime();

    // Helper to fade opacity
    const fade = (obj, targetOp) => {
      if (!obj) return;
      if (obj.material) {
        obj.material.opacity += (targetOp - obj.material.opacity) * 0.1;
      }
      if (obj.wire && obj.wire.material) {
        obj.wire.material.opacity += (targetOp - obj.wire.material.opacity) * 0.1;
      }
    };

    // Chapter 1: Receipt
    const rcptOp = activeCh === 1 ? 0.9 : 0;
    fade(this.holoReceipt, rcptOp);
    if (this.holoReceiptWire) this.holoReceiptWire.material.opacity = rcptOp;
    if (this.holoReceipt && activeCh === 1) {
      this.holoReceipt.position.y = 0.5 + Math.sin(elapsed * 2) * 0.06;
    }

    // Chapter 2: Ledger
    const ledgOp = activeCh === 2 ? 0.9 : 0;
    fade(this.ledgerGreen, ledgOp);
    fade(this.ledgerRed, ledgOp);
    if (activeCh === 2) {
      this.ledgerGreen.position.y = -0.6 + Math.sin(elapsed * 1.8) * 0.06;
      this.ledgerRed.position.y = 0.8 + Math.cos(elapsed * 1.8) * 0.06;
    }

    // Chapter 3: Inventory Cubes
    this.invCubes.forEach((cube, i) => {
      const cOp = activeCh === 3 ? 0.85 : 0;
      fade(cube, cOp);
      if (activeCh === 3) {
        cube.rotation.x += 0.01;
        cube.rotation.y += 0.015;
        cube.position.y = (i - 1) * 1.1 + Math.sin(elapsed * 2 + i) * 0.08;
      }
    });

    // Chapter 4: Portal
    const portalOp = activeCh === 4 ? 0.8 : 0;
    fade(this.portalFrame, portalOp);
    if (this.portalFrameWire) this.portalFrameWire.material.opacity = portalOp;

    // Chapter 5: NFC Card & Ring
    const nfcOp = activeCh === 5 ? 0.9 : 0;
    fade(this.nfcCard, nfcOp);
    if (this.nfcRing) {
      this.nfcRing.material.opacity = nfcOp;
      if (activeCh === 5) {
        const ringScale = 1.0 + ((elapsed * 1.5) % 1.2);
        this.nfcRing.scale.set(ringScale, ringScale, ringScale);
      }
    }

    // Chapter 7: Standee
    const standOp = activeCh === 7 ? 0.9 : 0;
    if (this.standeeMat) this.standeeMat.opacity += (standOp - this.standeeMat.opacity) * 0.1;
    if (this.standeeGroup && activeCh === 7) {
      this.standeeGroup.rotation.y = Math.sin(elapsed * 1.5) * 0.15;
    }

    // Chapter 8: AI Orb Cluster
    const aiOp = activeCh === 8 ? 0.95 : 0;
    if (this.aiSphereMat) this.aiSphereMat.opacity += (aiOp - this.aiSphereMat.opacity) * 0.1;
    if (this.aiRing1Mat) this.aiRing1Mat.opacity += (aiOp - this.aiRing1Mat.opacity) * 0.1;
    if (this.aiRing2Mat) this.aiRing2Mat.opacity += (aiOp - this.aiRing2Mat.opacity) * 0.1;

    if (activeCh === 8) {
      this.aiRing1.rotation.x = elapsed * 0.6;
      this.aiRing1.rotation.y = elapsed * 0.8;
      this.aiRing2.rotation.y = -elapsed * 0.7;
      this.aiRing2.rotation.z = elapsed * 0.5;
      const sphereScale = 1.0 + Math.sin(elapsed * 3) * 0.04;
      this.aiSphere.scale.set(sphereScale, sphereScale, sphereScale);
    }
  }

  // ========================================================================
  // MAIN RENDER LOOP (Paused when offscreen)
  // ========================================================================
  animate() {
    requestAnimationFrame(() => this.animate());

    if (!this.isVisible || this.isReducedMotion) return;

    const delta = this.clock.getDelta();
    this.updateScrollTransitions(delta);
    this.renderer.render(this.scene, this.camera);
  }
}

// Global initialization on DOM load
window.addEventListener('DOMContentLoaded', () => {
  window.brandx3DUniverse = new BrandXUniverse3D();
});
