var count      = 0;
var points     = [];

var width      = 1024;
var height     = 600;
var segments   = 15;
var ropeLength = width / segments;

var renderer   = null;    
var stage      = null;
var g          = null;
var spongebod  = null;

var spongebod_ripped_factor = 0.462;

function start_dancing()
{
    renderer = PIXI.autoDetectRenderer(width, height);
    document.body.appendChild(renderer.view);
    stage = new PIXI.Container();

    for (var i = 0; i < segments; i++)
    {
        points.push(new PIXI.Point(i * ropeLength,0));
    }

    var strip = new PIXI.mesh.Rope(PIXI.Texture.fromImage('spongebob_arms.png'), points);

    strip.position.x = 30;
    strip.position.y = height / 2;

    stage.addChild(strip);
    create_spongebod();

    g = new PIXI.Graphics();

    g.x = strip.x;
    g.y = strip.y;
    stage.addChild(g);

    // start animating
    animate();
}

function create_spongebod(){
    spongebod = PIXI.Sprite.fromImage('spongebob.png');
    spongebod.x = 361;
    spongebod.y = 85;

    spongebod.scale.x = spongebod_ripped_factor;
    spongebod.scale.y = spongebod_ripped_factor;
    
    stage.addChild(spongebod);
}

function animate() {

    count += 0.2;

    for (var i = 0; i < points.length; i++) {

        //points[i].y = (Math.sin((i * 0.5) + count) * 100) ;
        points[i].x = i * ropeLength;
        
    }
    
    renderer.render(stage);

    renderPoints();

    requestAnimationFrame(animate);
}

function renderPoints () {

    g.clear();

    g.lineStyle(2,0xffc2c2);
    g.moveTo(points[0].x,points[0].y);

    for (var i = 1; i < points.length; i++) {
        g.lineTo(points[i].x,points[i].y);
    };

    for (var i = 1; i < points.length; i++) {
        g.beginFill(0xff0022);
        g.drawCircle(points[i].x,points[i].y,10);
        g.endFill();
    };
}

