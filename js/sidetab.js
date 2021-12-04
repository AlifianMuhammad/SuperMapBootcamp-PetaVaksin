function queryVaccineLevel() {
    var selectedType = $('#VaccineLevel').val();
    var param = new SuperMap.QueryBySQLParameters({
        queryParams: {
            name: "VaksinPulauJawa@vaksinpulaujawa#1",
            attributeFilter: "Vaccine_Level = '" + selectedType + "'"
        }
    });

    new ol.supermap.QueryService(url).queryBySQL(param, function (serviceResult) {
        var features = (new ol.format.GeoJSON()).readFeatures(serviceResult.result.recordsets[0].features);
        vectorSource.clear();
        vectorSource.addFeatures(features);
        console.log(serviceResult);
    });
}


