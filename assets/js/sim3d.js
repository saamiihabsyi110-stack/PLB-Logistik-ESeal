        const sim3D = {
            scene: null,
            camera: null,
            renderer: null,
            controls: null,
            container: null,
            
            // 3D Entities
            truckGroup: null,
            esealGroup: null,
            esealShackle: null,
            esealLed: null,
            gateBarrierBar: null,
            scanWaveMesh: null,
            shipGroup: null,
            craneGroup: null,
            waterMesh: null,
            quarantineSign: null,

            // Animation Coordinates
            truckTargetX: -45,
            truckCurrentX: -45,
            truckTargetZ: 0,
            truckCurrentZ: 0,
            truckTargetRotY: 0,
            truckCurrentRotY: 0,
            truckRoute: null,
            truckRouteIndex: 0,
            truckRouteCallback: null,
            gateAngleTarget: 0,
            gateAngleCurrent: 0,
            gateOutAngleTarget: 0,
            gateOutAngleCurrent: 0,
            containerUnloadAnimating: false,
            containerUnloadStart: 0,
            containerUnloadDuration: 2800,
            driveTruckGroup: null,
            driveMode: false,
            driveTruckSpeed: 0,
            driveTruckRot: 0,
            driveTruckSpawn: { x: -76, z: 8 },
            esealUnlockedTarget: 0,
            esealUnlockedCurrent: 0,
            isScanning: false,
            quarantineAlarm: false,

            // SECRET EASTER EGG WEAPON SYSTEM
            weaponPickupGroup: null,
            weaponWorldPos: { x: 20, z: 38 },
            weaponEquipped: false,
            weaponGroup: null,
            weaponAmmo: Infinity,
            weaponReserve: Infinity,
            weaponReloading: false,
            weaponPromptName: 'Ambil Senjata',
            weaponMuzzleFlash: null,
            weaponHud: null,
            weaponAudioCtx: null,
            weaponProjectiles: [],
            weaponLastShotAt: 0,
            weaponFiring: false,
            weaponFireInterval: null,
            weaponFireRateMs: 110,

            // WASD Person Avatar Controller State
            avatarPos: { x: 0, z: 15 },
            avatarPosY: 0,
            avatarVelY: 0,
            isGrounded: true,
            avatarRot: 0,
            keysPressed: {},
            avatarMesh: null,

            init() {
                this.container = document.getElementById('canvas3d-container');
                const width = this.container.clientWidth || 800;
                const height = this.container.clientHeight || 500;

                // 1. Scene
                this.scene = new THREE.Scene();
                this.scene.background = new THREE.Color(0x0a1120);
                this.scene.fog = new THREE.FogExp2(0x0a1120, 0.012);

                // 2. Camera & Cegah error NaN di awal load flexbox
        const safeAspect = (width > 0 && height > 0) ? (width / height) : (800 / 500);
        this.camera = new THREE.PerspectiveCamera(45, safeAspect, 0.1, 800);

        // 3. Renderer (Aktifkan antialias agar animasi lebih jernih dan set fallback ukuran)
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true }); 
        this.renderer.setSize(width || 800, height || 500);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); 
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.container.appendChild(this.renderer.domElement);

        // 4. Orbit Controls (Harus diinisialisasi SEBELUM resetCamera dipanggil)
        if (typeof THREE.OrbitControls !== 'undefined') {
            this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
            this.controls.enableDamping = true;
            this.controls.dampingFactor = 0.05;
            this.controls.maxPolarAngle = Math.PI / 2.05;
            this.controls.minDistance = 0.5;
            this.controls.maxDistance = 140;
        }

        // 4.5. Panggil resetCamera SEKARANG agar target focus-nya aktif 
        this.resetCamera();

        // 4.6. Tambahkan ResizeObserver agar canvas merespons delay flexbox rendering dengan otomatis
        const resizeObserver = new ResizeObserver(() => this.onResize());
        resizeObserver.observe(this.container);

                // Keyboard Listeners for WASD Player Character Movement & Space Jump
                window.addEventListener('keydown', (e) => {
                    const key = e.key === ' ' ? 'space' : e.key.toLowerCase();
                    this.keysPressed[key] = true;
                    
                    // Mencegah scroll halaman ke bawah saat menekan Spasi
                    if (key === 'space' && e.target === document.body) {
                        e.preventDefault();
                    }
                    
                    // Logika Lompat (Jump Physics)
                    if (key === 'space' && this.cameraPreset === 'WALK' && this.isGrounded) {
                        this.avatarVelY = 0.45; // Daya lompatan
                        this.isGrounded = false;
                    }
                });
                window.addEventListener('keyup', (e) => {
                    const key = e.key === ' ' ? 'space' : e.key.toLowerCase();
                    this.keysPressed[key] = false;
                });

                // Secret weapon: HOLD LEFT MOUSE BUTTON = AUTO FIRE.
                // The first shot happens immediately, then the weapon keeps firing
                // until the left button is released.
                this.renderer.domElement.addEventListener('pointerdown', (e) => {
                    if (e.button === 0 && this.weaponEquipped && !this.driveMode) {
                        e.preventDefault();
                        e.stopPropagation();
                        this.initWeaponAudio();
                        this.startWeaponAutoFire();
                    }
                }, { passive: false });

                // Fallback for browsers/controls that do not forward pointer events cleanly.
                window.addEventListener('mousedown', (e) => {
                    if (e.button === 0 && this.weaponEquipped && !this.driveMode &&
                        e.target === this.renderer.domElement && !this.weaponFiring) {
                        e.preventDefault();
                        this.initWeaponAudio();
                        this.startWeaponAutoFire();
                    }
                }, { passive: false });

                // Release anywhere on the window so dragging the cursor out of the
                // canvas cannot leave the weapon stuck in automatic fire.
                window.addEventListener('pointerup', () => this.stopWeaponAutoFire());
                window.addEventListener('mouseup', () => this.stopWeaponAutoFire());
                window.addEventListener('pointercancel', () => this.stopWeaponAutoFire());
                window.addEventListener('blur', () => this.stopWeaponAutoFire());

                // 5. Bright Realistic Daytime Lighting & Sky
                const skyMat = new THREE.MeshBasicMaterial({ color: 0x93c5fd, side: THREE.BackSide });
                const skyDome = new THREE.Mesh(new THREE.SphereGeometry(300, 16, 16), skyMat);
                this.scene.add(skyDome);

                const ambientLight = new THREE.AmbientLight(0xf1f5f9, 1.2);
                this.scene.add(ambientLight);

                const sunLight = new THREE.DirectionalLight(0xfffbeb, 1.8);
                sunLight.position.set(50, 80, 45);
                sunLight.castShadow = true;
                sunLight.shadow.mapSize.width = 2048;
                sunLight.shadow.mapSize.height = 2048;
                sunLight.shadow.camera.near = 10;
                sunLight.shadow.camera.far = 300;
                sunLight.shadow.camera.left = -70;
                sunLight.shadow.camera.right = 70;
                sunLight.shadow.camera.top = 70;
                sunLight.shadow.camera.bottom = -70;
                this.scene.add(sunLight);

                const hemisphereLight = new THREE.HemisphereLight(0xbfdbfe, 0x475569, 0.6);
                this.scene.add(hemisphereLight);

                // 6. Build Detailed Seaport & PLB Yard
                this.buildSeaportEnvironment();
                this.buildContainerStacks();
                this.buildWeaponEasterEgg();
                this.createWeaponHud();
                this.buildPLBGate();
                this.buildPortWorkers();
                this.buildContainerTruck();
                this.buildUserAvatar();

                // 7. Resize Event
                window.addEventListener('resize', () => this.onResize());

                // 8. Animation Loop
                this.animate();
            },

            buildUserAvatar() {
                this.avatarMesh = new THREE.Group();
                this.avatarMesh.position.set(this.avatarPos.x, 0, this.avatarPos.z);

                // Player Character Body (Pink Inspector Vest)
                const torso = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.9, 0.35), new THREE.MeshStandardMaterial({ color: 0xec4899 }));
                torso.position.y = 1.15;
                const head = new THREE.Mesh(new THREE.SphereGeometry(0.22, 12, 12), new THREE.MeshStandardMaterial({ color: 0xfbcfe8 }));
                head.position.y = 1.8;
                const helmet = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.3, 0.18, 12), new THREE.MeshStandardMaterial({ color: 0xffffff }));
                helmet.position.y = 1.98;
                
                // Legs
                this.avatarLeg1 = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.7, 0.25), new THREE.MeshStandardMaterial({ color: 0x0f172a }));
                this.avatarLeg1.position.set(-0.14, 0.35, 0);
                this.avatarLeg2 = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.7, 0.25), new THREE.MeshStandardMaterial({ color: 0x0f172a }));
                this.avatarLeg2.position.set(0.14, 0.35, 0);

                // Arms (Lengan Karakter) dengan Group untuk pivot bahu yang realistis
                const armMat = new THREE.MeshStandardMaterial({ color: 0xec4899 });
                
                this.avatarArm1 = new THREE.Group(); // Group lengan kiri
                this.avatarArm1.position.set(-0.4, 1.45, 0); // Titik poros (pivot) di bahu atas
                const armMesh1 = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.7, 0.2), armMat);
                armMesh1.position.set(0, -0.35, 0); // Offset turun dari bahu
                this.avatarArm1.add(armMesh1);
                
                this.avatarArm2 = new THREE.Group(); // Group lengan kanan
                this.avatarArm2.position.set(0.4, 1.45, 0); // Titik poros (pivot) di bahu atas
                const armMesh2 = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.7, 0.2), armMat);
                armMesh2.position.set(0, -0.35, 0); // Offset turun dari bahu
                this.avatarArm2.add(armMesh2);

                this.avatarMesh.add(torso, head, helmet, this.avatarLeg1, this.avatarLeg2, this.avatarArm1, this.avatarArm2);
                this.scene.add(this.avatarMesh);
            },

            toggleWalkMode() {
                if (this.cameraPreset === 'WALK') {
                    this.resetCamera();
                    const btn = document.getElementById('btn-walk-mode');
                    if (btn) btn.className = 'px-2 py-0.5 rounded bg-indigo-600 hover:bg-indigo-500 text-white text-[9px] font-bold shadow';
                } else {
                    this.cameraPreset = 'WALK';
                    const btn = document.getElementById('btn-walk-mode');
                    if (btn) btn.className = 'px-2 py-0.5 rounded bg-emerald-600 text-white text-[9px] font-bold shadow ring-2 ring-emerald-400 blink-slow';
                    if (app) app.log('MODE JALAN KAKI (WASD): Gunakan W/A/S/D untuk berjalan menjelajah seluruh kawasan PLB!', 'system');
                }
            },

            resetCamera() {
                this.cameraPreset = 'DEFAULT';
                this.camera.position.set(-28, 20, 32);
                this.camera.lookAt(0, 2.5, 0); // Paksa arahkan mata kamera agar tidak melihat kabut hitam
                if (this.controls) {
                    this.controls.target.set(0, 2.5, 0);
                    this.controls.update();
                }
            },

            setCameraPreset(preset) {
                this.cameraPreset = preset;
                if (preset === 'GATE') {
                    // Close-up on Customs Gate & Officer
                    this.camera.position.set(16, 6.0, 12);
                    this.controls.target.set(8, 2.8, 1.5);
                } else if (preset === 'SHIP') {
                    // View of Container Ship & Quay Crane
                    this.camera.position.set(-45, 20, -10);
                    this.controls.target.set(-28, 8, -32);
                } else if (preset === 'TRUCK') {
                    // Follow truck position
                    const tx = this.truckCurrentX || 0;
                    const tz = this.truckCurrentZ || 0;
                    this.camera.position.set(tx + 14, 7.0, tz + 13);
                    this.controls.target.set(tx, 2.5, tz);
                }
                this.controls.update();
            },

            buildSeaportEnvironment() {
                // 1. Daratan Dermaga (Ukurannya dipendekkan agar berhenti pas di tebing laut)
                // Dataran dermaga dihentikan tepat di sisi laut/fence.
                // Area di luar pagar tidak lagi tertutup permukaan daratan.
                const dockEdgeZ = -47.4;
                const dockFarZ = 62;
                const dockDepthZ = dockFarZ - dockEdgeZ;
                const dockCenterZ = (dockFarZ + dockEdgeZ) / 2;
                const dockGeo = new THREE.BoxGeometry(300, 2.0, dockDepthZ);
                const dockMat = new THREE.MeshStandardMaterial({ 
                    color: 0x334155, 
                    roughness: 0.8,
                    metalness: 0.1
                });
                const dock = new THREE.Mesh(dockGeo, dockMat);
                dock.position.set(0, -0.9, dockCenterZ); 
                dock.receiveShadow = true;
                this.scene.add(dock);

                // 2. Garis Pembatas Hitam-Kuning (Digeser ke bibir pantai)
                const curbMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.7 });
                const curb = new THREE.Mesh(new THREE.BoxGeometry(300, 0.4, 1.2), curbMat);
                curb.position.set(0, 0.2, -47.4); 
                this.scene.add(curb);

                // 3. PAGER KECIL PEMBATAS (FITUR BARU)
                const fenceGroup = new THREE.Group();
                const postGeo = new THREE.CylinderGeometry(0.06, 0.06, 1.0, 8);
                const fenceMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, metalness: 0.4 }); // Pagar kuning
                const railGeo = new THREE.BoxGeometry(300, 0.08, 0.04);
                
                for(let fx = -145; fx <= 145; fx += 4) {
                    const post = new THREE.Mesh(postGeo, fenceMat);
                    post.position.set(fx, 0.5, -46.5); // Posisi tepat di belakang garis pembatas
                    fenceGroup.add(post);
                }
                const topRail = new THREE.Mesh(railGeo, fenceMat);
                topRail.position.set(0, 1.0, -46.5);
                const midRail = new THREE.Mesh(railGeo, fenceMat);
                midRail.position.set(0, 0.5, -46.5);
                fenceGroup.add(topRail, midRail);
                this.scene.add(fenceGroup);

                // 4. Mooring Bollards (Besi tambatan kapal dipindah ke pinggir laut)
                const bollardMat = new THREE.MeshStandardMaterial({ color: 0x090d16, metalness: 0.85, roughness: 0.2 });
                for (let bx = -90; bx <= 80; bx += 16) {
                    const bollardGroup = new THREE.Group();
                    bollardGroup.position.set(bx, 0.45, -47.2);
                    const bPost = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.45, 0.9, 12), bollardMat);
                    const bCap = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.45, 0.2, 12), bollardMat);
                    bCap.position.y = 0.5;
                    bollardGroup.add(bPost, bCap);
                    this.scene.add(bollardGroup);
                }

                // 5. Tiang Lampu Sorot
                const poleMat = new THREE.MeshStandardMaterial({ color: 0x64748b, metalness: 0.7, roughness: 0.3 });
                [-50, 15].forEach(px => {
                    const poleGroup = new THREE.Group();
                    poleGroup.position.set(px, 0, -9);

                    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.5, 22, 12), poleMat);
                    pole.position.set(0, 11, 0);
                    poleGroup.add(pole);

                    const platform = new THREE.Mesh(new THREE.CylinderGeometry(1.6, 1.6, 0.3, 12), poleMat);
                    platform.position.set(0, 20.5, 0);
                    poleGroup.add(platform);

                    const head = new THREE.Mesh(new THREE.BoxGeometry(3.6, 1.2, 1.8), new THREE.MeshStandardMaterial({ color: 0x1e293b }));
                    head.position.set(0, 21.8, 0);
                    poleGroup.add(head);

                    for (let lx = -1.2; lx <= 1.2; lx += 0.8) {
                        const lampLens = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.4, 0.1), new THREE.MeshBasicMaterial({ color: 0xfef08a }));
                        lampLens.position.set(lx, 21.8, 0.95);
                        poleGroup.add(lampLens);
                    }
                    this.scene.add(poleGroup);
                });

                // 6. JALUR ASPAL TRUK - INBOUND / U-TURN / OUTBOUND
                // Jalur dibuat sebagai satu pita aspal kontinu. U-turn memakai
                // kurva setengah lingkaran sehingga tidak ada siku/patahan tajam.
                const roadGroup = new THREE.Group();

                const asphaltMat = new THREE.MeshStandardMaterial({
                    color: 0x111318,
                    roughness: 0.94,
                    metalness: 0.02
                });
                const roadEdgeMat = new THREE.MeshBasicMaterial({ color: 0xdbe3ea });
                const roadCenterMat = new THREE.MeshBasicMaterial({ color: 0xfacc15 });

                const addRoadRect = (x, z, widthX, widthZ) => {
                    const road = new THREE.Mesh(
                        new THREE.BoxGeometry(widthX, 0.12, widthZ),
                        asphaltMat
                    );
                    road.position.set(x, 0.055, z);
                    road.receiveShadow = true;
                    road.castShadow = false;
                    roadGroup.add(road);
                };

                const addRoadEdgeX = (x1, x2, z) => {
                    const line = new THREE.Mesh(
                        new THREE.PlaneGeometry(Math.abs(x2 - x1), 0.16),
                        roadEdgeMat
                    );
                    line.rotation.x = -Math.PI / 2;
                    line.position.set((x1 + x2) / 2, 0.125, z);
                    roadGroup.add(line);
                };

                const addRoadEdgeZ = (x, z1, z2) => {
                    const line = new THREE.Mesh(
                        new THREE.PlaneGeometry(0.16, Math.abs(z2 - z1)),
                        roadEdgeMat
                    );
                    line.rotation.x = -Math.PI / 2;
                    line.position.set(x, 0.125, (z1 + z2) / 2);
                    roadGroup.add(line);
                };

                const addCenterDashesX = (xStart, xEnd, z) => {
                    for (let x = xStart; x <= xEnd; x += 8) {
                        const dash = new THREE.Mesh(
                            new THREE.PlaneGeometry(4.0, 0.20),
                            roadCenterMat
                        );
                        dash.rotation.x = -Math.PI / 2;
                        dash.position.set(x, 0.125, z);
                        roadGroup.add(dash);
                    }
                };

                // Straight inbound.
                addRoadRect(-8, 0, 100, 16);
                addRoadEdgeX(-58, 38, 7.8);
                addRoadEdgeX(-58, 38, -7.8);
                addCenterDashesX(-54, 34, 0);

                // CONTINUOUS U-TURN: centerline radius 14m, road width 16m.
                const uCenterX = 38;
                const uCenterZ = -14;
                const uRadius = 14;
                const uHalfWidth = 8;
                const uOuter = uRadius + uHalfWidth;
                const uInner = uRadius - uHalfWidth;

                const uShape = new THREE.Shape();
                const steps = 48;
                for (let i = 0; i <= steps; i++) {
                    const t = Math.PI / 2 - (Math.PI * i / steps);
                    const x = uCenterX + uOuter * Math.cos(t);
                    const z = uCenterZ + uOuter * Math.sin(t);
                    if (i === 0) uShape.moveTo(x, z);
                    else uShape.lineTo(x, z);
                }
                for (let i = steps; i >= 0; i--) {
                    const t = Math.PI / 2 - (Math.PI * i / steps);
                    const x = uCenterX + Math.max(0.8, uInner) * Math.cos(t);
                    const z = uCenterZ + Math.max(0.8, uInner) * Math.sin(t);
                    uShape.lineTo(x, z);
                }
                uShape.closePath();

                const uGeo = new THREE.ShapeGeometry(uShape);
                const uRoad = new THREE.Mesh(uGeo, asphaltMat);
                uRoad.rotation.x = -Math.PI / 2;
                uRoad.position.y = 0.06;
                uRoad.receiveShadow = true;
                roadGroup.add(uRoad);

                // Outer/inner continuous edge lines.
                const addArcLine = (radius, colorMat) => {
                    const pts = [];
                    for (let i = 0; i <= steps; i++) {
                        const t = Math.PI / 2 - (Math.PI * i / steps);
                        pts.push(new THREE.Vector3(
                            uCenterX + radius * Math.cos(t),
                            0.13,
                            uCenterZ + radius * Math.sin(t)
                        ));
                    }
                    const curve = new THREE.LineCurve3(pts[0], pts[pts.length - 1]);
                    const geo = new THREE.BufferGeometry().setFromPoints(pts);
                    const line = new THREE.Line(geo, colorMat);
                    roadGroup.add(line);
                };
                addArcLine(uOuter, roadEdgeMat);
                addArcLine(Math.max(0.8, uInner), roadEdgeMat);

                // Dashed centerline follows the curve, so the U-turn reads as one lane.
                for (let i = 0; i < 10; i++) {
                    const t0 = Math.PI / 2 - (Math.PI * (i * 2 + 0.2) / 20);
                    const t1 = Math.PI / 2 - (Math.PI * (i * 2 + 1.0) / 20);
                    const pts = [];
                    for (let j = 0; j <= 8; j++) {
                        const t = t0 + (t1 - t0) * (j / 8);
                        pts.push(new THREE.Vector3(
                            uCenterX + uRadius * Math.cos(t),
                            0.13,
                            uCenterZ + uRadius * Math.sin(t)
                        ));
                    }
                    roadGroup.add(new THREE.Line(
                        new THREE.BufferGeometry().setFromPoints(pts),
                        roadCenterMat
                    ));
                }

                // Straight outbound continues seamlessly from the U-turn.
                addRoadRect(-30, -28, 136, 16);
                addRoadEdgeX(-98, 38, -20.2);
                addRoadEdgeX(-98, 38, -35.8);
                addCenterDashesX(-94, 34, -28);

                // Gate 02 uses the existing outbound road surface directly.
                // The extra rectangular apron/slab was removed because it visually
                // floated across the gate area and was not part of the road.

                // Gate safety stop box / hatch marks.
                const stopMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
                for (let x = -15; x <= 5; x += 3) {
                    const stop = new THREE.Mesh(new THREE.PlaneGeometry(1.2, 0.35), stopMat);
                    stop.rotation.x = -Math.PI / 2;
                    stop.position.set(x, 0.135, -20.6);
                    roadGroup.add(stop);
                }

                this.scene.add(roadGroup);

                // 9. Air Laut (Ketinggian diturunkan drastis di sumbu Y)
                const seaGeo = new THREE.PlaneGeometry(420, 190);
                const seaMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.1, metalness: 0.8 });
                const sea = new THREE.Mesh(seaGeo, seaMat);
                sea.rotation.x = -Math.PI / 2;
                sea.position.set(0, -2.5, -75); // Diturunkan ke Y = -2.5
                this.scene.add(sea);

                // 9. Dinding Beton Dermaga
                const quayWallGeo = new THREE.BoxGeometry(260, 4.0, 2.0);
                const quayWallMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.9 });
                const quayWall = new THREE.Mesh(quayWallGeo, quayWallMat);
                quayWall.position.set(0, -1.8, -48);
                this.scene.add(quayWall);

                // 10. Ban Karet Pelindung Kapal (Ditempel sejajar tebing)
                const tireGeo = new THREE.TorusGeometry(0.7, 0.3, 10, 16);
                const tireMat = new THREE.MeshStandardMaterial({ color: 0x09090b, roughness: 0.9 });
                for (let tx = -85; tx <= 85; tx += 12) {
                    const fenderTire = new THREE.Mesh(tireGeo, tireMat);
                    fenderTire.position.set(tx, -1.5, -48.9);
                    this.scene.add(fenderTire);
                }

                // Dedicated Truck Parking Lot Area
                const parkLotGeo = new THREE.BoxGeometry(45, 0.06, 32);
                const parkLotMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.9 });
                const parkLot = new THREE.Mesh(parkLotGeo, parkLotMat);
                parkLot.position.set(-65, 0.06, 22);
                parkLot.receiveShadow = true;
                this.scene.add(parkLot);

                // White Parking Slot Lines
                const parkLineMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
                for (let px = -82; px <= -48; px += 8) {
                    const slotLine = new THREE.Mesh(new THREE.PlaneGeometry(0.3, 28), parkLineMat);
                    slotLine.rotation.x = -Math.PI / 2;
                    slotLine.position.set(px, 0.09, 22);
                    this.scene.add(slotLine);
                }

                // Sign Board "LAHAN PARKIR TRUK KOSONG (HOLDING AREA GATE 01)"
                const parkSignGroup = new THREE.Group();
                parkSignGroup.position.set(-85, 0, 36);
                const pSignPole = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 3.8, 8), poleMat); pSignPole.position.set(0, 1.9, 0);
                const pSignBoard = new THREE.Mesh(new THREE.BoxGeometry(5.2, 1.8, 0.15), new THREE.MeshStandardMaterial({ color: 0x2563eb })); pSignBoard.position.set(0, 3.0, 0);
                parkSignGroup.add(pSignPole, pSignBoard);
                this.scene.add(parkSignGroup);

                // Parked Chassis / Trailer Trucks in Holding Lot (Truk Kosong Parkir Siaga)
                [-78, -70, -62].forEach((tx, idx) => {
                    const parkedTruck = new THREE.Group();
                    parkedTruck.position.set(tx, 0, 22);
                    parkedTruck.rotation.y = Math.PI / 2;
                    
                    const cab = new THREE.Mesh(new THREE.BoxGeometry(4.0, 3.6, 2.8), new THREE.MeshStandardMaterial({ color: idx === 0 ? 0xd97706 : (idx === 1 ? 0x16a34a : 0xdc2626) }));
                    cab.position.set(4, 2.4, 0);
                    const chassis = new THREE.Mesh(new THREE.BoxGeometry(14, 0.7, 2.6), new THREE.MeshStandardMaterial({ color: 0x1e293b }));
                    chassis.position.set(-1, 1.0, 0);
                    parkedTruck.add(cab, chassis);
                    this.scene.add(parkedTruck);
                });

                // Container Cargo Ship (Sandar di Dermaga)
                this.buildCargoShip();

                // Ship-to-Shore (STS) Quay Crane
                this.buildQuayCrane();

                // 10. PLB MODERN HIGH-BAY LOGISTICS WAREHOUSE
                // Gudang dijauhkan dari area putar agar truck punya ruang manuver.
                const whGroup = new THREE.Group();
                whGroup.position.set(94, 0, -4);

                const whWidth = 46;
                const whHeight = 22;
                const whDepth = 42;
                const wallMat = new THREE.MeshStandardMaterial({
                    color: 0x1e293b,
                    roughness: 0.68,
                    metalness: 0.08
                });
                const roofMat = new THREE.MeshStandardMaterial({
                    color: 0x0b1220,
                    roughness: 0.55,
                    metalness: 0.18
                });
                const doorMat = new THREE.MeshStandardMaterial({
                    color: 0x475569,
                    roughness: 0.35,
                    metalness: 0.55
                });

                // Lantai solid
                const whFloor = new THREE.Mesh(
                    new THREE.BoxGeometry(whWidth, 0.35, whDepth),
                    new THREE.MeshStandardMaterial({ color: 0x293241, roughness: 0.85 })
                );
                whFloor.position.set(0, 0.18, 0);
                whGroup.add(whFloor);

                const frontX = -whWidth / 2;
                const frontDoorW = 14;

                // Dinding depan solid dengan bukaan pintu besar.
                const frontWallTop = new THREE.Mesh(
                    new THREE.BoxGeometry(1.0, 7.5, whDepth), wallMat
                );
                frontWallTop.position.set(frontX, 18.25, 0);

                const frontWallBottom = new THREE.Mesh(
                    new THREE.BoxGeometry(1.0, 1.5, whDepth), wallMat
                );
                frontWallBottom.position.set(frontX, 0.75, 0);

                const frontWallLeft = new THREE.Mesh(
                    new THREE.BoxGeometry(1.0, 9.0, (whDepth - frontDoorW) / 2), wallMat
                );
                frontWallLeft.position.set(frontX, 9.0, -(whDepth + frontDoorW) / 4);

                const frontWallRight = frontWallLeft.clone();
                frontWallRight.position.z = (whDepth + frontDoorW) / 4;

                whGroup.add(frontWallTop, frontWallBottom, frontWallLeft, frontWallRight);

                // Dinding belakang solid.
                const backWall = new THREE.Mesh(
                    new THREE.BoxGeometry(1.0, whHeight, whDepth), wallMat
                );
                backWall.position.set(whWidth / 2, 11, 0);

                // Dinding samping kiri solid.
                const sideWallL = new THREE.Mesh(
                    new THREE.BoxGeometry(whWidth, whHeight, 1.0), wallMat
                );
                sideWallL.position.set(0, 11, -whDepth / 2);

                // Dinding samping kanan dibuat dengan bukaan pintu kecil.
                const smallDoorW = 2.8;
                const smallDoorH = 5.5;
                const sideBottom = new THREE.Mesh(
                    new THREE.BoxGeometry(whWidth, 1.0, 1.0), wallMat
                );
                sideBottom.position.set(0, 0.5, whDepth / 2);

                const sideTop = new THREE.Mesh(
                    new THREE.BoxGeometry(whWidth, whHeight - smallDoorH - 1.0, 1.0), wallMat
                );
                sideTop.position.set(0, 1.0 + smallDoorH + (whHeight - smallDoorH - 1.0) / 2, whDepth / 2);

                const sideLeft = new THREE.Mesh(
                    new THREE.BoxGeometry((whWidth - smallDoorW) / 2, smallDoorH, 1.0), wallMat
                );
                sideLeft.position.set(-(whWidth + smallDoorW) / 4, 1.0 + smallDoorH / 2, whDepth / 2);

                const sideRight = sideLeft.clone();
                sideRight.position.x = (whWidth + smallDoorW) / 4;

                whGroup.add(backWall, sideWallL, sideBottom, sideTop, sideLeft, sideRight);

                // Trim frame di sisi pintu kecil untuk menutup celah visual di tepi bukaan.
                const smallFrameMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.5, roughness: 0.4 });
                const frameTop = new THREE.Mesh(new THREE.BoxGeometry(smallDoorW + 0.5, 0.22, 0.22), smallFrameMat);
                frameTop.position.set(0, 1.0 + smallDoorH + 0.12, whDepth / 2 + 0.12);
                const frameL = new THREE.Mesh(new THREE.BoxGeometry(0.22, smallDoorH + 0.35, 0.22), smallFrameMat);
                frameL.position.set(-(smallDoorW / 2 + 0.12), 1.0 + smallDoorH / 2, whDepth / 2 + 0.12);
                const frameR = frameL.clone();
                frameR.position.x = smallDoorW / 2 + 0.12;
                whGroup.add(frameTop, frameL, frameR);

                // Atap solid.
                const roof = new THREE.Mesh(
                    new THREE.BoxGeometry(whWidth + 2, 1.8, whDepth + 2), roofMat
                );
                roof.position.set(0, 22.5, 0);
                whGroup.add(roof);

                // Pintu besar rolling door.
                this.warehouseDoorLarge = new THREE.Group();
                this.warehouseDoorLarge.position.set(frontX - 0.55, 1.5, 0);

                // Satu daun pintu solid; semua detail menempel pada bidang pintu yang sama.
                const largeDoorPanel = new THREE.Mesh(
                    new THREE.BoxGeometry(0.22, 14, frontDoorW), doorMat
                );
                largeDoorPanel.castShadow = true;
                largeDoorPanel.receiveShadow = true;
                this.warehouseDoorLarge.add(largeDoorPanel);

                const doorRibMat = new THREE.MeshStandardMaterial({
                    color: 0x94a3b8, metalness: 0.5, roughness: 0.45
                });
                for (let y = -5.5; y <= 5.5; y += 1.5) {
                    const rib = new THREE.Mesh(
                        new THREE.BoxGeometry(0.06, 0.10, frontDoorW - 0.7),
                        doorRibMat
                    );
                    rib.position.set(-0.13, y, 0);
                    this.warehouseDoorLarge.add(rib);
                }
                whGroup.add(this.warehouseDoorLarge);

                // Pintu kecil personel pada dinding samping kanan.
                this.warehouseDoorSmall = new THREE.Group();
                this.warehouseDoorSmall.position.set(-8, 3.0, whDepth / 2 + 0.55);

                const smallDoor = new THREE.Mesh(
                    new THREE.BoxGeometry(2.8, 5.5, 0.24),
                    new THREE.MeshStandardMaterial({
                        color: 0x0f766e,
                        metalness: 0.45,
                        roughness: 0.35
                    })
                );
                smallDoor.castShadow = true;
                this.warehouseDoorSmall.add(smallDoor);
                whGroup.add(this.warehouseDoorSmall);

                // Kanopi loading dock.
                const canopy = new THREE.Mesh(
                    new THREE.BoxGeometry(3.0, 0.5, 18), roofMat
                );
                canopy.position.set(frontX - 1.5, 15.2, 0);
                whGroup.add(canopy);

                // Lampu loading dock.
                const dockLightMat = new THREE.MeshBasicMaterial({ color: 0xfef08a });
                [-6, 0, 6].forEach(z => {
                    const lamp = new THREE.Mesh(
                        new THREE.BoxGeometry(0.5, 0.15, 1.0), dockLightMat
                    );
                    lamp.position.set(frontX - 2.7, 14.9, z);
                    whGroup.add(lamp);
                });

                // Signage.
                const signPlb = new THREE.Mesh(
                    new THREE.BoxGeometry(0.25, 2.6, 18),
                    new THREE.MeshStandardMaterial({
                        color: 0x2563eb,
                        metalness: 0.25,
                        roughness: 0.35
                    })
                );
                signPlb.position.set(frontX - 0.2, 18.5, -13);
                whGroup.add(signPlb);

                // Kolom fasad.
                for (let z = -17; z <= 17; z += 4) {
                    const column = new THREE.Mesh(
                        new THREE.BoxGeometry(0.35, 21, 0.35),
                        new THREE.MeshStandardMaterial({
                            color: 0x334155,
                            metalness: 0.4,
                            roughness: 0.45
                        })
                    );
                    column.position.set(frontX - 0.35, 10.5, z);
                    whGroup.add(column);
                }

                // Ventilasi atas.
                for (let z = -14; z <= 14; z += 7) {
                    const vent = new THREE.Mesh(
                        new THREE.BoxGeometry(0.18, 1.3, 4.0),
                        new THREE.MeshStandardMaterial({
                            color: 0x0f172a,
                            metalness: 0.7,
                            roughness: 0.3
                        })
                    );
                    vent.position.set(frontX - 0.45, 16.2, z);
                    whGroup.add(vent);
                }

                // Detail struktur tambahan: panel dinding, jendela kantor, talang, ventilator,
                // dock bumper, railing, bollard, dan lampu. Semua menempel rapat ke bangunan.
                const panelMat = new THREE.MeshStandardMaterial({
                    color: 0x334155,
                    roughness: 0.58,
                    metalness: 0.12
                });
                const trimMat = new THREE.MeshStandardMaterial({
                    color: 0x64748b,
                    roughness: 0.38,
                    metalness: 0.5
                });
                const glassMatWh = new THREE.MeshStandardMaterial({
                    color: 0x0ea5e9,
                    roughness: 0.08,
                    metalness: 0.82
                });

                // Horizontal wall cladding.
                for (let y = 3.0; y <= 18.5; y += 2.2) {
                    const band = new THREE.Mesh(
                        new THREE.BoxGeometry(0.16, 0.14, whDepth - 1.2),
                        trimMat
                    );
                    band.position.set(frontX - 0.58, y, 0);
                    whGroup.add(band);
                }

                // Window strip / office glazing di fasad depan.
                [-16, -11, 11, 16].forEach(z => {
                    const winFrame = new THREE.Mesh(
                        new THREE.BoxGeometry(0.20, 3.0, 3.8),
                        trimMat
                    );
                    winFrame.position.set(frontX - 0.62, 12.2, z);
                    whGroup.add(winFrame);

                    const glass = new THREE.Mesh(
                        new THREE.BoxGeometry(0.08, 2.35, 3.1),
                        glassMatWh
                    );
                    glass.position.set(frontX - 0.74, 12.2, z);
                    whGroup.add(glass);
                });

                // Roof ventilators.
                [-14, -7, 0, 7, 14].forEach(z => {
                    const ventBase = new THREE.Mesh(
                        new THREE.BoxGeometry(3.4, 0.35, 2.0),
                        trimMat
                    );
                    ventBase.position.set(5, 23.45, z);
                    whGroup.add(ventBase);

                    const ventCap = new THREE.Mesh(
                        new THREE.BoxGeometry(2.8, 1.0, 1.5),
                        roofMat
                    );
                    ventCap.position.set(5, 24.0, z);
                    whGroup.add(ventCap);
                });

                // Downpipes at corners.
                [-19, 19].forEach(z => {
                    const pipe = new THREE.Mesh(
                        new THREE.CylinderGeometry(0.10, 0.10, 21, 10),
                        trimMat
                    );
                    pipe.position.set(frontX - 0.78, 10.5, z);
                    whGroup.add(pipe);
                });

                // Loading dock bumpers and wheel guides.
                [-6.5, 0, 6.5].forEach(z => {
                    const bumper = new THREE.Mesh(
                        new THREE.BoxGeometry(0.45, 1.2, 0.65),
                        new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.85 })
                    );
                    bumper.position.set(frontX - 2.0, 0.7, z);
                    whGroup.add(bumper);
                });

                // Safety railing di sisi pintu kecil.
                const railMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.5, roughness: 0.35 });
                [-10, -6, -2].forEach(z => {
                    const post = new THREE.Mesh(
                        new THREE.CylinderGeometry(0.07, 0.07, 1.15, 8),
                        railMat
                    );
                    post.position.set(-8, 0.58, whDepth / 2 + 1.0 + z * 0.0);
                    post.position.z = whDepth / 2 + 1.0;
                    post.position.x = z;
                    whGroup.add(post);
                });
                const rail = new THREE.Mesh(
                    new THREE.BoxGeometry(8, 0.10, 0.10),
                    railMat
                );
                rail.position.set(-6, 1.05, whDepth / 2 + 1.0);
                whGroup.add(rail);

                // Bollards around dock.
                [-18, -12, 12, 18].forEach(z => {
                    const bollard = new THREE.Mesh(
                        new THREE.CylinderGeometry(0.22, 0.22, 1.1, 12),
                        new THREE.MeshStandardMaterial({ color: 0xfacc15, metalness: 0.35, roughness: 0.45 })
                    );
                    bollard.position.set(frontX - 2.7, 0.55, z);
                    whGroup.add(bollard);
                });

                // ===== DETAIL GUDANG PELABUHAN — FACADE & OPERASIONAL =====
                // Loading bay markers, dock shelters, safety bollards, CCTV, lampu,
                // fire equipment, signage dan utilitas luar agar gudang terasa aktif.
                const whDetailDark = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.72, metalness: 0.15 });
                const whDetailSteel = new THREE.MeshStandardMaterial({ color: 0x64748b, roughness: 0.32, metalness: 0.7 });
                const whSafetyYellow = new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.4, metalness: 0.2 });
                const whSafetyRed = new THREE.MeshStandardMaterial({ color: 0xdc2626, roughness: 0.42, metalness: 0.2 });
                const whGlass = new THREE.MeshStandardMaterial({ color: 0x075985, roughness: 0.12, metalness: 0.8 });

                // 3 sectional loading-bay portals on the service facade.
                [-15, 0, 15].forEach((z, i) => {
                    const bayFrame = new THREE.Group();
                    const bw = i === 1 ? 15.2 : 9.2;
                    const bh = 10.2;
                    const sideL = new THREE.Mesh(new THREE.BoxGeometry(0.32, bh, 0.32), whDetailSteel);
                    const sideR = sideL.clone();
                    sideL.position.set(frontX - 0.82, 5.1, z - bw/2);
                    sideR.position.set(frontX - 0.82, 5.1, z + bw/2);
                    const header = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.32, bw + 0.65), whSafetyYellow);
                    header.position.set(frontX - 0.82, 10.2, z);
                    bayFrame.add(sideL, sideR, header);
                    whGroup.add(bayFrame);

                    // Dock shelter cushions / rubber seals.
                    [-1,1].forEach(side => {
                        const seal = new THREE.Mesh(new THREE.BoxGeometry(0.28, 7.2, 0.55), whDetailDark);
                        seal.position.set(frontX - 1.02, 4.0, z + side*(bw/2 - 0.35));
                        whGroup.add(seal);
                    });

                    // Bay number plaque.
                    const plaque = new THREE.Mesh(new THREE.BoxGeometry(0.18, 1.15, 1.8), whDetailDark);
                    plaque.position.set(frontX - 1.02, 11.15, z);
                    whGroup.add(plaque);
                });

                // Industrial hazard stripes on the base of the loading facade.
                for (let z = -20; z <= 20; z += 2.2) {
                    const stripe = new THREE.Mesh(new THREE.BoxGeometry(0.10, 0.16, 1.15), whSafetyYellow);
                    stripe.rotation.x = 0;
                    stripe.position.set(frontX - 0.68, 0.18, z);
                    whGroup.add(stripe);
                }

                // High-mounted exterior LED floodlights.
                [-17, -8, 0, 8, 17].forEach(z => {
                    const arm = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.18, 1.0), whDetailSteel);
                    arm.position.set(frontX - 0.72, 19.8, z);
                    const lamp = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.42, 0.75), new THREE.MeshBasicMaterial({color:0xfff7cc}));
                    lamp.position.set(frontX - 1.18, 19.45, z);
                    whGroup.add(arm, lamp);
                });

                // CCTV cameras under the eaves.
                [-18, 18].forEach(z => {
                    const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.06,0.06,1.0,8), whDetailSteel);
                    mast.position.set(frontX - 0.9, 18.9, z);
                    const cam = new THREE.Mesh(new THREE.BoxGeometry(0.65,0.38,0.42), whDetailDark);
                    cam.position.set(frontX - 1.22, 18.45, z);
                    cam.rotation.z = -0.18;
                    whGroup.add(mast, cam);
                });

                // Emergency exit door + red/green safety indicator on the side-facing facade.
                const exitFrame = new THREE.Mesh(new THREE.BoxGeometry(0.25, 5.8, 3.5), whDetailSteel);
                exitFrame.position.set(0, 3.4, whDepth/2 + 0.58);
                const exitDoor = new THREE.Mesh(new THREE.BoxGeometry(0.18, 5.2, 2.9), new THREE.MeshStandardMaterial({color:0x14532d,metalness:0.35,roughness:0.45}));
                exitDoor.position.set(0, 3.35, whDepth/2 + 0.72);
                const exitLamp = new THREE.Mesh(new THREE.BoxGeometry(0.12,0.32,1.0), new THREE.MeshBasicMaterial({color:0x22c55e}));
                exitLamp.position.set(0, 6.45, whDepth/2 + 0.72);
                whGroup.add(exitFrame, exitDoor, exitLamp);

                // Fire hose cabinet and extinguisher points.
                [-17, 17].forEach(z => {
                    const cabinet = new THREE.Mesh(new THREE.BoxGeometry(0.30, 1.7, 1.2), whSafetyRed);
                    cabinet.position.set(frontX - 0.88, 2.1, z);
                    const window = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.8, 0.65), whGlass);
                    window.position.set(frontX - 1.06, 2.25, z);
                    whGroup.add(cabinet, window);
                });

                // Roof HVAC / exhaust units with short ducts.
                [-12, 0, 12].forEach(z => {
                    const hvac = new THREE.Mesh(new THREE.BoxGeometry(4.5, 1.0, 3.0), whDetailSteel);
                    hvac.position.set(-2, 23.55, z);
                    const duct = new THREE.Mesh(new THREE.CylinderGeometry(0.48,0.48,1.8,12), whDetailDark);
                    duct.position.set(-2, 24.8, z);
                    whGroup.add(hvac, duct);
                });

                // Simple PLB sign plate: geometry-only, no external font/asset.
                const signPlate = new THREE.Mesh(new THREE.BoxGeometry(0.28, 3.2, 12), new THREE.MeshStandardMaterial({color:0x0b3b69,metalness:0.45,roughness:0.3}));
                signPlate.position.set(frontX - 0.82, 19.1, 0);
                whGroup.add(signPlate);

                // Guard rail di depan pintu besar DIHAPUS.
                // Area ini harus tetap terbuka agar kendaraan/truk dapat masuk langsung
                // ke loading bay tanpa terhalang pagar pedestrian.


                // ===== DETAIL INDUSTRIAL WAREHOUSE / PORT TERMINAL =====
                // Detail tambahan dibuat modular agar tidak mengganggu sistem pintu existing.
                const whSteel = new THREE.MeshStandardMaterial({ color: 0x64748b, metalness: 0.72, roughness: 0.28 });
                const whDark = new THREE.MeshStandardMaterial({ color: 0x111827, metalness: 0.45, roughness: 0.48 });
                const whYellow = new THREE.MeshStandardMaterial({ color: 0xfacc15, metalness: 0.25, roughness: 0.4 });
                const whRed = new THREE.MeshStandardMaterial({ color: 0xdc2626, metalness: 0.3, roughness: 0.4 });
                const whGreen = new THREE.MeshStandardMaterial({ color: 0x16a34a, metalness: 0.25, roughness: 0.35 });
                const whWhite = new THREE.MeshStandardMaterial({ color: 0xe5e7eb, roughness: 0.72 });
                const whGlassDetail = new THREE.MeshStandardMaterial({ color: 0x0b3558, roughness: 0.12, metalness: 0.78 });

                const addWhBox = (sx, sy, sz, mat, x, y, z, cast = true) => {
                    const m = new THREE.Mesh(new THREE.BoxGeometry(sx, sy, sz), mat);
                    m.position.set(x, y, z);
                    m.castShadow = cast;
                    m.receiveShadow = true;
                    whGroup.add(m);
                    return m;
                };
                const addWhCylinder = (r1, r2, h, mat, x, y, z, seg = 12, rotX = 0, rotZ = 0) => {
                    const m = new THREE.Mesh(new THREE.CylinderGeometry(r1, r2, h, seg), mat);
                    m.position.set(x, y, z);
                    m.rotation.x = rotX;
                    m.rotation.z = rotZ;
                    m.castShadow = true;
                    m.receiveShadow = true;
                    whGroup.add(m);
                    return m;
                };

                // 1) Portal frame / structural bay di sekitar pintu besar.
                [-9.0, 9.0].forEach(z => {
                    addWhBox(0.48, 16.5, 0.48, whSteel, frontX - 0.92, 8.8, z);
                    addWhBox(0.62, 0.48, 0.62, whYellow, frontX - 1.05, 1.0, z);
                });
                addWhBox(0.48, 0.48, 18.8, whSteel, frontX - 0.92, 17.0, 0);

                // 2) Dock shelter / karet seal kiri-kanan pintu.
                [-6.7, 6.7].forEach(z => {
                    addWhBox(0.55, 7.0, 0.32, whDark, frontX - 1.02, 5.4, z);
                    for (let yy = 2.5; yy <= 8.2; yy += 1.15) {
                        addWhBox(0.10, 0.82, 0.44, whDark, frontX - 1.28, yy, z);
                    }
                });
                addWhBox(0.55, 0.35, 14.4, whDark, frontX - 1.02, 9.15, 0);

                // 3) Industrial lamp fixtures di atas loading bay.
                [-7, -2.3, 2.3, 7].forEach(z => {
                    addWhBox(0.18, 0.18, 0.95, whDark, frontX - 2.9, 15.0, z);
                    addWhBox(0.12, 0.08, 0.65, new THREE.MeshBasicMaterial({ color: 0xfff7c2 }), frontX - 3.0, 14.82, z);
                });

                // 4) Nomor bay sederhana pada facade (panel fisik, bukan text texture).
                [-9, 9].forEach(z => {
                    addWhBox(0.16, 1.45, 2.5, whWhite, frontX - 0.72, 12.6, z);
                    addWhBox(0.10, 1.05, 1.8, whDark, frontX - 0.82, 12.6, z);
                });

                // 5) Panel warna yang sebelumnya berada di sisi pintu besar dihapus.
                // Area fasad dibuat bersih agar bukaan/loading bay terlihat lebih natural.

                // 6) CCTV camera housings + brackets di sudut facade.
                [-19, 19].forEach(z => {
                    addWhBox(0.22, 0.22, 0.75, whDark, frontX - 0.75, 17.2, z);
                    addWhCylinder(0.18, 0.12, 0.42, whDark, frontX - 0.95, 16.85, z, 10, Math.PI / 2);
                });

                // 7) Pipa utilitas / fire main horizontal dan riser.
                addWhCylinder(0.13, 0.13, whDepth - 2.0, whRed, frontX - 0.82, 19.4, 0, 10, Math.PI / 2);
                [-17, 17].forEach(z => {
                    addWhCylinder(0.13, 0.13, 18.0, whRed, frontX - 0.82, 10.0, z, 10);
                });

                // 8) Bollard pelindung sudut bangunan.
                [-20.5, 20.5].forEach(z => {
                    addWhCylinder(0.28, 0.28, 1.35, whDark, frontX - 2.2, 0.68, z, 14);
                    addWhCylinder(0.30, 0.30, 0.12, whYellow, frontX - 2.2, 1.38, z, 14);
                });

                // 9) Interior high-bay: rak pallet yang hanya terlihat ketika pintu besar dibuka.
                const rackMat = new THREE.MeshStandardMaterial({ color: 0x92400e, metalness: 0.52, roughness: 0.36 });
                const palletMat = new THREE.MeshStandardMaterial({ color: 0x9a6b3d, roughness: 0.8 });
                const goodsMatA = new THREE.MeshStandardMaterial({ color: 0x2563eb, roughness: 0.62 });
                const goodsMatB = new THREE.MeshStandardMaterial({ color: 0x16a34a, roughness: 0.62 });

                [-11, -4, 4, 11].forEach(z => {
                    // Rack uprights
                    [-8.5, 8.5].forEach(x => {
                        addWhBox(0.28, 12.5, 0.28, rackMat, x, 6.8, z);
                    });
                    // Rack beams
                    [3.0, 6.3, 9.6].forEach(y => {
                        addWhBox(17.4, 0.24, 0.28, rackMat, 0, y, z);
                        addWhBox(0.28, 0.22, 0.28, palletMat, -4.7, y + 0.18, z);
                        addWhBox(0.28, 0.22, 0.28, palletMat, 4.7, y + 0.18, z);
                    });
                    // Simplified palletized cargo.
                    addWhBox(3.2, 1.35, 2.0, goodsMatA, -5.0, 3.9, z);
                    addWhBox(3.0, 1.35, 2.0, goodsMatB, 4.7, 7.2, z);
                });

                // 10) Forklift charging / service corner.
                addWhBox(3.6, 2.8, 2.4, whDark, 15.0, 1.55, -15.0);
                addWhBox(3.0, 1.5, 0.12, whYellow, 15.0, 3.0, -15.0);
                addWhBox(2.0, 0.75, 0.16, whGreen, 15.0, 3.42, -15.0);

                // 11) Roof exhaust stacks dan intake cowls.
                [-14, -5, 5, 14].forEach(z => {
                    addWhCylinder(0.42, 0.52, 1.9, whDark, 10.0, 24.7, z, 12);
                    addWhBox(1.35, 0.22, 0.85, whSteel, 10.0, 25.7, z);
                });

                // 12) Downlight kecil di bawah kanopi untuk memberi depth saat malam.
                [-6, 0, 6].forEach(z => {
                    const pl = new THREE.PointLight(0xfff1b3, 0.45, 10);
                    pl.position.set(frontX - 3.2, 14.2, z);
                    whGroup.add(pl);
                });

                this.scene.add(whGroup);

                // Container Yard Gantry Crane Loader (Alat Pemuat Kontainer di Area Gudang)
                this.buildYardGantryLoader();

                // Heavy Port Cargo Handling Equipment (HMC, Reach Stacker, Straddle Carrier, Forklift, Chassis)
                this.buildPortEquipment();
            },

            buildYardGantryLoader() {
                this.yardLoader = new THREE.Group();
                this.yardLoader.position.set(38, 0, 0);

                const craneMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, metalness: 0.6, roughness: 0.3 }); // Industrial Blue Crane
                const steelMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.85, roughness: 0.2 });

                // Rubber Tired Gantry (RTG) Pillars & Legs
                const leg1 = new THREE.Mesh(new THREE.BoxGeometry(1.2, 16, 1.2), craneMat); leg1.position.set(-6, 8, -6);
                const leg2 = new THREE.Mesh(new THREE.BoxGeometry(1.2, 16, 1.2), craneMat); leg2.position.set(6, 8, -6);
                const leg3 = new THREE.Mesh(new THREE.BoxGeometry(1.2, 16, 1.2), craneMat); leg3.position.set(-6, 8, 6);
                const leg4 = new THREE.Mesh(new THREE.BoxGeometry(1.2, 16, 1.2), craneMat); leg4.position.set(6, 8, 6);
                this.yardLoader.add(leg1, leg2, leg3, leg4);

                // Overhead Frame
                const topBeam1 = new THREE.Mesh(new THREE.BoxGeometry(14, 1.5, 1.4), craneMat); topBeam1.position.set(0, 16, -6);
                const topBeam2 = new THREE.Mesh(new THREE.BoxGeometry(14, 1.5, 1.4), craneMat); topBeam2.position.set(0, 16, 6);
                const crossBeam = new THREE.Mesh(new THREE.BoxGeometry(1.4, 1.5, 14), craneMat); crossBeam.position.set(0, 16.5, 0);
                this.yardLoader.add(topBeam1, topBeam2, crossBeam);

                // RTG Rubber Wheels on 4 corners
                const rtgWheelGeo = new THREE.CylinderGeometry(1.1, 1.1, 0.8, 16);
                const rtgTireMat = new THREE.MeshStandardMaterial({ color: 0x09090b });
                [-6, 6].forEach(rx => {
                    [-6, 6].forEach(rz => {
                        const rw = new THREE.Mesh(rtgWheelGeo, rtgTireMat);
                        rw.rotation.x = Math.PI / 2;
                        rw.position.set(rx, 1.1, rz);
                        this.yardLoader.add(rw);
                    });
                });

                // Spreader Hoist (Moving container gripper)
                this.yardSpreader = new THREE.Group();
                this.yardSpreader.position.set(0, 12, 0);

                const spreaderFrame = new THREE.Mesh(new THREE.BoxGeometry(11.6, 0.8, 3.4), steelMat);
                this.yardSpreader.add(spreaderFrame);

                // Staged Container held by Gantry Loader
                this.stageContainer = new THREE.Mesh(new THREE.BoxGeometry(11.4, 4.4, 3.3), new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.4, metalness: 0.3 }));
                this.stageContainer.position.set(0, -2.6, 0);
                this.stageContainer.castShadow = true;
                this.yardSpreader.add(this.stageContainer);

                this.yardLoader.add(this.yardSpreader);
                this.scene.add(this.yardLoader);
            },

            buildCargoShip() {
                this.shipGroup = new THREE.Group();
                this.shipGroup.position.set(-38, -0.5, -78);

                // ===== LOW-POLY CONTAINER SHIP HULL =====
                // Replaces the old rectangular blocks with a proper ship silhouette.
                // The profile is intentionally stylized so it stays consistent with
                // the low-poly look of the port while reading clearly as a vessel.
                const hullMat = new THREE.MeshStandardMaterial({
                    color: 0x991b1b,
                    roughness: 0.4,
                    metalness: 0.2
                });
                const hullShape = new THREE.Shape();
                hullShape.moveTo(-31, 0.6);
                hullShape.lineTo(24.5, 0.6);
                hullShape.lineTo(30.5, 0.15);
                hullShape.lineTo(29.5, -1.15);
                hullShape.lineTo(25.0, -2.9);
                hullShape.lineTo(18.0, -4.15);
                hullShape.lineTo(-19.5, -4.55);
                hullShape.lineTo(-26.5, -3.25);
                hullShape.lineTo(-30.0, -1.55);
                hullShape.lineTo(-31, 0.6);

                const hullGeo = new THREE.ExtrudeGeometry(hullShape, {
                    depth: 15.2,
                    bevelEnabled: true,
                    bevelThickness: 0.28,
                    bevelSize: 0.38,
                    bevelSegments: 1,
                    curveSegments: 1
                });
                hullGeo.translate(0, 0, -7.6);
                hullGeo.computeVertexNormals();
                const hull = new THREE.Mesh(hullGeo, hullMat);
                hull.castShadow = true;
                hull.receiveShadow = true;
                this.shipGroup.add(hull);

                // Thin deck cap keeps the container stacks sitting on a visible deck
                // instead of making the ship look like one giant red block.
                const deckMat = new THREE.MeshStandardMaterial({
                    color: 0x7f1d1d,
                    roughness: 0.5,
                    metalness: 0.18
                });
                const deck = new THREE.Mesh(new THREE.BoxGeometry(53.5, 0.55, 14.9), deckMat);
                deck.position.set(0.8, 0.78, 0);
                deck.castShadow = true;
                deck.receiveShadow = true;
                this.shipGroup.add(deck);

                // Dark lower keel follows the hull profile rather than using another
                // rectangular box, giving the ship a recognizable bottom silhouette.
                const keelShape = new THREE.Shape();
                keelShape.moveTo(-27.5, -1.25);
                keelShape.lineTo(27.5, -1.25);
                keelShape.lineTo(24.0, -2.85);
                keelShape.lineTo(18.0, -3.75);
                keelShape.lineTo(-19.5, -4.05);
                keelShape.lineTo(-25.5, -2.9);
                keelShape.lineTo(-27.5, -1.25);

                const keelGeo = new THREE.ExtrudeGeometry(keelShape, {
                    depth: 15.45,
                    bevelEnabled: false,
                    curveSegments: 1
                });
                keelGeo.translate(0, 0, -7.725);
                keelGeo.computeVertexNormals();
                const keel = new THREE.Mesh(
                    keelGeo,
                    new THREE.MeshStandardMaterial({ color: 0x090d16, roughness: 0.72, metalness: 0.08 })
                );
                keel.castShadow = true;
                this.shipGroup.add(keel);

                // Raised bow deck and stern lip add the final ship cues without
                // turning the model into a heavy high-detail asset.
                const bowDeck = new THREE.Mesh(
                    new THREE.BoxGeometry(7.0, 0.55, 12.6),
                    deckMat
                );
                bowDeck.position.set(-25.7, 1.02, 0);
                bowDeck.rotation.z = -0.035;
                this.shipGroup.add(bowDeck);

                const sternDeck = new THREE.Mesh(
                    new THREE.BoxGeometry(7.0, 0.55, 12.8),
                    deckMat
                );
                sternDeck.position.set(24.5, 1.02, 0);
                this.shipGroup.add(sternDeck);

                // Ship Deck Superstructure (Bridge & Navigation Mast)
                const cabin = new THREE.Mesh(new THREE.BoxGeometry(13, 11, 13), new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.3 }));
                cabin.position.set(22, 8, 0);
                cabin.castShadow = true;
                this.shipGroup.add(cabin);

                // Navigation Bridge Windows
                const glassMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, metalness: 0.9, roughness: 0.1 });
                const bridgeGlass = new THREE.Mesh(new THREE.BoxGeometry(13.2, 1.4, 11), glassMat);
                bridgeGlass.position.set(22, 11, 0);
                this.shipGroup.add(bridgeGlass);

                // Ship Funnel / Exhaust Stack
                const funnel = new THREE.Mesh(new THREE.CylinderGeometry(1.4, 1.6, 5, 12), new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.3 }));
                funnel.position.set(24, 15, 0);
                this.shipGroup.add(funnel);

                // Multi-tiered Container Stacks on Cargo Ship Deck
                const colors = [0x0284c7, 0x16a34a, 0xd97706, 0x4f46e5, 0xdc2626];
                for (let x = -24; x <= 10; x += 7.2) {
                    for (let z = -4.5; z <= 4.5; z += 4.5) {
                        for (let y = 0; y < 3; y++) {
                            const box = new THREE.Mesh(new THREE.BoxGeometry(6.6, 2.6, 3.8), new THREE.MeshStandardMaterial({ color: colors[Math.abs(Math.round(x + z + y)) % colors.length], roughness: 0.4 }));
                            box.position.set(x, 4.8 + y * 2.7, z);
                            box.castShadow = true;
                            box.receiveShadow = true;
                            this.shipGroup.add(box);
                        }
                    }
                }

                this.scene.add(this.shipGroup);

                // Kapal kedua ditempatkan tepat di bawah crane dermaga besar.
                // Kapal ini menjadi visual sumber container yang sedang diangkat.
                this.shipGroup2 = this.shipGroup.clone(true);
                this.shipGroup2.position.set(58, -0.5, -75);
                this.scene.add(this.shipGroup2);
            },

            buildQuayCrane() {
                this.craneGroup = new THREE.Group();
                this.craneGroup.position.set(58, 0, -38);

                const craneMat = new THREE.MeshStandardMaterial({ color: 0xeab308, metalness: 0.5, roughness: 0.3 }); // Port Yellow
                const steelMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.8, roughness: 0.2 });

                // Crane Leg Trusses
                const leg1 = new THREE.Mesh(new THREE.BoxGeometry(1.4, 25, 1.4), craneMat); leg1.position.set(-7, 12.5, -6);
                const leg2 = new THREE.Mesh(new THREE.BoxGeometry(1.4, 25, 1.4), craneMat); leg2.position.set(7, 12.5, -6);
                const leg3 = new THREE.Mesh(new THREE.BoxGeometry(1.4, 25, 1.4), craneMat); leg3.position.set(-7, 12.5, 6);
                const leg4 = new THREE.Mesh(new THREE.BoxGeometry(1.4, 25, 1.4), craneMat); leg4.position.set(7, 12.5, 6);
                this.craneGroup.add(leg1, leg2, leg3, leg4);

                // Extended Overhead Boom Arm (Extends over ship in ocean)
                const boom = new THREE.Mesh(new THREE.BoxGeometry(18, 2.5, 75), craneMat);
                boom.position.set(0, 25, -22);
                this.craneGroup.add(boom);

                // Crane Operator Cabin & Trolley
                const trolley = new THREE.Mesh(new THREE.BoxGeometry(4.5, 3.2, 4.5), new THREE.MeshStandardMaterial({ color: 0xf8fafc }));
                trolley.position.set(0, 22.5, -30);
                this.craneGroup.add(trolley);

                // Spreader Cable & Container Spreader Bar
                const cable1 = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 12, 6), steelMat);
                cable1.position.set(-1.8, 15, -30);
                const cable2 = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 12, 6), steelMat);
                cable2.position.set(1.8, 15, -30);
                const spreader = new THREE.Mesh(new THREE.BoxGeometry(7, 0.8, 3.2), steelMat);
                spreader.position.set(0, 9, -30);

                // Container merah yang sedang diangkat dari kapal kedua.
                const liftContainerMat = new THREE.MeshStandardMaterial({
                    color: 0xdc2626,
                    roughness: 0.4,
                    metalness: 0.15
                });
                const liftContainer = new THREE.Mesh(
                    new THREE.BoxGeometry(6.6, 3.2, 3.8),
                    liftContainerMat
                );
                liftContainer.position.set(0, 6.9, -30);
                liftContainer.castShadow = true;

                // Empat kabel pendek dari spreader menuju container agar terlihat tergantung.
                const liftCableMat = new THREE.MeshStandardMaterial({ color: 0x64748b, metalness: 0.8, roughness: 0.25 });
                [-2.6, 2.6].forEach(cx => {
                    [-1.25, 1.25].forEach(cz => {
                        const cable = new THREE.Mesh(
                            new THREE.CylinderGeometry(0.045, 0.045, 2.0, 6),
                            liftCableMat
                        );
                        cable.position.set(cx, 7.9, -30 + cz);
                        this.craneGroup.add(cable);
                    });
                });

                this.craneGroup.add(cable1, cable2, spreader, liftContainer);

                this.scene.add(this.craneGroup);
            },


            // ===== SECRET EASTER EGG: HIDDEN WEAPON =====
            buildWeaponEasterEgg() {
                const root = new THREE.Group();
                root.name = 'SECRET_WEAPON_EASTER_EGG';
                root.position.set(this.weaponWorldPos.x, 0.35, this.weaponWorldPos.z);

                // Small maintenance crate so the item feels intentionally hidden.
                const crateMat = new THREE.MeshStandardMaterial({
                    color: 0x334155, roughness: 0.7, metalness: 0.15
                });
                const crate = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.9, 1.2), crateMat);
                crate.position.y = 0.45;
                crate.castShadow = true;
                crate.receiveShadow = true;

                // Detailed fictional tactical carbine (game prop; not a real-world replica).
                const weapon = new THREE.Group();
                weapon.name = 'EASTER_EGG_RIFLE';
                const dark = new THREE.MeshStandardMaterial({ color: 0x151a20, roughness: 0.42, metalness: 0.72 });
                const polymer = new THREE.MeshStandardMaterial({ color: 0x242b33, roughness: 0.62, metalness: 0.28 });
                const steel = new THREE.MeshStandardMaterial({ color: 0x59636e, roughness: 0.28, metalness: 0.92 });
                const rubber = new THREE.MeshStandardMaterial({ color: 0x0b0d10, roughness: 0.9, metalness: 0.05 });
                const receiver = new THREE.Mesh(new THREE.BoxGeometry(1.18,0.30,0.42),dark); receiver.position.x=-0.05;
                const upper = new THREE.Mesh(new THREE.BoxGeometry(1.12,0.13,0.34),steel); upper.position.set(0,0.18,0);
                const handguard = new THREE.Mesh(new THREE.BoxGeometry(0.92,0.25,0.38),polymer); handguard.position.x=0.82;
                const barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.055,0.065,0.92,12),steel); barrel.rotation.z=Math.PI/2; barrel.position.x=1.52;
                const muzzle = new THREE.Mesh(new THREE.CylinderGeometry(0.085,0.075,0.18,12),dark); muzzle.rotation.z=Math.PI/2; muzzle.position.x=1.98;
                const stock = new THREE.Mesh(new THREE.BoxGeometry(0.62,0.27,0.34),polymer); stock.position.x=-0.86; stock.rotation.z=-0.06;
                const cheek = new THREE.Mesh(new THREE.BoxGeometry(0.32,0.10,0.30),polymer); cheek.position.set(-0.55,0.20,0);
                const grip = new THREE.Mesh(new THREE.BoxGeometry(0.24,0.60,0.26),rubber); grip.position.set(-0.18,-0.38,0); grip.rotation.z=-0.14;
                const magazine = new THREE.Mesh(new THREE.BoxGeometry(0.28,0.46,0.22),dark); magazine.position.set(0.10,-0.34,0); magazine.rotation.z=-0.16;
                const rearSight = new THREE.Mesh(new THREE.BoxGeometry(0.24,0.10,0.12),steel); rearSight.position.set(-0.18,0.30,0);
                const frontSight = new THREE.Mesh(new THREE.BoxGeometry(0.12,0.18,0.10),steel); frontSight.position.set(1.35,0.25,0);
                const selector = new THREE.Mesh(new THREE.BoxGeometry(0.12,0.06,0.05),steel); selector.position.set(-0.36,-0.02,0.23);
                weapon.add(receiver,upper,handguard,barrel,muzzle,stock,cheek,grip,magazine,rearSight,frontSight,selector);
                for(let i=0;i<6;i++){ const slot=new THREE.Mesh(new THREE.BoxGeometry(0.08,0.06,0.40),rubber); slot.position.set(0.43+i*0.15,0.04,0); weapon.add(slot); }
                weapon.rotation.y=Math.PI/2; weapon.rotation.z=-0.08; weapon.position.set(0,0.95,0);

                root.add(crate, weapon);
                this.weaponPickupGroup = root;
                this.weaponPickupGroup.userData.weaponMesh = weapon;
                this.scene.add(root);

                // Small floating "SECRET" marker, intentionally subtle.
                const marker = new THREE.Mesh(
                    new THREE.SphereGeometry(0.10, 8, 8),
                    new THREE.MeshBasicMaterial({ color: 0xf59e0b })
                );
                marker.position.set(0, 1.55, 0);
                root.add(marker);
            },

            createWeaponHud() {
                if (this.weaponHud) return;
                const hud = document.createElement('div');
                hud.id = 'weapon-hud';
                hud.style.cssText = [
                    'position:absolute','right:18px','top:78px','z-index:40',
                    'display:none','min-width:210px','padding:10px 14px',
                    'border:1px solid rgba(245,158,11,.45)',
                    'border-radius:14px','background:rgba(2,6,23,.90)',
                    'backdrop-filter:blur(8px)','color:white',
                    'font-family:Arial,sans-serif','box-shadow:0 12px 30px rgba(0,0,0,.35)'
                ].join(';');
                hud.innerHTML = `
                    <div style="font-size:10px;font-weight:900;letter-spacing:.14em;color:#fbbf24;">SECRET EASTER EGG</div>
                    <div style="font-size:14px;font-weight:900;margin-top:3px;">WEAPON EQUIPPED</div>
                    <div id="weapon-ammo" style="font-size:20px;font-weight:900;margin-top:5px;">∞ AMMO</div>
                    <div style="font-size:9px;color:#94a3b8;margin-top:4px;">LMB Tembak · G Buang · AMMO UNLIMITED</div>
                `;
                this.container.appendChild(hud);
                this.weaponHud = hud;
            },

            updateWeaponHud() {
                if (!this.weaponHud) return;
                const ammo = this.weaponHud.querySelector('#weapon-ammo');
                if (ammo) ammo.textContent = '∞ AMMO';
                this.weaponHud.style.display = this.weaponEquipped ? 'block' : 'none';

                let crosshair = document.getElementById('weapon-crosshair');
                if (!crosshair) {
                    crosshair = document.createElement('div');
                    crosshair.id = 'weapon-crosshair';
                    crosshair.innerHTML = '+';
                    crosshair.style.cssText = [
                        'position:absolute','left:50%','top:50%','transform:translate(-50%,-50%)',
                        'z-index:39','display:none','color:#fbbf24','font:900 22px Arial',
                        'text-shadow:0 0 8px #000','pointer-events:none'
                    ].join(';');
                    this.container.appendChild(crosshair);
                }
                crosshair.style.display = this.weaponEquipped ? 'block' : 'none';
            },

            equipWeapon() {
                if (this.weaponEquipped || !this.weaponPickupGroup || !this.avatarMesh) return;
                this.weaponEquipped = true;

                const weapon = this.weaponPickupGroup.userData.weaponMesh;
                if (!weapon) return;

                // Remove the pickup object from the world and attach the weapon to the avatar.
                this.weaponPickupGroup.remove(weapon);
                this.scene.remove(this.weaponPickupGroup);
                this.weaponPickupGroup = null;

                this.weaponGroup = weapon;

                // HOLD FIX:
                // Attach the weapon to the front of the character's torso/hand area.
                // The previous Z=-0.32 placed the rifle behind the avatar from the
                // normal third-person camera. Keep it in front and at hand height.
                this.avatarMesh.add(this.weaponGroup);
                this.weaponGroup.position.set(0.12, 1.08, 0.34);
                this.weaponGroup.rotation.set(-0.04, -Math.PI / 2, -0.12);
                this.weaponGroup.scale.setScalar(0.62);

                // Put both arms into a simple two-hand ready pose while equipped.
                if (this.avatarArm1) this.avatarArm1.rotation.set(-0.72, 0.0, 0.10);
                if (this.avatarArm2) this.avatarArm2.rotation.set(-0.95, 0.0, -0.10);

                // Muzzle point marker used only for visual flash.
                const flash = new THREE.Mesh(
                    new THREE.SphereGeometry(0.12, 8, 8),
                    new THREE.MeshBasicMaterial({ color: 0xfff7ae, transparent: true, opacity: 0 })
                );
                flash.position.set(0.0, 0.0, 1.05);
                this.weaponGroup.add(flash);
                this.weaponMuzzleFlash = flash;

                this.createWeaponHud();
                this.updateWeaponHud();

                if (app && app.log) app.log('EASTER EGG ditemukan: senjata rahasia berhasil diambil.', 'warning');
            },

            dropWeapon() {
                if (!this.weaponEquipped || !this.weaponGroup) return;
                if (this.weaponReloading) return;

                const worldWeapon = this.weaponGroup;
                const worldPos = new THREE.Vector3();
                this.weaponGroup.getWorldPosition(worldPos);

                this.avatarMesh.remove(this.weaponGroup);
                this.scene.add(this.weaponGroup);
                this.weaponGroup.position.set(this.avatarPos.x, 0.55, this.avatarPos.z);
                this.weaponGroup.rotation.set(0, this.avatarRot, 0);
                this.weaponGroup.scale.setScalar(0.72);

                // Rebuild the pickup wrapper around the dropped weapon.
                const pickup = new THREE.Group();
                pickup.name = 'SECRET_WEAPON_DROPPED';
                pickup.position.set(this.avatarPos.x, 0.15, this.avatarPos.z);
                pickup.userData.weaponMesh = this.weaponGroup;
                this.scene.remove(this.weaponGroup);
                pickup.add(this.weaponGroup);
                this.weaponGroup.position.set(0, 0.35, 0);
                this.scene.add(pickup);
                this.weaponPickupGroup = pickup;

                this.weaponGroup = null;
                this.weaponEquipped = false;
                this.weaponMuzzleFlash = null;
                if (this.avatarArm1) this.avatarArm1.rotation.set(0, 0, 0);
                if (this.avatarArm2) this.avatarArm2.rotation.set(0, 0, 0);
                this.updateWeaponHud();

                if (app && app.log) app.log('Senjata dibuang. Tekan [F] untuk mengambilnya kembali.', 'info');
            },

            reloadWeapon() {
                this.weaponAmmo = Infinity;
                this.weaponReserve = Infinity;
                this.weaponReloading = false;
                this.updateWeaponHud();
            },

            initWeaponAudio() {
                if (this.weaponAudioCtx) return this.weaponAudioCtx;
                const AudioCtx = window.AudioContext || window.webkitAudioContext;
                if (!AudioCtx) return null;
                try {
                    this.weaponAudioCtx = new AudioCtx();
                    return this.weaponAudioCtx;
                } catch (e) {
                    return null;
                }
            },

            playGunshotSound() {
                const ctx = this.initWeaponAudio();
                if (!ctx) return;
                if (ctx.state === 'suspended') ctx.resume().catch(() => {});

                const now = ctx.currentTime;

                // Short filtered noise burst = sharp "bang".
                const buffer = ctx.createBuffer(1, Math.floor(ctx.sampleRate * 0.16), ctx.sampleRate);
                const data = buffer.getChannelData(0);
                for (let i = 0; i < data.length; i++) {
                    const t = i / ctx.sampleRate;
                    const envelope = Math.max(0, 1 - t / 0.16);
                    data[i] = (Math.random() * 2 - 1) * envelope * envelope;
                }

                const noise = ctx.createBufferSource();
                noise.buffer = buffer;

                const filter = ctx.createBiquadFilter();
                filter.type = 'lowpass';
                filter.frequency.setValueAtTime(2600, now);
                filter.frequency.exponentialRampToValueAtTime(650, now + 0.12);

                const gain = ctx.createGain();
                gain.gain.setValueAtTime(0.0001, now);
                gain.gain.exponentialRampToValueAtTime(0.9, now + 0.006);
                gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.14);

                noise.connect(filter);
                filter.connect(gain);
                gain.connect(ctx.destination);
                noise.start(now);
                noise.stop(now + 0.16);

                // Tiny low-frequency punch to make the shot feel less like static.
                const thump = ctx.createOscillator();
                const thumpGain = ctx.createGain();
                thump.type = 'sine';
                thump.frequency.setValueAtTime(115, now);
                thump.frequency.exponentialRampToValueAtTime(55, now + 0.10);
                thumpGain.gain.setValueAtTime(0.0001, now);
                thumpGain.gain.exponentialRampToValueAtTime(0.42, now + 0.004);
                thumpGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.10);
                thump.connect(thumpGain);
                thumpGain.connect(ctx.destination);
                thump.start(now);
                thump.stop(now + 0.11);
            },

            startWeaponAutoFire() {
                if (this.weaponFiring || !this.weaponEquipped || this.weaponReloading || this.driveMode) return;
                this.weaponFiring = true;

                // Fire immediately so holding the button feels responsive.
                this.shootWeapon();

                this.weaponFireInterval = setInterval(() => {
                    if (!this.weaponFiring || !this.weaponEquipped || this.weaponReloading || this.driveMode) {
                        this.stopWeaponAutoFire();
                        return;
                    }
                    this.shootWeapon();
                }, this.weaponFireRateMs);
            },

            stopWeaponAutoFire() {
                this.weaponFiring = false;
                if (this.weaponFireInterval) {
                    clearInterval(this.weaponFireInterval);
                    this.weaponFireInterval = null;
                }
            },

            shootWeapon() {
                if (!this.weaponEquipped || this.weaponReloading) return;
                this.weaponAmmo = Infinity;
                this.weaponReserve = Infinity;
                this.updateWeaponHud();
                this.playGunshotSound();

                // Muzzle flash.
                if (this.weaponMuzzleFlash) {
                    this.weaponMuzzleFlash.material.opacity = 1;
                    setTimeout(() => {
                        if (this.weaponMuzzleFlash) this.weaponMuzzleFlash.material.opacity = 0;
                    }, 70);
                }

                // ACTUAL VISIBLE GAME PROJECTILE: a small glowing round shot travels
                // through the scene instead of a single-frame line that can be invisible.
                const start = new THREE.Vector3();
                if (this.weaponMuzzleFlash) this.weaponMuzzleFlash.getWorldPosition(start);
                else start.set(this.avatarPos.x, 1.2, this.avatarPos.z);

                const dir = new THREE.Vector3();
                this.camera.getWorldDirection(dir).normalize();

                const bulletMat = new THREE.MeshBasicMaterial({ color: 0xffd54a });
                const bullet = new THREE.Mesh(new THREE.SphereGeometry(0.10, 8, 8), bulletMat);
                bullet.position.copy(start);
                this.scene.add(bullet);

                // Bright short trail behind the projectile.
                const trailMat = new THREE.LineBasicMaterial({ color: 0xff9f1a, transparent: true, opacity: 0.9 });
                const trailGeo = new THREE.BufferGeometry().setFromPoints([start.clone(), start.clone()]);
                const trail = new THREE.Line(trailGeo, trailMat);
                this.scene.add(trail);

                this.weaponProjectiles.push({
                    mesh: bullet,
                    trail,
                    velocity: dir.multiplyScalar(1.35),
                    life: 0,
                    maxLife: 48
                });

                // Small camera-independent recoil for clear feedback.
                if (this.weaponGroup) {
                    const z0 = this.weaponGroup.position.z;
                    this.weaponGroup.position.z = z0 - 0.035;
                    setTimeout(() => {
                        if (this.weaponGroup) this.weaponGroup.position.z = z0;
                    }, 55);
                }

            },

            checkWeaponPickup() {
                if (!this.weaponPickupGroup || this.weaponEquipped) return false;
                const dx = this.avatarPos.x - this.weaponPickupGroup.position.x;
                const dz = this.avatarPos.z - this.weaponPickupGroup.position.z;
                return Math.hypot(dx, dz) < 3.2;
            },

            buildContainerStacks() {
                // Realistic Stacks of Multi-Color Shipping Containers positioned cleanly away from traffic lanes
                const containerColors = [0x0284c7, 0xd97706, 0x16a34a, 0x9333ea, 0x475569, 0xdc2626];
                const cGeo = new THREE.BoxGeometry(9.2, 3.9, 3.4);

                const spawnStack = (startX, startZ, countX, countY, countZ) => {
                    for (let x = 0; x < countX; x++) {
                        for (let y = 0; y < countY; y++) {
                            for (let z = 0; z < countZ; z++) {
                                const col = containerColors[(x * 3 + y * 2 + z) % containerColors.length];
                                const cx = startX + x * 9.8;
                                const cy = 1.95 + y * 4.0;
                                const cz = startZ + z * 3.7;
                                const cMat = new THREE.MeshStandardMaterial({ color: col, roughness: 0.5, metalness: 0.25 });
                                const cMesh = new THREE.Mesh(cGeo, cMat);
                                cMesh.position.set(cx, cy, cz);
                                cMesh.castShadow = true;
                                cMesh.receiveShadow = true;
                                this.scene.add(cMesh);

                                // Corrugated side ribs.
                                const ribMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.45, roughness: 0.5 });
                                for (let r = -3.5; r <= 3.5; r += 1.0) {
                                    const rib = new THREE.Mesh(new THREE.BoxGeometry(0.08, 3.35, 0.12), ribMat);
                                    rib.position.set(cx, cy, cz + r);
                                    this.scene.add(rib);
                                }

                                // Corner posts + locking gear.
                                const cornerMat = new THREE.MeshStandardMaterial({ color: 0xcbd5e1, metalness: 0.8, roughness: 0.25 });
                                [-4.35, 4.35].forEach(dx => {
                                    [-1.45, 1.45].forEach(dz => {
                                        const post = new THREE.Mesh(new THREE.BoxGeometry(0.14, 3.65, 0.14), cornerMat);
                                        post.position.set(cx + dx, cy, cz + dz);
                                        this.scene.add(post);
                                        const lock = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.18, 0.28), cornerMat);
                                        lock.position.set(cx + dx, cy + 1.86, cz + dz);
                                        this.scene.add(lock);
                                    });
                                });

                                // Small logistics ID plate.
                                const idPlate = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.55, 1.8), new THREE.MeshBasicMaterial({ color: 0xf8fafc }));
                                idPlate.position.set(cx + 4.64, cy, cz);
                                this.scene.add(idPlate);
                            }
                        }
                    }
                };

                // Yard stacks ditempatkan menjauh dari jalur utama.
                spawnStack(-60, 26, 4, 3, 3); // Left Yard Stack
                spawnStack(10, 26, 4, 3, 3);  // Right Yard Stack

                // Tiga unit kontainer lama/invalid di area tengah sengaja dihapus.
                // Area tengah sekarang menjadi ruang manuver dan akses kendaraan.
            },

            buildPortEquipment() {
                // 1. Harbour Mobile Crane (HMC) on Rubber Tires near Quay (Repositioned to Quay Apron Edge facing Sea)
                const hmcGroup = new THREE.Group();
                hmcGroup.position.set(82, 0, -40);
                const hmcBody = new THREE.Mesh(new THREE.BoxGeometry(6, 4, 4.5), new THREE.MeshStandardMaterial({ color: 0xdc2626 })); hmcBody.position.y = 3;
                const hmcTower = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 1.2, 14, 12), new THREE.MeshStandardMaterial({ color: 0x1e293b })); hmcTower.position.set(0, 10, 0);
                const hmcBoom = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.5, 24, 8), new THREE.MeshStandardMaterial({ color: 0xdc2626 }));
                hmcBoom.rotation.x = -Math.PI / 3; hmcBoom.position.set(0, 16, -8);
                hmcGroup.add(hmcBody, hmcTower, hmcBoom);
                this.scene.add(hmcGroup);

                // 2. Reach Stacker (Kendaraan Lengan Teleskopik Pengangkat Kontainer)
                const rsGroup = new THREE.Group();
                rsGroup.position.set(-15, 0, 26);
                const rsBody = new THREE.Mesh(new THREE.BoxGeometry(5.5, 3.2, 3.2), new THREE.MeshStandardMaterial({ color: 0xeab308 })); rsBody.position.y = 2.2;
                const rsArm = new THREE.Mesh(new THREE.BoxGeometry(7.0, 0.8, 1.2), new THREE.MeshStandardMaterial({ color: 0x1e293b }));
                rsArm.rotation.z = -Math.PI / 6; rsArm.position.set(3, 4.5, 0);
                const rsSpreader = new THREE.Mesh(new THREE.BoxGeometry(4.5, 0.4, 2.8), new THREE.MeshStandardMaterial({ color: 0x090d16 })); rsSpreader.position.set(6, 3.0, 0);
                rsGroup.add(rsBody, rsArm, rsSpreader);
                this.scene.add(rsGroup);

                // 3. Straddle Carrier (Kendaraan Tinggi Pengangkut Kontainer)
                const scGroup = new THREE.Group();
                scGroup.position.set(78, 0, 28);
                const scMat = new THREE.MeshStandardMaterial({ color: 0x16a34a });
                const scLeg1 = new THREE.Mesh(new THREE.BoxGeometry(1.0, 12, 1.0), scMat); scLeg1.position.set(-3, 6, -3);
                const scLeg2 = new THREE.Mesh(new THREE.BoxGeometry(1.0, 12, 1.0), scMat); scLeg2.position.set(3, 6, -3);
                const scLeg3 = new THREE.Mesh(new THREE.BoxGeometry(1.0, 12, 1.0), scMat); scLeg3.position.set(-3, 6, 3);
                const scLeg4 = new THREE.Mesh(new THREE.BoxGeometry(1.0, 12, 1.0), scMat); scLeg4.position.set(3, 6, 3);
                const scTop = new THREE.Mesh(new THREE.BoxGeometry(8, 1.4, 7), scMat); scTop.position.set(0, 12, 0);
                scGroup.add(scLeg1, scLeg2, scLeg3, scLeg4, scTop);
                this.scene.add(scGroup);

                // 4. Forklift & Cargo Handler
                const fkGroup = new THREE.Group();
                fkGroup.position.set(-42, 0, -12);
                const fkBody = new THREE.Mesh(new THREE.BoxGeometry(2.6, 1.8, 1.6), new THREE.MeshStandardMaterial({ color: 0xf97316 })); fkBody.position.y = 1.2;
                const fkMast = new THREE.Mesh(new THREE.BoxGeometry(0.2, 3.2, 1.2), new THREE.MeshStandardMaterial({ color: 0x090d16 })); fkMast.position.set(1.4, 1.8, 0);
                const fkFork = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.1, 1.0), new THREE.MeshStandardMaterial({ color: 0x94a3b8 })); fkFork.position.set(2.2, 0.4, 0);
                fkGroup.add(fkBody, fkMast, fkFork);
                this.scene.add(fkGroup);

                // 5. Standby Terminal Chassis Trailer REMOVED.
                // Removed the unused rectangular chassis that was visually blocking
                // the Gate 02 outbound lane. Gate 02 now uses the road surface directly.
            },

            buildPortWorkers() {
                this.workers = [];

                const createWorker = (x, z, rotY, role = 'PORT', isWalker = false, walkPath = null) => {
                    const workerGroup = new THREE.Group();
                    workerGroup.position.set(x, 0, z);
                    workerGroup.rotation.y = rotY;

                    const vestColor = role === 'CUSTOMS' ? 0x1e3a8a : (role === 'SAFETY' ? 0x84cc16 : 0xf97316);
                    const helmetColor = role === 'CUSTOMS' ? 0x0f172a : (role === 'SAFETY' ? 0xffffff : 0xfacc15);

                    const legMat = new THREE.MeshStandardMaterial({ color: 0x1e293b });
                    const l1 = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.7, 0.25), legMat); l1.position.set(-0.12, 0.35, 0);
                    const l2 = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.7, 0.25), legMat); l2.position.set(0.12, 0.35, 0);
                    workerGroup.add(l1, l2);

                    const torso = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.75, 0.3), new THREE.MeshStandardMaterial({ color: vestColor }));
                    torso.position.set(0, 1.05, 0);
                    torso.castShadow = true;
                    workerGroup.add(torso);

                    const stripe = new THREE.Mesh(new THREE.BoxGeometry(0.52, 0.12, 0.32), new THREE.MeshBasicMaterial({ color: 0xffffff }));
                    stripe.position.set(0, 1.05, 0);
                    workerGroup.add(stripe);

                    const head = new THREE.Mesh(new THREE.SphereGeometry(0.18, 10, 10), new THREE.MeshStandardMaterial({ color: 0xfbcfe8, roughness: 0.4 }));
                    head.position.set(0, 1.6, 0);
                    workerGroup.add(head);

                    const helmet = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.26, 0.15, 12), new THREE.MeshStandardMaterial({ color: helmetColor, metalness: 0.3 }));
                    helmet.position.set(0, 1.76, 0);
                    const brim = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.32, 0.04, 12), new THREE.MeshStandardMaterial({ color: helmetColor }));
                    brim.position.set(0, 1.7, 0);
                    workerGroup.add(helmet, brim);

                    if (role === 'SAFETY' || role === 'PORT') {
                        const tablet = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.3, 0.04), new THREE.MeshStandardMaterial({ color: 0x0f172a }));
                        tablet.position.set(0.22, 1.05, 0.2);
                        tablet.rotation.x = -Math.PI / 4;
                        workerGroup.add(tablet);
                    }

                    this.scene.add(workerGroup);
                    this.workers.push({ group: workerGroup, leg1: l1, leg2: l2, isWalker, walkPath, basePos: { x, z } });
                };

                // Port Workers with Walking Animations & Stationary Duty Roles
                createWorker(-18, -12, 0, 'SAFETY', true, { minX: -25, maxX: -10, axis: 'x' }); // Patrol Marshall along Quay
                createWorker(-30, -12, Math.PI / 3, 'PORT', true, { minZ: -18, maxZ: -8, axis: 'z' }); // Dock Handler walking
                createWorker(12, 5.2, -Math.PI / 2, 'SAFETY'); // Traffic Safety Officer at Gate 01
                createWorker(38, 7.5, 0, 'PORT', true, { minX: 32, maxX: 44, axis: 'x' }); // Gantry Yard Operator walking
                createWorker(2, -23.5, Math.PI / 2, 'SAFETY'); // Customs Marshall at Outbound Gate 02
                createWorker(-55, 18, 0, 'PORT', true, { minZ: 12, maxZ: 26, axis: 'z' }); // Yard Inspector walking
            },

            buildPLBGate() {
                // Gate Gantry Overhead Beam & Heavy Steel Pillars (GATE 01 - INBOUND MAIN)
                const pillarMat = new THREE.MeshStandardMaterial({ color: 0x1e3a8a, metalness: 0.7, roughness: 0.25 });
                const pillarGeo = new THREE.BoxGeometry(1.6, 12, 1.6);

                const p1 = new THREE.Mesh(pillarGeo, pillarMat); p1.position.set(10, 6, -5.4);
                const p2 = new THREE.Mesh(pillarGeo, pillarMat); p2.position.set(10, 6, 5.4);
                p1.castShadow = true; p2.castShadow = true;
                this.scene.add(p1, p2);

                const gantryBeam = new THREE.Mesh(new THREE.BoxGeometry(2.0, 1.8, 12.4), pillarMat);
                gantryBeam.position.set(10, 11.2, 0);
                this.scene.add(gantryBeam);

                // LED Gate Banner "GATE 01 - INBOUND PLB"
                const banner = new THREE.Mesh(new THREE.BoxGeometry(0.2, 1.0, 8.0), new THREE.MeshBasicMaterial({ color: 0x38bdf8 }));
                banner.position.set(8.9, 11.2, 0);
                this.scene.add(banner);

                // Automatic Fixed RFID UHF Long-Range Antenna Array (3 Panel Arrays)
                const rfidMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.2 });
                [-2.5, 0, 2.5].forEach(rz => {
                    const rfidPanel = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.8, 1.6), rfidMat);
                    rfidPanel.position.set(10, 10.1, rz);
                    this.scene.add(rfidPanel);
                });

                // RFID Scanning Wave Mesh
                const waveGeo = new THREE.CylinderGeometry(0.4, 5.5, 9.5, 20, 1, true);
                const waveMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0, wireframe: true });
                this.scanWaveMesh = new THREE.Mesh(waveGeo, waveMat);
                this.scanWaveMesh.position.set(10, 5.5, 0);
                this.scene.add(this.scanWaveMesh);

                // Customs Guard Booth (Pos Jaga Bea Cukai Gate 01)
                const boothGroup = new THREE.Group();
                boothGroup.position.set(10, 0, 8.4);

                const booth = new THREE.Mesh(new THREE.BoxGeometry(4.0, 4.0, 4.0), new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.4 }));
                booth.position.y = 2.0;
                booth.castShadow = true;
                boothGroup.add(booth);

                const boothGlass = new THREE.Mesh(new THREE.BoxGeometry(2.4, 1.5, 0.1), new THREE.MeshStandardMaterial({ color: 0x0284c7, metalness: 0.9, roughness: 0.1 }));
                boothGlass.position.set(-0.6, 2.2, -2.05);
                boothGroup.add(boothGlass);

                const boothRoof = new THREE.Mesh(new THREE.BoxGeometry(4.6, 0.4, 4.6), new THREE.MeshStandardMaterial({ color: 0x0f172a }));
                boothRoof.position.y = 4.1;
                boothGroup.add(boothRoof);

                this.scene.add(boothGroup);

                // 3D Customs Officer Figure (Petugas Pemeriksa Pabean)
                this.officerGroup = new THREE.Group();
                this.officerGroup.position.set(8.2, 0, 5.2);

                const officerBody = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.44, 1.6, 12), new THREE.MeshStandardMaterial({ color: 0x1e3a8a, roughness: 0.5 }));
                officerBody.position.set(0, 1.4, 0);
                officerBody.castShadow = true;
                this.officerGroup.add(officerBody);

                const officerHead = new THREE.Mesh(new THREE.SphereGeometry(0.28, 12, 12), new THREE.MeshStandardMaterial({ color: 0xfbcfe8, roughness: 0.4 }));
                officerHead.position.set(0, 2.45, 0);
                this.officerGroup.add(officerHead);

                const officerCap = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 0.18, 12), new THREE.MeshStandardMaterial({ color: 0x0f172a }));
                officerCap.position.set(0, 2.68, 0);
                const capVisor = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.05, 0.25), new THREE.MeshStandardMaterial({ color: 0x000000 }));
                capVisor.position.set(-0.25, 2.62, 0);
                this.officerGroup.add(officerCap, capVisor);

                this.scene.add(this.officerGroup);

                // Automatic Boom Barrier Gate 01 Post
                const post1 = new THREE.Mesh(new THREE.BoxGeometry(0.9, 2.6, 0.9), new THREE.MeshStandardMaterial({ color: 0xf97316, roughness: 0.3 }));
                post1.position.set(11.2, 1.3, 4.4);
                this.scene.add(post1);

                this.gateBarrierBar = new THREE.Group();
                this.gateBarrierBar.position.set(11.2, 2.3, 4.4);

                const bar1 = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.3, 8.8), new THREE.MeshStandardMaterial({ color: 0xef4444, metalness: 0.2 }));
                bar1.position.set(0, 0, -4.4);
                bar1.castShadow = true;
                this.gateBarrierBar.add(bar1);

                for (let sz = -1.2; sz >= -7.6; sz -= 1.8) {
                    const stripe = new THREE.Mesh(new THREE.BoxGeometry(0.27, 0.32, 0.8), new THREE.MeshBasicMaterial({ color: 0xffffff }));
                    stripe.position.set(0, 0, sz);
                    this.gateBarrierBar.add(stripe);
                }

                this.scene.add(this.gateBarrierBar);

                // --- GATE 02: OUTBOUND EXIT GATE ---
                // Gate melintang jalur outbound: barrier berada pada X tetap,
                // sementara palang membentang di lebar jalan (sumbu Z).
                const pOut1 = new THREE.Mesh(pillarGeo, pillarMat);
                pOut1.position.set(-5.2, 6, -33.4);
                const pOut2 = new THREE.Mesh(pillarGeo, pillarMat);
                pOut2.position.set(-5.2, 6, -22.6);
                pOut1.castShadow = true;
                pOut2.castShadow = true;
                this.scene.add(pOut1, pOut2);

                const gantryBeamOut = new THREE.Mesh(
                    new THREE.BoxGeometry(1.8, 1.8, 12.4),
                    pillarMat
                );
                gantryBeamOut.position.set(-5.2, 11.2, -28);
                this.scene.add(gantryBeamOut);

                const bannerOut = new THREE.Mesh(
                    new THREE.BoxGeometry(0.2, 1.0, 8.0),
                    new THREE.MeshBasicMaterial({ color: 0x10b981 })
                );
                bannerOut.position.set(-4.25, 11.2, -28);
                this.scene.add(bannerOut);

                // Automatic Boom Barrier Gate 02 Post.
                const post2 = new THREE.Mesh(
                    new THREE.BoxGeometry(0.9, 2.6, 0.9),
                    new THREE.MeshStandardMaterial({ color: 0x10b981, roughness: 0.3 })
                );
                post2.position.set(-5.2, 1.3, -23.6);
                this.scene.add(post2);

                this.gateOutBarrierBar = new THREE.Group();
                this.gateOutBarrierBar.position.set(-5.2, 2.3, -23.6);

                const bar2 = new THREE.Mesh(
                    new THREE.BoxGeometry(0.25, 0.3, 9.8),
                    new THREE.MeshStandardMaterial({ color: 0xef4444, metalness: 0.2 })
                );
                bar2.position.set(0, 0, -4.9);
                bar2.castShadow = true;
                this.gateOutBarrierBar.add(bar2);

                for (let z = -1.0; z >= -8.8; z -= 2.0) {
                    const stripe = new THREE.Mesh(
                        new THREE.BoxGeometry(0.35, 0.34, 0.12),
                        new THREE.MeshBasicMaterial({ color: 0xffffff })
                    );
                    stripe.position.set(0, 0, z);
                    this.gateOutBarrierBar.add(stripe);
                }
                this.scene.add(this.gateOutBarrierBar);

                // Exit lights + bollards, ditempatkan di apron bersih tanpa alat berat.
                const exitLightMat = new THREE.MeshBasicMaterial({ color: 0x34d399 });
                [-19.8, -36.2].forEach(z => {
                    const bollard = new THREE.Mesh(
                        new THREE.CylinderGeometry(0.18, 0.22, 1.3, 12),
                        new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.6 })
                    );
                    bollard.position.set(-1.2, 0.65, z);
                    this.scene.add(bollard);

                    const lamp = new THREE.Mesh(
                        new THREE.SphereGeometry(0.16, 10, 10),
                        exitLightMat
                    );
                    lamp.position.set(-1.2, 1.35, z);
                    this.scene.add(lamp);
                });
            },

            setWarehouseLargeDoorOpen(isOpen) {
                if (!this.warehouseDoorLarge) return;
                this.warehouseDoorLarge.position.y = isOpen ? 15.5 : 1.5;
            },

            setWarehouseSmallDoorOpen(isOpen) {
                if (!this.warehouseDoorSmall) return;
                this.warehouseDoorSmall.rotation.y = isOpen ? -Math.PI / 2 : 0;
            },

            buildContainerTruck() {
                this.truckGroup = new THREE.Group();
                this.truckGroup.position.set(this.truckCurrentX, 0, 0);
                this.truckWheels = [];

                // Truck Cabin
                const cabMat = new THREE.MeshStandardMaterial({ color: 0x2563eb, metalness: 0.4, roughness: 0.3 });
                const cab = new THREE.Mesh(new THREE.BoxGeometry(5.0, 4.4, 3.4), cabMat);
                cab.position.set(6.0, 2.9, 0);
                cab.castShadow = true;
                this.truckGroup.add(cab);

                const deflector = new THREE.Mesh(new THREE.BoxGeometry(2.5, 1.0, 3.2), cabMat);
                deflector.position.set(5.0, 5.3, 0);
                this.truckGroup.add(deflector);

                const glassMat = new THREE.MeshStandardMaterial({ color: 0x090d16, roughness: 0.1, metalness: 0.9 });
                const glass = new THREE.Mesh(new THREE.BoxGeometry(1.2, 1.7, 3.2), glassMat);
                glass.position.set(7.8, 3.6, 0);
                this.truckGroup.add(glass);

                const sideGlass1 = new THREE.Mesh(new THREE.BoxGeometry(2.2, 1.4, 0.1), glassMat);
                sideGlass1.position.set(6.2, 3.6, 1.72);
                const sideGlass2 = new THREE.Mesh(new THREE.BoxGeometry(2.2, 1.4, 0.1), glassMat);
                sideGlass2.position.set(6.2, 3.6, -1.72);
                this.truckGroup.add(sideGlass1, sideGlass2);

                const grille = new THREE.Mesh(new THREE.BoxGeometry(0.2, 1.8, 2.4), new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.8, roughness: 0.2 }));
                grille.position.set(8.52, 2.0, 0);
                this.truckGroup.add(grille);

                const hlMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
                const hl1 = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.4, 0.6), hlMat);
                hl1.position.set(8.52, 1.5, 1.2);
                const hl2 = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.4, 0.6), hlMat);
                hl2.position.set(8.52, 1.5, -1.2);
                this.truckGroup.add(hl1, hl2);

                // Trailer Chassis
                const chassisMat = new THREE.MeshStandardMaterial({ color: 0x1f2937, metalness: 0.85, roughness: 0.3 });
                const chassis = new THREE.Mesh(new THREE.BoxGeometry(17, 0.8, 3.0), chassisMat);
                chassis.position.set(0.2, 1.15, 0);
                chassis.castShadow = true;
                this.truckGroup.add(chassis);

                const fuelTank = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.6, 3.2, 16), new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.9, roughness: 0.15 }));
                fuelTank.rotation.z = Math.PI / 2;
                fuelTank.position.set(3.8, 1.2, 1.6);
                this.truckGroup.add(fuelTank);

                // 8 Truck Wheels
                const wheelGeo = new THREE.CylinderGeometry(0.9, 0.9, 0.75, 18);
                const tireMat = new THREE.MeshStandardMaterial({ color: 0x09090b, roughness: 0.9 });
                const rimMat = new THREE.MeshStandardMaterial({ color: 0xcbd5e1, metalness: 0.9, roughness: 0.2 });

                [-5.8, -4.0, 4.2, 6.4].forEach(wx => {
                    [-1.65, 1.65].forEach(wz => {
                        const wheelGroup = new THREE.Group();
                        wheelGroup.position.set(wx, 0.9, wz);

                        const tire = new THREE.Mesh(wheelGeo, tireMat);
                        tire.rotation.x = Math.PI / 2;
                        tire.castShadow = true;

                        const rim = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 0.78, 12), rimMat);
                        rim.rotation.x = Math.PI / 2;

                        wheelGroup.add(tire, rim);
                        this.truckGroup.add(wheelGroup);
                        this.truckWheels.push(wheelGroup);
                    });
                });

                // Detachable 40ft Shipping Container on Trailer
                this.containerGroup = new THREE.Group();
                this.containerGroup.position.set(-2.2, 3.35, 0);

                const containerMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.4, metalness: 0.3 });
                this.containerMesh = new THREE.Mesh(new THREE.BoxGeometry(11.4, 4.4, 3.3), containerMat);
                this.containerMesh.castShadow = true;
                this.containerMesh.receiveShadow = true;
                this.containerGroup.add(this.containerMesh);

                const rodMat = new THREE.MeshStandardMaterial({ color: 0x64748b, metalness: 0.9 });
                [-0.8, 0.8].forEach(dz => {
                    const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 4.2, 8), rodMat);
                    rod.position.set(-5.72, 0, dz);
                    this.containerGroup.add(rod);
                });

                // E-Seal RFID IoT Smart Lock on Container Door
                this.esealGroup = new THREE.Group();
                this.esealGroup.position.set(-8.0, 3.2, 0.45);

                const body = new THREE.Mesh(new THREE.BoxGeometry(0.4, 1.1, 0.7), new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.25, metalness: 0.4 }));
                body.castShadow = true;
                this.esealGroup.add(body);

                const tagPlate = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.4, 0.5), new THREE.MeshBasicMaterial({ color: 0xffffff }));
                tagPlate.position.set(0, -0.2, 0);
                this.esealGroup.add(tagPlate);

                this.esealLed = new THREE.PointLight(0xef4444, 2.2, 5);
                this.esealLed.position.set(-0.3, 0.1, 0);
                const ledSphere = new THREE.Mesh(new THREE.SphereGeometry(0.1, 8, 8), new THREE.MeshBasicMaterial({ color: 0xef4444 }));
                ledSphere.position.set(-0.25, 0.1, 0);
                this.esealGroup.add(this.esealLed, ledSphere);

                const shackleGeo = new THREE.TorusGeometry(0.3, 0.06, 10, 20, Math.PI);
                this.esealShackle = new THREE.Mesh(shackleGeo, new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.95, roughness: 0.1 }));
                this.esealShackle.rotation.z = Math.PI;
                this.esealShackle.position.set(0, 0.55, 0);
                this.esealGroup.add(this.esealShackle);

                this.truckGroup.add(this.containerGroup);
                this.truckGroup.add(this.esealGroup);
                
                // Initially Empty Trailer (Container & E-seal hidden until loaded in Stage 2)
                this.setContainerLoaded(false);

                this.scene.add(this.truckGroup);

                // Truk operasional yang bisa dikendarai pemain.
                this.driveTruckGroup = this.truckGroup.clone(true);
                this.driveTruckGroup.position.set(this.driveTruckSpawn.x, 0, this.driveTruckSpawn.z);
                this.driveTruckGroup.rotation.y = Math.PI;
                this.driveTruckGroup.scale.setScalar(0.82);
                this.driveTruckGroup.traverse(obj => {
                    if (obj.isMesh) {
                        obj.castShadow = true;
                        obj.receiveShadow = true;
                    }
                });
                this.scene.add(this.driveTruckGroup);

                // Dedicated driving bay agar kendaraan interaktif mudah ditemukan.
                const drivePad = new THREE.Mesh(
                    new THREE.CylinderGeometry(5.5, 5.5, 0.12, 32),
                    new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.95 })
                );
                drivePad.position.set(this.driveTruckSpawn.x, 0.08, this.driveTruckSpawn.z);
                drivePad.receiveShadow = true;
                this.scene.add(drivePad);

                const driveRing = new THREE.Mesh(
                    new THREE.RingGeometry(4.2, 4.5, 32),
                    new THREE.MeshBasicMaterial({ color: 0x22c55e, side: THREE.DoubleSide })
                );
                driveRing.rotation.x = -Math.PI / 2;
                driveRing.position.set(this.driveTruckSpawn.x, 0.16, this.driveTruckSpawn.z);
                this.scene.add(driveRing);
            },

            setContainerLoaded(isLoaded) {
                if (this.containerGroup) this.containerGroup.visible = isLoaded;
                if (this.esealGroup) this.esealGroup.visible = isLoaded;
                if (this.stageContainer) this.stageContainer.visible = !isLoaded;
            },

            startContainerUnloadAnimation() {
                if (!this.yardSpreader || !this.stageContainer) return;
                this.containerUnloadAnimating = true;
                this.containerUnloadStart = performance.now();
                this.yardSpreader.position.y = 12;
                this.stageContainer.visible = true;
            },

            enterDriveMode() {
                if (!this.driveTruckGroup) return;
                this.driveMode = true;
                this.driveTruckRot = this.driveTruckGroup.rotation.y;
                this.driveTruckSpeed = 0;
                if (this.controls) this.controls.enabled = false;
                this.avatarMesh.visible = false;
                this.log('MODE DRIVE AKTIF — W/S maju-mundur, A/D belok, E keluar dari kendaraan.', 'info');
            },

            exitDriveMode() {
                if (!this.driveTruckGroup) return;
                this.driveMode = false;
                this.driveTruckSpeed = 0;
                if (this.controls) this.controls.enabled = true;
                this.avatarPos.x = this.driveTruckGroup.position.x;
                this.avatarPos.z = this.driveTruckGroup.position.z + 3;
                if (this.avatarMesh) {
                    this.avatarMesh.visible = true;
                    this.avatarMesh.position.set(this.avatarPos.x, this.avatarPosY, this.avatarPos.z);
                }
                this.log('Keluar dari truk. Mode jalan kaki kembali aktif.', 'system');
            },

            setTruckPosition(targetX, targetZ = 0, targetRotY = 0) {
                // Single destination: cancel any queued route.
                this.truckRoute = null;
                this.truckRouteIndex = 0;
                this.truckRouteCallback = null;
                this.truckTargetX = targetX;
                this.truckTargetZ = targetZ;
                this.truckTargetRotY = targetRotY;
            },

            setTruckRoute(points, callback = null) {
                // Waypoint-based movement: the truck physically reaches each point
                // before continuing, so turns are visible instead of looking like a teleport.
                this.truckRoute = Array.isArray(points) ? points.map(p => ({
                    x: p.x,
                    z: p.z,
                    rot: p.rot ?? this.truckCurrentRotY
                })) : [];
                this.truckRouteIndex = 0;
                this.truckRouteCallback = callback;
                if (this.truckRoute.length) {
                    const p = this.truckRoute[0];
                    this.truckTargetX = p.x;
                    this.truckTargetZ = p.z;
                    this.truckTargetRotY = p.rot;
                }
            },

            setBarrierGateOpen(isOpen) {
                this.gateAngleTarget = isOpen ? Math.PI / 2 : 0;
            },

            setOutboundBarrierOpen(isOpen) {
                this.gateOutAngleTarget = isOpen ? Math.PI / 2 : 0;
            },

            setEsealLockState(state) {
                if (!this.esealLed) return;
                if (state === 'LOCKED') {
                    this.esealLed.color.setHex(0xef4444);
                    this.esealUnlockedTarget = 0;
                } else if (state === 'UNLOCKED') {
                    this.esealLed.color.setHex(0x10b981);
                    this.esealUnlockedTarget = 0.65;
                } else if (state === 'TAMPER') {
                    this.esealLed.color.setHex(0xff0000);
                    this.esealUnlockedTarget = 0.85;
                } else {
                    this.esealLed.color.setHex(0x64748b);
                    this.esealUnlockedTarget = 0;
                }
            },

            setScanning(active, gate = 'GATE01') {
                // Sesuai permintaan: fungsi animasi scanning gelombang dihapus total
                this.isScanning = false; 
            },

            onResize() {
                if (!this.container || !this.camera || !this.renderer) return;
                const width = this.container.clientWidth;
                const height = this.container.clientHeight;
                
                // Cegah matriks proyeksi rusak akibat rasio NaN jika container sementara menyusut ke 0x0
                if (width === 0 || height === 0) return; 
                
                this.camera.aspect = width / height;
                this.camera.updateProjectionMatrix();
                this.renderer.setSize(width, height);
            },

            animate() {
                requestAnimationFrame(() => this.animate());

                // Animate visible weapon projectiles.
                if (this.weaponProjectiles && this.weaponProjectiles.length) {
                    for (let i = this.weaponProjectiles.length - 1; i >= 0; i--) {
                        const p = this.weaponProjectiles[i];
                        p.mesh.position.add(p.velocity);
                        p.life += 1;

                        const trailStart = p.mesh.position.clone().sub(p.velocity.clone().multiplyScalar(2.2));
                        p.trail.geometry.setFromPoints([trailStart, p.mesh.position.clone()]);

                        if (p.life >= p.maxLife) {
                            this.scene.remove(p.mesh);
                            this.scene.remove(p.trail);
                            p.mesh.geometry.dispose();
                            p.mesh.material.dispose();
                            p.trail.geometry.dispose();
                            p.trail.material.dispose();
                            this.weaponProjectiles.splice(i, 1);
                        }
                    }
                }

                const prevX = this.truckCurrentX;
                const prevZ = this.truckCurrentZ;

                // Saat mengikuti route, gunakan kecepatan konstan agar truk benar-benar
                // terasa mengemudi di jalan. Interpolasi eksponensial sebelumnya membuat
                // truk melambat di setiap waypoint dan terlihat seperti bergeser/teleport.
                let nextTruckX;
                let nextTruckZ;
                if (this.truckRoute && this.truckRoute.length) {
                    const dxToTarget = this.truckTargetX - this.truckCurrentX;
                    const dzToTarget = this.truckTargetZ - this.truckCurrentZ;
                    const distToTarget = Math.hypot(dxToTarget, dzToTarget);
                    const routeSpeed = 0.065; // world units / frame: pelan tapi terus berjalan
                    if (distToTarget > routeSpeed) {
                        nextTruckX = this.truckCurrentX + (dxToTarget / distToTarget) * routeSpeed;
                        nextTruckZ = this.truckCurrentZ + (dzToTarget / distToTarget) * routeSpeed;
                    } else {
                        nextTruckX = this.truckTargetX;
                        nextTruckZ = this.truckTargetZ;
                    }
                } else {
                    nextTruckX = this.truckCurrentX + (this.truckTargetX - this.truckCurrentX) * 0.045;
                    nextTruckZ = this.truckCurrentZ + (this.truckTargetZ - this.truckCurrentZ) * 0.045;
                }

                // Hard safety boundary: saat palang Gate 02 tertutup, truck tidak boleh
                // melewati garis gate x=-5.2. Karena ujung depan truck saat menghadap -X
                // berada sekitar 8.5 m di depan center, center truck ditahan minimal x=4.5.
                const gate02Closed = this.gateOutAngleCurrent < 1.0;
                const gate02CenterStopX = 4.5;
                if (gate02Closed && Math.abs(nextTruckZ + 28) < 5.5 && nextTruckX < gate02CenterStopX) {
                    nextTruckX = gate02CenterStopX;
                    if (this.truckTargetX < gate02CenterStopX) this.truckTargetX = gate02CenterStopX;
                }
                this.truckCurrentX = nextTruckX;
                this.truckCurrentZ = nextTruckZ;
                // Smoothly rotate the truck toward the direction of the current waypoint.
                let rotDelta = this.truckTargetRotY - this.truckCurrentRotY;
                rotDelta = Math.atan2(Math.sin(rotDelta), Math.cos(rotDelta));
                this.truckCurrentRotY += rotDelta * 0.075;

                // Advance the waypoint only after the truck has physically arrived.
                if (this.truckRoute && this.truckRoute.length) {
                    const wp = this.truckRoute[this.truckRouteIndex];
                    const remaining = Math.hypot(this.truckTargetX - this.truckCurrentX, this.truckTargetZ - this.truckCurrentZ);
                    if (remaining < 0.12) {
                        this.truckCurrentX = this.truckTargetX;
                        this.truckCurrentZ = this.truckTargetZ;
                        if (this.truckRouteIndex < this.truckRoute.length - 1) {
                            this.truckRouteIndex += 1;
                            const nextWp = this.truckRoute[this.truckRouteIndex];
                            this.truckTargetX = nextWp.x;
                            this.truckTargetZ = nextWp.z;
                            this.truckTargetRotY = nextWp.rot;
                        } else {
                            const cb = this.truckRouteCallback;
                            this.truckRoute = null;
                            this.truckRouteIndex = 0;
                            this.truckRouteCallback = null;
                            if (typeof cb === 'function') cb();
                        }
                    }
                }

                const dx = this.truckCurrentX - prevX;
                const dz = this.truckCurrentZ - prevZ;
                const distMoved = Math.sqrt(dx * dx + dz * dz);

                if (this.truckWheels && distMoved > 0.001) {
                    const direction = dx >= 0 ? 1 : -1;
                    this.truckWheels.forEach(w => {
                        w.rotation.z -= (distMoved / 0.9) * direction;
                    });
                }

                const isMoving = Math.abs(this.truckTargetX - this.truckCurrentX) > 0.1 || Math.abs(this.truckTargetZ - this.truckCurrentZ) > 0.1;
                const bounce = isMoving ? Math.sin(Date.now() * 0.015) * 0.03 : Math.sin(Date.now() * 0.004) * 0.008;

                if (this.truckGroup) {
                    this.truckGroup.position.x = this.truckCurrentX;
                    this.truckGroup.position.y = bounce;
                    this.truckGroup.position.z = this.truckCurrentZ;
                    this.truckGroup.rotation.y = this.truckCurrentRotY;
                }

                if (this.cameraPreset === 'TRUCK') {
                    const tx = this.truckCurrentX;
                    const tz = this.truckCurrentZ;
                    this.camera.position.x += ((tx + 14) - this.camera.position.x) * 0.05;
                    this.camera.position.z += ((tz + 13) - this.camera.position.z) * 0.05;
                    this.controls.target.set(tx, 2.5, tz);
                } else if (this.cameraPreset === 'WALK') {
                    // Simpan posisi karakter sebelum bergerak untuk menghitung pergeseran kamera
                    const prevAvatarX = this.avatarPos.x;
                    const prevAvatarY = this.avatarPosY;
                    const prevAvatarZ = this.avatarPos.z;

                    // WASD Character Movement (Camera-Relative Direction & Free Look Drag)
                    let moveX = 0;
                    let moveZ = 0;
                    if (this.keysPressed['w']) moveZ -= 1;
                    if (this.keysPressed['s']) moveZ += 1;
                    if (this.keysPressed['a']) moveX -= 1;
                    if (this.keysPressed['d']) moveX += 1;

                    let moved = (moveX !== 0 || moveZ !== 0);
                    
                    if (moved) {
                        // Ambil sudut kamera saat ini dengan Free Look OrbitControls
                        const camAngle = this.controls.getAzimuthalAngle(); 
                        
                        // Normalisasi kecepatan arah diagonal agar tidak lebih cepat
                        const length = Math.sqrt(moveX * moveX + moveZ * moveZ);
                        const normX = moveX / length;
                        const normZ = moveZ / length;

                        const speed = 0.4;
                        // Kalkulasi Trigonometri: Karakter maju relatif terhadap hadap kamera
                        const finalX = (normX * Math.cos(camAngle) + normZ * Math.sin(camAngle)) * speed;
                        const finalZ = (-normX * Math.sin(camAngle) + normZ * Math.cos(camAngle)) * speed;

                        this.avatarPos.x += finalX;
                        this.avatarPos.z += finalZ;

                        // Rotasi tubuh karakter otomatis menghadap ke arah gerakan barunya
                        this.avatarRot = Math.atan2(finalX, finalZ);
                    }

                    // Jump Physics & Gravity
                    if (!this.isGrounded) {
                        this.avatarPosY += this.avatarVelY;
                        this.avatarVelY -= 0.03; // Tarikan Gravitasi
                        if (this.avatarPosY <= 0) {
                            this.avatarPosY = 0;
                            this.avatarVelY = 0;
                            this.isGrounded = true;
                        }
                    }

                    // Clamp to World Bounds (Batas Area Pelabuhan)
                    this.avatarPos.x = Math.max(-110, Math.min(110, this.avatarPos.x));
                    this.avatarPos.z = Math.max(-45, Math.min(50, this.avatarPos.z));

                    // MENGGESER KAMERA: Kamera harus ikut bergeser sama persis dengan jarak pergerakan karakter
                    this.camera.position.x += (this.avatarPos.x - prevAvatarX);
                    this.camera.position.y += (this.avatarPosY - prevAvatarY);
                    this.camera.position.z += (this.avatarPos.z - prevAvatarZ);

                    if (this.avatarMesh) {
                        this.avatarMesh.position.x = this.avatarPos.x;
                        this.avatarMesh.position.y = this.avatarPosY;
                        this.avatarMesh.position.z = this.avatarPos.z;
                        this.avatarMesh.rotation.y = this.avatarRot;

                        // Arm Swing Animation (Ayunan Lengan & Kaki Selaras)
                        if (moved) {
                            const swing = Math.sin(Date.now() * 0.012) * 0.6;
                            if (this.avatarLeg1) this.avatarLeg1.rotation.x = swing;
                            if (this.avatarLeg2) this.avatarLeg2.rotation.x = -swing;
                            if (this.avatarArm1) this.avatarArm1.rotation.x = -swing;
                            if (this.avatarArm2) this.avatarArm2.rotation.x = swing;
                        } else {
                            // Reset pose kembali berdiri tegak jika berhenti jalan
                            if (this.avatarLeg1) this.avatarLeg1.rotation.x = 0;
                            if (this.avatarLeg2) this.avatarLeg2.rotation.x = 0;
                            if (this.avatarArm1) this.avatarArm1.rotation.x = 0;
                            if (this.avatarArm2) this.avatarArm2.rotation.x = 0;
                        }
                    }

                    // 1st Person vs 3rd Person Seamless Camera Target Focus
                    const camTargetX = this.avatarPos.x;
                    const camTargetY = 1.8 + this.avatarPosY; // Fokus setinggi mata/kepala
                    const camTargetZ = this.avatarPos.z;

                    const camDist = this.camera.position.distanceTo(new THREE.Vector3(camTargetX, camTargetY, camTargetZ));
                    
                    // Transisi 1st Person Halus: Sembunyikan badan karakter saat Zoom sangat dekat (< 2.5m)
                    if (this.avatarMesh) {
                        this.avatarMesh.visible = camDist > 2.5;
                    }

                   // Selalu ikuti pergerakan kepala karakter (menopang fitur drag mouse Free Look 360)
                    this.controls.target.set(camTargetX, camTargetY, camTargetZ);
                }

                // DETEKSI JARAK & PROYEKSI 3D KE 2D UNTUK TOMBOL F (ROBLOX STYLE)
                const promptEl = document.getElementById('roblox-prompt');
                const promptText = document.getElementById('roblox-prompt-text');
                
                if (promptEl && promptText && app && app.state) {
                    let target3D = null;
                    let promptString = "";
                    let isNear = false;

                    // SECRET EASTER EGG has priority over normal interaction prompts.
                    if (!this.weaponEquipped && this.checkWeaponPickup()) {
                        isNear = true;
                        target3D = new THREE.Vector3(
                            this.weaponPickupGroup.position.x,
                            this.weaponPickupGroup.position.y + 1.8,
                            this.weaponPickupGroup.position.z
                        );
                        promptString = "Ambil Senjata";
                    }

                    // 0. Target: Truk operasional yang bisa dikendarai.
                    if (!isNear && !this.driveMode && this.driveTruckGroup) {
                        const dx = this.avatarPos.x - this.driveTruckGroup.position.x;
                        const dz = this.avatarPos.z - this.driveTruckGroup.position.z;
                        isNear = Math.sqrt(dx * dx + dz * dz) < 6.0;
                        if (isNear) {
                            target3D = new THREE.Vector3(
                                this.driveTruckGroup.position.x,
                                4.0,
                                this.driveTruckGroup.position.z
                            );
                            promptString = "Drive Truck";
                        }
                    }

                    // 1. Target: Petugas Pemeriksa Dokumen
                    if (!isNear && app.state.awaitingInspection) {
                        isNear = Math.sqrt(Math.pow(this.avatarPos.x - 8.2, 2) + Math.pow(this.avatarPos.z - 5.2, 2)) < 5.0;
                        if (isNear) {
                            target3D = new THREE.Vector3(8.2, 3.8, 5.2); // Melayang di atas kepala petugas
                            promptString = "Periksa Dokumen";
                        }
                    } 
                    // 2. Target: Palang Gerbang
                    else if (app.state.awaitingGateOpen) {
                        isNear = Math.sqrt(Math.pow(this.avatarPos.x - 11.2, 2) + Math.pow(this.avatarPos.z - 4.4, 2)) < 5.0;
                        if (isNear) {
                            target3D = new THREE.Vector3(11.2, 2.5, 4.4); // Melayang di tiang palang gerbang
                            promptString = "Buka Gerbang";
                        }
                    } 
                    // 3. Target: Crane Gantry (Turunin Kontainer)
                    else if (app.state.awaitingOutboundInspection) {
                        isNear = Math.sqrt(Math.pow(this.avatarPos.x, 2) + Math.pow(this.avatarPos.z + 28, 2)) < 7.0;
                        if (isNear) {
                            target3D = new THREE.Vector3(0, 3.0, -28);
                            promptString = "Periksa Dokumen Keluar";
                        }
                    }
                    else if (app.state.awaitingOutboundGateOpen) {
                        isNear = Math.sqrt(Math.pow(this.avatarPos.x + 5.2, 2) + Math.pow(this.avatarPos.z + 28, 2)) < 8.0;
                        if (isNear) {
                            target3D = new THREE.Vector3(-5.2, 2.5, -28);
                            promptString = "Angkat Gerbang";
                        }
                    }
                    else if (app.state.awaitingContainerLoad) {
                        isNear = Math.sqrt(Math.pow(this.avatarPos.x - 38, 2) + Math.pow(this.avatarPos.z, 2)) < 6.0;
                        if (isNear) {
                            target3D = new THREE.Vector3(38, 3.0, 0);
                            promptString = "Turunkan Kontainer";
                        }
                    }

                    if (isNear && target3D) {
                        // Kalkulasi Proyeksi 3D Kamera ke Layar 2D (Sihir UI melayang)
                        target3D.project(this.camera);
                        const x = (target3D.x * 0.5 + 0.5) * this.container.clientWidth;
                        const y = (target3D.y * -0.5 + 0.5) * this.container.clientHeight;

                        // Hanya munculkan UI jika target ada di depan kamera (z < 1)
                        if (target3D.z < 1) {
                            promptEl.classList.remove('hidden');
                            promptText.innerText = promptString;
                            const promptKey = document.getElementById('roblox-prompt-key');
                            if (promptKey) promptKey.innerText = promptString === 'Drive Truck' ? 'E' : 'F';
                            promptEl.style.left = `${x}px`;
                            promptEl.style.top = `${y}px`;
                        } else {
                            promptEl.classList.add('hidden');
                        }
                        this.activePromptTarget = promptString; // Simpan status target saat ini
                    } else {
                        promptEl.classList.add('hidden');
                        const promptKey = document.getElementById('roblox-prompt-key');
                        if (promptKey) promptKey.innerText = 'F';
                        this.activePromptTarget = null;
                    }
                }

                // Container unloading: gantry turun bertahap, bukan snap/teleport.
                if (this.containerUnloadAnimating && this.yardSpreader) {
                    const elapsed = performance.now() - this.containerUnloadStart;
                    const t = Math.min(1, elapsed / this.containerUnloadDuration);
                    const eased = 1 - Math.pow(1 - t, 3);
                    this.yardSpreader.position.y = 12 - (6.0 * eased);

                    // Sedikit sway mekanis agar terasa seperti spreader/crane sungguhan.
                    this.yardSpreader.rotation.z = Math.sin(t * Math.PI * 2) * 0.012;

                    if (t >= 1) {
                        this.containerUnloadAnimating = false;
                        this.yardSpreader.rotation.z = 0;
                        this.yardSpreader.position.y = 12;
                        if (app && app.finishContainerUnloadAnimation) {
                            app.finishContainerUnloadAnimation();
                        }
                    }
                }

                // MODE DRIVE: kendaraan terpisah dikendalikan dengan WASD.
                if (this.driveMode && this.driveTruckGroup) {
                    const forward = this.keysPressed['w'] ? 1 : (this.keysPressed['s'] ? -1 : 0);
                    const steer = (this.keysPressed['a'] ? 1 : 0) + (this.keysPressed['d'] ? -1 : 0);
                    const accel = forward * 0.075;
                    this.driveTruckSpeed += accel;
                    this.driveTruckSpeed *= 0.90;
                    this.driveTruckSpeed = Math.max(-0.22, Math.min(0.42, this.driveTruckSpeed));

                    this.driveTruckRot += steer * 0.028 * (Math.abs(this.driveTruckSpeed) > 0.01 ? 1 : 0);
                    const nx = this.driveTruckGroup.position.x + Math.cos(this.driveTruckRot) * this.driveTruckSpeed;
                    const nz = this.driveTruckGroup.position.z + Math.sin(this.driveTruckRot) * this.driveTruckSpeed;

                    // Batas area daratan diperluas + collision Gate 02.
                    const gateClosed = this.gateOutAngleCurrent < 1.0;
                    const crossingGateFromRight = gateClosed &&
                        Math.abs(nz + 28) < 4.8 &&
                        this.driveTruckGroup.position.x > -16.5 &&
                        nx < -16.5;
                    const crossingGateFromLeft = gateClosed &&
                        Math.abs(nz + 28) < 4.8 &&
                        this.driveTruckGroup.position.x < -16.5 &&
                        nx > -16.5;

                    if (!(crossingGateFromRight || crossingGateFromLeft)) {
                        this.driveTruckGroup.position.x = Math.max(-120, Math.min(100, nx));
                        this.driveTruckGroup.position.z = Math.max(-44, Math.min(46, nz));
                    } else {
                        this.driveTruckGroup.position.x = -16.5;
                        this.driveTruckSpeed = 0;
                    }
                    this.driveTruckGroup.rotation.y = this.driveTruckRot;

                    // Putar roda kendaraan interaktif saat bergerak.
                    if (this.driveTruckGroup && Math.abs(this.driveTruckSpeed) > 0.001) {
                        this.driveTruckGroup.traverse(obj => {
                            if (obj.isMesh && obj.geometry && obj.geometry.type === 'CylinderGeometry') {
                                obj.rotation.z -= this.driveTruckSpeed * 0.9;
                            }
                        });
                    }

                    if (this.camera && this.controls === null || this.driveMode) {
                        const target = new THREE.Vector3(
                            this.driveTruckGroup.position.x,
                            2.2,
                            this.driveTruckGroup.position.z
                        );
                        const desired = new THREE.Vector3(
                            this.driveTruckGroup.position.x - Math.cos(this.driveTruckRot) * 18,
                            10,
                            this.driveTruckGroup.position.z - Math.sin(this.driveTruckRot) * 18
                        );
                        this.camera.position.lerp(desired, 0.08);
                        if (this.controls) this.controls.target.lerp(target, 0.12);
                    }
                }

                // Smooth Gate 01 & Gate 02 Lifting
                this.gateAngleCurrent += (this.gateAngleTarget - this.gateAngleCurrent) * 0.065;
                if (this.gateBarrierBar) this.gateBarrierBar.rotation.x = this.gateAngleCurrent;

                this.gateOutAngleCurrent = this.gateOutAngleCurrent || 0;
                this.gateOutAngleTarget = this.gateOutAngleTarget || 0;
                this.gateOutAngleCurrent += (this.gateOutAngleTarget - this.gateOutAngleCurrent) * 0.055;
                // Gate 02: palang berputar pada engsel di ujung tiang dan TERANGKAT ke ATAS.
                // Palang membentang sepanjang sumbu Z, sehingga sumbu engsel yang benar
                // adalah X. Rotation +X mengangkat ujung palang dari posisi horizontal
                // menjadi vertikal, tanpa menyapu/memotong jalur truk.
                if (this.gateOutBarrierBar) {
                    this.gateOutBarrierBar.rotation.x = this.gateOutAngleCurrent;
                    this.gateOutBarrierBar.rotation.z = 0;
                }

                // E-Seal Shackle Movement
                this.esealUnlockedCurrent += (this.esealUnlockedTarget - this.esealUnlockedCurrent) * 0.08;
                if (this.esealShackle) {
                    this.esealShackle.position.y = 0.55 + this.esealUnlockedCurrent * 0.45;
                    this.esealShackle.rotation.y = this.esealUnlockedCurrent * 1.5;
                }

                if (this.isScanning && this.scanWaveMesh) {
                    const gx = (this.scanningGate === 'GATE02') ? 0 : 10;
                    const gz = (this.scanningGate === 'GATE02') ? -28 : 0;
                    this.scanWaveMesh.position.set(gx, 5.5, gz);
                    this.scanWaveMesh.rotation.y += 0.06;
                    this.scanWaveMesh.material.opacity = 0.45 + Math.sin(Date.now() * 0.01) * 0.35;
                }

                if (this.officerGroup) {
                    this.officerGroup.position.y = Math.sin(Date.now() * 0.003) * 0.02;
                }

                if (this.workers) {
                    const time = Date.now() * 0.006;
                    this.workers.forEach((w, idx) => {
                        if (w.isWalker && w.walkPath) {
                            const swing = Math.sin(time * 2 + idx) * 0.5;
                            if (w.leg1) w.leg1.rotation.x = swing;
                            if (w.leg2) w.leg2.rotation.x = -swing;

                            const p = w.walkPath;
                            if (p.axis === 'x') {
                                const range = (p.maxX - p.minX) / 2;
                                const center = (p.maxX + p.minX) / 2;
                                w.group.position.x = center + Math.sin(time * 0.3 + idx) * range;
                                w.group.rotation.y = Math.cos(time * 0.3 + idx) >= 0 ? Math.PI / 2 : -Math.PI / 2;
                            } else if (p.axis === 'z') {
                                const range = (p.maxZ - p.minZ) / 2;
                                const center = (p.maxZ + p.minZ) / 2;
                                w.group.position.z = center + Math.sin(time * 0.3 + idx) * range;
                                w.group.rotation.y = Math.cos(time * 0.3 + idx) >= 0 ? 0 : Math.PI;
                            }
                        } else {
                            w.group.position.y = Math.sin(Date.now() * 0.004 + idx) * 0.015;
                        }
                    });
                }

                const cctvEl = document.getElementById('cctv-timestamp');
                if (cctvEl) {
                    const now = new Date();
                    cctvEl.innerText = now.getFullYear() + '-' + 
                        String(now.getMonth()+1).padStart(2,'0') + '-' + 
                        String(now.getDate()).padStart(2,'0') + ' ' + 
                        now.toLocaleTimeString('id-ID');
                }

                if (this.controls) this.controls.update();
                if (this.renderer && this.scene && this.camera) this.renderer.render(this.scene, this.camera);
            }
        };

        // --- CORE APPLICATION WORKFLOW ENGINE ---
