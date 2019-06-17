var _apisicam = _apisicam || {};
_apisicam.clavePublica = '-NE6h9ILKBt4^u^GfOn';
_apisicam.clavePrivada = 'v^]GBWA+D*0x0s-nh*]c';
var i=0; 
var activos=[];


window.apisicam || (function(d){
    var s,c,o = apisicam = function(){
        o._.push(arguments);
    };
    o._ = [];
    s = d.getElementsByTagName('script')[0];
    c = d.createElement('script');
    c.type = 'text/javascript';
    c.charset = 'utf-8';
    c.async = true;
    c.src = 'https://sicam32-jpllinas.c9users.io/api/clientes/javascript/?'+_apisicam.clavePublica+':'+_apisicam.clavePrivada;
    s.parentNode.insertBefore(c,s);
    
})(document);


function cargarSelectTiposIdentificaciones(){
    datos=[];
    ApiSicam.ejecutar(
        'personas/PersonasApp/tiposIdentificacion/',
        datos,
        function (tiposIdentificaciones){
        var select = document.getElementById("tiposIdentificacion");
        for (var i = 0; i < tiposIdentificaciones.length; i++)
            { 
            var option = document.createElement("option");
            option.text = tiposIdentificaciones[i]['tipoIdentificacionCODIGO'];
            option.value =tiposIdentificaciones[i]['tipoIdentificacionID'];
            select.appendChild(option);
            }
        }
    );
}

function cargarListadoActivos(){
    datos=[];
    ApiSicam.ejecutar(
        'tienda-apps/Activos/listadoActivos/',
        datos,
        function (activos){
        var select = document.getElementById("activos");
        for (var i = 0; i < activos.length; i++)
            { 
            var option = document.createElement("option");
            option.text = activos[i]['activoCODIGO']+'-'+activos[i]['activoTITULO'];
            option.value =activos[i]['activoID'];
            select.appendChild(option);
            }
        }
    );
}


window.onload = function(){
    cargarSelectTiposIdentificaciones();
    cargarListadoActivos();
}



$(document).ready(function() {
    $("#nombres").prop("disabled", true);
    $("#solicitudDESTINO").prop("disabled", true);
    $("#solicitudMOTIVO").prop("disabled", true);
    $("#cantidad").prop("disabled", true);
    $( ".datepicker" ).datepicker(
        {
            dateFormat: 'yy-mm-dd'
            
        });
});


function eliminar_elemento(id,activo){
    $("#"+id).remove();
    var indice = activos.indexOf(activo);
    activos.splice(indice, 1);
    i--;
}


$("#agregarElemento").click(function(){
    var elemento = $("#activos option:selected").text().split('-');
    var cantidad = $("#cantidad").val();
    var descripcion = $("#descripcion").val();
    var activo = $("#activos").val();
    if(cantidad=="0"||cantidad==""){
        alert("Favor ingresar una cantidad");
        return false;
    }
    if(activos.includes( activo))
    {
        alert("Este Elemento Esta incluido en el listado");
       
    }else
    {
        i++;
        activos.push($("#activos").val()); 
        $("#tabla_elementos > tbody").append("<tr id='"+i+"'><td>"+elemento[0]+"<input type='hidden' value='"+activo+"' name='solicitudACTIVOS["+i+"][activoID]'> </td><td>"+elemento[1]+" </td><td>"+cantidad+" <input type='hidden' value='"+cantidad+"' name='solicitudACTIVOS["+i+"][cantidad]'> </td><td>"+descripcion+" <input type='hidden' value='"+descripcion+"' name='solicitudACTIVOS["+i+"][descripcion]'> </td><td><a class='btn btn-danger' onclick='eliminar_elemento("+i+","+activo+")'><i class='fa fa-trash'></i></a> </td></tr>");
        //$("#tabla_elementos > tbody").append("<tr id='"+i+"'><td>"+elemento[0]+"<input type='hidden' value='"+activo+"' name='solicitudACTIVOS["+i+"]'> </td><td>"+elemento[1]+" </td><td>"+cantidad+" </td><td>"+descripcion+" </td><td><a class='btn btn-danger' onclick='eliminar_elemento("+i+","+activo+")'><i class='fa fa-trash'></i></a> </td></tr>");

    }
    
});

    
$("#buscarColaborador").click(function(){
    datos=[];
    var tipoIdentificacionID = $("#tiposIdentificacion").val();
    var Identificacion       = $("#identificacion").val();
    ApiSicam.ejecutar(
        'talento-humano/ColaboradoresApp/buscar/'+tipoIdentificacionID+'/'+Identificacion,
        datos,
        function (colaborador){
            if(colaborador){
                $("#nombres").val(colaborador.personaRAZONSOCIAL);
                $("#ColaboradorID").val(colaborador.colaboradorID);
                $("#nombres").prop("disabled", false);
                $("#solicitudDESTINO").prop("disabled", false);
                $("#solicitudMOTIVO").prop("disabled", false);
                $("#cantidad").prop("disabled", false);
            }
            else{
                alert("No se encontró el documento  :"+Identificacion);
            }
        }
    );
});

$(document).on('submit', 'form#generarSolicitudSalida', function (event) {
    event.preventDefault();
    if(activos && activos.length>0){
        var form = $(this);
        var datos = new FormData($(this)[0]);
        ApiSicam.ejecutarPost(
            'administracion/servicios/generarSalidaActivo/',
            datos,
            function (salidaActivo){
                console.log(salidaActivo);
            }
        );
    }else{
        alert("Seleccione elementos a salir");
    }
    return false;
});