var canvas = document.getElementById("renderCanvas");
var engine = new BABYLON.Engine(canvas, true);
var camera, scene, ball, goal, timeoutId, particleSystem;

scene = createScene();

engine.runRenderLoop(function(){
    scene.render();
})
scene.registerAfterRender(function(){
    if(ball.intersectsMesh(goal, false)) {
        goal.position.x = Math.random() * 8 - 4;
        //play particles
        particleSystem.manualEmitCount = 21;
        particleSystem.start();
        //position them
        particleSystem.minEmitBox = ball.position;
        resetBall();
    }
})
function createScene() {
    //creaing scene
    var scene = new BABYLON.Scene(engine);

    camera = new BABYLON.UniversalCamera("UC", new BABYLON.Vector3(0,0,-15), scene);

    var light = new BABYLON.DirectionalLight("lighty2", new BABYLON.Vector3(0, -.5, 1), scene);
    //enabling physics
    var gravityVector = BABYLON.Vector3(0,-9.81,0);
    var physicsPlugin = new BABYLON.CannonJSPlugin();
    scene.enablePhysics(gravityVector, physicsPlugin);
    //set up ball
    ball =  BABYLON.MeshBuilder.CreateSphere("spheroSmile", {diameter: 1}, scene);
    //set up ball in spirit dimension
    ball.physicsImpostor = new BABYLON.PhysicsImpostor(ball, BABYLON.PhysicsImpostor.SphereImpostor, {mass:1, restitution:.2}, scene)
    ball.tag = "ball";

    //set up ground
    var ground = BABYLON.MeshBuilder.CreateGround("ground", {height: 20, width: 20, subdivisions: 4 }, scene);
    ground.position.y = -1;
    ground.position.x = 2;
    //set up ground in spirit dimension

    ground.physicsImpostor = new BABYLON.PhysicsImpostor(ground, BABYLON.PhysicsImpostor.BoxImpostor, {mass: 0, restitution: .9}, scene);

    //set up goal

    goal = new BABYLON.MeshBuilder.CreateBox("goal", {height: 5, width:5}, scene);
    goal.position.z = 10;
    goal.position.x = Math.random() * 8 - 4;

    //make the particle system
    particleSystem = new BABYLON.ParticleSystem("particles", 2000, scene);
    particleSystem.emitter = new BABYLON.Vector3(0,0,0);
    particleSystem.minEmitPower = 1;
    particleSystem.maxEmitPower = 3;
    particleSystem.addVelocityGradient(0,2);

    //load particle texture

    particleSystem.particleTexture = new BABYLON.Texture("image/particle.png", scene);
    return scene;
}
function resetBall()
{
   ball.position = new BABYLON.Vector3();
   ball.physicsImpostor.setLinearVelocity( new BABYLON.Vector3());
   ball.physicsImpostor.setAngularVelocity( new BABYLON.Vector3());

   //stop timeout
    clearTimeout(timeoutId);
}
window.addEventListener("click", function(){
    var pickResult = scene.pick(scene.pointerX, scene.pointerY);
    var selectedObject = pickResult.pickedMesh;

    if(selectedObject)
    {
       if(selectedObject.tag == "ball") {


           //geting click direction
           var surfaceNormal = pickResult.getNormal(true);
           var foreDirection = surfaceNormal.scale(-1000);
           //move ball
           selectedObject.physicsImpostor.applyForce(foreDirection, selectedObject.getAbsolutePosition());

           //reset ball

           timeoutId = setTimeout(resetBall, 3000);
       }
    }
});


