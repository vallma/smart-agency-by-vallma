import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import * as THREE from 'three/webgpu';
import { SCENE_BACKGROUND_COLOR } from '../constants';

export class Stage {
  public scene: THREE.Scene;
  public camera: THREE.PerspectiveCamera;
  public controls: OrbitControls;

  private followTarget: THREE.Vector3 | null = null;
  private readonly defaultTarget = new THREE.Vector3(0, 0.8, 0);

  constructor(rendererElement: HTMLElement) {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(SCENE_BACKGROUND_COLOR);
    this.scene.fog = new THREE.FogExp2(SCENE_BACKGROUND_COLOR, 0.045);

    this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 500);
    this.camera.position.set(10, 8, 15);

    this.controls = new OrbitControls(this.camera, rendererElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.rotateSpeed = 0.8;
    this.controls.enableRotate = true;
    this.controls.enablePan = false;
    this.controls.enableZoom = true;
    this.controls.minPolarAngle = Math.PI / 4.5;
    this.controls.maxPolarAngle = Math.PI / 2.4;
    this.controls.minDistance = 3;
    this.controls.maxDistance = 10;
    this.controls.target.set(0, 0.8, 0);

    this.controls.addEventListener('start', () => {
      rendererElement.style.cursor = 'grabbing';
    });
    this.controls.addEventListener('end', () => {
      rendererElement.style.cursor = 'auto';
    });

    this.setupLights();
    // Environment is initialized with a default, but updated via updateDimensions immediately in SceneManager
  }

  private setupLights() {
    // Luz ambiental cálida — simula reflexión difusa de paredes de oficina
    const ambientLight = new THREE.AmbientLight(0xFFF5E4, 1.8);
    this.scene.add(ambientLight);

    // Luz de techo principal — fluorescente de oficina, levemente azulada
    const ceilingLight = new THREE.DirectionalLight(0xEEF4FF, 1.2);
    ceilingLight.position.set(0, 20, 0);
    ceilingLight.castShadow = true;
    ceilingLight.shadow.camera.near = 0.1;
    ceilingLight.shadow.camera.far = 100;
    ceilingLight.shadow.camera.top = 12;
    ceilingLight.shadow.camera.bottom = -12;
    ceilingLight.shadow.camera.right = 12;
    ceilingLight.shadow.camera.left = -12;
    ceilingLight.shadow.mapSize.set(2048, 2048);
    ceilingLight.shadow.bias = -0.0001;
    ceilingLight.shadow.radius = 3;
    ceilingLight.shadow.autoUpdate = true;
    this.scene.add(ceilingLight);

    // Luz de ventana lateral — sol de tarde, naranja suave
    const windowLight = new THREE.DirectionalLight(0xFFD9A0, 0.6);
    windowLight.position.set(-15, 10, 5);
    windowLight.castShadow = false;
    this.scene.add(windowLight);

    // Relleno trasero suave — evita sombras totalmente negras
    const fillLight = new THREE.DirectionalLight(0xC8D8FF, 0.3);
    fillLight.position.set(5, 5, -10);
    this.scene.add(fillLight);
  }

  public onResize(width: number, height: number) {
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
  }

  /** Call every frame with the character's world position to follow, or null to return to origin. */
  public setFollowTarget(pos: THREE.Vector3 | null) {
    this.followTarget = pos ? pos.clone() : null;
  }

  public update() {
    const lerpTarget = this.followTarget
      ? new THREE.Vector3(this.followTarget.x, 0.8, this.followTarget.z)
      : this.defaultTarget;
    this.controls.target.lerp(lerpTarget, 0.06);
    this.controls.update();
  }

  /**
   * Drive camera behavior based on chat state.
   * Call every frame from the animation loop.
   *
   * @param isChatting  True while a conversation is active.
   * @param playerMoving True while player is walking toward the NPC (GOTO state).
   */
  public setChatMode(isChatting: boolean, playerMoving: boolean): void {
    if (!this.controls) return;

    if (isChatting) {
      if (playerMoving) {
        // Lock controls and zoom in while walking
        this.controls.enabled = false;
        this.controls.minDistance = THREE.MathUtils.lerp(this.controls.minDistance, 4, 0.05);
        this.controls.maxDistance = THREE.MathUtils.lerp(this.controls.maxDistance, 6, 0.05);
      } else {
        // Arrived — re-enable controls, stay slightly zoomed
        this.controls.enabled = true;
        this.controls.minDistance = THREE.MathUtils.lerp(this.controls.minDistance, 3, 0.05);
        this.controls.maxDistance = THREE.MathUtils.lerp(this.controls.maxDistance, 10, 0.05);
      }
    } else {
      // Free roam
      this.controls.enabled = true;
      this.controls.minDistance = THREE.MathUtils.lerp(this.controls.minDistance, 3, 0.05);
      this.controls.maxDistance = THREE.MathUtils.lerp(this.controls.maxDistance, 50, 0.05);
    }
  }
}
