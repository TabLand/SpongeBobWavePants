var speed  = 10;
var points = [];
var time   = 0;

var width       = 1024;
var height      = 600;
var segments    = 16;
var centerPoint = (segments / 2) - 1;

var appendageLength = width / segments;

var renderer     = null;    
var stage        = null;
var spongebod    = null;
var sponge_arms  = null;

var spongebod_ripped_factor = 4;
var spongebod_aspect_ratio  = 1300/2000;

var sponge_arms_ripped_factor = 0.6;

var arm_horizontal_offset = 235;
var arm_vertical_offset   = -100;

var bod_vertical_offset   = 20;
var bod_arm_horizontal_offset = 50;

var pointIndex = null;
var x_script   = null;
var y_script   = null;

//anti trap(ezium) - TODO Make Spongebod krump to the beat
var squarer_pants = 5;

var BannedWords = ["BannedWords", "document", "while", "for", "forEach",
                   "function", "XMLHttpRequest", "window", "location",
                   "Navigator", "History", "PIXI", "eval", "setTimeout", 
                   "setInterval", "alert", "confirm", "prompt", "onbeforeunload",
                   "script", "console", "class", "constructor", "{", "}", "=>",
                   "return", "new", "continue", "break", "points", "delete",
                   "width", "height", "renderer", "stage",  "spongebod", 
                   "sponge_arms", "start_dancing", "create_sponge_arms",
                   "create_spongebod", "animate", "containsNoBannedWords", "$(", 
                   "runCodeInjection", "updateSpeed", "speed", "calculate_x", "calculate_y"];

function start_dancing()
{
    renderer = PIXI.autoDetectRenderer(width, height, {backgroundColor: 0x00ffff});
    document.body.appendChild(renderer.view);
    stage = new PIXI.Container();

    create_spongebod();
    create_sponge_arms();
    

    animate();

    checkIfSharedLink();
}

function checkIfSharedLink(){
    get_params = getUrlVars();
    if(get_params["xcode"] !== undefined && get_params["ycode"] !== undefined && get_params["speed"] !== undefined){
        document.getElementById("speed").value = get_params["speed"];
        x_script = atob(get_params["xcode"]);
        y_script = atob(get_params["ycode"]);
        
        document.getElementById("x_formula").value = x_script;
        document.getElementById("y_formula").value = y_script;

        //to guarantee that shared code / parameters get injected
        runCodeInjection();
        updateSpeed();
    }
}

function containsNoBannedWords(codeToEval){
    codeToEval = codeToEval.toLowerCase();
    for( i = 0; i < BannedWords.length; i++){
        if(codeToEval.includes(BannedWords[i].toLowerCase())){
            alert("You are not allowed to mess with " + BannedWords[i]);
            return false;    
        };
    }
    return true;
}

function create_sponge_arms(){
    for (var i = 0; i < segments; i++){
        points.push(new PIXI.Point(i * appendageLength,0));
    }

    sponge_arms = new PIXI.mesh.Rope(PIXI.Texture.fromImage('spongebob_arms.png'), points);
    sponge_arms.position.x = arm_horizontal_offset;
    sponge_arms.position.y = (height / 2) + arm_vertical_offset;

    sponge_arms.scale.x = sponge_arms_ripped_factor;
    sponge_arms.scale.y = sponge_arms_ripped_factor;

    stage.addChild(sponge_arms);

}

function create_spongebod(){    
    spongetex  = PIXI.Texture.fromImage('spongebob.png');
    spongebod  = new PIXI.mesh.Mesh(spongetex)

    spongebod.vertices[0] += squarer_pants;
    spongebod.vertices[2] -= squarer_pants; 
    
    spongebod.y = bod_vertical_offset;

    spongebod.scale.x = spongebod_ripped_factor * spongebod_aspect_ratio;
    spongebod.scale.y = spongebod_ripped_factor;
    
    stage.addChild(spongebod);
}

function animate() {
    time += speed / 100;

    for (var i = 0; i < points.length; i++) {
        pointIndex = i;
        
        points[i].y = calculate_y(pointIndex, time, appendageLength);
        points[i].x = calculate_x(pointIndex, time, appendageLength);
       
        if(pointIndex == centerPoint){
            spongebod.x = points[i].x - bod_arm_horizontal_offset;
        } 
    }
    
    renderer.render(stage);

    requestAnimationFrame(animate);
}

function runCodeInjection(){
    x_script = document.getElementById("x_formula").value;
    y_script = document.getElementById("y_formula").value;
    
    if(containsNoBannedWords(x_script) && containsNoBannedWords(y_script)){
        calculate_y = Function("pointIndex", "time", "appendageLength", y_script + "; return y;");
        calculate_x = Function("pointIndex", "time", "appendageLength", x_script + "; return x;");
    }
}

function updateSpeed(){
    speed_temp = parseFloat(document.getElementById("speed").value);
    
    if(speed_temp + "" === "NaN"){
        alert("Speed must be a number");    
    }
    else {
        speed = speed_temp;    
    }
}

function calculate_y(pointIndex, time, appendageLength){
    return Math.sin((pointIndex * 0.5) + time) * 100;    
}

function calculate_x(pointIndex, time, appendageLength){
    return pointIndex * appendageLength;    
}

function createShareLink(){
    link        = window.location + "#";
    share_speed = "?speed=" + speed;
    share_x     = "&xcode=" + btoa(x_script);
    share_y     = "&ycode=" + btoa(y_script);
    link        = link + share_speed + share_x + share_y;

    window.location = link;

    return link;
}

//http://papermashup.com/read-url-get-variables-withjavascript/
function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
    });
    return vars;
}
