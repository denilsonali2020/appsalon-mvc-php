
<h1 class="nombre-pagina">Login</h1>
<p class="descripcion-pagina">Inicia sesion con tus datos</p>

<?php 
    include_once __DIR__ . "/../templates/alertas.php";
?>

<form action="/" class="formulario" method="POST">
    <div class="campo">
        <label for="email">Email</label>
        <input type="email" name="email" id="email" autocomplete="off" placeholder="Tu email">
    </div>

    <div class="campo">
        <label for="password">Password</label>
        <input type="password" name="password" id="password" autocomplete="off" placeholder="Tu Password">
    </div>

    <input type="submit" class="boton" value="Iniciar Sesion" readonly>
</form>

<div class="acciones">
    <a href="/crear-cuenta">Crea Cuenta Nueva</a>
    <a href="/olvide">¿Olvidaste tu contraseña?</a>
</div>