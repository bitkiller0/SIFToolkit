export function loadUtils(){
    let utils = {
        /*
        clearConcentrationSpells: function (actor = undefined){
            game.scenes.forEach(scene => {
                let filtertemplates = scene.data.templates;
                filtertemplates = filtertemplates.filter(i => {
                    scene = i.parent; 
                    return (i.data.flags.siftoolkit !== undefined)?(SIFT.Settings.worldConcentration?true:(scene.id == game.scenes.viewed.id)):false;
                });
                filtertemplates = filtertemplates.filter(i => {
                        scene = i.parent;					
                        return i.data.flags.siftoolkit?.concentration??false;
                    }
                );
                filtertemplates = filtertemplates.filter(i => {
                    return ((i.data.flags.siftoolkit.actor == actor) && 
                    (i.data.flags.siftoolkit.player == game.userId ||
                    (game.user.isGM && !game.users.get(i.data.flags.siftoolkit.player).active)));
                });
                if(filtertemplates !== undefined) {
                    let deletions = filtertemplates.map(i => i.id);
                    scene.deleteEmbeddedDocuments("MeasuredTemplate",deletions);
                }else{
                    console.log("SIFT | Nothing to delete!");
                }				
            });
        },
        */
        clearConcentrationSpellsByToken: function (token = undefined){
            game.scenes.forEach(scene => {
                let filtertemplates = scene.data.templates;
                filtertemplates = filtertemplates.filter(i => {
                    scene = i.parent; 
                    return (i.data.flags.siftoolkit !== undefined)?(SIFT.Settings.worldConcentration?true:(scene.id == game.scenes.viewed.id)):false;
                });
                filtertemplates = filtertemplates.filter(i => {
                        scene = i.parent;					
                        return i.data.flags.siftoolkit?.concentration??false;
                    }
                );
                filtertemplates = filtertemplates.filter(i => {
                    return ((i.data.flags.siftoolkit.token == token) && 
                    (i.data.flags.siftoolkit.player == game.userId ||
                    (game.user.isGM && !game.users.get(i.data.flags.siftoolkit.player).active)));
                });
                if(filtertemplates !== undefined) {
                    let deletions = filtertemplates.map(i => i.id);
                    scene.deleteEmbeddedDocuments("MeasuredTemplate",deletions);
                }else{
                    console.log("SIFT | Nothing to delete!");
                }				
            });
        },

        getDuration: function (SIF){
            let value = SIF.data.data.duration?.value;
            let units = SIF.data.data.duration?.units;
            let duration = 0;
            switch(units?.toLowerCase()) {
                case "day":
                    duration = value * 10 * 60 * 24 * SIFT.Settings.roundSeconds;
                    break;
                case "hour":
                    duration = value * 10 * 60 * SIFT.Settings.roundSeconds;
                    break;
                case "inst":
                    duration = SIFT.Settings.instantaneousSpellFade * SIFT.Settings.roundSeconds;
                    break;
                case "minute":
                case "minutes":
                    duration = value * 10 * SIFT.Settings.roundSeconds;
                    break;
                case "round":
                    duration = value * SIFT.Settings.roundSeconds;
                    break;
                case "spec":
                case "unti":
                    duration = -1;
                    break;
                default:
                    duration = 0;
            }
            return duration;
        },

        pushButtonHandlerTemplate(event){
            let chatId = event.currentTarget.parentElement.parentElement.parentElement.parentElement.getAttribute('data-message-id');
            SIFT.utils.pushChatData(chatId);
        },

        pushButtonHandlerDamage(event){
            let chatId = event.currentTarget.parentElement.parentElement.parentElement.parentElement.getAttribute('data-message-id');
            SIFT.utils.pushChatData(chatId);
        },

        pushButtonHandlerSave(event){
            let chatId = event.currentTarget.parentElement.parentElement.parentElement.parentElement.getAttribute('data-message-id');
            SIFT.utils.pushChatData(chatId);
        },

        pushButtonHandlerUnknown(event){
            //BetterRolls5e Repeat Button
            if(event.currentTarget.childNodes[1]?.outerHTML?.includes('<button data-action="repeat"')){
                let chatId = event.data;
                SIFT.utils.pushChatData(chatId);
            }
            //BetterRolls5e Save Button
            if(event.currentTarget.childNodes[1]?.outerHTML?.includes('<button data-action="save"')){
                let chatId = event.data;
                SIFT.utils.pushChatData(chatId);
                let SIFObj = SIFT.utils.getSIFObjFromChat(game.messages.get(chatId)); 
                let SIFData = SIFObj?.data?.flags?.siftoolkit?.SIFData;
                if (SIFData?.playSaveAudio && (SIFData?.clip != "")) {
                    SIFT.soundHold = true;
                    AudioHelper.play({
                        src: SIFData.clip,
                        volume: ((SIFData.volume??100)/100)
                    }, false);
                    setTimeout(()=>{SIFT.soundHold = false},500); 
                }
            }            
        }, 

        hijackTemplateButton: function (...args){
            let chatId = args[0].id;
            if(game.messages.get(chatId).isAuthor || game.user.isGM){
                let found = false;
                for (let i = 0; i < game.user.data.flags.siftoolkit.chatData.length;i++){
                    if(game.user.data.flags.siftoolkit.chatData[i].chatId == chatId){
                        found = true;
                    }
                }
                if(!found){
                    console.debug("SIFT | Hijacking button: ",chatId);
                    let ancestor = $('ol[id="chat-log"]');
                    ancestor.on('click', "li[data-message-id='"+chatId+"'] button[data-action$='emplate']", function(event){
                        SIFT.utils.pushButtonHandlerTemplate(event);
                    });
                }
                SIFT.utils.pushChatData(args[0].id);
            }
            
        },

        hijackDamageButton: function (...args){
            let chatId = args[0].id;
            if(game.messages.get(chatId).isAuthor || game.user.isGM){
                let found = false;
                for (let i = 0; i < game.user.data.flags.siftoolkit.chatData.length;i++){
                    if(game.user.data.flags.siftoolkit.chatData[i].chatId == chatId){
                        found = true;
                    }
                }
                if(!found){
                    console.debug("SIFT | Hijacking button: ",chatId);
                    let ancestor = $('ol[id="chat-log"]');
                    ancestor.on('click', "li[data-message-id='"+chatId+"'] button[data-action$='damage']", function(event){
                        SIFT.utils.pushButtonHandlerDamage(event);
                    });                    
                }
                SIFT.utils.pushChatData(args[0].id);
            }
            
        },

        hijackSaveButton: function (...args){
            let chatId = args[0].id;
            if(game.messages.get(chatId).isAuthor || game.user.isGM){
                let found = false;
                for (let i = 0; i < game.user.data.flags.siftoolkit.chatData.length;i++){
                    if(game.user.data.flags.siftoolkit.chatData[i].chatId == chatId){
                        found = true;
                    }
                }
                if(!found){
                    console.debug("SIFT | Hijacking button: ",chatId);
                    let ancestor = $('ol[id="chat-log"]');
                    ancestor.on('click', "li[data-message-id='"+chatId+"'] button[data-action$='save']", function(event){
                        SIFT.utils.pushButtonHandlerSave(event);
                    });                    
                }
                SIFT.utils.pushChatData(args[0].id);
            }
            
        },

        parseUnknownMessage: function (...args){
            let SIFObj = SIFT.utils.getSIFObjFromChat(args[0]);
            let SIFData = SIFObj?.flags?.siftoolkit?.SIFData;
            
            if ((SIFData?.playTemplateAudio || SIFData?.playDamageAudio) && (SIFData?.clip != "")) {
                AudioHelper.preloadSound(SIFData.clip);
            }

            let chatId = args[0].id;
            let found = false;
            for (let i = 0; i < game.user.data.flags.siftoolkit.chatData.length;i++){
                if(game.user.data.flags.siftoolkit.chatData[i].chatId == chatId){
                    found = true;
                }
            }
            if(game.messages.get(chatId).isAuthor || game.user?.isGM){
                if(!found){
                    console.debug("SIFT | Hijacking unknown chat message: ",chatId);
                    let ancestor = $('ol[id="chat-log"]');
                    //capture card-buttons buttons
                    ancestor.on("click", "li[data-message-id='"+chatId+"'] div[class^='card-buttons']",args[0].id, function(...args){
                        SIFT.utils.pushButtonHandlerUnknown(args[0]);
                    });
                    //capture die-result-overlay-br buttons
                    ancestor.on("click", "li[data-message-id='"+chatId+"'] div[class^='die-result-overlay-br']",args[0].id, function(...args){
                        SIFT.utils.pushButtonHandlerUnknown(args[0]);
                    });
                }
                SIFT.utils.pushChatData(args[0].id); 
            }
        },

        extractSIFData: function (itemObj){
            if(!itemObj) return undefined;
            let isConcentration = (itemObj?.data?.data?.components)?itemObj.data.data.components.concentration:false;
            let isSpecial = (itemObj.data.data.duration?.units == "unti" || itemObj.data.data.duration?.units == "spec");
            let SIFData = {
                item : itemObj.id,
                actor : itemObj.actor.id,
                token : itemObj.actor.token?.id,
                scene : game.scenes.viewed.id,
                player : game.userId,
                sif : itemObj.name,
                type : itemObj.type,
                ignoreDuration : itemObj.data.flags.siftoolkit?.SIFData?.ignoreDuration??false,
                duration: (itemObj !== undefined)?utils.getDuration(itemObj):0,
                isConcentration : isConcentration,
                isSpecial : isSpecial,
                displayData : SIFT.utils.generateDisplayData(itemObj.actor.id, itemObj.actor.token?.id, itemObj.id),
                audioData : SIFT.utils.generateAudioData(itemObj.actor.id, itemObj.actor.token?.id, itemObj.id)
            };
            SIFT.SIFData = SIFData;
            SIFT.mostRecentSifData = SIFData;
        },

        extractSIFDataFromChat: function (itemObj,chatObj){
            if(!itemObj) return undefined;
            let token = chatObj?.data.speaker?.token;
            let isConcentration = (itemObj?.data?.data?.components)?itemObj.data.data.components.concentration:false;
            let isSpecial = (itemObj.data.data?.duration?.units == "unti" || itemObj.data.data?.duration?.units == "spec");
            let SIFData = {
                item : itemObj.id,
                actor : itemObj?.actor.id,
                token : token??itemObj?.actor.token?.id,
                scene : game.scenes.viewed.id,
                player : game.userId,
                sif : itemObj.name,
                type : itemObj.type,
                ignoreDuration : itemObj.data.flags.siftoolkit?.SIFData?.ignoreDuration??false,
                duration: (itemObj !== undefined)?utils.getDuration(itemObj):0,
                isConcentration : isConcentration,
                isSpecial : isSpecial,
                displayData : SIFT.utils.generateDisplayData(itemObj.actor.id, itemObj.actor.token?.id, itemObj.id),
                audioData : SIFT.utils.generateAudioData(itemObj.actor.id, itemObj.actor.token?.id, itemObj.id)
            };
            SIFT.SIFData = SIFData;
            SIFT.mostRecentSifData = SIFData;
        },

        updateTemplate: function (template,index=0,duration=undefined){
            console.debug("SIFT | Updating Template");
            let currentSIFData = template.data.flags.siftoolkit;
            currentSIFData = currentSIFData??game.user.getFlag("siftoolkit","chatData")[game.user.getFlag("siftoolkit","chatData").length-1].SIFData??SIFT.SIFData;
            if(currentSIFData == undefined){
                currentSIFData ={
                    concentration: false, 
                    player: game.userId,
                    actor: "", 
                    token: "",
                    duration: 0,
                    special: false,
                    scene: game.scenes.active,
                    birthday: game.time.worldTime,
                    sif: "",
                    item: "",
                    displayData: undefined,
                    audioData: undefined
                }
            }
            let scene = game.scenes.get(currentSIFData.scene);  
            if(scene && index < 10){
                if(scene.data.templates.filter(i => i.id === template.id).length > 0){

                    if(currentSIFData.isConcentration){
                        SIFT.utils.clearConcentrationSpellsByToken(currentSIFData.token);
                    }
                    
                    let update =  {_id: template.id, flags: {
                        "siftoolkit":{
                            concentration: currentSIFData.isConcentration, 
                            player: currentSIFData.player,
                            actor: currentSIFData.actor, 
                            token: currentSIFData.token,
                            duration: duration??currentSIFData.duration,
                            special: currentSIFData.isSpecialSpell,
                            scene: currentSIFData.scene,
                            birthday: game.time.worldTime,
                            sif: currentSIFData.sif,
                            item: currentSIFData.item,
                            displayData: currentSIFData.displayData,
                            audioData: currentSIFData.audioData
                        }
                    }};
        
                    if(currentSIFData.isConcentration){
                        update.borderColor = SIFT.Settings.concentrationTemplateColor;
                    }else if(currentSIFData.duration>0){
                        update.borderColor = SIFT.Settings.enduringTemplateColor;
                    }else if(currentSIFData.isSpecialSpell){
                        update.borderColor = SIFT.Settings.specialTemplateColor;
                    }else{
                        update.borderColor = SIFT.Settings.standardTemplateColor;
                    }
                    scene.updateEmbeddedDocuments("MeasuredTemplate", [update]);
                    
                }else{
                    console.debug("SIFT | Failed to update template.  Retrying. ", index);
                    setTimeout(utils.updateTemplate(template,index+1), 100);
                }
            }else{
                console.debug("SIFT | Failed to update template.");
            }
            
        }

    }

    return utils;
}

