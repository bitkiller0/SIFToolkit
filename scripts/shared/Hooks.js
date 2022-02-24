export function setHooks(){
    //////////////////////////////////////////
    //      Init Hooks start here           //
    //////////////////////////////////////////


    //attempt to reapply textures
    let reloadAttempts = 0;
    let mysi = setInterval(
    function(){
        if(reloadAttempts < 20){
            let placeables = game.canvas.templates?.placeables;
            try{
                if(placeables){
                    clearInterval(mysi);
                    console.debug("SIFT | Applying textures post-reload")
                    for(let i = 0; i < placeables.length; i++){
                        if(placeables[i].data.flags.siftoolkit != undefined){
                            SIFT.textures.reapplyTexture(placeables[i]);		
                        }
                        SIFT.utils.hideTemplateGridHighlights(placeables[i].id);
                        SIFT.utils.hideTemplateText(placeables[i].id);
                        //setTimeout(async function () {SIFT.utils.hideTemplateBorder(placeables[i].id)},1000);
                    }
                }else{
                    console.debug("SIFT | Placeables not ready");
                }
                reloadAttempts++;
            }catch (e){}
        }
    },300);


    async function newHover(wrapped, ...args) {
        return true;
    }
    libWrapper.register("siftoolkit", "CONFIG.MeasuredTemplate.objectClass.prototype._canHover", newHover,'OVERRIDE');
    
    Hooks.on('ready', () => {
        try{window.Ardittristan.ColorSetting.tester} catch {
            ui.notifications.notify('Please make sure you have the "lib - ColorSettings" module installed and enabled.', "error");
        }
    });



    Hooks.on('updateWorldTime', (...args) => {
        if(SIFT.Settings.timeProcessor == "SimpleCalendar"){
            SIFT.utils.ageTemplates(args[1]);
        }
        if(game.combats.active == undefined){
            SIFT.utils.cleanupTemplates();
        }
    });
        
    Hooks.on("deleteMeasuredTemplate",e=>{SIFT.currentTT?.remove();});

    Hooks.on("hoverMeasuredTemplate",e=>{
        let sourceTemplate = SIFT.utils.getSourceTemplate(e.data._id);
        let placeable = SIFT.utils.getPlaceableTemplate(e.data._id);
        let mx = e.x;
        let my = e.y;
        mx += 30;
        my -= 30;
        let ttplayer = game.scenes.viewed.tokens.get(sourceTemplate.data.flags.siftoolkit?.token)?.name??game.actors.get(sourceTemplate.data.flags.siftoolkit?.actor)?.name??(game.users.get(sourceTemplate.data.user)?.name??"Unknown");
        let ttspell = sourceTemplate.data.flags.siftoolkit?.sif??"???"
        let ttduration = "";
        
        ttduration = '<span style="font-weight:500;">Remaining: </span>' + ((sourceTemplate.data.flags.siftoolkit?.duration)??"Unknown") + " seconds";
        
        let scale = document.getElementById("hud").style.transform.substring(6,document.getElementById("hud").style.transform.length-1);
        if(e._hover){
            if(SIFT.currentTT == undefined){
                SIFT.currentTT = document.createElement("DIV");
            }
            SIFT.currentTT.innerHTML = '<table style="border:0px;padding:0px;margin:0px;border-collapse: collapse;"><tr style="font-weight:bold;font-size:115%"><td>'+ttplayer+'</td></tr><tr style="font-weight:500"><td>'+ttspell+'</td></tr><tr><td>'+ttduration+'</</td></tr></table>';
            SIFT.currentTT.setAttribute("id", "spell-template-manager-tooltip");
            SIFT.currentTT.style.position = "absolute";
            SIFT.currentTT.style.borderColor = "black";
            SIFT.currentTT.style.borderWidth = "2px";
            SIFT.currentTT.style.borderStyle = "solid";
            SIFT.currentTT.style.backgroundColor = "white";
            SIFT.currentTT.style.borderRadius = "5px";
            SIFT.currentTT.style.padding = "5px";
            SIFT.currentTT.style.left = (mx+"px");
            SIFT.currentTT.style.visibility = "visible";
            SIFT.currentTT.style.left = (placeable.worldTransform.tx+(placeable.controlIcon.width*scale/2)+10+"px");
            SIFT.currentTT.style.top = (placeable.worldTransform.ty-(placeable.controlIcon.width*scale/2)+"px");
            if(SIFT.Settings.showToolTip){
                document.body.appendChild(SIFT.currentTT);
            }
            SIFT.utils.showTemplateGridHighlights(sourceTemplate.id);
            SIFT.utils.showTemplateText(sourceTemplate.id);
            SIFT.utils.showTemplateBorder(sourceTemplate.id);
        }else{
            SIFT.currentTT?.remove();
            SIFT.utils.hideTemplateGridHighlights(sourceTemplate.id);
            SIFT.utils.hideTemplateText(sourceTemplate.id);
            SIFT.utils.hideTemplateBorder(sourceTemplate.id);
        }
    });
    


    Hooks.on("updateMeasuredTemplate",async (e)=> {
        console.debug("SIFT | updating template",e);
        if(e.data.flags.siftoolkit?.displayData?.useTexture){
            let placeable = SIFT.utils.getPlaceableTemplate(e.id);
            SIFT.textures.reapplyTexture(placeable);		
        }
    });

    Hooks.on("renderSceneControls",async (...args) =>{
        if(args[0].activeControl=="measure" && SIFT.Settings.disableText){
            game.scenes.active.templates.forEach(j=>{
                j._object.children.forEach(i=>{ 
                    if(["PreciseText"].includes(Object(i).constructor.name)){
                        i.visible = false;
                    }
                });
            });
        }
    });

    Hooks.on("canvasReady",async (...args) => {
        let placeables = game.canvas.templates?.placeables;
            try{
                if(placeables){
                    for(let i = 0; i < placeables.length; i++){
                        if(placeables[i].data.flags.siftoolkit != undefined){
                            SIFT.textures.reapplyTexture(placeables[i]);		
                        }
                        SIFT.utils.hideTemplateGridHighlights(placeables[i].id);
                        SIFT.utils.hideTemplateText(placeables[i].id);
                        setTimeout(async function () {SIFT.utils.hideTemplateBorder(placeables[i].id)},1000);
                    }
                }else{
                    console.debug("SIFT | Placeables not ready");
                }
            }catch (e){}
    });

    Hooks.on("createMeasuredTemplate", (...args) => {
        let template = args[0];
        let userId = args[2];
        let SIFData = game.user.getFlag("siftoolkit","chatData")[game.user.getFlag("siftoolkit","chatData").length-1].SIFData;
        if(game.userId == userId){
            SIFT.utils.updateTemplate(template);
            if(SIFData?.displayData?.useTexture && (SIFData?.displayData?.spellTexture != "")){
                let attempts = 0;
                let mysi = setInterval(
                function(){
                    if(attempts < 20){
                        attempts++;
                        SIFT.textures.applyTexture(args,mysi);                            
                    }else{
                        clearInterval(mysi);
                    }
                });
            }
        }
        if(SIFData.audioData?.playTemplateAudio && SIFData.audioData?.clip != ""){
            SIFT.utils.playAudio(template);
        }
        SIFT.utils.hideTemplateGridHighlights(template.id);
        SIFT.utils.hideTemplateText(template.id);
        setTimeout(async function () {SIFT.utils.hideTemplateBorder(template.id)},1000);
    });

    Hooks.on("getSceneControlButtons", (controls) => {
        let measure = controls.filter(control => {return control.name=="measure"})[0];
        measure.tools.push(
            {
                name: "Clear Effects Data",
                title: "Clear Effects Data",
                icon: "fas fa-video-slash",
                onClick: () => {
                    SIFT.utils.clearTemplateData();
                    SIFT.SIFData = null;
                },
                button: true
            }
        );
    });

    Hooks.on("deleteCombatant", async function(...args) {        
        let scene = args[0].combat.scene.id;
        let token = args[0].token?.id;

        let templates = game.scenes.get(scene).templates.filter(i=>i.data.flags.siftoolkit?.token == token);
        if(templates.length > 0){
            let option = SIFT.Settings.removedCombatantTemplateAction;
            let action = "keep";
            switch(option){
                case "prompt":
                    let response = await SIFT.UI.promptRemoveCombatant(args);
                    if(response == game.i18n.localize("siftoolkit.removedCombatantTemplateAction.delete")){
                        action = "delete";                    
                    }
                    break;
                case "delete":
                    action = "delete";
                    break;
                case "keep":
                default:
                    action = "keep";
                    break;
            }
            switch(action){
                case "delete":
                    SIFT.utils.removeTokenTemplates(token,scene);
                    break;
                case "keep":
                default:
                    break;
            }
        }
    });

    Hooks.on("deleteToken", async function(...args) {
        let token = args[0].id;
        let scene = args[0].parent?.id;
        
        let templates = game.scenes.get(scene).templates.filter(i=>i.data.flags.siftoolkit?.token == token);
        if(templates.length > 0){
            let option = SIFT.Settings.removedCombatantTemplateAction;
            let action = "keep";
            switch(option){
                case "prompt":
                    let response = await SIFT.UI.promptRemoveCombatant(args);
                    if(response == game.i18n.localize("siftoolkit.removedCombatantTemplateAction.delete")){
                        action = "delete";                    
                    }
                    break;
                case "delete":
                    action = "delete";
                    break;
                case "keep":
                default:
                    action = "keep";
                    break;
            }
            switch(action){
                case "delete":
                    SIFT.utils.removeTokenTemplates(token,scene);
                    break;
                case "keep":
                default:
                    break;
            }
        }
    });
    
}
