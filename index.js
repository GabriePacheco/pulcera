$("#indicador").height($(window).height()/2);
$("#buscar").click(bluetooth);
$("car").click(buscarCaracteristicas);
var cargando = `<div class="preloader-wrapper small active">
    <div class="spinner-layer spinner-red-only">
      <div class="circle-clipper left">
        <div class="circle"></div>
      </div><div class="gap-patch">
        <div class="circle"></div>
      </div><div class="circle-clipper right">
        <div class="circle"></div>
      </div>
    </div>
  </div`



async function bluetooth(evento){
  $("#estado").html(cargando);
  if (! navigator.bluetooth){
    $("#estado").html("Tu dispositvo no es compatible con bluetooth..");
  }else{
    let device = await navigator.bluetooth.requestDevice({
      filters:[
        {services: ['heart_rate'] }  
      ]
    });
    if (! device ){
      $("#estado").html("no se encontro al dispositivo ");
    }else{
      try {
        $("#estado").html("Conectando a:  " + device.name + "...");
        $("#dispositivo").html(``);
        $("#dispositivo").append(`<p>ID: ${device.id} </p>`);
        $("#dispositivo").append(`<p>Nombre: ${device.name} </p>`);
        $("#car").removeClass(`hide`);
                
        const server = await device.gatt.connect();
        if (server){
            $("#estado").html("Conectado");

        }else{
            $("#estado").html("no Conectado");
        }
        let service = await server.getPrimaryService('heart_rate');
        if (!service){
          $("#estado").html("no hay servicio");
        }else {
          try {
            let characteristic = await service.getCharacteristic(0x2A37);
            if (!characteristic){
               $("#estado").html("no hay caracteristica ");
            }else{
              characteristic.addEventListener('characteristicvaluechanged', handleCharacteristicValueChanged);
               characteristic.startNotifications();
            }
          }
          catch(some){
            $("#estado").append(some.message);    
          }
        }
      }
      catch (error){
        $("#estado").html(error.message);
      }

    }
  }

}
function handleCharacteristicValueChanged(event){
  let value = event.target.value;
  let r =  value.getUint8(0)
  let g =  value.getUint8(1)
  let b =  value.getUint8(2)
  let n = value.getUint8(3)
  $("#estado").html("<p> <span>"+ r + "</span> <span>"+ g + "</span>  <span>"+ b + "</span> <span>"+ n + "</span></p>");

}

function buscarCaracteristicas (e){
 
  $("#dispositvo").append("<p>la concha d tu hermana </p>");
}