import './style.css'
import * as THREE from 'three'
import {
    OrbitControls
} from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import testVertexShader from './shaders/test/vertex.glsl'
import testFragmentShader from './shaders/test/fragment.glsl'
import {
    Perlin,
    FBM
}
from '../node_modules/three-noise/build/three-noise.module.js';
import {
    Vector2
} from 'three'


/**
 * Base
 */
// Debug
const gui = new dat.GUI()
//gui.add(randomSeed, 'randomSeed')

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()

/**
 * Test mesh
 */
// Geometry
const xgrid = 100;
const ygrid = 100;
const x_count = xgrid + 1;
const y_count = ygrid + 1;

const geometry = new THREE.PlaneGeometry(3, 2, xgrid, ygrid)

const count = geometry.attributes.position.count;

const randoms = new Float32Array(count);

const params = {
    RndSeed: 1,
}
let rndSeed = 1;

const vect2 = new Vector2(0, 0);


const perlin = new Perlin(Math.random())


function resetRnd(rndSeed) {


    let xoff = 0.00;
    for (let i = 0; i < x_count; i++) {
        let yoff = 0.00;
        for (let j = 0; j < y_count; j++) {
            randoms[i * y_count + j] = perlin.get2(new Vector2(xoff, yoff)) * 1.5;
            yoff += 0.2;
        }
        xoff += 0.2;
    }

    geometry.setAttribute('aRandom', new THREE.BufferAttribute(randoms, 1))
}

// gui.add(params, 'RndSeed')
//     .onChange(() => resetRnd(params.RndSeed))
//     .min(1)
//     .max(10)
//     .step(1)

// function assignColor(color) {
//     geometry.material.color.set(color)
// }

// gui.addColor(params, 'color')
//     .onChange(() => {
//         material.color.set(parameters.color)
//     })

rndSeed = params.RndSeed



// for (let i = 0; i < count; i++) {
//     randoms[i] = Math.random();
//     // console.log(noise(i, i, i))
//     // randoms[i] = 0.04;
// }



let xoff = 0.00;
for (let i = 0; i < x_count; i++) {
    let yoff = 0.00;
    for (let j = 0; j < y_count; j++) {
        randoms[i * y_count + j] = perlin.get2(new Vector2(xoff, yoff)) * 1.5;
        yoff += 0.2;
    }
    xoff += 0.2;
}


geometry.setAttribute('aRandom', new THREE.BufferAttribute(randoms, 1))

console.log(geometry)


// Material
const material = new THREE.RawShaderMaterial({
    vertexShader: testVertexShader,
    fragmentShader: testFragmentShader,
    //transparent: true,
    wireframe: true

})

// Mesh
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera   
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(0, -0.35, 0.25)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () => {



    let elapsedTime = clock.getElapsedTime()

    // flying


    let xoff = elapsedTime * 2.2;
    for (let i = 0; i < x_count; i++) {
        let yoff = 0.00;
        for (let j = 0; j < y_count; j++) {
            randoms[i * y_count + j] = perlin.get2(new Vector2(xoff, yoff)) * 1.5;
            yoff -= 0.15;
        }
        xoff -= 0.15;
    }

    geometry.setAttribute('aRandom', new THREE.BufferAttribute(randoms, 1))

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()