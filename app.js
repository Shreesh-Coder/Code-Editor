const textArea = document.getElementById("code");
const codeEditor = CodeMirror.fromTextArea(textArea,
{
    lineNumbers: true,
    theme: "ayu-dark", 
    mode: "python",
    autoCloseBrackets: true,
    indentUnit: 4,
    matchBrackets: true        
});
const langSelector = document.getElementById("languages");
const output = document.getElementById("output");
const compile = document.getElementById("compile");


langSelector.addEventListener("change", (event) =>{
    event.preventDefault();

    let language = langSelector.value;

    let mode = null;

    switch(language)
    {
        case "python":
            mode = "python";
            codeEditor.doc.setValue("");
            break;
        case "javascript":
            mode = "javascript";
            codeEditor.doc.setValue("");
            break;
        case "c":
            mode = "text/x-csrc";
            codeEditor.doc.setValue("");
            break;
        case "cpp":
            mode = "text/x-c++src";
            codeEditor.doc.setValue("");
            break;
        case "java":
            mode = "text/x-java";
            codeEditor.doc.setValue("");
    }

    codeEditor.setOption("mode", mode);
})

compile.addEventListener("click", (event) =>{
    event.preventDefault();
    
    const xhttp = new XMLHttpRequest();

    let code = codeEditor.doc.getValue();
    let mode = codeEditor.getOption("mode");

    const toSend = {code: code, langId: modeCal(mode)};

    // console.log(toSend); //Need to be removed

    xhttp.onreadystatechange = response.bind(xhttp);

    xhttp.open("POST", "https://codequotient.com/api/executeCode", true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send(JSON.stringify(toSend));
});

var modeCal = (mode) =>{
    switch(mode)
    {
        case "python":
            return "0";
        case "javascript":
            return "4";
        case "text/x-csrc":
            return "7";
        case "text/x-c++src":
            return "77";
        case "text/x-java":
            return "8";
    }
};

function response()
{

    if(this.readyState == 4 && this.status == 200)
    {
        let resp = JSON.parse(this.responseText);

        if(resp.error != null)
        {
            alert("Code can not be empty");
        }   

        setTimeout(() =>{
            const xhttp = new XMLHttpRequest();

            xhttp.onreadystatechange = () =>{
                
                if(xhttp.readyState == 4 && xhttp.status == 200)
                {
                    let result = JSON.parse(xhttp.responseText);                    
                    let data = JSON.parse(result.data);
                    // console.log(data);
                    
                    if(data.errors != "" )
                    {
                        output.value = data.errors;
                    }
                    else
                    {
                        output.value = data.output;
                    }

                }        
            };
        
            xhttp.open("GET", `https://codequotient.com/api/codeResult/${resp.codeId}`, true);
            xhttp.send();
        }, 5000);
    }        
}

