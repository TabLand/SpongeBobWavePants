var count      = 0;
var points     = [];

var width      = 1024;
var height     = 650;
var segments   = 15;
var armsLength = width / segments;

var renderer     = null;    
var stage        = null;
var g            = null;
var spongebod    = null;
var sponge_arms  = null;

var spongebod_ripped_factor = 6;
var spongebod_aspect_ratio  = 1300/2000;

var arm_horizontal_offset = 45;
var arm_vertical_offset   = -100;
var bod_horizontal_offset = 330;
var bod_vertical_offset   = 20;

//anti trap
var squarer_pants = 5;

function start_dancing()
{
    renderer = PIXI.autoDetectRenderer(width, height, {backgroundColor: 0xffffff});
    document.body.appendChild(renderer.view);
    stage = new PIXI.Container();

    for (var i = 0; i < segments; i++)
    {
        points.push(new PIXI.Point(i * armsLength,0));
    }

    sponge_arms = new PIXI.mesh.Rope(PIXI.Texture.fromImage('spongebob_arms.png'), points);
 
    sponge_arms.position.x = arm_horizontal_offset;
    sponge_arms.position.y = (height / 2) + arm_vertical_offset;

    create_spongebod();
    stage.addChild(sponge_arms);

    g = new PIXI.Graphics();

    g.x = sponge_arms.x;
    g.y = sponge_arms.y;
    stage.addChild(g);

    animate();
}

function create_spongebod(){    
    spongetex  = PIXI.Texture.fromImage('spongebob.png');
    spongebod  = new PIXI.mesh.Mesh(spongetex)

    spongebod.vertices[0] += squarer_pants;
    spongebod.vertices[2] -= squarer_pants; 
    
    spongebod.x = bod_horizontal_offset;
    spongebod.y = bod_vertical_offset;

    spongebod.scale.x = spongebod_ripped_factor * spongebod_aspect_ratio;
    spongebod.scale.y = spongebod_ripped_factor;
    
    stage.addChild(spongebod);
}

function animate() {

    count += 1;

    for (var i = 0; i < points.length; i++) {

        points[i].y = (Math.sin((i * 0.5) + count) * 100) ;
        points[i].x = i * armsLength;
        
    }
    
    renderer.render(stage);

    requestAnimationFrame(animate);
}
