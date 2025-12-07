import {
    Color,
    Material,
    Mesh,
    MeshBasicMaterial,
    MeshLambertMaterial,
    MeshPhongMaterial,
    MeshStandardMaterial,
    Object3D,
    SkinnedMesh,
} from 'three';

type SupportedMaterialType = 'basic' | 'phong' | 'lambert' | 'standard';

type SupportedMaterial =
    | MeshBasicMaterial
    | MeshPhongMaterial
    | MeshLambertMaterial
    | MeshStandardMaterial;

type ObjectWithMaterial = Object3D & { material?: SupportedMaterial | SupportedMaterial[] };

// type MaterialProps =
//     | keyof (MeshBasicMaterial & { skinning: boolean })
//     | keyof (MeshPhongMaterial & { skinning: boolean })
//     | keyof (MeshLambertMaterial & { skinning: boolean })
//     | keyof (MeshStandardMaterial & { skinning: boolean });

const propsToCopy = [
    'blending',
    'color',
    'colorWrite',
    'depthTest',
    'depthWrite',
    'emissive',
    'emissiveIntensity',
    'map',
    'name',
    'opacity',
    'side',
    'skinning',
    'shininess',
    'specular',
    'transparent',
    'vertexColors',
    'wireframe',
    'flatShading',
] as const;

type PropsToCopy = Record<(typeof propsToCopy)[number], string | number | boolean | Color>;

export class MaterialManager {
    cache: Record<string, SupportedMaterial> = {};

    add(type: SupportedMaterialType, props = {}) {
        switch (type.toLowerCase()) {
            case 'basic':
                return new MeshBasicMaterial(props);
            case 'phong':
                return new MeshPhongMaterial(props);
            case 'lambert':
                return new MeshLambertMaterial(props);
            case 'standard':
                return new MeshStandardMaterial(props);
            default:
                return new MeshLambertMaterial(props);
        }
    }

    replace(
        target: Object3D,
        type: SupportedMaterialType = 'lambert',
        props: PropsToCopy,
        clone = false,
    ) {
        const handler = (srcMat: SupportedMaterial) => {
            if (!this.cache[srcMat.uuid]) {
                srcMat = clone ? srcMat.clone() : srcMat;
                const dstMat = this.add(type);
                this.cache[srcMat.uuid] = this.copyProperties(srcMat, dstMat, props);
            }

            return this.cache[srcMat.uuid];
        };

        this.traverseObject(target, handler, true);
    }

    change(target: ObjectWithMaterial, props: PropsToCopy) {
        if (!target) {
            return;
        }

        if (
            target instanceof MeshBasicMaterial ||
            target instanceof MeshPhongMaterial ||
            target instanceof MeshLambertMaterial ||
            target instanceof MeshStandardMaterial
        ) {
            this.copyProperties(target, target, props);
            return;
        }

        this.traverseObject(target, (mat) => this.copyProperties(mat, mat, props), false);
    }

    traverseObject(
        target: ObjectWithMaterial,
        handler: (m: SupportedMaterial, c: ObjectWithMaterial) => SupportedMaterial,
        rewrite = false,
    ) {
        target.traverse((child: ObjectWithMaterial) => {
            if (child instanceof Mesh) {
                let result: SupportedMaterial | SupportedMaterial[];

                if (child.material) {
                    if (Array.isArray(child.material)) {
                        result = child.material.map((material) => handler(material, child));
                    } else {
                        result = handler(child.material, child);
                    }

                    if (rewrite) {
                        child.material = result;
                    }
                }
            }

            if (child instanceof SkinnedMesh) {
                child.material.skinning = true;
            }
        });
    }

    isMaterialsArray(mat: Material | Material[]): mat is Material[] {
        return Array.isArray(mat);
    }

    copyProperties(
        srcMaterial: SupportedMaterial,
        dstMaterial: SupportedMaterial,
        extraProps: PropsToCopy,
    ) {
        for (const key of propsToCopy) {
            if (Object.hasOwn(dstMaterial, key)) {
                const hasExtraKey =
                    extraProps[key] ||
                    (typeof extraProps[key] === 'number' && extraProps[key] >= 0);
                let value = hasExtraKey ? extraProps[key] : srcMaterial[key];

                if (key === 'map' && extraProps.map === null) {
                    value = extraProps.map;
                }

                if (key === 'color' || key === 'emissive' || key === 'specular') {
                    this.copyColorProperties(dstMaterial, key, value);
                } else if (key === 'shininess' && !extraProps[key]) {
                    value = 0;
                } else {
                    dstMaterial[key] = value;
                }
            }
        }

        return dstMaterial;
    }

    copyColorProperties(
        material: SupportedMaterial,
        key: (typeof propsToCopy)[number],
        value: string | number | Color,
    ) {
        if (value || (typeof value === 'number' && value >= 0)) {
            if (key in material) {
                if (material[key] instanceof Color) {
                    if (value instanceof Color) {
                        material[key]?.copy(value);
                    }

                    if (typeof value === 'number') {
                        material[key].setHex(value);
                    }

                    if (typeof value === 'string') {
                        material[key].setStyle(value);
                    }
                }
            }
        }
    }
}
