(function(window, document){
    function Createcontain(){

        var title = document.createElement("dt");
        var item = document.createElement("dd");


    }



    var Data_struct = {
        "text":null,
        "position":null,
        relation:null,
        layer:null,
        scope:null,
        grade:null,
        parent:null,
        children:null,
    }

    function applyStruct(that, struct){

    }

    var Data = function(){

    }
    var _scope= "global";

    //
    function createScope(){
        var container = document.createElement("div");
        container.style.position = "fixed";
        container.style.left = 20 + "px";
        container.style.top =  20 + "px";
        container.style.border = "solid 1px #eee";
        document.body.appendChild(container);

        // 作用域创建按钮
        var adder = document.createElement("button");
        adder.style.width = 20 + "px";
        adder.style.height = 20 + "px";
        adder.style.background = "#aaa";
        // 作用域输入框
        var name = document.createElement("input");
        name.placeholder = "创建新作用域"
        container.appendChild(name)
        container.appendChild(adder)

        // create scope
        function newScope(name){

        }

        //创建新作用域
        adder.addEventListener("click",function(){
            var newscope = document.createElement("input");
            var newscopelabel = document.createElement("label");
            newscope.type = "radio";
            newscope.name = "scope";
            newscope.value = name.value;
            newscope.addEventListener("change",function(evt){
                _scope = evt.target.value;
            })
            newscopelabel.appendChild(newscope);
            newscopelabel.appendChild(document.createTextNode(name.value));
            container.appendChild(newscopelabel);
        })
    }
    createScope()


    function action(){
        function inputStyle(input){
            input.style.position = "absolute"
            input.style.left = 0
        }
        document.addEventListener("click",function(evt){
            if(!(evt.ctrlKey&&evt.altKey)) return
            var positionX = evt.clientX;
            var positionY = evt.clientY;
            var input = document.createElement("textarea");
            input.style.position = "absolute";
            input.style.left = positionX + "px";
            input.style.top = positionY + "px";
            var scope = _scope;
            console.log(scope)
            document.body.appendChild(input)
        })
    }
    action();
}(window, document))


window.onload = function(){

}


