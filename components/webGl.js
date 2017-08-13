import { Component } from 'react'
import ReactDOM from 'react-dom'
import * as THREE from 'three'
//import WAGNER from '../bower_components/Wagner/Wagner'

export default class WebGl extends Component {
  constructor(props) {
    super(props)
    this.resizeHandler = this.resizeHandler.bind(this)
  }

  componentDidMount() {
    const container = ReactDOM.findDOMNode(this.refs.container)
    this.three = {}
    this.threshold = 48;
    this.size = {
      innerWidth: window.innerWidth,
      innerHeight: window.innerHeight + this.threshold
    }

    this.three.scene = new THREE.Scene();
		this.three.camera = new THREE.PerspectiveCamera(75, this.size.innerWidth / this.size.innerHeight, 0.1, 5000);
		this.three.renderer = new THREE.WebGLRenderer({ antialias: true })
    this.three.renderer.setPixelRatio( window.devicePixelRatio )
		this.three.renderer.setSize( this.size.innerWidth, this.size.innerHeight * 1.2)
    this.three.renderer.setClearColor( 0x282d47, 1 )
    // add the container
    container.appendChild( this.three.renderer.domElement )

    this.three.camera.position.z = 100;
    this.three.scene.fog = new THREE.Fog( 0x282d47, 1000, 6000 );

    /*
    * Star
    **/
    const star = {}
		star.geometry = new THREE.SphereGeometry(2, 32, 32)
		star.material = new THREE.MeshBasicMaterial(
      {
        color: 0xe0e0e0
      }
    )

    /*
    * AP logo
    **/
    this.apLogoCoposent = {}

    //this.apLogoCoposent.image = new THREE.TextureLoader().load("static/textures/logo-another-planet-white.png" );

    this.apLogoCoposent.geometry = new THREE.PlaneGeometry(512, 512)
    this.apLogoCoposent.material = new THREE.MeshBasicMaterial( {
      // color: 0xffffff,
      // side: THREE.DoubleSide,
      transparent: true
    } );
    this.aplogo = new THREE.Mesh( this.apLogoCoposent.geometry, this.apLogoCoposent.material )
    this.aplogo.position.x = 0;

    var loader = new THREE.TextureLoader()
    // load a resource
    loader.load(
    	// resource URL
    	'static/textures/logo-another-planet-white.png', // 'static/textures/uv.jpg',
    	// Function when resource is loaded
    	(texture) => {
        // console.log('isload');
    		this.apLogoCoposent.material.map = texture
        this.three.scene.add( this.aplogo )
    	}
    )
    this.three.stars = []
    for (var z = -1200; z < 11000; z += 15 ) {
			// Make a sphere (exactly the same as before).
			const sphere = new THREE.Mesh(star.geometry, star.material)
			// This time we give the sphere random x and y positions between -500 and 500
			sphere.position.x = Math.random() * 2000 - 1000;
			sphere.position.y = Math.random() * 5000 - 2500;
			// Then set the z position to where it is in the loop (distance of camera)
			sphere.position.z = z;
			// scale it up a bit
			sphere.scale.x = sphere.scale.y = Math.random() * 4;
			//add the sphere to the scene
			this.three.scene.add( sphere );
			//finally push it to the stars array
			this.three.stars.push(sphere);
		}
    this.three.camera.position.z = 6000
    this.aplogo.position.y = 100
    this.aplogo.position.z = 4500
    this.aplogo.position.x = 0
    //this.aplogo.rotation.y = 0.5
    this.three.camera.position.y = 0
    /*
    * Resize listner
    **/
    window.addEventListener('resize', this.resizeHandler, false)
    setTimeout(this.resizeHandler, 10)
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resizeHandler, false)
  }

  componentDidUpdate(prevProps) {
    //console.log(this.props.timeControl)
    const pow = 3;

    const easeIn = (t, d) => {
      return Math.pow(Math.min(t, d) / d, pow);
    }

    const easeOut = (t, d) => {
      return 1 - Math.pow(1 - (Math.min(t, d) / d), pow)
    }
		//this.three.camera.lookAt( this.three.scene.position );

    if (prevProps.timeControl !== this.props.timeControl) {
      const zpos = easeOut(this.props.timeControl, 2000)
      this.three.camera.position.z = zpos * -5000 + 6000
      this.aplogo.position.y = zpos * -400 + 100
      this.aplogo.position.z = zpos * -4500 + 4500
      this.apLogoCoposent.material.opacity = 1 - zpos //or any other value you like

      //this.aplogo.rotation.y = (zpos * -0.5) + 0.5
      this.three.camera.position.y = this.props.timeControl * -0.5
      this.three.renderer.render(this.three.scene, this.three.camera);
    }
  }

  resizeHandler() {
    //var style = window.getComputedStyle(ReactDOM.findDOMNode(this.refs.container), null)
    //console.log(window.innerHeight, style.getPropertyValue("height"))

    if( Math.abs(this.size.innerWidth - window.innerWidth) > this.threshold || Math.abs(this.size.innerHeight - window.innerHeight) > this.threshold) {
      this.size = {
        innerWidth: window.innerWidth,
        innerHeight: window.innerHeight
      }
    }
    this.three.camera.aspect = this.size.innerWidth / this.size.innerHeight;
    this.three.camera.updateProjectionMatrix();
    this.three.renderer.setSize( this.size.innerWidth, this.size.innerHeight );
    this.three.windowHalfX = this.size.innerWidth / 2;
    this.three.windowHalfY = this.size.innerHeight / 2;
    setTimeout(() => { this.three.renderer.render( this.three.scene, this.three.camera) }, 0)
  }

  render() {

    return (
      <div ref="container" className="heroCanvasContainer">
        { /*
          <div className="counter">{this.props.timeControl}</div>
          */}
        <style jsx>{`

            .heroCanvasContainer {
              position: fixed;
              width: 100%;
              height: 100vh;
              top: 0;
              left: 0;
              z-index: -2;
            }
            .counter {
              position: fixed;
              width: 100%;

              bottom: 0;
              left: 0;
            }

            .heroCanvasContainer :global(canvas) {
              width: 100%;
              height: 100%
            }

        `}</style>
      </div>

    );
  }
}
