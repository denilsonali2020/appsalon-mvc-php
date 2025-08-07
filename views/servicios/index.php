<h1 class="nombre-pagina">Servicios</h1>
<p class="descripcion-pagina">Administración de Servicios</p>

<?php    
    @include_once __DIR__ . '/../templates/barra.php';
?>


<?php 
    if($resultado){
        $mensaje = mostrarNotificacion( intval($resultado) );
    if($mensaje){ ?>
        <p class="alerta <?php if($resultado == 3) {
            echo 'error';
        }else{
           echo 'exito'; 
        } ?>"><?php echo s($mensaje) ?></p>                
    <?php }
    }
?>

<ul class="servicios">
    <?php foreach($servicios as $servicio) { ?>
            <li>
                <p>Nombre: <span><?php echo $servicio->nombre ?></span></p>
                <p>Precio: <span>L <?php echo $servicio->precio ?></span></p>

                <div class="acciones">
                    <a class="boton" href="/servicios/actualizar?id=<?php echo $servicio->id; ?>">Actualizar</a>

                    <form action="/servicios/eliminar" method="POST">
                        <input type="hidden" name="id" value="<?php echo $servicio->id; ?>">

                        <input type="submit" value="Borrar" class="boton-eliminar">
                    </form>
                </div>
            </li>            
    <?php } ?>
</ul>

<?php
    $script = "    
        <script src='build/js/admin.js'></script>
    ";
 ?>


