<h1 class="nombre-pagina">Reestablece tu Password</h1>
<p class="descripcion-pagina">Coloca tu nuevo password a contiuación</p>

<?php 
    include_once __DIR__ . "/../templates/alertas.php";
?>
<!--Esto hace que el siguiente codigo html, no se ejecute-->
<?php if($error)return; ?>

<form  class="formulario" method="POST">
    <div class="campo">
        <label for="password">Nuevo Password</label>
        <input type="password" name="password" id="password" autocomplete="off" placeholder="Nuevo Password">
    </div>

    <input type="submit" class="boton" value="Reestablecer">
</form>

<div class="acciones">
    <a href="/">¿Ya tienes cuenta? Iniciar Sesion</a>
    <a href="/crear-cuenta">Crea Nueva Cuenta</a>
</div>
