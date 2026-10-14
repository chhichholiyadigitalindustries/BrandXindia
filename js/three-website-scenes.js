/**
 * BRANDX — NEXT-LEVEL FULL-WEBSITE 3D ANIMATION SCENES
 * Three.js WebGL Engine powering:
 * 1. 3D Product Universe Constellation (Capabilities Section)
 * 2. 3D Refractive Glass Stage (Pricing Section)
 * 3. 3D Smartphone Product Journey (Download Section)
 * Unified performance management with IntersectionObserver visibility pausing.
 */

class BrandXWebsiteScenes {
  constructor() {
    if (!window.THREE) {
      console.warn('BrandX Scenes: THREE.js not available, keeping CSS fallbacks.');
      return;
    }

    this.isWebGLSupported = this.checkWebGL();
    if (!this.isWebGLSupported) {
      console.warn('BrandX Scenes: WebGL not supported, CSS fallbacks active.');
      return;
    }

    this.isMobile = window.innerWidth <= 768;
    this.isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.clock = new THREE.Clock();

    // Scene Visibility State (0% GPU overhead when scrolled out)
    this.visibility = {
      constellation: false,
      pricing: false,
      download: false
    };

    // Node data for 3D constellation
    this.constellationData = [
      { id: 1, title: "GST Billing & POS", tag: "POS ENGINE", desc: "Instant GST invoices, thermal printouts & automated WhatsApp delivery.", color: 0x38bdf8 },
      { id: 2, title: "Customer Khata", tag: "DIGITAL LEDGER", desc: "Digital Udhaar-Jama ledger with automated WhatsApp payment links.", color: 0x34d399 },
      { id: 3, title: "Product Management", tag: "INVENTORY", desc: "Smart SKU catalog with real-time low stock alerts and margin tracking.", color: 0x60a5fa },
      { id: 4, title: "Digital Dukaan", tag: "STOREFRONT", desc: "24/7 online shop link with 0% commission direct WhatsApp orders.", color: 0x2dd4bf },
      { id: 5, title: "NFC Visiting Card", tag: "SMART IDENTITY", desc: "Contactless tap-to-share business identity and instant contact save.", color: 0xc084fc },
      { id: 6, title: "Festival Posters", tag: "BRANDING", desc: "Daily Indian festival and business marketing status creatives with auto-branding.", color: 0xfbbf24 },
      { id: 7, title: "UPI QR Standee", tag: "PAYMENTS", desc: "Professional counter UPI standee with instant audio settlement confirmation.", color: 0x22d3ee },
      { id: 8, title: "AI Business Copilot", tag: "INTELLIGENCE", desc: "Everyday retail business copilot fluent in Hindi, Hinglish and English.", color: 0xe879f9 }
    ];

    this.activeConstellationNode = 0;
    this.constellationNodes = [];

    // Initialize all 3 scenes
    this.initConstellationScene();
    this.initPricingScene();
    this.initDownloadScene();

    // Setup global observers and interactions
    this.setupIntersectionObservers();
    this.bindInteractions();

    // Start unified render loop
    this.animate();
  }

  checkWebGL() {
    try {
      const canvas = document.createElement('canvas');
      return !!(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
    } catch (e) {
      return false;
    }
  }

  // ==========================================================================
  // SCENE 1: 3D FEATURE CONSTELLATION (Capabilities Section)
  // ==========================================================================
  initConstellationScene() {
    this.constCanvas = document.getElementById('constellationCanvas');
    if (!this.constCanvas) return;

    this.constStage = document.getElementById('constellation3dStage');
    const width = this.constStage ? this.constStage.clientWidth : window.innerWidth;
    const height = this.constStage ? this.constStage.clientHeight : 340;

    this.constScene = new THREE.Scene();
    this.constCamera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    this.constCamera.position.set(0, 0, 9);

    this.constRenderer = new THREE.WebGLRenderer({
      canvas: this.constCanvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    this.constRenderer.setSize(width, height);
    this.constRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Lighting
    const ambLight = new THREE.AmbientLight(0x0c1938, 2.0);
    this.constScene.add(ambLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.4);
    dirLight.position.set(5, 8, 10);
    this.constScene.add(dirLight);

    const cyanRim = new THREE.PointLight(0x38bdf8, 3.5, 25);
    cyanRim.position.set(-6, 2, 4);
    this.constScene.add(cyanRim);

    const purpleRim = new THREE.PointLight(0xa855f7, 3.0, 25);
    purpleRim.position.set(6, -2, 4);
    this.constScene.add(purpleRim);

    // Central BrandX Core Emblem (Rotating Polyhedron)
    this.constCoreGroup = new THREE.Group();
    const coreGeo = new THREE.IcosahedronGeometry(0.7, 1);
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0x1d4ed8,
      metalness: 0.9,
      roughness: 0.15,
      wireframe: false
    });
    this.constCoreMesh = new THREE.Mesh(coreGeo, coreMat);
    this.constCoreGroup.add(this.constCoreMesh);

    // Glowing Wireframe Aura
    const coreWireMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8, wireframe: true, transparent: true, opacity: 0.5 });
    const coreWireMesh = new THREE.Mesh(coreGeo, coreWireMat);
    coreWireMesh.scale.set(1.15, 1.15, 1.15);
    this.constCoreGroup.add(coreWireMesh);

    this.constScene.add(this.constCoreGroup);

    // 8 Constellation Orbital Nodes
    this.constellationGroup = new THREE.Group();
    this.constellationNodes = [];
    const orbitRadiusX = this.isMobile ? 3.0 : 4.4;
    const orbitRadiusY = this.isMobile ? 1.6 : 2.2;
    const numNodes = this.constellationData.length;

    for (let i = 0; i < numNodes; i++) {
      const data = this.constellationData[i];
      const angle = (i / numNodes) * Math.PI * 2;
      const x = Math.cos(angle) * orbitRadiusX;
      const y = Math.sin(angle) * orbitRadiusY;
      const z = Math.sin(angle * 2) * 0.6;

      const nodeGroup = new THREE.Group();
      nodeGroup.position.set(x, y, z);
      nodeGroup.userData = {
        index: i,
        baseX: x,
        baseY: y,
        baseZ: z,
        angle: angle,
        data: data
      };

      // Node Sphere Core
      const nodeGeo = new THREE.SphereGeometry(0.24, 16, 16);
      const nodeMat = new THREE.MeshStandardMaterial({
        color: data.color,
        emissive: data.color,
        emissiveIntensity: 0.6,
        metalness: 0.8,
        roughness: 0.2
      });
      const nodeMesh = new THREE.Mesh(nodeGeo, nodeMat);
      nodeGroup.add(nodeMesh);

      // Node Orbital Ring
      const ringGeo = new THREE.TorusGeometry(0.38, 0.02, 8, 24);
      const ringMat = new THREE.MeshBasicMaterial({ color: data.color, transparent: true, opacity: 0.75 });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.rotation.x = Math.PI / 3;
      nodeGroup.add(ringMesh);

      this.constellationGroup.add(nodeGroup);
      this.constellationNodes.push({
        group: nodeGroup,
        mesh: nodeMesh,
        ring: ringMesh,
        mat: nodeMat,
        data: data
      });
    }

    // Connect Nodes with Luminous Lines
    const lineMat = new THREE.LineBasicMaterial({ color: 0x2563eb, transparent: true, opacity: 0.35 });
    const lineGeo = new THREE.BufferGeometry();
    const linePoints = [];

    for (let i = 0; i < numNodes; i++) {
      const p1 = this.constellationNodes[i].group.position;
      const p2 = this.constellationNodes[(i + 1) % numNodes].group.position;
      linePoints.push(p1.x, p1.y, p1.z);
      linePoints.push(p2.x, p2.y, p2.z);
      // Connect to center core
      linePoints.push(p1.x, p1.y, p1.z);
      linePoints.push(0, 0, 0);
    }
    lineGeo.setAttribute('position', new THREE.Float32BufferAttribute(linePoints, 3));
    this.constLines = new THREE.LineSegments(lineGeo, lineMat);
    this.constellationGroup.add(this.constLines);

    // Floating Stardust Particles
    const dustCount = this.isMobile ? 120 : 350;
    const dustGeo = new THREE.BufferGeometry();
    const dustPositions = new Float32Array(dustCount * 3);
    for (let i = 0; i < dustCount * 3; i += 3) {
      dustPositions[i] = (Math.random() - 0.5) * 14;
      dustPositions[i + 1] = (Math.random() - 0.5) * 8;
      dustPositions[i + 2] = (Math.random() - 0.5) * 6;
    }
    dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPositions, 3));
    const dustMat = new THREE.PointsMaterial({
      color: 0x38bdf8,
      size: 0.05,
      transparent: true,
      opacity: 0.6
    });
    this.constDust = new THREE.Points(dustGeo, dustMat);
    this.constScene.add(this.constDust);

    this.constScene.add(this.constellationGroup);
  }

  // Highlight a specific constellation node
  highlightConstellationNode(index) {
    if (index < 0 || index >= this.constellationNodes.length) return;
    this.activeConstellationNode = index;
    const target = this.constellationNodes[index];

    // Update HUD display
    const titleEl = document.getElementById('constNodeTitle');
    const descEl = document.getElementById('constNodeDesc');
    const tagEl = document.getElementById('constNodeTag');

    if (titleEl) titleEl.textContent = target.data.title;
    if (descEl) descEl.textContent = target.data.desc;
    if (tagEl) tagEl.textContent = target.data.tag;

    // Reset all nodes
    this.constellationNodes.forEach((node, i) => {
      const isTarget = i === index;
      const targetScale = isTarget ? 1.6 : 1.0;
      node.group.scale.set(targetScale, targetScale, targetScale);
      node.mat.emissiveIntensity = isTarget ? 1.4 : 0.4;
      node.ring.material.opacity = isTarget ? 1.0 : 0.4;
    });
  }

  // ==========================================================================
  // SCENE 2: 3D PRICING STAGE (Sophisticated Prisms & Refraction)
  // ==========================================================================
  initPricingScene() {
    this.pricingCanvas = document.getElementById('pricingCanvas');
    if (!this.pricingCanvas) return;

    this.pricingStage = document.getElementById('pricing3dStage');
    const width = this.pricingStage ? this.pricingStage.clientWidth : window.innerWidth;
    const height = this.pricingStage ? this.pricingStage.clientHeight : 500;

    this.pricingScene = new THREE.Scene();
    this.pricingCamera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    this.pricingCamera.position.set(0, 0, 11);

    this.pricingRenderer = new THREE.WebGLRenderer({
      canvas: this.pricingCanvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    this.pricingRenderer.setSize(width, height);
    this.pricingRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Refined Studio Lighting (Violet / Blue)
    const amb = new THREE.AmbientLight(0x060b19, 1.8);
    this.pricingScene.add(amb);

    this.pricingPointBlue = new THREE.PointLight(0x2563eb, 4.0, 30);
    this.pricingPointBlue.position.set(-6, 4, 3);
    this.pricingScene.add(this.pricingPointBlue);

    this.pricingPointViolet = new THREE.PointLight(0x8b5cf6, 4.2, 30);
    this.pricingPointViolet.position.set(6, -3, 3);
    this.pricingScene.add(this.pricingPointViolet);

    // Floating Geometric Crystal Prisms
    this.pricingPrisms = [];
    const prismCount = this.isMobile ? 5 : 9;
    const prismGeos = [
      new THREE.OctahedronGeometry(0.8, 0),
      new THREE.IcosahedronGeometry(0.65, 0),
      new THREE.TetrahedronGeometry(0.7, 0)
    ];

    for (let i = 0; i < prismCount; i++) {
      const geo = prismGeos[i % prismGeos.length];
      const mat = new THREE.MeshPhysicalMaterial({
        color: i % 2 === 0 ? 0x38bdf8 : 0xa855f7,
        metalness: 0.2,
        roughness: 0.1,
        transparent: true,
        opacity: 0.45,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1,
        wireframe: false
      });
      const mesh = new THREE.Mesh(geo, mat);

      const wireMat = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        wireframe: true,
        transparent: true,
        opacity: 0.25
      });
      const wire = new THREE.Mesh(geo, wireMat);
      mesh.add(wire);

      const posX = (Math.random() - 0.5) * 14;
      const posY = (Math.random() - 0.5) * 7;
      const posZ = -1 - Math.random() * 4;
      mesh.position.set(posX, posY, posZ);

      mesh.userData = {
        rotSpeedX: (Math.random() - 0.5) * 0.015,
        rotSpeedY: (Math.random() - 0.5) * 0.02,
        baseY: posY,
        floatSpeed: 1 + Math.random(),
        floatAmp: 0.2 + Math.random() * 0.2
      };

      this.pricingScene.add(mesh);
      this.pricingPrisms.push(mesh);
    }
  }

  // ==========================================================================
  // SCENE 3: 3D SMARTPHONE JOURNEY (Download Launchpad Section)
  // ==========================================================================
  initDownloadScene() {
    this.downCanvas = document.getElementById('downloadCanvas');
    if (!this.downCanvas) return;

    this.downStage = document.getElementById('download3dStage');
    const width = this.downStage ? this.downStage.clientWidth : 320;
    const height = this.downStage ? this.downStage.clientHeight : 460;

    this.downScene = new THREE.Scene();
    this.downCamera = new THREE.PerspectiveCamera(40, width / height, 0.1, 50);
    this.downCamera.position.set(0, 0, 7.8);

    this.downRenderer = new THREE.WebGLRenderer({
      canvas: this.downCanvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    this.downRenderer.setSize(width, height);
    this.downRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Studio Lighting
    const amb = new THREE.AmbientLight(0x0a1435, 2.0);
    this.downScene.add(amb);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.0);
    keyLight.position.set(4, 8, 6);
    this.downScene.add(keyLight);

    const rimCyan = new THREE.PointLight(0x06b6d4, 4.5, 20);
    rimCyan.position.set(-5, 2, -1);
    this.downScene.add(rimCyan);

    const rimBlue = new THREE.PointLight(0x3b82f6, 4.0, 20);
    rimBlue.position.set(5, -2, -1);
    this.downScene.add(rimBlue);

    // Build Realistic 3D Smartphone
    this.buildDownloadPhone();
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

  buildDownloadPhone() {
    this.phoneGroup = new THREE.Group();
    const w = 2.4, h = 4.8, d = 0.28, r = 0.38;

    // 1. Titanium Unibody Chassis (Extruded squircle with smooth bevels)
    const chassisShape = this.createRoundedRectShape(w, h, r);
    const extrudeSettings = {
      depth: d - 0.06,
      bevelEnabled: true,
      bevelSegments: 4,
      steps: 1,
      bevelSize: 0.03,
      bevelThickness: 0.03
    };
    const chassisGeo = new THREE.ExtrudeGeometry(chassisShape, extrudeSettings);
    chassisGeo.center();

    const chassisMat = new THREE.MeshStandardMaterial({
      color: 0x0c152a,
      metalness: 0.95,
      roughness: 0.22,
      envMapIntensity: 2.0
    });
    const chassisMesh = new THREE.Mesh(chassisGeo, chassisMat);
    this.phoneGroup.add(chassisMesh);

    // 2. Glistening cyan chamfer edge
    const edgeGeo = new THREE.EdgesGeometry(chassisGeo, 24);
    const edgeMat = new THREE.LineBasicMaterial({
      color: 0x38bdf8,
      linewidth: 1.5,
      transparent: true,
      opacity: 0.75
    });
    this.phoneGroup.add(new THREE.LineSegments(edgeGeo, edgeMat));

    // 3. Procedural Live Screen Texture
    this.downScreenCanvas = document.createElement('canvas');
    this.downScreenCanvas.width = 512;
    this.downScreenCanvas.height = 1024;
    this.drawDownloadScreen();

    this.downScreenTexture = new THREE.CanvasTexture(this.downScreenCanvas);
    this.downScreenTexture.minFilter = THREE.LinearFilter;
    this.downScreenTexture.magFilter = THREE.LinearFilter;

    // 4. Front Rounded Display Mesh
    const dispW = w - 0.18;
    const dispH = h - 0.18;
    const dispR = r - 0.06;
    const dispShape = this.createRoundedRectShape(dispW, dispH, dispR);
    const dispGeo = new THREE.ShapeGeometry(dispShape, 24);

    const posAttr = dispGeo.attributes.position;
    const uvs = new Float32Array(posAttr.count * 2);
    for (let i = 0; i < posAttr.count; i++) {
      const px = posAttr.getX(i);
      const py = posAttr.getY(i);
      uvs[i * 2] = (px + dispW / 2) / dispW;
      uvs[i * 2 + 1] = (py + dispH / 2) / dispH;
    }
    dispGeo.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));

    const screenMat = new THREE.MeshBasicMaterial({ map: this.downScreenTexture });
    const screenMesh = new THREE.Mesh(dispGeo, screenMat);
    screenMesh.position.z = d / 2 + 0.005;
    this.phoneGroup.add(screenMesh);

    // 5. Glass Clearcoat Sheen
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.18,
      roughness: 0.06,
      metalness: 0.08,
      clearcoat: 1.0,
      clearcoatRoughness: 0.04
    });
    const glassMesh = new THREE.Mesh(dispGeo, glassMat);
    glassMesh.position.z = d / 2 + 0.008;
    this.phoneGroup.add(glassMesh);

    // 6. Dynamic Island Pill
    const islandShape = this.createRoundedRectShape(0.64, 0.18, 0.09);
    const islandGeo = new THREE.ShapeGeometry(islandShape, 16);
    const islandMat = new THREE.MeshBasicMaterial({ color: 0x020617 });
    const islandMesh = new THREE.Mesh(islandGeo, islandMat);
    islandMesh.position.set(0, h * 0.42, d / 2 + 0.012);
    this.phoneGroup.add(islandMesh);

    const sensorGeo = new THREE.CircleGeometry(0.026, 16);
    const sensorMat = new THREE.MeshBasicMaterial({ color: 0x0a1426 });
    const sensorMesh = new THREE.Mesh(sensorGeo, sensorMat);
    sensorMesh.position.set(-0.18, h * 0.42, d / 2 + 0.013);
    this.phoneGroup.add(sensorMesh);

    // 7. Hardware Side Buttons
    const btnMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      metalness: 0.95,
      roughness: 0.18
    });

    // Left Action Button
    const actionGeo = new THREE.BoxGeometry(0.04, 0.28, 0.09);
    const actionBtn = new THREE.Mesh(actionGeo, btnMat);
    actionBtn.position.set(-w / 2 - 0.015, 1.25, 0);
    this.phoneGroup.add(actionBtn);

    // Left Volume Up & Down
    const volUpGeo = new THREE.BoxGeometry(0.04, 0.40, 0.09);
    const volUpBtn = new THREE.Mesh(volUpGeo, btnMat);
    volUpBtn.position.set(-w / 2 - 0.015, 0.72, 0);
    this.phoneGroup.add(volUpBtn);

    const volDownGeo = new THREE.BoxGeometry(0.04, 0.40, 0.09);
    const volDownBtn = new THREE.Mesh(volDownGeo, btnMat);
    volDownBtn.position.set(-w / 2 - 0.015, 0.18, 0);
    this.phoneGroup.add(volDownBtn);

    // Right Power Button
    const powerGeo = new THREE.BoxGeometry(0.04, 0.58, 0.09);
    const powerBtn = new THREE.Mesh(powerGeo, btnMat);
    powerBtn.position.set(w / 2 + 0.015, 0.65, 0);
    this.phoneGroup.add(powerBtn);

    // 8. Rear Camera Plateau & 3 Stepped Lenses
    const bumpShape = this.createRoundedRectShape(1.05, 1.05, 0.22);
    const bumpGeo = new THREE.ExtrudeGeometry(bumpShape, {
      depth: 0.06,
      bevelEnabled: true,
      bevelSegments: 3,
      bevelSize: 0.015,
      bevelThickness: 0.015
    });
    bumpGeo.center();
    const bumpMat = new THREE.MeshStandardMaterial({
      color: 0x081022,
      metalness: 0.9,
      roughness: 0.25
    });
    const bumpMesh = new THREE.Mesh(bumpGeo, bumpMat);
    bumpMesh.position.set(-0.55, 1.55, -d / 2 - 0.04);
    this.phoneGroup.add(bumpMesh);

    // 3 Lenses
    const lensPositions = [
      [-0.75, 1.76],
      [-0.75, 1.34],
      [-0.34, 1.55]
    ];
    const outerRimGeo = new THREE.CylinderGeometry(0.18, 0.18, 0.05, 20);
    const outerRimMat = new THREE.MeshStandardMaterial({
      color: 0x94a3b8,
      metalness: 0.98,
      roughness: 0.12
    });
    const innerConeGeo = new THREE.CylinderGeometry(0.15, 0.15, 0.055, 20);
    const innerConeMat = new THREE.MeshStandardMaterial({
      color: 0x020617,
      metalness: 0.9,
      roughness: 0.2
    });
    const opticGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.06, 20);
    const opticMat = new THREE.MeshPhysicalMaterial({
      color: 0x030712,
      roughness: 0.04,
      metalness: 0.4,
      clearcoat: 1.0
    });

    lensPositions.forEach(pos => {
      const rim = new THREE.Mesh(outerRimGeo, outerRimMat);
      rim.rotation.x = Math.PI / 2;
      rim.position.set(pos[0], pos[1], -d / 2 - 0.08);
      this.phoneGroup.add(rim);

      const cone = new THREE.Mesh(innerConeGeo, innerConeMat);
      cone.rotation.x = Math.PI / 2;
      cone.position.set(pos[0], pos[1], -d / 2 - 0.09);
      this.phoneGroup.add(cone);

      const optic = new THREE.Mesh(opticGeo, opticMat);
      optic.rotation.x = Math.PI / 2;
      optic.position.set(pos[0], pos[1], -d / 2 - 0.10);
      this.phoneGroup.add(optic);
    });

    // 9. Luminous Surrounding Portal Ring
    const portalRingGeo = new THREE.TorusGeometry(3.2, 0.035, 16, 64);
    const portalRingMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending
    });
    this.downPortalRing = new THREE.Mesh(portalRingGeo, portalRingMat);
    this.downPortalRing.rotation.x = 0.3;
    this.downScene.add(this.downPortalRing);

    // Initial angled perspective
    this.phoneGroup.rotation.set(0.15, -0.4, 0.05);
    this.phoneGroup.position.set(0, 0, 0);
    this.downScene.add(this.phoneGroup);

    // Hide fallback if 3D phone is active
    const fallback = document.getElementById('downloadPhoneFallback');
    if (fallback) fallback.style.display = 'none';
  }

  drawDownloadScreen() {
    const ctx = this.downScreenCanvas.getContext('2d');
    const w = 512, h = 1024;

    ctx.clearRect(0, 0, w, h);
    ctx.save();
    // Strictly clip screen drawings to iPhone rounded display boundary
    ctx.beginPath();
    ctx.roundRect(0, 0, w, h, 64);
    ctx.clip();

    // Background Gradient
    const bg = ctx.createLinearGradient(0, 0, 0, h);
    bg.addColorStop(0, '#091128');
    bg.addColorStop(0.5, '#060b19');
    bg.addColorStop(1, '#0b1329');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, w, h);

    // Status Bar
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 22px system-ui';
    ctx.fillText('9:41', 40, 50);
    ctx.font = '18px system-ui';
    ctx.fillText('5G ●●●', 410, 50);

    // App Header Pill
    ctx.fillStyle = 'rgba(37, 99, 235, 0.18)';
    ctx.beginPath();
    ctx.roundRect(32, 90, 448, 70, 20);
    ctx.fill();
    ctx.strokeStyle = 'rgba(59, 130, 246, 0.4)';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = '#38BDF8';
    ctx.font = 'bold 24px system-ui';
    ctx.fillText('BRANDX SUPER APP', 60, 134);

    ctx.fillStyle = '#10B981';
    ctx.font = 'bold 16px system-ui';
    ctx.fillText('● CLOUD SYNCED', 315, 134);

    // Metric Cards Grid
    const cards = [
      { label: "TODAY'S BILLING", val: "₹18,450", color: "#38BDF8" },
      { label: "KHATA BALANCE", val: "₹6,820", color: "#34D399" },
      { label: "ACTIVE ITEMS", val: "548 SKUs", color: "#60A5FA" },
      { label: "DIGITAL DUKAAN", val: "24/7 ONLINE", color: "#C084FC" }
    ];

    cards.forEach((c, i) => {
      const col = i % 2;
      const row = Math.floor(i / 2);
      const cardX = 32 + col * 232;
      const cardY = 180 + row * 130;

      ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
      ctx.beginPath();
      ctx.roundRect(cardX, cardY, 216, 110, 16);
      ctx.fill();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.fillStyle = '#94A3B8';
      ctx.font = '600 14px system-ui';
      ctx.fillText(c.label, cardX + 16, cardY + 36);

      ctx.fillStyle = c.color;
      ctx.font = 'bold 26px system-ui';
      ctx.fillText(c.val, cardX + 16, cardY + 80);
    });

    // AI Copilot Active Card
    ctx.fillStyle = 'rgba(139, 92, 246, 0.12)';
    ctx.beginPath();
    ctx.roundRect(32, 460, 448, 140, 20);
    ctx.fill();
    ctx.strokeStyle = 'rgba(192, 132, 252, 0.35)';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = '#C084FC';
    ctx.font = 'bold 18px system-ui';
    ctx.fillText('✨ AI COPILOT SMART ADVISOR', 52, 500);

    ctx.fillStyle = '#E2E8F0';
    ctx.font = '500 16px system-ui';
    ctx.fillText('"Namaste! 3 WhatsApp payment reminders scheduled for', 52, 536);
    ctx.fillText('today. 1-tap dispatch ready."', 52, 564);

    // Bottom Navigation Bar
    ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
    ctx.fillRect(0, h - 90, w, 90);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.strokeRect(0, h - 90, w, 1);

    const navIcons = ['🧾 Billing', '📒 Khata', '📦 Items', '🌐 Dukaan', '🤖 AI'];
    navIcons.forEach((n, idx) => {
      ctx.fillStyle = idx === 0 ? '#38BDF8' : '#64748B';
      ctx.font = '600 16px system-ui';
      ctx.fillText(n, 20 + idx * 98, h - 38);
    });

    ctx.restore();
  }

  // ==========================================================================
  // PERFORMANCE OBSERVER (Pause offscreen WebGL loops)
  // ==========================================================================
  setupIntersectionObservers() {
    if (!('IntersectionObserver' in window)) return;

    // 1. Constellation Section Observer
    const constSec = document.getElementById('featuresGridSection');
    if (constSec) {
      new IntersectionObserver((entries) => {
        entries.forEach(e => { this.visibility.constellation = e.isIntersecting; });
      }, { threshold: 0.05 }).observe(constSec);
    }

    // 2. Pricing Section Observer
    const pricingSec = document.getElementById('pricing');
    if (pricingSec) {
      new IntersectionObserver((entries) => {
        entries.forEach(e => { this.visibility.pricing = e.isIntersecting; });
      }, { threshold: 0.05 }).observe(pricingSec);
    }

    // 3. Download Section Observer
    const downSec = document.getElementById('download');
    if (downSec) {
      new IntersectionObserver((entries) => {
        entries.forEach(e => { this.visibility.download = e.isIntersecting; });
      }, { threshold: 0.05 }).observe(downSec);
    }
  }

  // ==========================================================================
  // INTERACTION BINDINGS
  // ==========================================================================
  bindInteractions() {
    // Window Resize
    window.addEventListener('resize', () => {
      this.isMobile = window.innerWidth <= 768;
      this.handleResize();
    });

    // Feature Cards Hover -> Constellation Node Highlight
    const featureCards = document.querySelectorAll('.features-grid .feature-card');
    featureCards.forEach((card, idx) => {
      card.addEventListener('mouseenter', () => {
        this.highlightConstellationNode(idx);
      });
      card.addEventListener('click', () => {
        this.highlightConstellationNode(idx);
      });
    });

    // Pricing Plan Toggle -> Shift 3D Lighting
    const pricingToggle = document.getElementById('pricingToggle');
    if (pricingToggle) {
      pricingToggle.addEventListener('change', (e) => {
        const isYearly = e.target.checked;
        if (this.pricingPointBlue && this.pricingPointViolet) {
          if (isYearly) {
            this.pricingPointBlue.color.setHex(0xf59e0b); // Amber Gold highlight
            this.pricingPointViolet.color.setHex(0x38bdf8); // Cyan
          } else {
            this.pricingPointBlue.color.setHex(0x2563eb); // Deep Blue
            this.pricingPointViolet.color.setHex(0x8b5cf6); // Cyber Violet
          }
        }
      });
    }

    // Download Card Mouse Parallax -> Phone 3D Tilt
    const downloadCard = document.querySelector('.download-card');
    if (downloadCard && !this.isReducedMotion) {
      downloadCard.addEventListener('mousemove', (e) => {
        if (!this.phoneGroup) return;
        const rect = downloadCard.getBoundingClientRect();
        const xPct = (e.clientX - rect.left) / rect.width - 0.5;
        const yPct = (e.clientY - rect.top) / rect.height - 0.5;
        this.phoneGroup.rotation.y = -0.4 + xPct * 0.6;
        this.phoneGroup.rotation.x = 0.15 - yPct * 0.4;
      });

      downloadCard.addEventListener('mouseleave', () => {
        if (!this.phoneGroup) return;
        this.phoneGroup.rotation.set(0.15, -0.4, 0.05);
      });
    }
  }

  handleResize() {
    // Resize Constellation
    if (this.constRenderer && this.constStage) {
      const w = this.constStage.clientWidth;
      const h = this.constStage.clientHeight;
      this.constCamera.aspect = w / h;
      this.constCamera.updateProjectionMatrix();
      this.constRenderer.setSize(w, h);
    }

    // Resize Pricing
    if (this.pricingRenderer && this.pricingStage) {
      const w = this.pricingStage.clientWidth;
      const h = this.pricingStage.clientHeight;
      this.pricingCamera.aspect = w / h;
      this.pricingCamera.updateProjectionMatrix();
      this.pricingRenderer.setSize(w, h);
    }

    // Resize Download
    if (this.downRenderer && this.downStage) {
      const w = this.downStage.clientWidth;
      const h = this.downStage.clientHeight;
      this.downCamera.aspect = w / h;
      this.downCamera.updateProjectionMatrix();
      this.downRenderer.setSize(w, h);
    }
  }

  // ==========================================================================
  // UNIFIED 60FPS ANIMATION LOOP
  // ==========================================================================
  animate() {
    requestAnimationFrame(() => this.animate());

    if (this.isReducedMotion) return;
    const elapsed = this.clock.getElapsedTime();

    // 1. Render Constellation if visible
    if (this.visibility.constellation && this.constRenderer) {
      if (this.constCoreGroup) {
        this.constCoreGroup.rotation.y = elapsed * 0.3;
        this.constCoreGroup.rotation.x = Math.sin(elapsed * 0.5) * 0.2;
      }

      if (this.constellationGroup) {
        this.constellationGroup.rotation.z = Math.sin(elapsed * 0.1) * 0.05;
      }

      if (this.constDust) {
        this.constDust.rotation.y = elapsed * 0.04;
      }

      // Orbital nodes subtle breathing
      this.constellationNodes.forEach((node, i) => {
        const u = node.group.userData;
        node.group.position.y = u.baseY + Math.sin(elapsed * 1.5 + i) * 0.08;
        node.ring.rotation.z += 0.02;
      });

      this.constRenderer.render(this.constScene, this.constCamera);
    }

    // 2. Render Pricing 3D Prisms if visible
    if (this.visibility.pricing && this.pricingRenderer) {
      this.pricingPrisms.forEach((p) => {
        const u = p.userData;
        p.rotation.x += u.rotSpeedX;
        p.rotation.y += u.rotSpeedY;
        p.position.y = u.baseY + Math.sin(elapsed * u.floatSpeed) * u.floatAmp;
      });

      this.pricingRenderer.render(this.pricingScene, this.pricingCamera);
    }

    // 3. Render Download Smartphone if visible
    if (this.visibility.download && this.downRenderer) {
      if (this.phoneGroup) {
        this.phoneGroup.position.y = Math.sin(elapsed * 1.8) * 0.08;
        this.phoneGroup.rotation.y = -0.38 + Math.sin(elapsed * 1.2) * 0.14;
        this.phoneGroup.rotation.x = 0.15 + Math.cos(elapsed * 1.0) * 0.04;
      }
      if (this.downPortalRing) {
        this.downPortalRing.rotation.z = elapsed * 0.4;
        this.downPortalRing.rotation.y = elapsed * 0.25;
        const pScale = 1.0 + Math.sin(elapsed * 2.0) * 0.06;
        this.downPortalRing.scale.set(pScale, pScale, pScale);
      }

      this.downRenderer.render(this.downScene, this.downCamera);
    }
  }
}

// Global initialization
window.addEventListener('DOMContentLoaded', () => {
  window.brandxWebsiteScenes = new BrandXWebsiteScenes();
});
