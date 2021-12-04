var currentFeature;

var dataUrl = "http://localhost:8090/iserver/services/data-Training_Data_Alifian/rest/data";

function editTable() {
    $.each(currentFeature.values_, function (idx, obj) {
        if (idx != "geometry" && idx != "SmID" && idx != "SmUserID" && idx != "SmArea" && idx !=
            "SmPerimeter") {
            currentFeature.values_[idx] = $("#" + idx + "Input").val();
        }
    });
    console.log(currentFeature);

    var addFeatureParams = new SuperMap.EditFeaturesParameters({
        features: [currentFeature],
        dataSourceName: "Training_Data_Alifian",
        dataSetName: "building",
        editType: "update",
        returnContent: true
    });
    var editFeaturesService = new ol.supermap.FeatureService(dataUrl);
    editFeaturesService.editFeatures(addFeatureParams, function (serviceResult) {
        if (serviceResult.result.succeed) {
            alert("Modify successfully!");
            layer.getSource().refresh();
            clearDraw();
        } else {
            alert("Modify Failed!");
        }
    });
}

var editSource = new ol.source.Vector();
let editLayer = new ol.layer.Vector({
    source: editSource
});

var modify, snap;
map.addLayer(editLayer);

function editGeometry() {
    editLayer.getSource().clear();
    drawLayer.getSource().clear();
    resultLayer.getSource().clear();
    overlay.setOffset([0, overlay.getOffset()[1] - 30]);

    modify = new ol.interaction.Modify({
        source: editSource
    });
    map.addInteraction(modify);

    snap = new ol.interaction.Snap({
        source: editSource
    });
    map.addInteraction(snap);

    editSource.addFeatures([currentFeature]);

    modify.on('modifyend', function (evt) {
        currentFeature = evt.features.array_[0];
    });
}

function drawBuilding() {
    var drawBuilding = new ol.interaction.Draw({
        source: drawLayer.getSource(),
        type: "Polygon"
    });
    map.addInteraction(drawBuilding);

    drawBuilding.on('drawend', function (evt) {
        map.removeInteraction(drawBuilding);
        var buildingGeometry = evt.feature.getGeometry();
        var buildingFeature = new ol.Feature(buildingGeometry);

        buildingFeature.values_.osm_id = $("#osm_id").val();
        buildingFeature.values_.code = $("#code").val();
        buildingFeature.values_.fclass = $("#fclass").val();
        buildingFeature.values_.name = $("#name").val();
        buildingFeature.values_.type = $("#type").val();
        console.log(buildingFeature);

        var addFeatureParams = new SuperMap.EditFeaturesParameters({
            features: [buildingFeature],
            dataSourceName: "Training_Data_Alifian",
            dataSetName: "building",
            editType: "add",
            returnContent: true
        });
        var editFeaturesService = new ol.supermap.FeatureService(dataUrl);
        editFeaturesService.editFeatures(addFeatureParams, function (serviceResult) {
            if (serviceResult.result.succeed) {
                alert("Add building successfully!");
                layer.getSource().refresh();
                clearDraw();
            }
        });

    });
}


function deleteBuilding() {
    var deleteBuilding = new ol.interaction.Draw({
        source: drawLayer.getSource(),
        type: "Point"
    });
    map.addInteraction(deleteBuilding);

    deleteBuilding.on('drawend', function (evt) {
        map.removeInteraction(deleteBuilding);

        var param = new SuperMap.QueryByGeometryParameters({
            queryParams: {
                name: "building@Training_Data_Alifian"
            },
            geometry: evt.feature.values_.geometry
        });
        new ol.supermap.QueryService(url).queryByGeometry(param, function (serviceResult) {
            var features = (new ol.format.GeoJSON()).readFeatures(serviceResult.result.recordsets[0].features);
            vectorSource.addFeatures(features);
            parseInt(features[0].values_)
            console.log();

            var deleteFeatureParams = new SuperMap.EditFeaturesParameters({
                IDs: [parseInt(features[0].values_.SmID)],
                dataSourceName: "Training_Data_Alifian",
                dataSetName: "building",
                editType: "delete",
                returnContent: true
            });
            var editFeaturesService = new ol.supermap.FeatureService(dataUrl);
            editFeaturesService.editFeatures(deleteFeatureParams, function (serviceResult) {
                if (serviceResult.result.succeed) {
                    alert("Delete building successfully!");
                    layer.getSource().refresh();
                    clearDraw();
                }
            });


        });
    });

}