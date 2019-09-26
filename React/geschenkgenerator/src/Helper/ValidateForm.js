import $ from 'jquery'


let ValidateForm = {};

ValidateForm.collectAndValidate = function (returnType = "url", idsPrefix="", afterUnderscore=true) {
    var fields = [];
    var failedReasons = [];

    $(".formField").each((index, x) => {
        var obj = { key: $(x).attr("id"), value: $(x).val().trim() };
        if(idsPrefix!="" && obj.key.includes(idsPrefix)==false) return;

        var vali = this.validate(x);
        if (vali != true) {
            failedReasons.push("Field " + obj.key + ": " + vali);
        } else {
            if ($(x).attr("ignoreForCollect") != "true") {
                if(afterUnderscore) obj=this.takeAfterUnderscore(obj);
                fields.push(obj);
            } 
        }
    });
    if (failedReasons.length > 0) return { valid: false, result: failedReasons };

    var fieldFlat={};
    fields.forEach(x=> {fieldFlat[x.key]=x.value});
    return { valid: true, result: this.convertToReturnType(returnType, fields) , fields: fieldFlat};
}

ValidateForm.takeAfterUnderscore=function(obj) {
    if(obj.key.includes("_")) obj.key=obj.key.split("_")[1];
    return obj;
}

ValidateForm.validate = function (element) {
    var value = $(element).val();
    if ($(element).attr("allowEmpty") == "false" && (value == null || value.length == 0)) {
        return "Empty not allowed";
    }

    if ((value == null || value.length == 0)) {
        return true;
    }

    if ($(element).attr("minLength") != null && value.length < Number($(element).attr("minLength"))) return "Too short";

    var type = $(element).attr("fieldType");
    switch (type) {
        case "text":
            return isNaN(value) ? true : "No text";
            break;

        case "double":
            return !isNaN(value) ? true : "No number";
            break;
        case "address":
            return value.includes(",") && value.includes(" ") ? true : "No valid address";
            break;
        case "number":
            return !isNaN(value) ? true : "No number";
            break;
        case "link":
            return value.includes("http") && value.includes("//") && value.includes(".") ? true : "No url";
            break;
        case "mail":
            return value.includes("@") && value.includes(".") ? true : "No valid mail";
            break;
        case "":
            return true;
            break;

        default:
            break;
    }
    return true;
}

ValidateForm.convertToReturnType = function (type, fields) {
    if (type == "url") {
        var url = "";
        fields.forEach(x => {
            url += "&" + x.key + "=" + encodeURI(x.value);
        });
        return url;
    }
    return true;
}



export default ValidateForm;