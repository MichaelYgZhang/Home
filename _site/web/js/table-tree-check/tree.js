function init(){
    //ȥ�����ǰ����ļ����ļ���Сͼ��
    $(".tree-icon,.tree-file").removeClass("tree-icon tree-file");
    $(".tree-icon,.tree-folder").removeClass("tree-icon tree-folder tree-folder-open tree-folder-closed");
};
function show(checkid){
    var s = '#check_'+checkid;
    //alert( $(s).attr("id"));
    // alert($(s)[0].checked);
    /*ѡ�ӽڵ�*/
    var nodes = $("#test").treegrid("getChildren",checkid);
    for(i=0;i<nodes.length;i++){
        $(('#check_'+nodes[i].id))[0].checked = $(s)[0].checked;

    }
    //ѡ�ϼ��ڵ�
    if(!$(s)[0].checked){
        var parent = $("#test").treegrid("getParent",checkid);
        //��������ӽڵ�Ҳ��û��ѡ����else,����if
        var flag = false;
        for(var i =0;i<parent.children.length;i++){
            console.log(parent.children[i]);
            if($(('#check_'+parent.children[i].id))[0].checked){
                flag = true;
            }
        }
        if(flag){
            return;
        }
        else{
            $(('#check_'+parent.id))[0].checked  = false;
            while(parent){
                parent = $("#test").treegrid("getParent",parent.id);
                if(parent){
                    $(('#check_'+parent.id))[0].checked  = false;
                }
            }
        }

    }else{
        //���ӽڵ�ѡ��ʱ�����ڵ��Զ�ѡ�У�Ŀǰ֧���ļ�����
        //�ڶ���
        var parent = $("#test").treegrid("getParent",checkid);
        if(parent){
            $(('#check_'+parent.id))[0].checked = $(s)[0].checked;
            //��һ��
            var pparent = $('#test').treegrid("getParent",parent.id);
            if(pparent){
                $(('#check_'+pparent.id))[0].checked = $('#check_'+parent.id)[0].checked;
            }
            //��0��
            var ppparent = $('#test').treegrid("getParent",pparent.id);
            if(ppparent){
                $(('#check_'+ppparent.id))[0].checked = $('#check_'+pparent.id)[0].checked;
            }

        }

    }

};

/**
 * ����json�ļ�
 */
$(function(){
    $('#test').treegrid({
        url:"data.json",
        idField:'id',
        treeField:'name',
        animate:"true",
        rownumbers:"true",
        columns:[[
            {title:'Name',field:'name',
                formatter:function(value,rowData,rowIndex){//���check��ѡ��
                    return "<input type='checkbox' onclick=show('"+rowData.id+"') id='check_"+rowData.id+"'/>" + rowData.name;
                },width:180},
            {field:'size',title:'Size',width:120,align:'right'},
            {field:'date',title:'Date',width:120}
        ]]
    });
    $("#consle").bind("click",consleclick)
});

/**
 * չ�����нڵ�
 */
function consleclick(){
    var node = $('#test').treegrid('expandAll',2);
};


var app = angular.module('app',[]);
app.controller('ctrl',function($scope,$http){
    var idList = "";
    /**
     * ��ȡ����ѡ����е�id
     */
    function getSelected(){
        idList = "";
        $("input:checked").each(function(){
//                console.log("id:"+$(this).attr("id").toString()+"||name:"+$(this).attr("name")+"||size:"+$(this).attr("size")+"||date:"+$(this).attr("date"));
            var id = $(this).attr("id");
            if(id.indexOf('check_type')== -1 && id.indexOf("check_")>-1)
                idList += id.replace("check_",'')+',';
        });
    };

    var obj = [];//��ʱ����json����
    $http.get("data.json")
        .success(function(response) {
            obj = response;
        });

    var datatemp = [];
    //�ж������Ƿ����ĳһԪ��
    function check(receiveArray,checkItem){
        if(receiveArray.length==0){return 1;}
        var index = -1; //��������ֵ���ڲ����ж�
        for(var i=0; i<receiveArray.length;i++){
            if(receiveArray[i].name != checkItem.name){
                index = i;
                break;
            }
        }
        return index;
    };

    function pushObj(obj){
        console.log(obj);
        var data = {};
        data.id = obj.id;
        data.name = obj.name;
        data.date = obj.date;
        data.size = obj.size;
        if(check(datatemp,data)!=-1){
            datatemp.push(data);
        }
    };

    //Ŀǰ֧���ļ�չ����ʽ����ȡjson�ļ��еļ���
    function get_datatemp(){
        datatemp = new Array();
        for(var i=0;i<obj.length;i++){
            pushObj(obj[i]);
            if(obj[i].hasOwnProperty('children')){
                for(var j=0;j<obj[i].children.length;j++){
                    pushObj(obj[i].children[j]);
                    if(obj[i].children[j].hasOwnProperty('children')){
                        for(var k=0;k<obj[i].children[j].children.length;k++){
                            pushObj(obj[i].children[j].children[k]);
                            if(obj[i].children[j].children[k].hasOwnProperty('children')){
                                for(var q=0;q<obj[i].children[j].children[k].children.length;q++){
                                    pushObj(obj[i].children[j].children[k].children[q]);
                                }
                            }
                        }
                    }
                }
            }
        }
    };

    $scope.addSelected = function(){
        getSelected();
        get_datatemp();
        var tabledata = [];
        var ids = idList.trim().split(',');
        for(var i=0;i<ids.length;i++){
            var id = ids[i];
            if(id!=null && id!=""){
                for(var j=0;j<parseInt(datatemp.length);j++){
                    if(id==datatemp[j].id){
                        if(check(tabledata,datatemp[j])!=-1){
                            tabledata.push(datatemp[j]);
                            break;
                        }
                    }
                }
            }
        }
        $scope.datas = tabledata;
    };
});