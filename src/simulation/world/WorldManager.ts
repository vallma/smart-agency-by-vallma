
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import * as THREE from 'three/webgpu';
import { getAgentSet } from '../../data/agents';
import { useTeamStore } from '../../integration/store/teamStore';
import { DRACO_LIB_PATH } from '../constants';
import { NavMeshManager } from '../pathfinding/NavMeshManager';
import { PoiManager } from './PoiManager';

export class WorldManager {
  private office: THREE.Group | null = null;

  constructor(
    private scene: THREE.Scene,
    private navMesh: NavMeshManager,
    private poiManager: PoiManager
  ) {}

  public async load(): Promise<void> {
    const loader = new GLTFLoader();
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath(DRACO_LIB_PATH);
    loader.setDRACOLoader(dracoLoader);
    const officeGltf = await loader.loadAsync(`${import.meta.env.BASE_URL}models/office.glb`);
    this.office = officeGltf.scene;
    this.scene.add(this.office);

    // Get current AgentSet color
    const { selectedAgentSetId, customSystems } = useTeamStore.getState();
    const activeSet = getAgentSet(selectedAgentSetId, customSystems);
    const themeColor = new THREE.Color(activeSet.color);

    // Paleta de colores de oficina realista
    const MESH_COLORS: Record<string, { color: number; roughness: number; metalness: number }> = {
      'static-floor':           { color: 0xC4B8A8, roughness: 0.95, metalness: 0.0  }, // moqueta beige
      'static-counter':         { color: 0xEDEAE4, roughness: 0.8,  metalness: 0.05 }, // mostrador blanco
      'static-cafe-table':      { color: 0x6B4226, roughness: 0.7,  metalness: 0.0  }, // mesa café madera oscura
      'static-chair':           { color: 0x2C2C2C, roughness: 0.8,  metalness: 0.1  }, // silla recepción negra
      'static-chair001':        { color: 0x2C2C2C, roughness: 0.8,  metalness: 0.1  },
      'static-cabinet':         { color: 0xE8E4DC, roughness: 0.75, metalness: 0.05 }, // archivador blanco hueso
      'static-plant001':        { color: 0x2A7A45, roughness: 1.0,  metalness: 0.0  }, // planta verde
      'static-plant002':        { color: 0x2A7A45, roughness: 1.0,  metalness: 0.0  },
      'static-pc':              { color: 0x1A1A1A, roughness: 0.4,  metalness: 0.6  }, // monitor negro
      'static-pc001':           { color: 0x1A1A1A, roughness: 0.4,  metalness: 0.6  },
      'static-pc002':           { color: 0x1A1A1A, roughness: 0.4,  metalness: 0.6  },
      'static-pc003':           { color: 0x1A1A1A, roughness: 0.4,  metalness: 0.6  },
      'static-work-desk001':    { color: 0x8B5E3C, roughness: 0.65, metalness: 0.0  }, // escritorio madera
      'static-work-desk002':    { color: 0x8B5E3C, roughness: 0.65, metalness: 0.0  },
      'static-work-desk003':    { color: 0x8B5E3C, roughness: 0.65, metalness: 0.0  },
      'static-work-desk004':    { color: 0x8B5E3C, roughness: 0.65, metalness: 0.0  },
      'static-flexo':           { color: 0xD4D0C8, roughness: 0.4,  metalness: 0.7  }, // flexo aluminio
      'static-flexo001':        { color: 0xD4D0C8, roughness: 0.4,  metalness: 0.7  },
      'static-flexo002':        { color: 0xD4D0C8, roughness: 0.4,  metalness: 0.7  },
      'static-flexo003':        { color: 0xD4D0C8, roughness: 0.4,  metalness: 0.7  },
      'static-work-chair000':   { color: 0x222222, roughness: 0.85, metalness: 0.05 }, // silla oficina negra
      'static-work-chair001':   { color: 0x222222, roughness: 0.85, metalness: 0.05 },
      'static-work-chair002':   { color: 0x222222, roughness: 0.85, metalness: 0.05 },
      'static-work-chair003':   { color: 0x222222, roughness: 0.85, metalness: 0.05 },
      'static-work-chair004':   { color: 0x222222, roughness: 0.85, metalness: 0.05 },
      'static-board':           { color: 0xF5F5F0, roughness: 0.9,  metalness: 0.0  }, // pizarra blanca
      'static-sofa':            { color: 0xA52020, roughness: 0.9,  metalness: 0.0  }, // sofá rojo
      'static-laptop':          { color: 0xB8B8B8, roughness: 0.3,  metalness: 0.8  }, // laptop aluminio
    };

    // Extract NavMesh and setup
    this.office.traverse((child) => {
      if ((child as any).isMesh) {
        const mesh = child as THREE.Mesh;
        const name = mesh.name.toLowerCase();

        if (name.includes('navmesh')) {
          this.navMesh.loadFromGeometry(mesh.geometry);
          mesh.visible = false;
        } else {
          mesh.receiveShadow = true;
          mesh.castShadow = true;

          if (mesh.material) {
            const oldMat = mesh.material as THREE.MeshStandardMaterial;
            const isColored = name.startsWith('colored');
            const preset = MESH_COLORS[mesh.name];

            mesh.material = new THREE.MeshStandardNodeMaterial({
              color: isColored ? themeColor : preset ? new THREE.Color(preset.color) : oldMat.color,
              map: oldMat.map,
              roughness: preset ? preset.roughness : 1,
              metalness: preset ? preset.metalness : 0.35,
            });
          }
        }
      }
    });

    // Extract Points of Interest
    this.poiManager.loadFromGlb(this.office);
  }

  public updateThemeColor(color: string): void {
    if (!this.office) return;
    const themeColor = new THREE.Color(color);
    this.office.traverse((child) => {
      if ((child as any).isMesh) {
        const mesh = child as THREE.Mesh;
        if (mesh.name.toLowerCase().startsWith('colored') && (mesh.material as any)?.color) {
          (mesh.material as any).color.copy(themeColor);
        }
      }
    });
  }

  public getOffice(): THREE.Group | null {
    return this.office;
  }
}
