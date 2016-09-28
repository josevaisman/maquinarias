$(document).ready(function(){
	$(".data-fuente").each(function( index ) {
		var fuente = $(this).data('fuente');
		var filtro = $(this).data('filtro');
		var obj_fuente = this;
		$.getJSON(fuente + '?r=' + Math.random(), function(data) {
			var filtrados = FiltrarJson(data, filtro);
			$(".data-output", obj_fuente).each(function( index ) {
				$(this).addClass('tooltip');
				var columnaSumar = $(this).data('show');
				var suma = SumaColumna(filtrados, columnaSumar);
				$(this).html(suma).css( 'cursor', 'pointer' ).css( 'color', 'blue' ).css( 'font-weight', 'bold' );
				
				var detalle = $(this).data('detalle');
				var columnasdetalle = $(this).data('columnasdetalle');
				var tabla = JsonToTabla(columnaSumar, columnasdetalle, filtrados);
				var grafico = JsonToGrafico();
				var contenedor = UnirElementos(tabla, grafico);
				$(this).tooltipster({content: contenedor, contentAsHTML: true, hideOnClick: true, functionReady: function(origin, tooltip) {Chart1(columnaSumar, filtrados)}});
				$(this).click(function() {$(detalle).html(tabla)});		
			});
		});
	});
});

function UnirElementos(tabla, grafico) {
	var cont$ = $('<div/>'); 
    cont$.append(tabla);
    cont$.append('<br>');
    cont$.append(grafico);
	return cont$;
}

function JsonToGrafico() {
	return '<canvas id="chart-1" width="80" height="80"></canvas>';
}

function Chart1(columnavalor, myList){
	var data = [];
	$.each( myList, function( i, registro ) {
		$.each(registro, function( k, columna ) {
			if (columnavalor == k) {
				data.push({value: parseFloat(columna), color: "orange", label: columnavalor});
				}
		  });
	  });
	
	var options = {animateRotate : false};
	
	var ctx = document.getElementById("chart-1").getContext("2d");
	var myNewChart = new Chart(ctx).Pie(data, options);
}

function JsonToTabla(calumnabase, columnastabla, myList) {
	var columnSet = [];
    
	var Tb$ = $('<table/>'); 
    Tb$.attr('border', '1').css('text-align', 'center');
	var Tr$ = $('<tr/>'); 
    for (var i = 0 ; i < myList.length ; i++) {
        var rowHash = myList[i];
        for (var key in rowHash) {
            if ($.inArray(key, columnSet) == -1 && $.inArray(key, columnastabla) != -1){
                columnSet.push(key);
				if (calumnabase == key) {			
					Tr$.append($('<th/>').html(key).css('color', 'orange'));
				} else {
					Tr$.append($('<th/>').html(key));
				}
            }
        }
    }
	
	Tb$.append(Tr$);

    for (var i = 0 ; i < myList.length ; i++) {
		var row$ = $('<tr/>');
		for (var colIndex = 0 ; colIndex < columnSet.length ; colIndex++) {
			var cellValue = myList[i][columnSet[colIndex]];		
			if (cellValue == null) { cellValue = ""; }		
			if (calumnabase == columnSet[colIndex]) {			
				row$.append($('<td/>').html(cellValue).css('color', 'orange'));
			} else {
				row$.append($('<td/>').html(cellValue));
			}
		}
		
		Tb$.append(row$);
    }
	return Tb$;
}

function SumaColumna(filtrados, columnaSumar) {
	var suma = 0
	$.each( filtrados, function( i, registro ) {
		$.each(registro, function( k, columna ) {
			if (columnaSumar == k) {
				suma +=  parseFloat(columna);
				}
		  });
	  });
	return suma;
}

function FiltrarJson(data, filtro) {
	var filtrados = [];
	$.each( data, function( i, registro ) {
		var incluido = true;
		$.each(registro, function( k, columna ) {
			$.each(filtro, function( h, criterio ) {
				if (k == criterio.atributo && columna != criterio.valor) {
					incluido = false;
					}
			  });
		  });
		if (incluido) {
			filtrados.push(registro);
		}
		});
	return filtrados;
}