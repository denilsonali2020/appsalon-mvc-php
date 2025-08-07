<div class="barra">
    <p>Hola: <?php echo $nombre ?? ''; ?></p> <!--Tenemos acceso mediante por la variable que enviamos en el render-->

    <a href="/logout" class="boton">Cerrar Sesión</a>
</div>

<?php if(isset($_SESSION['admin'])) {  ?>
    <div class="barra-servicios">             
        <a class="boton" href="/admin">Ver Citas</a>
        <a class="boton" href="/servicios">Ver Servicios</a>
        <a class="boton" href="/servicios/crear">Nuevo Servicio</a>
    </div> 

<?php }; ?>