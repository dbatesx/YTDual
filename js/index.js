const params = Object.fromEntries(new URLSearchParams(location.search));

var windowDisplay,
  windowDisplayName = 'VideoDisplay';

$.ready(function () {
 });

    if(localStorage["grid_data"] == undefined){
        setTestData();
    }

    function setTestData(){
        var testData = [];
        localStorage["grid_data"] = JSON.stringify(testData);
    }
    
    function reset(){
        setTestData();
        $("#grid").data("kendoGrid").dataSource.read();
    }

    var dataSource = new kendo.data.DataSource({
        transport: {
          create: function(options){
            var localData = JSON.parse(localStorage["grid_data"]);
            if(localData.length)
              options.data.ID = localData[localData.length-1].ID + 1;
            else {
              options.data.ID = 1;
            }
            // parse url, get videoID, title, length in seconds:
            const params = Object.fromEntries(new URLSearchParams(options.data.URL.split('?')[1]));
            localData.push(options.data);
            localStorage["grid_data"] = JSON.stringify(localData);
            options.success(options.data);
          },
          read: function(options){
              var localData = JSON.parse(localStorage["grid_data"]);
              options.success(localData);
          },
          update: function(options){
            var localData = JSON.parse(localStorage["grid_data"]);

            for(var i=0; i<localData.length; i++){
              if(localData[i].ID == options.data.ID){
                localData[i].URL = options.data.URL;
                localData[i].VidID = options.data.VidID;
                localData[i].StartAt = options.data.StartAt;
                localData[i].StopAt = options.data.StopAt;
              }
            }
            localStorage["grid_data"] = JSON.stringify(localData);
            options.success(options.data);
          },
          destroy: function(options){
            var localData = JSON.parse(localStorage["grid_data"]);
            for(var i=0; i<localData.length; i++){
                if(localData[i].ID === options.data.ID){
                    localData.splice(i,1);
                    break;
                }
            }
            localStorage["grid_data"] = JSON.stringify(localData);
            options.success(localData);
          },
        },
        schema: {
          model: {
            id: "ID",
            fields: {
              ID: { type: "number", editable: false },
              URL: { type: "string" },
              VidID: { type: "string" },
              StartAt: { type: "number" },
              StopAt: { type: "number"},
            }}
        },
        pageSize: 20
    });

    var grid = $("#gridPlaylist").kendoGrid({
        dataSource,
        pageable: true,
        toolbar: ["create", "save", "cancel"],
        columns: [
            { command: "PP", click: playPause },
          //{ field: "ID", width: "100px" },
          { field: "URL", title: "YouTube URL", width: "400px"},
          { field: "VidID", title: "Video ID", width: "100px"},
          { field: "StartAt", title: "Start At", width: "100px"},
          { field: "StopAt", title: "Stop At", width: "100px"},
          { command: "destroy" },
        ],
        editable: "incell",
        xsave: function (e) {
            var url = e.values.URL;
            e.model.VidID = url.split(/[=/]/g).pop();
        },
    }).data("kendoGrid");
// });
//     $('#PlaylistGrid').kendoGrid({
//         dataSource: [{Video: '123', Start: '0', Stop: null}],
//         columns: [
//             { command: [{ name: "edit", text: "", iconClass: "far fa-edit" }], title: "&nbsp;", width: 40 },
//             { field: 'Video' },
//             { field: 'Start' },
//             { field: 'Stop' },
//         ],
// //        editable: 'inline',
//         editable: 'popup',
//     });

function playPause(e) {

}

$('#Open').click(function(){
  windowDisplay = window.open('display.html', windowDisplayName, 'popup');

});