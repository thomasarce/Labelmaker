//Editor DOM Elements Pointers
function EditorObject() {

    this.getProductID = function() {
        // Input Field with Product ID
        var el = $(".editor-product-id");

        return this.getFieldObject(el);
    }

    this.getServingSize = function() {
        //Input Field with Serving Size
        var el = $(".editor-product-serving-size");

        return this.getFieldObject(el);
    }

    this.getServingSizePerBottle = function() {
        //Input Field with Serving Size per Bottle
        var el = $(".editor-product-serving-per");

        return this.getFieldObject(el);
    }

    this.getRecommendedFields = function() {
        // Container Element for Recommended Fields
        var el = $(".editor-recommended-fields .editor-recommended-field-single"),
            returnArray = [];

        el.each(function(index,item){
            returnArray.push(app.Editor.getFieldRowObject(item));
        });

        return returnArray;
    }

    this.getCrossFields = function() {
        // Container Element for Recommended Fields
        var el = $(".editor-cross-fields .editor-cross-field-single"),
            returnArray = [];

        el.each(function(index,item){
            returnArray.push(app.Editor.getFieldRowObject(item));
        });

        return returnArray;
    }

    this.getIngredients = function() {
        //Input Field with Serving Size per Bottle
        var el = $("textarea.editor-ingredients");

        return this.getFieldObject(el);
    }

    this.getFieldObject = function(field) {
        var returnObj = {},
            name = $(field).attr("name"),
            value = $(field).val();
        
        returnObj[name] = value;
        
        return returnObj;
    }

    this.getFieldRowObject = function(fieldRow) {
        var returnObj = {};
        $(fieldRow).children("input, textbox").each(function(index,item){
            $.extend(returnObj,app.Editor.getFieldObject(item));
        });

        return returnObj;
    }

    this.addCrossField = function() {
        var field = $("#templates .cross-field-template").clone(),
            fieldContainer = $(".editor-cross-fields");

        fieldContainer.append(field);
    }

    this.addRecommendedField = function() {
        var field = $("#templates .recommended-field-template").clone(),
            fieldContainer = $(".editor-recommended-fields");

        fieldContainer.append(field);

    }

    this.triggerEditorSection = function(clicked) {
        var triggers = $(".editor-section-trigger");

        if (!$(clicked).hasClass("active")) {
            triggers.each(function(index,item) {
                var content = $(this).next();

                //If this is the trigger that was clicked
                if (item == $(clicked).get(0)) {
                    $(content).slideDown(300);
                    $(content).addClass("active");
                    $(this).addClass("active");    
                }

                //Else hide and slide up
                else {
                    $(content).slideUp(300);
                    $(content).removeClass("active");
                    $(this).removeClass("active");
                }
            });
        }
    }

    this.createLabelObject = function() {
        var returnObj = {};
        $.extend(returnObj,this.getProductID());
        $.extend(returnObj,this.getServingSize());
        $.extend(returnObj,this.getServingSizePerBottle());
        $.extend(returnObj,this.getIngredients());
        $.extend(returnObj, {
            recommendedFields : this.getRecommendedFields()
        });
        $.extend(returnObj, {
            crossFields : this.getCrossFields()
        });

        return returnObj;
    }
}

function LabelObject() {
    this.initialLabel = {};
    this.undoLabel = {};
    this.currentLabel = {}

    this.updateCurrentLabel = function() {
        this.undoLabel = this.currentLabel;
        this.currentLabel = app.Editor.createLabelObject();
    };

    this.updateLabelView = function() {
        this.updateCurrentLabel();

        var labelViewElement = $(".label"),
            labelTemplate = $(".label-template").html();

        Mustache.parse(labelTemplate);

        var renderedLabelHTML = Mustache.render(labelTemplate,this.currentLabel);

        $(labelViewElement).html(renderedLabelHTML);
    }
}

function app() {
    this.Editor = new EditorObject();
    this.Label = new LabelObject();
    this.updateTrigger = $('.label-settings-preview');
    this.saveTrigger = $('.label-settings-save');
    this.addRecommendedFieldTrigger = $(".editor-recommended-add");
    this.addCrossFieldTrigger = $(".editor-cross-add");
    this.sectionTrigger = $(".editor-section-trigger");


    this.init = function() {
        //Update Listener
        this.updateTrigger.on("click", function() {
            app.Label.updateLabelView();
        });

        //Save Trigger
        this.saveTrigger.on("click", function() {
            console.log("Label Save");
        });

        // Add More Fields To Editor
        this.addCrossFieldTrigger.on("click", function() {
           app.Editor.addCrossField(); 
        });

        this.addRecommendedFieldTrigger.on("click", function() {
            app.Editor.addRecommendedField();
        });

        // Trigger Accordion
        this.sectionTrigger.on("click", function() {
            app.Editor.triggerEditorSection(this);
        });
    };
}

var app = new app();
app.init();